const $=id=>document.getElementById(id);
const API=(window.CONFIG&&CONFIG.API_BASE)||'';
const NAMES={1:'رفع اليقين',2:'توسيع النطاق',3:'نسبة زائفة إلى مصدر',4:'تبديل الأرقام أو المقام',5:'السماع',6:'تشبيه انفعالي',7:'حجة من الغياب',8:'تجاور إيحائي',9:'خلط بين طبقتين',11:'إخفاء انتقائي',12:'نفي ظاهري',13:'كيل بمكيالين',14:'نسبة دوافع'};
let CUES=[];
function td(tr,text,cls){const c=document.createElement('td');c.textContent=text;if(cls)c.className=cls;tr.append(c);return c}
function tile(box,n,label){const d=document.createElement('div');d.className='stat';const b=document.createElement('b');b.textContent=n;const s=document.createElement('span');s.textContent=label;d.append(b,s);box.append(d)}
function rate(c,r){return c+r?Math.round(r/(c+r)*100):0}
function wilson(c,r){const n=c+r;if(!n)return [0,0];const z=1.96,p=r/n,d=1+z*z/n,m=(p+z*z/(2*n))/d,w=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return [Math.max(0,Math.round((m-w)*100)),Math.min(100,Math.round((m+w)*100))]}
let MINB=5;
function renderCues(){
  const q=$('q').value.trim(),only=$('only5').checked,tb=document.querySelector('#t-cue tbody');tb.textContent='';
  CUES.filter(x=>(!q||x.cue.includes(q))&&(!only||x.batches>=MINB)).slice(0,300).forEach(x=>{
    const r=rate(x.confirmed,x.rejected),ci=wilson(x.confirmed,x.rejected),tr=document.createElement('tr');
    td(tr,'م'+x.ind+' '+(NAMES[x.ind]||''));td(tr,x.cue);td(tr,x.confirmed);td(tr,x.rejected);td(tr,x.batches);
    const c=td(tr,r+'% ('+ci[0]+'-'+ci[1]+'%)');const bar=document.createElement('span');bar.className='bar2';bar.style.width=Math.round(r*0.6)+'px';bar.style.marginInlineStart='8px';c.append(bar);
    td(tr,x.batches<MINB?'أولية':(ci[0]>=50?'تراجع: إنذارات كاذبة كثيرة':(ci[1]<=20?'مستقرة':'غير محسومة')));tb.append(tr)});
  if(!tb.children.length){const tr=document.createElement('tr');const c=td(tr,'لا قرائن مطابقة.');c.colSpan=7;tb.append(tr)}
}
async function load(){
  if(!API){$('state').textContent='لم يفعل جمع المعطيات بعد في هذا الموقع.';$('f').hidden=true;return}
  try{
    const r=await fetch(API+'/stats');if(!r.ok)throw 0;const j=await r.json();
    $('state').hidden=true;$('data').hidden=false;
    const t=$('tiles');tile(t,j.total.batches||0,'مساهمة مجهولة');tile(t,j.total.records||0,'قرار مسجل');
    tile(t,(j.total.first||'-')+' إلى '+(j.total.last||'-'),'الفترة');
    $('dl-csv').href=API+'/export.csv';$('dl-json').href=API+'/export.json';
    const tb=document.querySelector('#t-ind tbody');
    j.indicators.forEach(x=>{const tr=document.createElement('tr');td(tr,'م'+x.ind+' '+(NAMES[x.ind]||''));td(tr,x.confirmed);td(tr,x.rejected);td(tr,x.added);td(tr,rate(x.confirmed,x.rejected)+'%');tb.append(tr)});
    MINB=j.min_batches||5;CUES=j.cues;renderCues();
  }catch(e){$('state').textContent='تعذر تحميل النتائج الآن. أعد المحاولة لاحقا.'}
}
$('q').addEventListener('input',renderCues);$('only5').addEventListener('change',renderCues);
$('f').addEventListener('submit',async e=>{
  e.preventDefault();const m=$('f-msg');
  if(window.Auth&&Auth.enabled()&&!Auth.user){m.textContent='سجل الدخول أولا لمراسلة الموقع.';Auth.show();return}
  m.textContent='جاري الإرسال...';$('f-go').disabled=true;
  const r=await Auth.api('/message',{method:'POST',body:{text:$('f-text').value,contact:$('f-contact').value,website:$('f-web').value}});
  if(r.ok){m.textContent='وصلت رسالتك. شكرا.';$('f-text').value=''}
  else m.textContent=r.status===429?'بلغت حد الرسائل اليومي.':(r.status===401||r.status===403?'سجل الدخول وأكد موافقتك على الشروط ثم أعد المحاولة.':'تعذر الإرسال. تحقق من طول الرسالة وأعد المحاولة.');
  $('f-go').disabled=false;
});
if(window.Auth)Auth.initOpen();
load();
