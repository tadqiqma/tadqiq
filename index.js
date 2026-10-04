/* واجهة جمع القرارات المجهولة والرسائل. Cloudflare Worker مع قاعدة D1.
   لا تحفظ نصوصا ولا روابط ولا أسماء منابر ولا عناوين IP.
   تحفظ فقط: رقم المؤشر، قرينة قصيرة، قرار القارئ، إصدار المحرك، نمط التحليل، الشهر، شكل المادة. */

const IND_OK=new Set([1,2,3,4,5,6,7,8,9,11,12,13,14]);
const DEC_OK=new Set(['confirmed','rejected','added']);
const MODE_OK=new Set(['rules','ai']);
const GENRES=new Set(['','مقال','تعليق','حلقة مصورة أو صوتية','خبر']);
const LIMITS={contribute:6,message:3,otp:5,otpEmail:5,authIp:30};   // في اليوم

const SEC={'x-content-type-options':'nosniff','referrer-policy':'no-referrer','content-security-policy':"default-src 'none'; frame-ancestors 'none'",'cross-origin-resource-policy':'cross-origin'};
const json=(o,status=200,extra={})=>new Response(JSON.stringify(o),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...SEC,...extra}});

function corsHeaders(env,req){
  const origin=req.headers.get('Origin')||'';
  const allowed=(env.ALLOWED_ORIGIN||'').split(',').map(s=>s.trim()).filter(Boolean);
  const ok=allowed.includes('*')||allowed.includes(origin);
  return ok?{'access-control-allow-origin':origin||'*','vary':'Origin','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type, authorization','access-control-max-age':'86400'}:{};
}
function originAllowed(env,req){
  const origin=req.headers.get('Origin');
  if(!origin)return false;               // الإرسال من الصفحة فقط
  const allowed=(env.ALLOWED_ORIGIN||'').split(',').map(s=>s.trim()).filter(Boolean);
  return allowed.includes('*')||allowed.includes(origin);
}
async function sha(s){
  const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
async function underLimit(env,req,kind,who){
  if(!env.HASH_SALT)throw new Error('misconfigured: HASH_SALT');   // بلا ملح تصبح البصمات قابلة للتخمين
  const ip=who||(req.headers.get('CF-Connecting-IP')||'0');
  const day=new Date().toISOString().slice(0,10);
  const h=await sha(ip+'|'+day+'|'+kind+'|'+(env.HASH_SALT||''));
  await env.DB.prepare('DELETE FROM rl WHERE day<?').bind(day).run();
  const row=await env.DB.prepare('INSERT INTO rl(h,day,n) VALUES(?,?,1) ON CONFLICT(h,day) DO UPDATE SET n=n+1 RETURNING n').bind(h,day).first();
  return row.n<=LIMITS[kind];
}
const normCue=s=>String(s||'').replace(/[ً-ْٰـ]/g,'').replace(/[\u0000-\u001f\u007f<>]/g,' ').replace(/\s+/g,' ').trim();

function cleanRecords(arr){
  const seen=new Set(),out=[];
  for(const r of (Array.isArray(arr)?arr:[]).slice(0,200)){
    if(!r||typeof r!=='object')continue;
    const ind=parseInt(r.ind),decision=String(r.decision||'');
    if(!IND_OK.has(ind)||!DEC_OK.has(decision))continue;
    let cue=normCue(r.cue);
    if(decision==='added')cue='';
    else{
      if(!cue||cue.length>80||cue.split(' ').length>8)continue;
      if(/https?:|www\.|@|[0-9٠-٩]{6,}/i.test(cue))continue;   // لا روابط ولا بريد ولا أرقام طويلة
      if(/^[=+\-@|%]/.test(cue))continue;                         // لا بداية تفسرها جداول البيانات صيغة
    }
    const k=ind+'|'+cue+'|'+decision;
    if(seen.has(k))continue;seen.add(k);
    out.push({ind,cue,decision});
  }
  return out;
}


/* ---------- الحسابات والجلسات ---------- */
const TERMS=env=>String(env.TERMS_VERSION||'1');
const EMAIL_RE=/^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[^\s@<>"]{2,}$/;
const randHex=n=>[...crypto.getRandomValues(new Uint8Array(n))].map(x=>x.toString(16).padStart(2,'0')).join('');
const b64u=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4)),c=>c.charCodeAt(0));

async function newSession(env,userId){
  const token=randHex(32),exp=Date.now()+30*864e5;
  await env.DB.prepare('INSERT INTO sessions(token_hash,user_id,exp) VALUES(?,?,?)').bind(await sha('s|'+token),userId,exp).run();
  await env.DB.prepare('DELETE FROM sessions WHERE exp<?').bind(Date.now()).run();
  return token;
}
async function upsertUser(env,email,provider,acceptTerms){
  email=email.toLowerCase();
  let u=await env.DB.prepare('SELECT id,terms_version FROM users WHERE email=?').bind(email).first();
  const now=Date.now();
  if(!u){
    if(!acceptTerms)return {error:'terms_required'};
    const id=randHex(12);
    await env.DB.prepare('INSERT INTO users(id,email,provider,created,terms_version,terms_at,last_login) VALUES(?,?,?,?,?,?,?)').bind(id,email,provider,now,TERMS(env),now,now).run();
    return {id,email};
  }
  if(acceptTerms&&u.terms_version!==TERMS(env))
    await env.DB.prepare('UPDATE users SET terms_version=?,terms_at=? WHERE id=?').bind(TERMS(env),now,u.id).run();
  await env.DB.prepare('UPDATE users SET last_login=? WHERE id=?').bind(now,u.id).run();
  return {id:u.id,email};
}
async function authUser(env,req){
  const m=/^Bearer ([0-9a-f]{64})$/.exec(req.headers.get('Authorization')||'');
  if(!m)return null;
  const row=await env.DB.prepare('SELECT u.id id,u.email email,u.terms_version tv,s.exp exp FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=?').bind(await sha('s|'+m[1])).first();
  if(!row||row.exp<Date.now())return null;
  return {id:row.id,email:row.email,needsTerms:row.tv!==TERMS(env)};
}
let JWKS=null,JWKS_AT=0;
async function googleKeys(force){
  if(!force&&JWKS&&Date.now()-JWKS_AT<36e5)return JWKS;
  if(force&&JWKS&&Date.now()-JWKS_AT<6e4)return JWKS;      // لا أكثر من مرة في الدقيقة
  const r=await fetch('https://www.googleapis.com/oauth2/v3/certs');
  JWKS=await r.json();JWKS_AT=Date.now();return JWKS;
}
async function verifyGoogle(env,cred){
  if(!env.GOOGLE_CLIENT_ID||typeof cred!=='string')return null;
  const p=cred.split('.');if(p.length!==3)return null;
  let head,pay;
  try{head=JSON.parse(new TextDecoder().decode(b64u(p[0])));pay=JSON.parse(new TextDecoder().decode(b64u(p[1])))}catch(e){return null}
  if(head.alg!=='RS256')return null;
  let jwk=((await googleKeys()).keys||[]).find(k=>k.kid===head.kid);
  if(!jwk)jwk=((await googleKeys(true)).keys||[]).find(k=>k.kid===head.kid);   // قد يكون Google بدل مفاتيحه
  if(!jwk)return null;
  const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  const ok=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,b64u(p[2]),new TextEncoder().encode(p[0]+'.'+p[1]));
  if(!ok)return null;
  if(pay.aud!==env.GOOGLE_CLIENT_ID||!['https://accounts.google.com','accounts.google.com'].includes(pay.iss))return null;
  if(!pay.exp||pay.exp*1000<Date.now()||pay.email_verified!==true||!pay.email)return null;
  return String(pay.email);
}
async function sendCode(env,email,code){
  if(!env.BREVO_KEY||!env.MAIL_FROM)throw new Error('mail_not_configured');
  const r=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'api-key':env.BREVO_KEY,'content-type':'application/json'},body:JSON.stringify({
    sender:{name:'أداة تدقيق الخطاب',email:env.MAIL_FROM},to:[{email}],subject:'رمز الدخول إلى أداة تدقيق الخطاب',
    textContent:'رمز الدخول: '+code+'\nصالح لمدة 10 دقائق. إذا لم تطلبه فتجاهل هذه الرسالة.'})});
  if(!r.ok)throw new Error('mail_failed');
}
const tooBig=(req,max)=>{const n=parseInt(req.headers.get('content-length')||'0');return n>max};
async function parseBody(req,max){if(tooBig(req,max))return null;const raw=await req.text();if(raw.length>max)return null;try{return JSON.parse(raw)}catch(e){return null}}

async function authGoogle(env,req){
  const b=await parseBody(req,8000);if(!b)return json({ok:false,error:'bad_json'},400);
  if(!(await underLimit(env,req,'authIp')))return json({ok:false,error:'rate_limited'},429);
  const email=await verifyGoogle(env,b.credential);
  if(!email)return json({ok:false,error:'invalid_credential'},401);
  const u=await upsertUser(env,email,'google',b.accept_terms===true);
  if(u.error)return json({ok:false,error:u.error},400);
  return json({ok:true,token:await newSession(env,u.id),email:u.email});
}
async function authEmailStart(env,req){
  const b=await parseBody(req,2000);if(!b)return json({ok:false,error:'bad_json'},400);
  const email=String(b.email||'').trim().toLowerCase();
  if(email.length>254||!EMAIL_RE.test(email))return json({ok:false,error:'bad_email'},400);
  if(b.accept_terms!==true)return json({ok:false,error:'terms_required'},400);
  if(!(await underLimit(env,req,'otp'))||!(await underLimit(env,req,'otpEmail',email)))return json({ok:false,error:'rate_limited'},429);
  const code=String(crypto.getRandomValues(new Uint32Array(1))[0]%1000000).padStart(6,'0');
  await env.DB.prepare('INSERT INTO otp(email,code_hash,exp,tries) VALUES(?,?,?,0) ON CONFLICT(email) DO UPDATE SET code_hash=excluded.code_hash,exp=excluded.exp,tries=0').bind(email,await sha('o|'+email+'|'+code+'|'+(env.HASH_SALT||'')),Date.now()+10*60*1000).run();
  try{await sendCode(env,email,code)}catch(e){return json({ok:false,error:'mail_failed'},502)}
  return json({ok:true});
}
async function authEmailVerify(env,req){
  const b=await parseBody(req,2000);if(!b)return json({ok:false,error:'bad_json'},400);
  const email=String(b.email||'').trim().toLowerCase(),code=String(b.code||'').trim();
  if(!EMAIL_RE.test(email)||!/^\d{6}$/.test(code))return json({ok:false,error:'invalid_code'},400);
  if(!(await underLimit(env,req,'authIp')))return json({ok:false,error:'rate_limited'},429);
  // العد والقراءة في عملية واحدة: لا تتجاوز المحاولات الخمس حتى مع طلبات متزامنة
  const row=await env.DB.prepare('UPDATE otp SET tries=tries+1 WHERE email=? AND exp>? AND tries<5 RETURNING code_hash').bind(email,Date.now()).first();
  if(!row)return json({ok:false,error:'invalid_code'},401);
  if(row.code_hash!==await sha('o|'+email+'|'+code+'|'+(env.HASH_SALT||'')))return json({ok:false,error:'invalid_code'},401);
  await env.DB.prepare('DELETE FROM otp WHERE email=?').bind(email).run();
  const u=await upsertUser(env,email,'email',b.accept_terms===true);
  if(u.error)return json({ok:false,error:u.error},400);
  return json({ok:true,token:await newSession(env,u.id),email:u.email});
}
async function me(env,req){
  const u=await authUser(env,req);
  if(!u)return json({ok:false,error:'unauthorized'},401);
  return json({ok:true,email:u.email,needs_terms:u.needsTerms,terms_version:TERMS(env)});
}
async function acceptTerms(env,req){
  const u=await authUser(env,req);if(!u)return json({ok:false,error:'unauthorized'},401);
  await env.DB.prepare('UPDATE users SET terms_version=?,terms_at=? WHERE id=?').bind(TERMS(env),Date.now(),u.id).run();
  return json({ok:true});
}
async function logout(env,req){
  const m=/^Bearer ([0-9a-f]{64})$/.exec(req.headers.get('Authorization')||'');
  if(m)await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha('s|'+m[1])).run();
  return json({ok:true});
}
async function deleteAccount(env,req){
  const u=await authUser(env,req);if(!u)return json({ok:false,error:'unauthorized'},401);
  await env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(u.id).run();
  await env.DB.prepare('DELETE FROM msg WHERE user_id=?').bind(u.id).run();
  await env.DB.prepare('DELETE FROM users WHERE id=?').bind(u.id).run();
  return json({ok:true});
}
async function accountExport(env,req){
  const u=await authUser(env,req);if(!u)return json({ok:false,error:'unauthorized'},401);
  const row=await env.DB.prepare('SELECT email,provider,created,terms_version,terms_at,last_login FROM users WHERE id=?').bind(u.id).first();
  const msgs=await env.DB.prepare('SELECT ts,text FROM msg WHERE user_id=? ORDER BY ts').bind(u.id).all();
  return json({ok:true,account:row,messages:msgs.results});
}

async function contribute(env,req){
  const user=await authUser(env,req);
  if(!user)return json({ok:false,error:'unauthorized'},401);
  if(user.needsTerms)return json({ok:false,error:'terms_required'},403);
  if(tooBig(req,60000))return json({ok:false,error:'too_large'},413);
  const raw=await req.text();
  if(raw.length>60000)return json({ok:false,error:'too_large'},413);
  let body;try{body=JSON.parse(raw)}catch(e){return json({ok:false,error:'bad_json'},400)}
  if(body.consent!==true)return json({ok:false,error:'no_consent'},400);
  const recs=cleanRecords(body.records);
  if(!recs.length)return json({ok:false,error:'empty'},400);
  const mode=MODE_OK.has(body.mode)?body.mode:'rules';
  const engine=/^[A-Za-z0-9._-]{1,24}$/.test(body.engine||'')?body.engine:'';
  const month=/^\d{4}-(0[1-9]|1[0-2])$/.test(body.month||'')?body.month:'';
  const genre=GENRES.has(body.genre||'')?(body.genre||''):'';
  if(!(await underLimit(env,req,'contribute',user.id)))return json({ok:false,error:'rate_limited'},429);
  // منع تكرار الإرسال: بصمة المحتوى فقط (لا تحتوي هوية ولا تربط بالحساب)
  const fp=await sha('b|'+engine+'|'+recs.map(r=>r.ind+':'+r.cue+':'+r.decision).sort().join('|'));
  const batch=crypto.randomUUID(),ts=Date.now();
  const ins=await env.DB.prepare('INSERT INTO bat(fp,batch,ts) VALUES(?,?,?) ON CONFLICT(fp) DO NOTHING RETURNING fp').bind(fp,batch,ts).first();
  if(!ins)return json({ok:true,accepted:0,duplicate:true});
  const st=env.DB.prepare("INSERT INTO rec(batch,ind,cue,decision,engine,mode,month,genre,ts,status) VALUES(?,?,?,?,?,?,?,?,?,'ok')");
  const stmts=recs.map(r=>st.bind(batch,r.ind,r.cue,r.decision,engine,mode,month,genre,ts));
  for(let i=0;i<stmts.length;i+=50)await env.DB.batch(stmts.slice(i,i+50));
  return json({ok:true,accepted:recs.length});
}

async function message(env,req){
  const user=await authUser(env,req);
  if(!user)return json({ok:false,error:'unauthorized'},401);
  if(user.needsTerms)return json({ok:false,error:'terms_required'},403);
  if(tooBig(req,6000))return json({ok:false,error:'too_large'},413);
  const raw=await req.text();
  if(raw.length>6000)return json({ok:false,error:'too_large'},413);
  let b;try{b=JSON.parse(raw)}catch(e){return json({ok:false,error:'bad_json'},400)}
  if(b.website)return json({ok:true});                       // فخ للبرمجيات الآلية
  const text=String(b.text||'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').trim();
  const contact=String(b.contact||'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,120);
  if(text.length<5||text.length>1000)return json({ok:false,error:'bad_length'},400);
  if(!(await underLimit(env,req,'message',user.id)))return json({ok:false,error:'rate_limited'},429);
  await env.DB.prepare('INSERT INTO msg(ts,text,contact,user_id) VALUES(?,?,?,?)').bind(Date.now(),text,contact||null,user.id).run();
  return json({ok:true});
}

const MIN_BATCHES=5;    // قرينة موثوقة: قرارات من 5 مساهمات مستقلة
const SHOW_MIN=3;       // لا تعرض قرينة علنا قبل 3 مساهمات مستقلة (يمنع نشر نصوص اعتباطية يدسها فرد)
const memo=new Map();   // ذاكرة قصيرة داخل الـ Worker تحمي حصة القاعدة المجانية من تكرار الطلبات
async function memoized(env,key,ttl,fn){
  if(env.NO_CACHE)return fn();
  const hit=memo.get(key);if(hit&&Date.now()-hit.t<ttl)return new Response(hit.body,{status:200,headers:hit.headers});
  const res=await fn();const body=await res.text();const headers=[...res.headers];
  memo.set(key,{t:Date.now(),body,headers});if(memo.size>20)memo.delete(memo.keys().next().value);
  return new Response(body,{status:res.status,headers});
}
const SHOWN="(cue='' OR (ind||'|'||cue) IN (SELECT ind||'|'||cue FROM rec WHERE status='ok' AND cue!='' GROUP BY ind,cue HAVING COUNT(DISTINCT batch)>="+SHOW_MIN+"))";
async function stats(env){
  const tot=await env.DB.prepare("SELECT COUNT(*) records, COUNT(DISTINCT batch) batches, MIN(month) first, MAX(month) last FROM rec WHERE status='ok'").first();
  const inds=await env.DB.prepare("SELECT ind, SUM(decision='confirmed') confirmed, SUM(decision='rejected') rejected, SUM(decision='added') added, COUNT(DISTINCT batch) batches FROM rec WHERE status='ok' GROUP BY ind ORDER BY ind").all();
  const cues=await env.DB.prepare("SELECT ind, cue, SUM(decision='confirmed') confirmed, SUM(decision='rejected') rejected, COUNT(DISTINCT batch) batches FROM rec WHERE status='ok' AND cue!='' GROUP BY ind,cue HAVING COUNT(DISTINCT batch)>="+SHOW_MIN+" ORDER BY COUNT(DISTINCT batch) DESC, (SUM(decision='confirmed')+SUM(decision='rejected')) DESC LIMIT 400").all();
  const eng=await env.DB.prepare("SELECT engine, mode, COUNT(*) n, COUNT(DISTINCT batch) batches FROM rec WHERE status='ok' GROUP BY engine, mode ORDER BY n DESC").all();
  return json({total:tot,min_batches:MIN_BATCHES,show_min:SHOW_MIN,indicators:inds.results,cues:cues.results,engines:eng.results},200,{'cache-control':'public, max-age=60'});
}

const csvq=v=>{let t=String(v??'').replace(/"/g,'""');if(/^[=+\-@\t\r|%]/.test(t))t="'"+t;return '"'+t+'"'};   // يمنع تنفيذ صيغ Excel
async function exportData(env,fmt){
  const r=await env.DB.prepare("SELECT ind,cue,decision,engine,mode,month,genre,batch FROM rec WHERE status='ok' AND "+SHOWN+" ORDER BY ind,cue,decision LIMIT 20000").all();
  if(fmt==='json')return json(r.results,200,{'content-disposition':'attachment; filename="tadqiq-open-data.json"','cache-control':'public, max-age=300'});
  const head=['ind','cue','decision','engine','mode','month','genre','batch'];
  const body='﻿'+[head.join(',')].concat(r.results.map(x=>head.map(k=>csvq(x[k])).join(','))).join('\n');
  return new Response(body,{headers:{...SEC,'content-type':'text/csv; charset=utf-8','content-disposition':'attachment; filename="tadqiq-open-data.csv"','cache-control':'public, max-age=300'}});
}

export default {
  async fetch(req,env){
    const url=new URL(req.url),path=url.pathname.replace(/\/+$/,'');
    const cors=corsHeaders(env,req);
    const wrap=async(p)=>{let res;try{res=await p}catch(e){res=json({ok:false,error:'server_error'},500)}const h=new Headers(res.headers);for(const k in cors)h.set(k,cors[k]);return new Response(res.body,{status:res.status,headers:h})};
    if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
    try{
      if(req.method==='POST'){
        const routes={'/contribute':contribute,'/message':message,'/auth/google':authGoogle,'/auth/email/start':authEmailStart,'/auth/email/verify':authEmailVerify,'/auth/logout':logout,'/terms/accept':acceptTerms,'/account/delete':deleteAccount};
        if(routes[path]){
          if(!originAllowed(env,req))return json({ok:false,error:'forbidden'},403);
          return wrap(routes[path](env,req));
        }
      }
      if(req.method==='GET'&&path==='/me')return wrap(me(env,req));
      if(req.method==='GET'&&path==='/account/export')return wrap(accountExport(env,req));
      if(req.method==='GET'&&path==='/stats')return wrap(memoized(env,'stats',60e3,()=>stats(env)));
      if(req.method==='GET'&&path==='/export.csv')return wrap(memoized(env,'csv',300e3,()=>exportData(env,'csv')));
      if(req.method==='GET'&&path==='/export.json')return wrap(memoized(env,'json',300e3,()=>exportData(env,'json')));
      if(req.method==='GET'&&(path===''||path==='/health'))return json({ok:true,service:'tadqiq-api'});
      return json({ok:false,error:'not_found'},404);
    }catch(e){
      return wrap(json({ok:false,error:'server_error'},500));
    }
  }
};
