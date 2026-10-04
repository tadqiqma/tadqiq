
/* ---------- المؤشرات ---------- */
const INDS=[
 {c:1,n:'رفع اليقين',w:2,bench:true,q:'هل جزم المقطع بما لم يجزم به المصدر؟',cues:'أدوات جزم (قطعا، لا شك، بالتأكيد، حتما)، تحويل "اتهم" أو "يقال" إلى إثبات',
  d:'يصاغ الخبر بجزم أقوى مما في مصدره.',t:'مصدر منسوب إليه صيغته محتملة أو منسوبة (قيل، اتهم، يرجح)، والنص يصوغه جازما.',x:'الجزم من المصدر نفسه، أو يعلنه الكاتب رأيا.',e:'المصدر: اتهم بالتزوير. النص: المزور فلان.'},
 {c:2,n:'توسيع النطاق',w:1,q:'هل انتقل الحكم من حالة إلى مؤسسة أو فئة كاملة؟',cues:'كميات كلية بلا إحصاء (كل، جميع، دائما، لا أحد، أي)، الانتقال من اسم علم إلى اسم جماعي',
  d:'ينتقل الحكم من حالات محددة إلى الفئة كلها.',t:'كمية كلية في ادعاء وقائعي دون إحصاء أو جرد يسندها.',x:'نص قانوني، أو كلية صحيحة بالتعريف، أو سياق مجازي صريح.',e:'كل المسؤولين يتصرفون كأن المال العام ملكهم.'},
 {c:3,n:'نسبة زائفة إلى مصدر',w:2,bench:true,q:'هل ينسب إلى المصدر ما ليس فيه؟',cues:'عزو إلى جهة موثوقة (حسب تقرير، كما كتبت، قالت) يتبعه مضمون دون إحالة دقيقة',
  d:'ينسب إلى جهة مسماة قول أو استنتاج ليس في وثيقتها.',t:'عزو إلى جهة معينة بمضمون محدد، ومقابلته بالأصل تظهر غيابه أو تحويره. دون المقابلة يبقى مقترحا.',x:'عزو مطابق للأصل أو تلخيص أمين.',e:'"قال التقرير إن الدولة ترعى الفساد" والتقرير لا يقول ذلك.'},
 {c:4,n:'تبديل الأرقام أو المقام',w:2,bench:true,q:'هل الرقم أو نسبته مختلفة عن المصدر أو بلا قاعدة قياس؟',cues:'رقم أو نسبة بلا مقام أو سنة أو مجموعة، مقارنة بين قواعد غير متجانسة، "فقط" و"أكثر من" قبل الرقم',
  d:'يذكر رقم أو نسبة بقاعدة قياس مختلفة عن مصدره أو بلا قاعدة.',t:'رقم أو نسبة في المقطع، وغاب مقامه أو سنته أو مجموعته أو خالف المصدر.',x:'رقم مذكور بمقامه وسنته كاملين وموافق لمصدره.',e:'"40 مليونا في سنة واحدة" والمصدر: ثلاث سنوات.'},
 {c:5,n:'السماع',w:1,q:'هل الخبر منقول عن مجهول أو بوسيط ويقدم كمعطى؟',cues:'مصادر، مطلعون، قيل، بلغني، أحد أصدقائه، سلسلة وسطاء',
  d:'يقدم خبر منقول عن مجهول أو بوسيط كأنه معطى.',t:'إسناد مجهول (مصدر مطلع، قيل) أو وسيط عن وسيط، ثم بني عليه استنتاج أو أثبت الخبر بعده.',x:'إخفاء الاسم لحماية مصدر مع تحفظ صريح وعدم البناء عليه.',e:'قال مصدر مطلع إن الرئيس يعلم، ثم: والرئيس متواطئ.'},
 {c:6,n:'تشبيه انفعالي',w:1,q:'هل يحمل التشبيه شحنة بدل معلومة؟',cues:'مفردات عنف أو تاريخ أسود، استعارات حيوانية، تشبيه بلا وجه شبه معلن',
  d:'يحل التشبيه الوجداني محل المعلومة.',t:'تشبيه أو استعارة من حقل العنف أو الجريمة أو التاريخ الأسود، بلا وجه شبه معلن، داخل ادعاء وقائعي.',x:'تشبيه صريح في أسلوب أدبي، أو وجه شبهه معلن.',e:'تعامل الإدارة مواطنيها كما تعامل المسالخ ماشيتها.'},
 {c:7,n:'حجة من الغياب',w:1,bench:true,q:'هل جعل السكوت أو عدم النفي دليلا؟',cues:'لم ينف، لم يرد، التزم الصمت، لماذا لم، أين الدليل على العكس',
  d:'يجعل السكوت أو غياب النفي دليلا.',t:'عبارة عن عدم النفي أو الرد يستخرج منها استنتاج. ويلزم مرجع يبين هل صدر رد قبل النشر.',x:'ذكر غياب الرد كواقعة فقط بعد طلب رد موثق.',e:'لم تنف البلدية، وهذا الصمت يقول الكثير.'},
 {c:8,n:'تجاور إيحائي',w:1,q:'هل توجد وثيقة تربط الواقعتين؟',cues:'واقعتان متتاليتان بأداة ربط ضعيفة (و، بينما، في الوقت الذي)، قرابة بدل علاقة، ترك الاستنتاج للقارئ',
  d:'يضع واقعتين متجاورتين ويترك القارئ يربط بينهما.',t:'واقعتان لا تربطهما وثيقة، مجاورتان في المقطع بأداة ربط ضعيفة، وتؤديان استنتاجا ضمنيا.',x:'علاقة موثقة بين الواقعتين.',e:'اعتقال صحفي، وفي الوقت نفسه تهنئة سفارة أجنبية للدولة.'},
 {c:9,n:'خلط بين طبقتين',w:2,bench:true,q:'هل مرر غير الموثق بجوار موثق دون فصل؟',cues:'وثيقة وشاهد واستنتاج في فقرة واحدة بإسناد واحد، الانتقال من "ورد في التقرير" إلى "وهذا يؤكد"',
  d:'يمزج الموثق بغير الموثق في صيغة إسناد واحدة.',t:'وثيقة أو شاهد مع استنتاج الكاتب في جملة أو فقرة واحدة دون فاصل، ويلزم تمييز ما في الوثيقة فعلا.',x:'فصل صريح بين ما ورد وما يستنتجه الكاتب.',e:'"ورد في التقرير كذا، وهذا يؤكد أن الدولة..."'},
 {c:11,n:'إخفاء انتقائي',w:1,bench:true,q:'هل غاب قيد أو رد موثق في المرجع؟',cues:'اقتصار على جزء من المصدر، غياب الشرط والاستثناء، طرف واحد لواقعة ذات طرفين',
  d:'يحذف قيدا أو ردا موثقا يغير دلالة الخبر.',t:'المرجع يتضمن قيدا أو ردا جوهريا والمقطع يغفله. لا يثبت دون المرجع.',x:'قيد غير جوهري لا يغير الدلالة.',e:'يذكر المبلغ ويغفل أن البلاغ يبين أنه عن ثلاث سنوات.'},
 {c:12,n:'نفي ظاهري',w:1,q:'هل نقض الكاتب مبدأه المعلن في الجملة نفسها؟',cues:'"لا أقول لكن"، "ليس سبا لكن"، "دون أن أتهم"، "لا يعني... ومع ذلك"',
  d:'يعلن مبدأ ثم يمارس نقيضه قريبا منه.',t:'صيغة نفي، ثم "لكن" أو ما يماثلها، ثم مضمون يحمل ما نفي.',x:'تحفظ حقيقي يتبعه تقييد فعلي لا نقض.',e:'لا أتهم أحدا، لكن لا تفسير غير خدمة المقربين.'},
 {c:13,n:'كيل بمكيالين',w:1,bench:true,q:'هل يطبق على طرف ما يعفي منه نظيره؟',cues:'معيار لنفسه ثم سلوك ضده نحو الآخر، أو معيار دولي عن حالة واحدة',
  d:'يطبق معيارا على طرف ويعفي نظيره.',t:'حالتان فأكثر متماثلتان، وجرد لهما، ومعاملتان مختلفتان في النص. مثال واحد لا يكفي.',x:'حالة واحدة.',e:'يدين قيدا على صحفي ويصمت عن مثله في صحفي من معسكره.'},
 {c:14,n:'نسبة دوافع',w:1,q:'هل حدد نية مجهولين ونفى ما سواها؟',cues:'أفعال النوايا (يريد، يهدف، غرضه، لتصفية، خدمة لـ)، فاعل مبهم (جهات، أطراف)، نفي بقية الأسباب',
  d:'يجزم بدافع طرف ما دون دليل وينفي غيره.',t:'فعل نية، وفاعل مبهم أو معين، ونفي بقية التفسيرات.',x:'دافع أعلنه صاحبه بنفسه.',e:'لا تفسير آخر غير الرغبة في خدمة المقربين.'}
];
const IND=Object.fromEntries(INDS.map(i=>[i.c,i]));
const EXITS=[
 [1,'إسناد مسمى لكل ادعاء جوهري'],[2,'فصل الواقعة عن الرأي بإعلان الانتقال'],[3,'نقل الشروط والتحفظات الواردة في المصدر'],
 [4,'عرض رد الطرف الآخر أو ذكر غيابه'],[5,'التصريح بكونه طرفا'],[6,'إحالات قابلة للتحقق (وثيقة، رابط، صفحة)'],
 [7,'تحديد حدود الادعاء ومنع التعميم'],[8,'تصحيح خطأ سابق علنا']
];
const TYPES={fact:'واقعة',opinion:'رأي صريح',insinuation:'إيحاء'};
const ATTR={'':'غير منطبق','0':'0 وثيقة أو تقرير مسمى','1':'1 شاهد مسمى','2':'2 مجهول مباشر','3':'3 وسيط'};

/* ---------- الحالة ---------- */
const S={passages:[],exits:{},flags:{10:{items:[],ok:false},12:{ok:false},13:{items:[],ok:false}},demo:false,locked:false,th:{pass:2,rate:10,exit:5,min:10,conf:85,ind:20},refs:[]};
let ctl=null;

/* ---------- أدوات ---------- */
const $=id=>document.getElementById(id);
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const k in (attrs||{})){const v=attrs[k];if(v==null||v===false)continue;if(k==='class')e.className=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?'':v)}
  for(const c of kids.flat()){if(c==null||c===false)continue;e.append(c.nodeType?c:document.createTextNode(String(c)))}return e}
const norm=s=>String(s||'').replace(/[ً-ْٰـ]/g,'').replace(/[“”«»„"]/g,'"').replace(/\s+/g,' ').trim();
const put=(el,...kids)=>kids.flat().forEach(k=>{if(k!=null&&k!==false)el.append(k)});
const pct=(a,b)=>b?Math.round(a/b*1000)/10:0;
function outletVal(){const s=$('m-outlet').value;if(s==='آخر'){const o=$('m-outlet-other').value.trim();return o?'آخر: '+o:'آخر'}return s}
function setOutlet(v){const s=$('m-outlet'),o=$('m-outlet-other');v=typeof v==='string'?v.slice(0,120):'';
  const opts=[...s.options].map(x=>x.value);
  if(opts.includes(v)&&v!=='آخر'){s.value=v;o.value=''}
  else if(v){s.value='آخر';o.value=v.replace(/^آخر:\s*/,'').slice(0,80)}else{s.value='';o.value=''}
  o.hidden=s.value!=='آخر'}
function msg(t,warn){const m=$('msg');m.textContent=t||'';m.style.color=warn?'var(--flag)':'var(--mute)'}

/* ---------- الحساب ---------- */
function passScore(p,provisional){
  const codes=new Set();
  for(const i of p.inds){
    if(i.s==='confirmed')codes.add(i.c);
    else if(provisional&&i.s==='suggested'&&!IND[i.c].bench)codes.add(i.c);
  }
  let t=0;codes.forEach(c=>t+=IND[c].w);return t;
}
function compute(){
  const th=S.th;
  const ver=S.passages.filter(p=>p.ver&&p.type!=='opinion');
  const camo=ver.filter(p=>passScore(p,false)>=th.pass).length;
  const camoProv=ver.filter(p=>passScore(p,true)>=th.pass).length;
  const exitScore=EXITS.filter(([c])=>{const e=S.exits[c];return e&&e.a>0&&e.p/e.a>=0.5}).length;
  const N=ver.length,rate=pct(camo,N),rateProv=pct(camoProv,N);
  const lowC=rate<th.rate,highE=exitScore>=th.exit;
  let key,label,cls;
  if(!N){key='none';label='لا مقاطع قابلة للتحقق';cls=''}
  else if(lowC&&highE){key='clear';label='نص شفاف';cls='good'}
  else if(lowC){key='light';label='نص خفيف التوثيق غير مموه';cls='mid'}
  else if(highE){key='amb';label='ملتبس: علامات الخروج مرتفعة مع تمويه مرتفع، فتراجع ممارستها ويختبر الأمر بالاستراتيجية 10';cls='mid'}
  else{key='camo';label='نص مموه بحسب هذه الشبكة';cls='bad'}
  if(S.partial&&N){key='partial';label='فحص جزئي: لا يصدر تصنيف إجمالي';cls=''}
  else if(N&&rate<th.rate&&rateProv>=th.rate&&(key==='clear'||key==='light')){key='pending';label='التصنيف مؤجل: توجد مقترحات غير محسومة قد ترفع النسبة إلى '+rateProv+'%';cls=''}
  return {N,camo,camoProv,rate,rateProv,exitScore,label,cls,key,enough:N>=th.min};
}
function indStats(){
  const ver=S.passages.filter(p=>p.ver&&p.type!=='opinion'),N=ver.length;
  return INDS.map(d=>{
    const conf=ver.filter(p=>p.inds.some(i=>i.c===d.c&&i.s==='confirmed')).length;
    const pend=ver.filter(p=>p.inds.some(i=>i.c===d.c&&i.s==='suggested')).length;
    const share=pct(conf,N);
    return {d,conf,pend,share,est:N>0&&conf>0&&share>=S.th.ind};
  });
}
function activeStats(){return indStats().filter(x=>!S.sel||S.sel.includes(x.d.c)||x.conf||x.pend)}
function selected(){return INDS.filter(d=>{const e=document.getElementById('pk-'+d.c);return e?e.checked:true})}
const PRESETS={all:null,num:[2,4,11,3],src:[1,3,5,9,11],fra:[6,7,8,12,14]};
function renderPicker(){
  const box=$('picker'),old=INDS.filter(d=>document.getElementById('pk-'+d.c)),keep=new Set(old.filter(d=>$('pk-'+d.c).checked).map(d=>d.c)),had=new Set(old.map(d=>d.c));
  box.textContent='';
  INDS.forEach(d=>box.append(h('label',{title:d.d+' '+d.t},h('input',{type:'checkbox',id:'pk-'+d.c,checked:!had.has(d.c)||keep.has(d.c),onchange:()=>{$('preset').value='custom';presetNote()}}),'م'+d.c+' '+d.n)));
  presetNote();
}
function applyPreset(){
  const v=$('preset').value;if(v==='custom')return;
  const list=PRESETS[v];INDS.forEach(d=>{const e=$('pk-'+d.c);if(e)e.checked=!list||list.includes(d.c)||!!d.custom});presetNote();
}
function presetNote(){
  const n=selected().length,all=n===INDS.length;
  $('presetnote').textContent=all?'كل المؤشرات مفحوصة: يصدر تصنيف كامل.':n+' من '+INDS.length+' مؤشرا: ينتج جدول حضور المؤشرات والمقاطع المرصودة، دون تصنيف إجمالي لأن نسبة التمويه محسوبة على الشبكة كاملة.';
}
function addCustom(){
  const name=$('c-name').value.trim(),cond=$('c-cond').value.trim();
  if(!name||!cond){msg('اكتب اسم المؤشر وشرطه.',true);return}
  const c=INDS.reduce((m,d)=>Math.max(m,d.c),100)+1;
  const d={c,n:name,w:parseInt($('c-w').value)||1,bench:$('c-bench').checked,q:cond,cues:'',d:cond,t:cond,x:'غير محدد',e:'-',custom:true};
  INDS.push(d);IND[c]=d;$('c-name').value='';$('c-cond').value='';
  renderPicker();$('guide').textContent='';renderGuide();msg('أضيف المؤشر الخاص م'+c+'.');
}
function applyAuto(){
  let n=0;
  for(const p of S.passages){
    if(!p.ver||p.type==='opinion')continue;
    for(const i of p.inds){
      if(i.s!=='suggested'||(i.k||0)<S.th.conf)continue;
      if(IND[i.c].bench&&!(p.refs&&p.refs.length))continue;
      i.s='confirmed';i.auto=true;n++;
    }
  }
  return n;
}

/* ---------- العرض: الملخص ---------- */
function summaryText(r,st){
  if(!r.N)return 'لم تحصر الأداة مقاطع قابلة للتحقق في هذا النص.';
  const top=st.filter(x=>x.conf>0).sort((a,b)=>b.conf-a.conf).slice(0,3);
  const est=st.filter(x=>x.est);
  let t='من '+r.N+' مقطعا قابلا للتحقق، تأكد التمويه في '+r.camo+' ('+r.rate+'%).';
  if(top.length)t+=' أكثر المؤشرات حضورا: '+top.map(x=>x.d.n+' ('+x.conf+')').join('، ')+'.';
  if(est.length)t+=' المؤشرات المطردة بحسب عتبة '+S.th.ind+'%: '+est.map(x=>x.d.n).join('، ')+'.';
  t+=' علامات الخروج الممارسة: '+r.exitScore+' من 8.';
  return t;
}
function renderSummary(){
  const r=compute(),box=$('sum');if(!box)return;box.textContent='';
  const st=indStats();
  const pend=S.passages.reduce((n,p)=>n+p.inds.filter(i=>i.s==='suggested').length,0);
  const auto=S.passages.reduce((n,p)=>n+p.inds.filter(i=>i.auto&&i.s==='confirmed').length,0);
  box.append(
    h('div',{class:'verdict '+r.cls},
      h('div',{class:'lab'},r.label),
      h('p',{class:'sumtxt'},summaryText(r,activeStats())),
      !r.enough&&r.N>0?h('p',{class:'note',style:'margin:6px 0 0'},'نتيجة هذا النص وحده، وعدد مقاطعه القابلة للتحقق قليل ('+r.N+' من '+S.th.min+' فأكثر للاستقرار)، فيكفي تغيير مقطع واحد لتتبدل النسبة. اعتمدها قرينة لا حكما.'):h('p',{class:'note',style:'margin:6px 0 0'},'الحكم وصفي يخص هذا النص وحده بحسب الشبكة، ولا يقال عن كاتبه أو منبره شيء.'),
      pend?h('p',{class:'note',style:'margin:6px 0 0'},'بانتظار قرارك: '+pend+' مؤشر. لو اعتمدت المقترحات النصية كلها لبلغت النسبة '+r.rateProv+'%.'):null,
      auto?h('p',{class:'note',style:'margin:6px 0 0'},'اعتمد تلقائيا '+auto+' مؤشر لبلوغ ثقته '+S.th.conf+'% فأكثر، ويمكنك رفضها بالضغط عليها.'):null
    ),
    h('div',{class:'stats'},
      h('div',{class:'stat'},h('b',null,String(r.N)),h('span',null,'مقاطع قابلة للتحقق (الأفضل '+S.th.min+' فأكثر)')),
      h('div',{class:'stat'},h('b',{style:'color:var(--flag)'},r.camo+' / '+r.N),h('span',null,'مقاطع مموهة مؤكدة')),
      h('div',{class:'stat'},h('b',null,r.rate+'%'),h('span',null,'نسبة التمويه (العتبة '+S.th.rate+'%)'),h('div',{class:'bar'},h('i',{style:'width:'+Math.min(100,r.rate)+'%'}))),
      h('div',{class:'stat'},h('b',null,r.exitScore+' / 8'),h('span',null,'درجة الخروج (العتبة '+S.th.exit+')'))
    )
  );
}
function renderInds(){
  const box=$('inds');if(!box)return;box.textContent='';
  const st=activeStats();
  box.append(h('div',{class:'scroll'},h('table',null,
    h('thead',null,h('tr',null,['المؤشر','الوزن','مؤكد','مقترح','حضوره %','الحالة'].map(x=>h('th',null,x)))),
    h('tbody',null,st.map(x=>h('tr',null,
      h('td',null,h('b',null,'م'+x.d.c+' '),x.d.n),h('td',null,x.d.w),h('td',null,x.conf),h('td',null,x.pend),
      h('td',null,h('span',{style:'font-variant-numeric:tabular-nums'},x.share+'%'),h('div',{class:'bar',style:'width:90px'},h('i',{style:'width:'+Math.min(100,x.share*2)+'%'}))),
      h('td',null,x.est?h('span',{class:'pill est'},'مطرد ومعتد به'):(x.conf?h('span',{class:'pill'},'حاضر'):h('span',{class:'pill'},'غائب')))))))));
}

/* ---------- العرض: علامات الخروج والأعلام ---------- */
function renderExits(){
  const box=$('exits');if(!box)return;box.textContent='';
  const rows=EXITS.map(([c,t])=>{
    const e=S.exits[c]||(S.exits[c]={a:0,p:0,d:false,ev:''});
    const ok=e.a>0&&e.p/e.a>=0.5;
    const num=(k)=>h('input',{type:'number',min:0,value:e[k],'aria-label':(k==='a'?'مقاطع منطبقة ':'مقاطع ممارسة ')+'خ'+c,onchange:ev=>{e[k]=Math.max(0,parseInt(ev.target.value)||0);if(e.p>e.a&&k==='a')e.p=e.a;if(e.p>e.a)e.p=e.a;renderExits();renderSummary()}});
    return h('tr',null,
      h('td',null,'خ'+c),h('td',null,t),
      h('td',null,num('a')),h('td',null,num('p')),
      h('td',null,e.a?Math.round(e.p/e.a*100)+'%':'-'),
      h('td',null,ok?h('span',{class:'pill ok'},'ممارس'):(e.d?h('span',{class:'pill decl'},'معلن فقط'):h('span',{class:'pill'},e.a?'غير ممارس':'لا ينطبق'))),
      h('td',{class:'note'},e.ev?'"'+e.ev+'"':''));
  });
  box.append(h('div',{class:'scroll'},h('table',null,
    h('thead',null,h('tr',null,['الرمز','العلامة','مقاطع منطبقة','مقاطع ممارسة','النسبة','الحالة','شاهد'].map(x=>h('th',null,x)))),
    h('tbody',null,rows))));
}
function densityText(){
  const items=S.flags[10].items;if(!items.length)return 'لم تلتقط الأداة عبارات مصداقية استباقية.';
  const ver=S.passages.filter(p=>p.ver&&p.type!=='opinion');
  const camo=ver.filter(p=>passScore(p,false)>=S.th.pass),clean=ver.filter(p=>passScore(p,false)<S.th.pass);
  let bc=0,bn=0;
  for(const it of items){const nxt=ver.find(p=>p.pos>=it.pos);if(!nxt)continue;if(camo.includes(nxt))bc++;else bn++}
  return 'قبل المقاطع المموهة: '+bc+' عبارة في '+camo.length+' مقطعا ('+(camo.length?(bc/camo.length).toFixed(2):'-')+' للمقطع). قبل غير المموهة: '+bn+' في '+clean.length+' ('+(clean.length?(bn/clean.length).toFixed(2):'-')+' للمقطع).';
}
function renderFlags(){
  const box=$('flags');if(!box)return;box.textContent='';
  const c12=S.passages.reduce((n,p)=>n+p.inds.filter(i=>i.c===12&&i.s==='confirmed').length,0);
  const block=(code,title,body,items)=>h('div',{class:'p',style:'margin-bottom:8px'},
    h('div',{class:'p-head'},
      h('label',{style:'flex-direction:row;align-items:center;gap:8px;color:var(--ink)'},h('input',{type:'checkbox',checked:S.flags[code].ok,onchange:e=>{S.flags[code].ok=e.target.checked}}),h('strong',null,title))),
    body,items);
  box.append(
    block(10,'علم الاستراتيجية 10: التجميل بعلامات المصداقية (يسجل بتأكيدك)',
      h('p',{class:'why'},densityText()+' العلم يثبت إذا كانت الكثافة أعلى قبل المقاطع المموهة.'),
      h('ul',{class:'note',style:'margin:0;padding-inline-start:18px'},S.flags[10].items.map(i=>h('li',null,'"'+i.quote+'"'+(i.why?' - '+i.why:''))))),
    block(12,'علم النفي الظاهري على مستوى النص',
      h('p',{class:'why'},'مؤشرات النفي الظاهري المؤكدة في المقاطع: '+c12+'.'),null),
    block(13,'علم الكيل بمكيالين على مستوى النص',
      h('p',{class:'why'},'يتطلب حالتين فأكثر وجردا مسبقا للحالات المقارنة. مثال واحد لا يكفي. ما يلي مرشحات من الأداة تحتاج جردا قبل التأكيد.'),
      S.flags[13].items.length?h('ul',{class:'note',style:'margin:0;padding-inline-start:18px'},S.flags[13].items.map(i=>h('li',null,'"'+i.quote+'"'+(i.why?' - '+i.why:'')))):null)
  );
}

/* ---------- العرض: المقاطع ---------- */
function highlight(quote,cues){
  const out=h('p',{class:'quote'});let rest=quote;const cs=[...new Set(cues.filter(Boolean))];
  const pos=[];for(const c of cs){const i=rest.indexOf(c);if(i>=0)pos.push([i,i+c.length])}
  pos.sort((a,b)=>a[0]-b[0]);let cur=0;
  for(const [a,b] of pos){if(a<cur)continue;out.append(rest.slice(cur,a));out.append(h('mark',null,rest.slice(a,b)));cur=b}
  out.append(rest.slice(cur));return out;
}
function card(p){
  const sc=passScore(p,false),camo=p.ver&&p.type!=='opinion'&&sc>=S.th.pass;
  const el=h('div',{class:'p'+(camo?' camo':'')+(p.type==='opinion'?' opin':'')});
  const redo=()=>{const n=card(p);el.replaceWith(n);renderSummary();renderInds();renderFlags()};
  const chips=h('div',{class:'chips'},p.inds.map(i=>{
    const d=IND[i.c];
    const next={suggested:'confirmed',confirmed:'rejected',rejected:'suggested'}[i.s];
    return h('button',{class:'chip '+(i.s==='confirmed'?'c':i.s==='rejected'?'r':''),title:(d.q+' - '+(i.why||'')+' (اضغط لتغيير الحالة)'),'aria-label':'م'+i.c+' '+d.n+': '+({suggested:'مقترح',confirmed:'مؤكد',rejected:'مرفوض'})[i.s],
      onclick:()=>{i.s=next;i.auto=false;redo()}},
      'م'+i.c+' '+d.n,h('small',null,'وزن '+d.w),i.s==='suggested'?h('small',null,d.bench&&!(p.refs&&p.refs.length)?'بانتظار المرجع':'مقترح'):null,i.auto&&i.s==='confirmed'?h('small',{class:'auto'},'آلي'):null,i.k?h('small',null,i.k+'%'):null)}));
  const whys=p.inds.filter(i=>i.why).map(i=>h('p',{class:'why'},'م'+i.c+': '+i.why));
  const refChips=h('div',{class:'chips'},(p.refs||[]).map(id=>{const r=S.refs.find(x=>x.id===id);return r?h('span',{class:'pill ok'},safeUrl(r.link)?h('a',{href:safeUrl(r.link),target:'_blank',rel:'noopener noreferrer',style:'color:inherit'},r.title):r.title,' ',h('button',{style:'border:0;background:none;padding:0 4px;color:inherit','aria-label':'فك الربط',onclick:()=>{p.refs=p.refs.filter(z=>z!==id);redo()}},'×')):null}));
  const refSel=h('div',{class:'add'},
    h('select',{id:'ref-'+p.id,'aria-label':'ربط مرجع بالمقطع'},h('option',{value:''},S.refs.length?'اربط مرجعا بهذا المقطع':'لا مراجع بعد'),S.refs.filter(r=>!(p.refs||[]).includes(r.id)).map(r=>h('option',{value:r.id},r.title))),
    h('button',{onclick:()=>{const v=parseInt($('ref-'+p.id).value);if(!v)return;(p.refs=p.refs||[]).push(v);applyAuto();redo()}},'ربط'));
  const add=h('div',{class:'add'},
    h('select',{id:'add-'+p.id,'aria-label':'إضافة مؤشر يدويا'},h('option',{value:''},'أضف مؤشرا'),INDS.filter(d=>!p.inds.some(i=>i.c===d.c)).map(d=>h('option',{value:d.c},'م'+d.c+' '+d.n))),
    h('button',{onclick:()=>{const v=parseInt($('add-'+p.id).value);if(!v)return;p.inds.push({c:v,cue:'',why:'أضيف يدويا',s:'confirmed',k:0});redo()}},'إضافة'));
  put(el,
    h('div',{class:'p-head'},
      h('span',{class:'p-n'},'#'+p.id),
      h('select',{'aria-label':'التصنيف',style:'width:auto',onchange:e=>{p.type=e.target.value;if(p.type==='opinion')p.ver=false;redo()}},Object.entries(TYPES).map(([k,v])=>h('option',{value:k,selected:p.type===k},v))),
      h('label',{style:'flex-direction:row;align-items:center;gap:6px;color:var(--ink)'},h('input',{type:'checkbox',checked:p.ver&&p.type!=='opinion',disabled:p.type==='opinion',onchange:e=>{p.ver=e.target.checked;redo()}}),'قابل للتحقق'),
      h('span',{class:'pill '+(camo?'no':'')},'درجة '+sc),
      camo?h('span',{class:'pill no'},'مموه'):null),
    highlight(p.quote,p.inds.map(i=>i.cue)),
    p.inds.length?chips:h('p',{class:'note',style:'margin:0'},'لا مؤشرات مقترحة.'),
    whys,
    (p.ver&&p.type!=='opinion')?h('details',null,h('summary',null,'المرجع والإسناد'+((p.refs&&p.refs.length)?' ('+p.refs.length+' مرجع مربوط)':'')),
      h('div',{class:'p-meta',style:'margin-top:8px'},
        h('label',null,'درجة الإسناد',h('select',{onchange:e=>{p.attr=e.target.value}},Object.entries(ATTR).map(([k,v])=>h('option',{value:k,selected:String(p.attr??'')===k},v)))),
        h('label',{class:'bm'},'ما يلزم مقابلته',h('input',{type:'text',value:p.bench||'',placeholder:'مثال: النص الكامل للتقرير المنسوب إليه',onchange:e=>{p.bench=e.target.value}}))),
      refChips,refSel):null,
    add);
  return el;
}
function renderPassages(){
  const box=$('plist');if(!box)return;box.textContent='';
  const only=$('onlyver')&&$('onlyver').checked;
  S.passages.filter(p=>!only||(p.ver&&p.type!=='opinion')).forEach(p=>box.append(card(p)));
  if(!box.children.length)box.append(h('p',{class:'note'},'لا مقاطع لعرضها.'));
}

/* ---------- العرض: لوحة النتائج ---------- */
function renderResults(){
  const root=$('results');root.textContent='';
  if(!S.passages.length){root.append(h('div',{class:'empty'},h('b',null,'لا نتائج بعد.'),h('ol',null,h('li',null,'الصق النص أو ارفعه.'),h('li',null,'اختر نوع الفحص أو المؤشرات التي تهمك.'),h('li',null,'أضف مراجعك إن كانت لديك، ثم اضغط "حلل النص".'),h('li',null,'راجع كل مؤشر مقترح بالاقتباس الذي استند إليه، وأكده أو ارفضه.')),h('p',{class:'note',style:'margin:8px 0 0'},'تستطيع أيضا الضغط على "عرض مثال توضيحي" لترى شكل النتيجة بنص مختلق.')));return}
  put(root,
    h('h2',null,'3. النتيجة'),
    S.demo?h('div',{class:'banner demo',style:'margin-bottom:12px'},'مثال توضيحي بنص مختلق عن بلدية خيالية، ولا يخص أحدا. حلل نصك لتظهر نتائجه هنا.'):null,
    h('div',{id:'sum'}),
    h('div',{class:'row',style:'margin:10px 0 24px'},
      h('button',{onclick:()=>{S.passages.forEach(p=>p.inds.forEach(i=>{if(i.s==='suggested'&&!IND[i.c].bench)i.s='confirmed'}));renderAll()}},'اعتمد المقترحات النصية'),
      h('button',{onclick:()=>{const n=applyAuto();renderAll();msg(n?'اعتمد '+n+' مؤشرا لبلوغه عتبة الثقة.':'لا مؤشرات جديدة بلغت العتبة.')}},'طبق عتبة الاعتماد'),
      h('button',{onclick:exportReport},'تنزيل التقرير (Markdown)'),
      h('button',{onclick:exportCSV},'تنزيل جدول المؤشرات (CSV)'),
      h('button',{onclick:exportJSON},'تنزيل البيانات (JSON)')),
    contribBlock(),
    h('h2',null,'4. حضور المؤشرات'),
    h('p',{class:'note'},'المؤشر المطرد هو ما بلغ حضوره عتبة '+S.th.ind+'% من المقاطع القابلة للتحقق، فيعد معتدا به قرينة على استراتيجية غالبة في النص.'),
    h('div',{class:'card',id:'inds',style:'margin-bottom:24px'}),
    h('h2',null,'5. علامات الخروج من التمويه'),
    h('p',{class:'note'},'تحتسب العلامة إذا مورست في نصف المقاطع المنطبقة على الأقل. الإعلان وحده لا يكفي. عدل الأرقام إن خالفت قراءتك.'),
    h('div',{class:'card',id:'exits',style:'margin-bottom:24px'}),
    h('h2',null,'6. أعلام مستوى النص'),
    h('div',{id:'flags',style:'margin-bottom:24px'}),
    h('h2',null,'7. المقاطع'),
    h('div',{class:'legend'},
      h('span',null,'اضغط المؤشر لتغيير حالته: مقترح (متقطع)، مؤكد (أحمر)، مرفوض (مشطوب).'),
      h('label',{style:'flex-direction:row;align-items:center;gap:6px'},h('input',{type:'checkbox',id:'onlyver',onchange:renderPassages}),'القابلة للتحقق فقط')),
    h('div',{id:'plist'}));
  renderAll();
}
function renderAll(){renderSummary();renderInds();renderExits();renderFlags();renderPassages()}

/* ---------- التحليل ---------- */
let SEL=INDS;
const PROMPT=()=>`أنت مرمز في أداة لتدقيق الخطاب الإعلامي. تقطع النص إلى مقاطع وتقترح مؤشرات من شبكة محددة. لا تحكم على الأشخاص ولا على صدق المحتوى، ولا تنسب نوايا إلى الكاتب. اقترح فقط ما يدل عليه النص نفسه، ويؤكد الباحث لاحقا.

القواعد:
1. قسم النص إلى مقاطع من جملة إلى ثلاث جمل. الحقل quote ينسخ حرفيا من النص، من 5 إلى 40 كلمة، بلا تغيير ولا اختصار داخلي.
2. type: "fact" واقعة قابلة للتحقق، أو "opinion" رأي صريح، أو "insinuation" إيحاء. verifiable: true إذا احتوى ادعاء وقائعيا يمكن مقابلته بمعيار خارجي، وfalse إذا كان رأيا أو تأويلا لا يقابل بمعيار. الرأي الصريح لا يرمز بمؤشرات.
3. attribution: 0 وثيقة أو تقرير مسمى، 1 شاهد مسمى، 2 مصدر مجهول مباشر، 3 وسيط عن وسيط، null إن لم ينطبق.
4. indicators: قائمة عناصر {c, cue, why, k}. c رقم المؤشر من القائمة أدناه. cue عبارة منسوخة حرفيا من quote تدل على المؤشر. why جملة قصيرة. k رقم من 0 إلى 100 يمثل ثقتك بأن شرط المؤشر متحقق في النص نفسه وأن الاستثناء لا ينطبق؛ لا تعط 85 فأكثر إلا إذا ظهر شرط المؤشر صراحة في عبارة منسوخة، وما احتاج مرجعا خارجيا لا يتجاوز 70 ما لم يرد المرجع في القائمة. لا تضف مؤشرا بلا cue حرفي. الإسناد المجهول لحماية مصدر ليس انزلاقا بذاته: سجل c=5 فقط إذا بني عليه استنتاج أو أثبت الخبر بعده. الكلية في نص قانوني ليست تعميما. التشبيه الصريح في أسلوب أدبي ليس انفعاليا.
5. bench: للمقاطع القابلة للتحقق، المعيار الخارجي اللازم للتحقق (النص الكامل للتقرير المنسوب إليه، نتائج رسمية، بلاغ سابق، جرد حالات). لا تخترع وثائق ولا أرقاما ولا وقائع. refs: أرقام المراجع من قسم المراجع المتاحة (إن وجد) التي تخص هذا المقطع مباشرة، ولا تضف مرجعا غير ذي صلة. لا تحكم بمطابقة النص للمرجع إلا بما كتب في المرجع حرفيا. ولا تقترح إلا المؤشرات الواردة في قائمة المؤشرات أدناه وحدها.
6. exits: لكل علامة خروج من 1 إلى 8: a عدد المقاطع القابلة للتحقق التي تنطبق عليها العلامة، p كم منها مارس العلامة فعلا، d true إذا أعلن النص العلامة دون ممارستها، ev اقتباس حرفي قصير أو سلسلة فارغة.
7. flags: عناصر {c, quote, why} حيث c=10 لعبارة مصداقية استباقية في النص (مثل: لا أحاسب أحدا بنسبه، بالدليل، للأمانة، بكل موضوعية)، وc=13 لمعيار يطلبه الكاتب لنفسه ويرفضه لغيره أو لمعيار دولي يطبق على حالة واحدة. quote حرفي.

المؤشرات:
${SEL.map(d=>`${d.c}. ${d.n}: ${d.d} الشرط: ${d.t} لا يحسب إذا: ${d.x} قرائن: ${d.cues}`).join('\n')}
علامات الخروج:
${EXITS.map(([c,t])=>`${c}. ${t}`).join('\n')}

أجب بكائن JSON واحد فقط بلا شرح: {"passages":[{"quote":"","type":"fact","verifiable":true,"attribution":null,"indicators":[{"c":5,"cue":"","why":"","k":60}],"bench":"","refs":[]}],"exits":{"1":{"a":0,"p":0,"d":false,"ev":""}},"flags":[{"c":10,"quote":"","why":""}]}

المراجع المتاحة:
${S.refs.length?S.refs.map(r=>`[${r.id}] ${r.title}${r.note?' - '+r.note:''}${r.text?'\nنص المرجع: '+r.text.slice(0,3000):''}`).join('\n'):'لا مراجع.'}

النص:
`;
function chunks(t){
  const out=[];let cur='';
  const paras=t.split(/\n+/).flatMap(p=>p.length>6500?p.match(/[^.!؟?]+[.!؟?]*/g)||[p]:[p]);
  for(const p of paras){if((cur+'\n'+p).length>6500&&cur){out.push(cur);cur=p}else cur=cur?cur+'\n'+p:p}
  if(cur.trim())out.push(cur);return out;
}
const ERR={rate_limited:'بلغت حد الاستخدام اليومي. أعد المحاولة غدا.',invalid_json:'تعذر فهم رد خدمة التحليل المعمق. أعد المحاولة أو استعمل التحليل بالقواعد.',upstream_error:'انقطاع مؤقت في الخدمة. أعد المحاولة.',cancelled:'أوقف التحليل.'};
async function analyze(){
  if(window.Auth&&Auth.enabled()&&!Auth.user){Auth.show();return}
  const text=$('text').value.trim();
  if(text.length<200){msg('النص قصير. الصق مقالا أو تفريغا كاملا.',true);return}
  const useAI=!!(window.CONFIG&&CONFIG.AI_ENDPOINT&&$('ai')&&$('ai').checked);
  SEL=selected();if(!SEL.length){msg('اختر مؤشرا واحدا على الأقل.',true);return}
  S.sel=SEL.length===INDS.length?null:SEL.map(d=>d.c);S.partial=!!S.sel;
  lock();
  const parts=chunks(text),all=[],dropped={q:0,c:0};
  const exits={},fl={10:[],13:[]};
  EXITS.forEach(([c])=>exits[c]={a:0,p:0,d:false,ev:''});
  ctl=new AbortController();$('go').disabled=true;$('stop').hidden=false;$('prog').hidden=false;
  const bar=$('prog').firstElementChild;bar.style.width='4%';
  const nt=norm(text);
  try{
    for(let i=0;i<parts.length;i++){
      msg('جاري تحليل الجزء '+(i+1)+' من '+parts.length+(useAI?'... قد يستغرق دقيقة':'...'));
      await new Promise(res=>setTimeout(res,0));
      window.__mode=useAI?'ai':'rules';
      const r=useAI?await callAI(PROMPT()+parts[i],parts[i],ctl.signal):RULES.analyze(parts[i],SEL);
      bar.style.width=Math.round((i+1)/parts.length*100)+'%';
      for(const q of (r.passages||[])){
        const nq=norm(q.quote);const pos=nt.indexOf(nq);
        if(!nq||pos<0){dropped.q++;continue}
        const inds=[];
        for(const x of (q.indicators||[])){
          const c=parseInt(x.c);
          if(!IND[c]||c===10||!SEL.some(d=>d.c===c))continue;
          if(!x.cue||!nq.includes(norm(x.cue))){dropped.c++;continue}
          if(!inds.some(z=>z.c===c))inds.push({c,cue:norm(x.cue),why:x.why||'',k:Math.min(100,Math.max(0,parseInt(x.k)||0)),s:'suggested'});
        }
        const type=TYPES[q.type]?q.type:'fact';
        all.push({pos,quote:nq,type,ver:type!=='opinion'&&!!q.verifiable,attr:q.attribution==null?'':String(q.attribution),inds:type==='opinion'?[]:inds,bench:q.bench||'',refs:(Array.isArray(q.refs)?q.refs:[]).map(Number).filter(id=>S.refs.some(r=>r.id===id))});
      }
      for(const [c] of EXITS){const e=(r.exits||{})[c];if(e){exits[c].a+=Math.max(0,parseInt(e.a)||0);exits[c].p+=Math.max(0,parseInt(e.p)||0);exits[c].d=exits[c].d||!!e.d;if(!exits[c].ev&&e.ev&&nt.includes(norm(e.ev)))exits[c].ev=norm(e.ev)}}
      for(const f of (r.flags||[])){const c=parseInt(f.c);const nq=norm(f.quote);const pos=nt.indexOf(nq);if((c===10||c===13)&&nq&&pos>=0)fl[c].push({quote:nq,why:f.why||'',pos})}
    }
    EXITS.forEach(([c])=>{if(exits[c].p>exits[c].a)exits[c].p=exits[c].a});
    all.sort((a,b)=>a.pos-b.pos);all.forEach((p,i)=>p.id=i+1);
    S.sent=false;S.passages=all;applyAuto();S.exits=exits;S.flags={10:{items:fl[10],ok:false},12:{ok:false},13:{items:fl[13],ok:false}};S.demo=false;
    renderResults();
    const au=S.passages.reduce((n,p)=>n+p.inds.filter(i=>i.auto).length,0);
    msg('اكتمل التحليل ('+(useAI?'تحليل معمق':'بالقواعد داخل متصفحك')+'): '+all.length+' مقطعا.'+(au?' اعتمد '+au+' مؤشرا تلقائيا لبلوغه عتبة الثقة.':'')+(dropped.q||dropped.c?' استبعدت الأداة '+dropped.q+' مقطعا و'+dropped.c+' مؤشرا لأن اقتباسها لا يطابق النص حرفيا.':'')+' راجع المؤشرات واحدا واحدا.');
    $('results').scrollIntoView({behavior:'smooth',block:'start'});
  }catch(e){
    const code=e&&(e.code||(e.name==='AbortError'?'cancelled':''));msg(ERR[code]||'تعذر إكمال التحليل.',code!=='cancelled');
  }finally{
    $('go').disabled=false;$('stop').hidden=true;setTimeout(()=>{$('prog').hidden=true;bar.style.width='0'},600);ctl=null;
  }
}
function lock(){
  if(S.locked)return;
  S.th={pass:parseInt($('t-pass').value)||2,rate:parseFloat($('t-rate').value)||10,exit:parseInt($('t-exit').value)||5,min:parseInt($('t-min').value)||10,conf:parseInt($('t-conf').value)||85,ind:parseFloat($('t-ind').value)||20};
  ['t-pass','t-rate','t-exit','t-min','t-conf','t-ind'].forEach(i=>$(i).disabled=true);S.locked=true;
}

/* ---------- التصدير ---------- */
function reportText(){
  const r=compute(),m=k=>$(k).value||'-';
  const L=[];
  L.push('# تقرير تدقيق الخطاب','');
  L.push('- المنبر: '+(outletVal()||'-'),'- تاريخ النشر: '+m('m-date'),'- الرابط: '+m('m-link'),'- شكل المادة: '+m('m-genre')+' | الهدف: '+m('m-target')+' | النبرة: '+m('m-dir')+' | انتماء الهدف: '+m('m-pos')+($('asr').checked?' | تفريغ آلي':''),'');
  L.push('## النتيجة (وصفية، بحسب هذه الشبكة)');
  L.push('- مقاطع قابلة للتحقق: '+r.N+(r.enough?'':' (أقل من '+S.th.min+': النسبة غير مستقرة، فهي قرينة لا حكم)'));
  L.push('- مقاطع مموهة: '+r.camo+' ('+r.rate+'%)');
  L.push('- درجة الخروج: '+r.exitScore+' من 8');
  L.push('- التصنيف: '+r.label);
  L.push('- العتبات: مقطع مموه من '+S.th.pass+'، نسبة '+S.th.rate+'%، خروج '+S.th.exit+'، اعتماد مباشر '+S.th.conf+'%، اطراد المؤشر '+S.th.ind+'%.','');
  L.push('الخلاصة: '+summaryText(r,activeStats()),'');
  L.push('المؤشرات المفحوصة: '+(S.sel?S.sel.map(c=>'م'+c).join('، '):'كلها'),'');
  L.push('## حضور المؤشرات','| المؤشر | مؤكد | مقترح | الحضور % | الحالة |','|---|---|---|---|---|');
  activeStats().forEach(x=>L.push('| م'+x.d.c+' '+x.d.n+' | '+x.conf+' | '+x.pend+' | '+x.share+' | '+(x.est?'مطرد ومعتد به':x.conf?'حاضر':'غائب')+' |'));
  L.push('');
  L.push('## علامات الخروج');
  EXITS.forEach(([c,t])=>{const e=S.exits[c]||{a:0,p:0};L.push('- خ'+c+' '+t+': '+e.p+' من '+e.a+(e.a&&e.p/e.a>=0.5?' (ممارس)':''))});
  L.push('','## المقاطع القابلة للتحقق');
  S.passages.filter(p=>p.ver&&p.type!=='opinion').forEach(p=>{
    const conf=p.inds.filter(i=>i.s==='confirmed');
    L.push('### #'+p.id+' (درجة '+passScore(p,false)+')','"'+p.quote+'"');
    L.push('- مؤشرات مؤكدة: '+(conf.length?conf.map(i=>'م'+i.c+' '+IND[i.c].n).join('، '):'لا شيء'));
    const pend=p.inds.filter(i=>i.s==='suggested');if(pend.length)L.push('- بانتظار القرار: '+pend.map(i=>'م'+i.c).join('، '));
    if(p.bench)L.push('- ما يلزم مقابلته: '+p.bench);
    const rl=(p.refs||[]).map(id=>S.refs.find(r=>r.id===id)).filter(Boolean);if(rl.length)L.push('- المراجع المربوطة: '+rl.map(r=>r.title+(r.link?' ('+r.link+')':'')).join('، '));
    L.push('');
  });
  if(S.refs.length){L.push('## المراجع');S.refs.forEach(r=>L.push('- '+r.title+(r.note?': '+r.note:'')+(r.link?' - '+r.link:'')));L.push('')}
  L.push('---','أعد هذا التقرير أداة شبه آلية؛ المؤشرات اقتراحات أكدها الباحث أو لم يؤكدها، ولا تثبت وجود نية أو تنسيق. الأرقام والأسماء في التفريغ الآلي تعاد مقابلتها بالتسجيل قبل أي استشهاد.');
  return L.join('\n');
}
async function save(name,data){
  try{
    const type=name.endsWith('.json')?'application/json':name.endsWith('.csv')?'text/csv':'text/markdown';
    const url=URL.createObjectURL(new Blob([data],{type:type+';charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
  }catch(e){
    try{await navigator.clipboard.writeText(data);msg('تعذر التنزيل المباشر، فنسخت المحتوى إلى الحافظة.')}catch(e2){msg('تعذر التنزيل والنسخ في هذا المتصفح.',true)}
  }
}
async function callAI(prompt,part,signal){
  let res;
  try{res=await fetch(CONFIG.AI_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt,text:part}),signal})}
  catch(e){if(e&&e.name==='AbortError')throw e;throw {code:'upstream_error'}}
  if(!res.ok)throw {code:res.status===429?'rate_limited':'upstream_error'};
  try{return await res.json()}catch(e){throw {code:'invalid_json'}}
}
function exportCSV(){
  const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
  const rows=[['المؤشر','الوزن','مؤكد','مقترح','الحضور %','الحالة']].concat(activeStats().map(x=>['م'+x.d.c+' '+x.d.n,x.d.w,x.conf,x.pend,x.share,x.est?'مطرد ومعتد به':x.conf?'حاضر':'غائب']));
  save('tadqiq-indicators.csv','\ufeff'+rows.map(r=>r.map(q).join(',')).join('\n'));
}
const exportReport=()=>save('tadqiq-report.md',reportText());
const exportJSON=()=>save('tadqiq-data.json',JSON.stringify({fmt:'tadqiq-report/1',engine:RULES.version,text:$('text').value,meta:{outlet:outletVal(),link:$('m-link').value,genre:$('m-genre').value,date:$('m-date').value,target:$('m-target').value,direction:$('m-dir').value,position:$('m-pos').value,asr:$('asr').checked},thresholds:S.th,refs:S.refs,passages:S.passages,exits:S.exits,flags:S.flags,result:compute()},null,1));


/* ---------- استيراد تقرير محفوظ ---------- */
const ST_OK=new Set(['suggested','confirmed','rejected']);
const str=(v,n)=>String(v==null?'':v).slice(0,n);
function importReport(d){
  if(!d||d.fmt!=='tadqiq-report/1'||typeof d.text!=='string'||!Array.isArray(d.passages))throw new Error('format');
  if(d.text.length>400000||d.passages.length>2000)throw new Error('size');
  const nt=norm(d.text);
  const known=new Set(INDS.map(x=>x.c));
  const passages=d.passages.map((p,i)=>{
    const quote=str(p&&p.quote,2000);if(!quote||nt.indexOf(quote)<0)return null;       // لا يقبل مقطع لا يطابق النص حرفيا
    const type=TYPES[p.type]?p.type:'fact';
    const inds=(Array.isArray(p.inds)?p.inds:[]).slice(0,40).map(x=>({c:parseInt(x&&x.c),cue:str(x&&x.cue,120),why:str(x&&x.why,400),s:ST_OK.has(x&&x.s)?x.s:'suggested',k:Math.max(0,Math.min(100,parseInt(x&&x.k)||0)),auto:!!(x&&x.auto)})).filter(x=>known.has(x.c)||x.c>100);
    return {id:i+1,pos:nt.indexOf(quote),quote,type,ver:type!=='opinion'&&!!p.ver,attr:str(p.attr,80),bench:str(p.bench,300),inds,refs:(Array.isArray(p.refs)?p.refs:[]).map(Number).filter(Number.isFinite)};
  }).filter(Boolean);
  if(!passages.length)throw new Error('empty');
  passages.forEach((p,i)=>p.id=i+1);
  const m=d.meta||{};
  [['m-link','link'],['m-genre','genre'],['m-date','date'],['m-target','target'],['m-dir','direction'],['m-pos','position']].forEach(([id,k])=>{const el=$(id);if(el&&m[k]!=null)el.value=str(m[k],300)});
  setOutlet(m.outlet);
  $('asr').checked=!!m.asr;$('text').value=d.text;
  const th=d.thresholds||{};for(const k of Object.keys(S.th)){const v=parseFloat(th[k]);if(Number.isFinite(v)&&v>=0&&v<=1000)S.th[k]=v}
  if(Array.isArray(d.refs)){S.refs=d.refs.slice(0,100).map(r=>({id:parseInt(r&&r.id),title:str(r&&r.title,200),link:/^https?:\/\//i.test(r&&r.link||'')?str(r.link,500):'',note:str(r&&r.note,300),text:str(r&&r.text,6000)})).filter(r=>Number.isFinite(r.id)&&r.title);saveRefs();renderRefs()}
  const ex={};EXITS.forEach(([c])=>{const e=(d.exits||{})[c]||{};ex[c]={a:Math.max(0,parseInt(e.a)||0),p:Math.max(0,parseInt(e.p)||0),d:!!e.d,ev:nt.includes(norm(e.ev||''))?norm(e.ev||''):''};if(ex[c].p>ex[c].a)ex[c].p=ex[c].a});
  const fl=(c)=>({items:((d.flags&&d.flags[c]&&d.flags[c].items)||[]).filter(f=>f&&nt.indexOf(norm(f.quote))>=0).slice(0,50).map(f=>({quote:norm(f.quote),why:str(f.why,300),pos:nt.indexOf(norm(f.quote))})),ok:!!(d.flags&&d.flags[c]&&d.flags[c].ok)});
  S.passages=passages;S.exits=ex;S.flags={10:fl(10),12:{ok:!!(d.flags&&d.flags[12]&&d.flags[12].ok)},13:fl(13)};
  S.sent=false;S.demo=false;S.partial=false;S.sel=null;
  renderResults();
  return {n:passages.length,dropped:d.passages.length-passages.length,old:d.engine&&d.engine!==RULES.version?d.engine:''};
}
$('imp-file').addEventListener('change',e=>{
  const f=e.target.files[0];e.target.value='';if(!f)return;
  const r=new FileReader();
  r.onload=()=>{try{const o=importReport(JSON.parse(String(r.result||'')));
      msg('فتح التقرير: '+o.n+' مقطعا.'+(o.dropped?' استبعد '+o.dropped+' مقطعا لا يطابق النص.':'')+(o.old?' حلل بإصدار المحرك '+o.old+' (الحالي '+RULES.version+').':'')+' الحسابات تعاد من القرارات المحفوظة.');
      $('results').scrollIntoView({behavior:'smooth',block:'start'})}
    catch(x){msg('تعذر فتح الملف. اختر ملف JSON نزلته من هذه الأداة (تنزيل البيانات).',true)}};
  r.readAsText(f,'utf-8');
});

/* ---------- نص تجريبي ---------- */
const DEMO_TEXT=`نشر موقع إخباري محلي مقالا عن ميزانية بلدية مدينة الوادي. جاء فيه أن البلدية صرفت 40 مليون درهم على الإنارة العمومية في سنة واحدة، وأن هذا المبلغ يفوق ما صرفته أي بلدية في المنطقة.
وقال مصدر مطلع لم يرغب في ذكر اسمه إن الرئيس يعلم بالتجاوزات منذ أشهر. لا أتهم أحدا، لكن من يتأمل الأرقام لا يجد تفسيرا آخر غير الرغبة في خدمة المقربين. كل المسؤولين في هذه البلدية يتصرفون كأن المال العام ملكهم.
ولم تصدر البلدية أي توضيح بشأن الأرقام، وهذا الصمت يقول الكثير. وكانت البلدية قد نشرت قبل الصفقة بأسبوع بلاغا تقول فيه إن المبلغ يشمل صيانة ثلاث سنوات. وفي الوقت نفسه، يقيم نائب الرئيس حفلا عائليا في أحد أرقى فنادق المدينة. وللقارئ أن يستنتج ما يشاء.`;
function loadDemo(){
  $('text').value=DEMO_TEXT;
  const nt=norm(DEMO_TEXT);
  const P=(q,type,ver,attr,bench,inds)=>({quote:q,pos:nt.indexOf(q),type,ver,attr,bench,inds:inds.map(([c,cue,why,s,k])=>({c,cue,why,s,k:k||0})),refs:[]});
  const list=[
   P('البلدية صرفت 40 مليون درهم على الإنارة العمومية في سنة واحدة','fact',true,'','الميزانية المنشورة وبلاغ البلدية',[[4,'في سنة واحدة','المدة المذكورة (سنة) تخالف ما يرد لاحقا في النص (ثلاث سنوات)','confirmed'],[11,'في سنة واحدة','لم يذكر أن المبلغ يشمل صيانة سنوات متعددة','suggested',72]]),
   P('هذا المبلغ يفوق ما صرفته أي بلدية في المنطقة','fact',true,'','جرد ميزانيات البلديات المجاورة لنفس الفترة',[[2,'أي بلدية','كلية بلا إحصاء','confirmed']]),
   P('وقال مصدر مطلع لم يرغب في ذكر اسمه إن الرئيس يعلم بالتجاوزات منذ أشهر','fact',true,'2','لا يوجد',[[5,'مصدر مطلع لم يرغب في ذكر اسمه','إسناد مجهول مباشر يبنى عليه اتهام','confirmed'],[1,'يعلم بالتجاوزات','"التجاوزات" تقدم إثباتا لا ادعاء','confirmed']]),
   P('لا أتهم أحدا، لكن من يتأمل الأرقام لا يجد تفسيرا آخر غير الرغبة في خدمة المقربين','insinuation',false,'','',[[12,'لا أتهم أحدا، لكن','ينفي الاتهام ثم يصوغ اتهاما','confirmed'],[14,'لا يجد تفسيرا آخر غير الرغبة في خدمة المقربين','دافع بلا أسماء ولا دليل مع نفي الأسباب الأخرى','confirmed']]),
   P('كل المسؤولين في هذه البلدية يتصرفون كأن المال العام ملكهم','insinuation',true,'','قائمة بالمسؤولين وما نسب إلى كل منهم',[[2,'كل المسؤولين','كلية بلا حالات','confirmed']]),
   P('ولم تصدر البلدية أي توضيح بشأن الأرقام، وهذا الصمت يقول الكثير','fact',true,'0','بلاغات البلدية قبل النشر',[[7,'وهذا الصمت يقول الكثير','يجعل الصمت دليلا','confirmed'],[11,'ولم تصدر البلدية أي توضيح','يرد في النص نفسه أن بلاغا نشر قبل الصفقة','confirmed']]),
   P('نشرت قبل الصفقة بأسبوع بلاغا تقول فيه إن المبلغ يشمل صيانة ثلاث سنوات','fact',true,'0','نص البلاغ الأصلي',[]),
   P('يقيم نائب الرئيس حفلا عائليا في أحد أرقى فنادق المدينة','fact',true,'','وثيقة تربط الحفل بالمال العام',[[8,'وفي الوقت نفسه','واقعتان متجاورتان دون علاقة موثقة','confirmed']]),
   P('وللقارئ أن يستنتج ما يشاء','insinuation',false,'','',[[8,'وللقارئ أن يستنتج ما يشاء','ترك الاستنتاج للقارئ','suggested',90]])
  ];
  list.forEach((p,i)=>p.id=i+1);
  S.passages=list;
  S.exits={1:{a:3,p:0,d:false,ev:''},2:{a:2,p:0,d:false,ev:''},3:{a:0,p:0,d:false,ev:''},4:{a:1,p:1,d:false,ev:'نشرت قبل الصفقة بأسبوع بلاغا'},5:{a:0,p:0,d:false,ev:''},6:{a:3,p:0,d:false,ev:''},7:{a:1,p:0,d:false,ev:''},8:{a:0,p:0,d:false,ev:''}};
  S.flags={10:{items:[{quote:'لا أتهم أحدا',why:'عبارة استباقية قبل مقطع غير موثق',pos:nt.indexOf('لا أتهم أحدا')}],ok:false},12:{ok:false},13:{items:[],ok:false}};
  S.sel=null;S.partial=false;S.demo=true;renderResults();msg('');
}

/* ---------- المساهمة المجهولة ---------- */
function contribRecords(){
  const out=[];
  for(const p of S.passages)for(const i of p.inds){
    if(i.c>100||i.auto)continue;
    if(i.s==='rejected'&&i.cue)out.push({ind:i.c,cue:i.cue,decision:'rejected'});
    else if(i.s==='confirmed'&&i.cue)out.push({ind:i.c,cue:i.cue,decision:'confirmed'});
    else if(i.s==='confirmed'&&!i.cue)out.push({ind:i.c,cue:'',decision:'added'});
  }
  const seen=new Set();
  return out.filter(r=>{const k=r.ind+'|'+r.cue+'|'+r.decision;if(seen.has(k))return false;seen.add(k);return true});
}
function contribBlock(){
  if(!(window.CONFIG&&CONFIG.API_BASE)||S.demo)return null;
  const prev=h('ul',{class:'note',style:'margin:6px 0 0;padding-inline-start:18px'});
  const status=h('p',{class:'note',style:'margin:6px 0 0'},'');
  const btn=h('button',{class:'primary',disabled:true},'أرسل قراراتي');
  const box=h('input',{type:'checkbox',id:'consent',onchange:e=>{btn.disabled=!e.target.checked||S.sent}});
  const fill=()=>{prev.textContent='';const rs=contribRecords();
    if(!rs.length)prev.append(h('li',null,'لا قرارات بعد. أكد مؤشرات أو ارفضها أولا.'));
    rs.slice(0,60).forEach(r=>prev.append(h('li',null,'م'+r.ind+' | '+(r.decision==='added'?'أضفته يدويا':(r.decision==='confirmed'?'أكدته':'رفضته'))+(r.cue?' | "'+r.cue+'"':''))));
    if(rs.length>60)prev.append(h('li',null,'... و'+(rs.length-60)+' أخرى'));return rs};
  btn.addEventListener('click',async()=>{
    const rs=fill();if(!rs.length){status.textContent='لا قرارات للإرسال.';return}
    btn.disabled=true;status.textContent='جاري الإرسال...';
    const r=await Auth.api('/contribute',{method:'POST',body:{consent:true,records:rs,engine:RULES.version,mode:window.__mode||'rules',month:new Date().toISOString().slice(0,7),genre:$('m-genre').value}});
    if(r.ok&&r.data.duplicate){S.sent=true;status.textContent='سبق استلام هذه القرارات نفسها، فلم تسجل مرتين. شكرا لك.'}
    else if(r.ok){S.sent=true;status.textContent='وصلت '+r.data.accepted+' قرارات. شكرا لمساهمتك. يمكنك مراجعة النتائج المجمعة في صفحة النتائج المفتوحة.'}
    else{status.textContent=r.status===429?'بلغت حد الإرسال اليومي. أعد المحاولة غدا.':(r.status===401||r.status===403?'سجل الدخول وأكد موافقتك على الشروط ثم أعد المحاولة.':'تعذر الإرسال. أعد المحاولة لاحقا.');btn.disabled=false}
  });
  return h('div',{class:'card',style:'margin:14px 0 24px'},
    h('h3',null,'ساهم في تحسين الأداة (اختياري)'),
    h('p',{class:'note',style:'margin:6px 0'},'تفيد قراراتك في معرفة القرائن التي تخطئ الأداة فيها. يرسل فقط: رقم المؤشر، والقرينة القصيرة (كلمات لا مقاطع)، وقرارك بتأكيدها أو رفضها، وإصدار المحرك، والشهر، وشكل المادة. لا يرسل نص المقال ولا الرابط ولا اسم المنبر ولا هويتك. لا يمكن حذف ما أرسل لاحقا لأنه مجهول المصدر، وتنشر النتائج مجمعة للجميع.'),
    h('label',{style:'flex-direction:row;align-items:center;gap:8px;color:var(--ink)'},box,'أوافق على إرسال قراراتي المجهولة'),
    h('details',{ontoggle:e=>{if(e.target.open)fill()}},h('summary',null,'اعرض ما سيرسل بالضبط'),prev),
    h('div',{class:'row',style:'margin-top:8px'},btn,h('a',{href:'public.html'},'النتائج المفتوحة')),status);
}

/* ---------- المراجع ---------- */
function saveRefs(){try{localStorage.setItem('adt-refs',JSON.stringify(S.refs))}catch(e){}}
function loadRefs(){try{const v=JSON.parse(localStorage.getItem('adt-refs')||'[]');if(Array.isArray(v))S.refs=v.filter(r=>r&&r.id&&r.title).map(r=>({...r,link:safeUrl(r.link)}))}catch(e){}}
function safeUrl(u){return /^https?:\/\//i.test(u||'')?u:''}
function renderRefs(){
  const box=$('reflist');box.textContent='';
  if(!S.refs.length){box.append(h('p',{class:'note',style:'margin:0'},'لا مراجع بعد.'));return}
  S.refs.forEach(r=>box.append(h('div',{class:'ref'},
    h('div',{class:'grow'},h('b',null,r.title),r.note?h('span',{class:'note'},' - '+r.note):null,r.text?h('span',{class:'pill ok',style:'margin-inline-start:6px'},'نص مرفق ('+r.text.length+' حرف)'):null),
    safeUrl(r.link)?h('a',{href:safeUrl(r.link),target:'_blank',rel:'noopener noreferrer',dir:'ltr'},'فتح الرابط'):null,
    h('button',{'aria-label':'حذف المرجع '+r.title,onclick:()=>{S.refs=S.refs.filter(x=>x.id!==r.id);S.passages.forEach(p=>p.refs=(p.refs||[]).filter(id=>id!==r.id));saveRefs();renderRefs();if(S.passages.length)renderAll()}},'حذف'))));
}
function addRef(){
  const title=$('r-title').value.trim();if(!title){msg('اكتب عنوان المرجع.',true);return}
  const link=safeUrl($('r-link').value.trim());
  if($('r-link').value.trim()&&!link){msg('الرابط يجب أن يبدأ بـ http أو https.',true);return}
  const id=S.refs.reduce((m,r)=>Math.max(m,r.id),0)+1;
  S.refs.push({id,title,link,note:$('r-note').value.trim(),text:$('r-text').value.trim().slice(0,6000)});
  ['r-title','r-link','r-note','r-text'].forEach(i=>$(i).value='');
  saveRefs();renderRefs();msg('أضيف المرجع.');if(S.passages.length)renderAll();
}
function renderGuide(){
  $('guide').append(...INDS.map(d=>h('div',{class:'g-i'},
    h('p',null,h('b',null,'م'+d.c+' '+d.n),' (وزن '+d.w+(d.bench?'، يحتاج مرجعا خارجيا':'، يثبت من النص')+')'),
    h('p',null,h('b',null,'التعريف: '),d.d),h('p',null,h('b',null,'يحسب إذا: '),d.t),
    h('p',null,h('b',null,'لا يحسب إذا: '),d.x),h('p',{class:'note'},'مثال: '+d.e))));
}

/* ---------- ربط ---------- */
$('go').addEventListener('click',analyze);
$('stop').addEventListener('click',()=>ctl&&ctl.abort());
$('demo').addEventListener('click',loadDemo);
async function loadInto(file,target,limit,done,forceOcr){
  const note=$('read-note');if(note){note.hidden=true;note.textContent=''}
  try{
    const r=await Readers.read(file,{status:t=>msg(t),forceOcr:!!forceOcr});
    let t=r.text;if(limit&&t.length>limit){t=t.slice(0,limit)}
    target.value=t;msg('تم تحميل الملف: '+file.name);
    if(note&&(r.notes.length||r.review)){
      note.hidden=false;note.textContent=(r.notes.join(' ')+' راجع النص أدناه وصححه قبل الفحص.').trim();
      if(r.kind==='pdf'&&!r.ocr){const b=h('button',{type:'button',style:'margin-top:8px;display:block'},'النص مشوه؟ اقرأ الملف بالتعرف الضوئي');b.addEventListener('click',()=>loadInto(file,target,limit,done,true));note.append(b)}
    }
    if(done)done(file);
  }catch(e){msg(Readers.errText(e),true)}
}
$('file').addEventListener('change',e=>{const f=e.target.files[0];if(f)loadInto(f,$('text'))});
if(window.Auth)Auth.init();
if(window.CONFIG&&CONFIG.AI_ENDPOINT)$('ai-wrap').hidden=false;
$('r-add').addEventListener('click',addRef);
$('c-add').addEventListener('click',addCustom);
$('preset').addEventListener('change',applyPreset);
$('r-file').addEventListener('change',e=>{const f=e.target.files[0];if(f)loadInto(f,$('r-text'),6000,()=>{if(!$('r-title').value)$('r-title').value=f.name.replace(/\.[^.]+$/,'')})});
loadRefs();renderRefs();renderGuide();renderPicker();renderResults();
$('ver').textContent=RULES.version;
document.querySelectorAll('label.pick input[type=file]').forEach(i=>i.addEventListener('change',()=>{const f=i.closest('label').querySelector('.fn');if(f&&i.files[0])f.textContent=i.files[0].name}));
$('m-outlet').addEventListener('change',()=>{const o=$('m-outlet-other');o.hidden=$('m-outlet').value!=='آخر';if(!o.hidden)o.focus()});
