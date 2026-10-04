/* الحساب وشروط الاستعمال. يعمل فقط إذا ضبط API_BASE وAUTH_REQUIRED في config.js.
   الرمز يحفظ في المتصفح ويرسل في ترويسة Authorization. كل النصوص تكتب بـ textContent. */
(function(){
'use strict';
const C=window.CONFIG||{};
const K='tadqiq-token';
const $=(t,a,...kids)=>{const e=document.createElement(t);for(const k in (a||{})){if(k==='class')e.className=a[k];else if(k.startsWith('on'))e.addEventListener(k.slice(2),a[k]);else if(a[k]!==false&&a[k]!=null)e.setAttribute(k,a[k]===true?'':a[k])}for(const c of kids)if(c!=null)e.append(c.nodeType?c:document.createTextNode(c));return e};

const A={
  user:null,
  enabled:()=>!!(C.API_BASE&&C.AUTH_REQUIRED),
  token(){try{return localStorage.getItem(K)||''}catch(e){return ''}},
  setToken(t){try{t?localStorage.setItem(K,t):localStorage.removeItem(K)}catch(e){}},
  async api(path,opts){
    opts=opts||{};const h={'content-type':'application/json'};const t=A.token();if(t)h.authorization='Bearer '+t;
    let r,j={};
    try{r=await fetch(C.API_BASE+path,{method:opts.method||'GET',headers:h,body:opts.body?JSON.stringify(opts.body):undefined})}catch(e){return {status:0,ok:false,data:{error:'network'}}}
    try{j=await r.json()}catch(e){}
    if(r.status===401&&t&&path!=='/me'){A.drop();A.show()}
    return {status:r.status,ok:r.ok&&j.ok!==false,data:j};
  },
  drop(){A.setToken('');A.user=null;document.body.classList.add('locked');A.renderChip()},
  async init(){
    if(!A.enabled()){A.renderChip();return}
    document.body.classList.add('locked');
    if(A.token()){
      const r=await A.api('/me');
      if(r.ok){A.user=r.data;if(r.data.needs_terms){A.show(true);return}A.unlock();return}
      A.setToken('');
    }
    A.show();
  },
  /* صفحة مفتوحة للقراءة: تعرف المستعمل إن كان داخلا دون أن تقفل الصفحة */
  async initOpen(){
    if(!A.enabled()){return}
    if(A.token()){const r=await A.api('/me');if(r.ok){A.user=r.data;if(r.data.needs_terms){A.user=null}}else A.setToken('')}
    A.renderChip();
  },
  unlock(){document.body.classList.remove('locked');const g=document.getElementById('gate');if(g)g.remove();A.renderChip();document.dispatchEvent(new Event('tadqiq-auth'))},
  renderChip(){
    document.querySelectorAll('.acct').forEach(e=>e.remove());
    const nav=document.querySelector('.topnav');if(!nav||!A.enabled())return;
    const box=$('span',{class:'acct'});
    if(A.user){
      box.append($('span',{class:'who',title:A.user.email},A.user.email),
        $('button',{type:'button',onclick:async()=>{await A.api('/auth/logout',{method:'POST',body:{}});A.drop();A.show()}},'خروج'),
        $('button',{type:'button',onclick:A.accountMenu},'حسابي'));
    }else box.append($('button',{type:'button',onclick:()=>A.show()},'تسجيل الدخول'));
    nav.append(box);
  },
  accountMenu(){
    const ov=$('div',{class:'gate',id:'gate'});
    const msg=$('p',{class:'note','aria-live':'polite'});
    ov.append($('div',{class:'gate-card',role:'dialog','aria-modal':'true'},
      $('h2',null,'حسابي'),$('p',null,'البريد: '+(A.user?A.user.email:'')),
      $('div',{class:'row'},
        $('button',{type:'button',onclick:async()=>{const r=await A.api('/account/export');if(!r.ok){msg.textContent='تعذر التنزيل.';return}
          const u=URL.createObjectURL(new Blob([JSON.stringify(r.data,null,1)],{type:'application/json'}));const a=$('a',{href:u,download:'tadqiq-my-data.json'});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000)}},'نزل بياناتي'),
        $('button',{type:'button',onclick:async()=>{if(!confirm('سيحذف حسابك ورسائلك نهائيا. ما أرسلته من قرارات مجهولة يبقى لأنه غير مرتبط بك. أتأكد؟'))return;
          const r=await A.api('/account/delete',{method:'POST',body:{}});if(r.ok){A.drop();A.show()}else msg.textContent='تعذر الحذف.'}},'احذف حسابي'),
        $('button',{type:'button',onclick:()=>ov.remove()},'إغلاق')),msg));
    document.body.append(ov);
  },
  show(termsOnly){
    const old=document.getElementById('gate');if(old)old.remove();
    const status=$('p',{class:'note','aria-live':'polite',style:'min-height:1.4em'});
    const say=(t,bad)=>{status.textContent=t;status.style.color=bad?'var(--flag)':'var(--mute)'};
    const terms=$('input',{type:'checkbox',id:'g-terms'});
    const termsRow=$('label',{class:'g-terms'},terms,$('span',null,'قرأت '),$('a',{href:'terms.html',target:'_blank',rel:'noopener'},'شروط الاستعمال وسياسة الخصوصية'),$('span',null,' وأوافق عليها.'));
    const card=$('div',{class:'gate-card',role:'dialog','aria-modal':'true','aria-labelledby':'g-title'});
    card.append($('h2',{id:'g-title'},termsOnly?'تحديث شروط الاستعمال':'سجل الدخول لاستعمال الأداة'));
    if(termsOnly){
      card.append($('p',null,'تغيرت شروط الاستعمال. اقرأها ووافق عليها لتتابع.'),termsRow,
        $('div',{class:'row'},$('button',{class:'primary',type:'button',onclick:async()=>{
          if(!terms.checked){say('وافق على الشروط أولا.',true);return}
          const r=await A.api('/terms/accept',{method:'POST',body:{}});if(r.ok){A.user.needs_terms=false;A.unlock()}else say('تعذر الحفظ. أعد المحاولة.',true)}},'أوافق'),
          $('button',{type:'button',onclick:async()=>{await A.api('/auth/logout',{method:'POST',body:{}});A.drop();A.show()}},'خروج')),status);
    }else{
      card.append($('p',null,'يشترط الموقع حسابا ببريدك الإلكتروني (Gmail أو غيره) وموافقتك على شروط الاستعمال. الحساب لا يغير شيئا في خصوصية نصوصك: يبقى التحليل داخل متصفحك.'),termsRow);
      if(C.GOOGLE_CLIENT_ID){
        const gbox=$('div',{id:'g-btn',class:'g-btn'});
        card.append($('h3',null,'الدخول بحساب Google'),gbox);
        const initG=()=>{
          if(!window.google||!google.accounts)return;
          google.accounts.id.initialize({client_id:C.GOOGLE_CLIENT_ID,callback:async resp=>{
            if(!terms.checked){say('وافق على الشروط أولا ثم أعد الضغط على زر Google.',true);return}
            say('جاري التحقق...');
            const r=await A.api('/auth/google',{method:'POST',body:{credential:resp.credential,accept_terms:true}});
            finish(r)}});
          google.accounts.id.renderButton(gbox,{theme:'outline',size:'large',text:'signin_with',locale:'ar'});
        };
        if(window.google&&window.google.accounts)initG();
        else{const s=$('script',{src:'https://accounts.google.com/gsi/client',async:true,defer:true});s.onload=initG;s.onerror=()=>say('تعذر تحميل زر Google. استعمل البريد الإلكتروني.',true);document.head.append(s)}
      }
      const email=$('input',{type:'email',id:'g-email',inputmode:'email',autocomplete:'email',placeholder:'name@example.com',dir:'ltr'});
      const code=$('input',{type:'text',id:'g-code',inputmode:'numeric',autocomplete:'one-time-code',maxlength:'6',placeholder:'الرمز المكون من 6 أرقام',dir:'ltr'});
      const codeRow=$('div',{hidden:true,style:'margin-top:8px'},$('label',null,'الرمز المرسل إلى بريدك',code),
        $('div',{class:'row',style:'margin-top:8px'},$('button',{class:'primary',type:'button',id:'g-verify',onclick:async()=>{
          if(!terms.checked){say('وافق على الشروط أولا.',true);return}
          say('جاري التحقق...');
          const r=await A.api('/auth/email/verify',{method:'POST',body:{email:email.value,code:code.value,accept_terms:true}});finish(r)}},'ادخل')));
      const send=$('button',{type:'button',id:'g-send',onclick:async()=>{
        if(!terms.checked){say('وافق على الشروط أولا.',true);return}
        if(!email.value.includes('@')){say('اكتب بريدك الإلكتروني.',true);return}
        send.disabled=true;say('جاري إرسال الرمز...');
        const r=await A.api('/auth/email/start',{method:'POST',body:{email:email.value,accept_terms:true}});
        send.disabled=false;
        if(r.ok){codeRow.hidden=false;say('أرسلنا رمزا إلى بريدك. صالح عشر دقائق. تحقق من مجلد الرسائل غير المرغوبة إن لم يصل.');code.focus()}
        else say(r.status===429?'محاولات كثيرة. أعد المحاولة غدا.':(r.data.error==='bad_email'?'بريد غير صالح.':'تعذر إرسال الرمز. أعد المحاولة لاحقا.'),true)}},'أرسل الرمز');
      card.append($('h3',null,'أو بأي بريد إلكتروني'),$('label',null,'بريدك الإلكتروني',email),$('div',{class:'row',style:'margin-top:8px'},send),codeRow,status);
    }
    const finish=r=>{
      if(r.ok){A.setToken(r.data.token);A.user={email:r.data.email};A.unlock()}
      else say(r.data.error==='terms_required'?'وافق على الشروط لإنشاء الحساب.':(r.status===429?'محاولات كثيرة. أعد المحاولة لاحقا.':'رمز أو بيانات غير صحيحة.'),true);
    };
    const ov=$('div',{class:'gate',id:'gate'},card);
    document.body.append(ov);
  },
  /* للصفحات التي لا تشترط الدخول لكنها تحتاجه لميزة (مراسلة) */
  ok:()=>!A.enabled()||!!A.user
};
window.Auth=A;
})();
