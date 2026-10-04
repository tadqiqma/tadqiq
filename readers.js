/* قراءة الملفات داخل المتصفح فقط: نص، Word (docx)، PDF، وصور (OCR). لا يغادر شيء جهاز المستعمل. */
(function(){
'use strict';
var MAX_BYTES={txt:5e6,docx:25e6,pdf:30e6,img:25e6};
var MAX_PDF_PAGES=80,MAX_OCR_PAGES=6,MAX_XML=30e6;
var AR_COMMON=['من','في','على','أن','إلى','التي','الذي','هذا','عن','ما','كان','هذه'];
var AR_REV=AR_COMMON.map(function(w){return Array.from(w).reverse().join('')});

function kindOf(f){
  var n=(f.name||'').toLowerCase(),t=f.type||'';
  if(/\.docx$/.test(n)||t==='application/vnd.openxmlformats-officedocument.wordprocessingml.document')return 'docx';
  if(/\.doc$/.test(n)||t==='application/msword')return 'doc';
  if(/\.pdf$/.test(n)||t==='application/pdf')return 'pdf';
  if(/\.(png|jpe?g|webp|bmp|gif)$/.test(n)||/^image\/(png|jpeg|webp|bmp|gif)$/.test(t))return 'img';
  if(/\.(heic|heif)$/.test(n)||/^image\//.test(t))return 'imgx';
  if(/\.(txt|md|text)$/.test(n)||/^text\//.test(t))return 'txt';
  return 'unknown';
}
function clean(s){
  return String(s||'').replace(/[‎‏‪-‮⁦-⁩­]/g,'').replace(/\r\n?/g,'\n').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
function arabicRatio(t){
  var L=t.match(/[A-Za-z؀-ۿ]/g);if(!L||!L.length)return 0;
  var A=t.match(/[؀-ۿ]/g);return (A?A.length:0)/L.length;
}
function reversedScore(t){
  var tok=t.split(/[\s،.,;:!?()«»"]+/),n=0,r=0;
  tok.forEach(function(w){if(AR_COMMON.indexOf(w)>=0)n++;else if(AR_REV.indexOf(w)>=0)r++});
  return {normal:n,rev:r};
}
function fixReversed(t){
  return t.split('\n').map(function(line){
    return Array.from(line).reverse().join('').replace(/[0-9A-Za-z.,%\/:-]+/g,function(s){return Array.from(s).reverse().join('')});
  }).join('\n');
}
function arabicPost(text,notes){
  var t=text;
  if(/[ﭐ-﷿ﹰ-﻿]/.test(t)){t=t.normalize('NFKC');notes.push('حُوّلت حروف عربية مرسومة بصيغ منفصلة إلى حروف عادية.')}
  var s=reversedScore(t);
  if(s.rev>=5&&s.rev>2*s.normal){t=fixReversed(t);notes.push('بدا أن اتجاه الحروف معكوس في الملف، فعُكس تلقائيا. تأكد أن الكلمات صحيحة.')}
  return clean(t);
}

/* ---------- docx: فك الأرشيف بلا مكتبات ---------- */
async function inflateRaw(bytes,cap){
  var ds=new DecompressionStream('deflate-raw');
  var w=ds.writable.getWriter();w.write(bytes);w.close();
  var rd=ds.readable.getReader(),chunks=[],size=0;
  for(;;){var r=await rd.read();if(r.done)break;size+=r.value.length;if(size>cap){try{rd.cancel()}catch(e){}throw new Error('too_big')}chunks.push(r.value)}
  var out=new Uint8Array(size),o=0;chunks.forEach(function(c){out.set(c,o);o+=c.length});return out;
}
async function zipEntry(buf,wanted){
  var v=new DataView(buf),u=new Uint8Array(buf),i=buf.byteLength-22,min=Math.max(0,buf.byteLength-65557);
  for(;i>=min;i--)if(v.getUint32(i,true)===0x06054b50)break;
  if(i<min)throw new Error('not_zip');
  var cnt=v.getUint16(i+10,true),off=v.getUint32(i+16,true),dec=new TextDecoder();
  for(var k=0;k<cnt;k++){
    if(off+46>buf.byteLength||v.getUint32(off,true)!==0x02014b50)throw new Error('bad_zip');
    var method=v.getUint16(off+10,true),csize=v.getUint32(off+20,true),usize=v.getUint32(off+24,true),nl=v.getUint16(off+28,true),xl=v.getUint16(off+30,true),cl=v.getUint16(off+32,true),lho=v.getUint32(off+42,true);
    var name=dec.decode(u.subarray(off+46,off+46+nl));
    if(name===wanted){
      if(usize>MAX_XML)throw new Error('too_big');
      var lnl=v.getUint16(lho+26,true),lxl=v.getUint16(lho+28,true),ds=lho+30+lnl+lxl;
      var raw=u.subarray(ds,ds+csize);
      if(method===0)return raw;
      if(method===8)return inflateRaw(raw,MAX_XML);
      throw new Error('bad_method');
    }
    off+=46+nl+xl+cl;
  }
  return null;
}
async function readDocx(file){
  var buf=await file.arrayBuffer();
  if(typeof DecompressionStream==='undefined')throw new Error('no_support');
  var xml=await zipEntry(buf,'word/document.xml');
  if(!xml)throw new Error('no_doc');
  var doc=new DOMParser().parseFromString(new TextDecoder('utf-8').decode(xml),'application/xml');
  if(doc.getElementsByTagName('parsererror').length)throw new Error('bad_xml');
  var out=[],paras=doc.getElementsByTagNameNS('*','p');
  for(var i=0;i<paras.length;i++){
    var s='',ws=paras[i].getElementsByTagNameNS('*','*');
    for(var j=0;j<ws.length;j++){var n=ws[j].localName;
      if(n==='t')s+=ws[j].textContent;else if(n==='tab')s+='\t';else if(n==='br'||n==='cr')s+='\n'}
    out.push(s);
  }
  return out.join('\n');
}

/* ---------- OCR ---------- */
var ocrWorker=null,ocrPending={},ocrId=0,ocrProgress=function(){};
function abs(p){return new URL(p,location.href).href}
function ocrCall(action,payload){
  return new Promise(function(res,rej){var id=++ocrId;ocrPending[id]={res:res,rej:rej};ocrWorker.postMessage({workerId:'w1',jobId:id,action:action,payload:payload})});
}
async function ocrStart(){
  if(ocrWorker)return;
  ocrWorker=new Worker('ocr/worker.js');
  ocrWorker.onerror=function(e){Object.keys(ocrPending).forEach(function(k){ocrPending[k].rej(new Error('ocr_fail'));delete ocrPending[k]})};
  ocrWorker.onmessage=function(ev){var d=ev.data||{},p=ocrPending[d.jobId];
    if(d.status==='progress'){ocrProgress(d.data);return}
    if(!p)return;delete ocrPending[d.jobId];
    if(d.status==='resolve')p.res(d.data);else p.rej(new Error(String(d.data)))};
  await ocrCall('load',{options:{lstmOnly:true,corePath:abs('ocr/'),logging:false}});
  await ocrCall('loadLanguage',{langs:['ara'],options:{langPath:abs('ocr/'),cacheMethod:'none',gzip:false,lstmOnly:true}});
  await ocrCall('initialize',{langs:['ara'],oem:1,config:{}});
}
function ocrStop(){if(ocrWorker){try{ocrWorker.terminate()}catch(e){}ocrWorker=null;ocrPending={}}}
async function ocrBytes(bytes){
  await ocrStart();
  var r=await ocrCall('recognize',{image:bytes,options:{},output:{text:true}});
  return (r&&r.text)||'';
}
async function canvasToBytes(cv){
  var blob=await new Promise(function(r){cv.toBlob(r,'image/png')});
  return new Uint8Array(await blob.arrayBuffer());
}
async function readImage(file){
  var bmp=await createImageBitmap(file),w=bmp.width,h=bmp.height,m=Math.max(w,h),s=1;
  if(m>2600)s=2600/m;else if(m<1000)s=Math.min(2,1500/m);
  var cv=document.createElement('canvas');cv.width=Math.round(w*s);cv.height=Math.round(h*s);
  var cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,cv.width,cv.height);cx.drawImage(bmp,0,0,cv.width,cv.height);
  return ocrBytes(await canvasToBytes(cv));
}

/* ---------- PDF ---------- */
var pdfjs=null;
async function loadPdfjs(){
  if(pdfjs)return pdfjs;
  pdfjs=await import('./pdf/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc=abs('pdf/pdf.worker.min.mjs');
  return pdfjs;
}

/* بناء النص من عناصر الصفحة حسب مواضعها، لأن بعض ملفات PDF ترسم كل حرف على حدة وبالترتيب البصري */
var SINGLE=/^[0-9A-Za-z.,%\/:\-]$/;
function lineText(items){
  var joined=items.map(function(i){return i.s}).join('');
  var ar=(joined.match(/[\u0600-\u06FF]/g)||[]).length,la=(joined.match(/[A-Za-z]/g)||[]).length;
  var rtl=ar>la;
  items.sort(function(a,b){return rtl?b.x-a.x:a.x-b.x});
  var seq=[],k=0,ALN=/^[0-9A-Za-z]$/;
  while(k<items.length){
    if(rtl&&SINGLE.test(items[k].s)){var e=k;while(e<items.length&&SINGLE.test(items[e].s))e++;
      var s0=k,t0=e-1;while(s0<=t0&&!ALN.test(items[s0].s))s0++;while(t0>=s0&&!ALN.test(items[t0].s))t0--;
      for(var a=k;a<s0;a++)seq.push(items[a]);
      for(var q=t0;q>=s0;q--)seq.push(items[q]);
      for(var z=t0+1;z<e;z++)if(z>=s0)seq.push(items[z]);
      k=e}
    else{seq.push(items[k]);k++}
  }
  var out='',prev=null;
  seq.forEach(function(it){
    if(prev){
      var gap=rtl?(prev.x-(it.x+it.w)):(it.x-(prev.x+prev.w));
      if(rtl&&SINGLE.test(prev.s)&&SINGLE.test(it.s)){gap=Math.abs(prev.x-it.x)-prev.w}
      if(gap>it.size*0.32&&!/\s$/.test(out)&&!/^\s/.test(it.s))out+=' ';
    }
    out+=it.s;prev=it;
  });
  return out;
}
function pageText(items){
  var lines=[];
  items.forEach(function(it){
    if(typeof it.str!=='string'||!it.transform)return;
    var y=it.transform[5],size=Math.abs(it.transform[3])||it.height||10,ln=null;
    for(var i=lines.length-1;i>=0&&i>=lines.length-6;i--){if(Math.abs(lines[i].y-y)<size*0.45){ln=lines[i];break}}
    if(!ln){ln={y:y,size:size,items:[]};lines.push(ln)}
    ln.items.push({s:it.str,x:it.transform[4],w:it.width||0,size:size});
  });
  lines.sort(function(a,b){return b.y-a.y});
  var out='',prev=null;
  lines.forEach(function(ln){
    var t=lineText(ln.items);if(!t.trim())return;
    if(prev){out+=(prev.y-ln.y)>ln.size*2.6?'\n\n':' '}
    out+=t;prev=ln;
  });
  return out;
}
async function readPdf(file,hooks,notes,forceOcr){
  var lib=await loadPdfjs(),data=new Uint8Array(await file.arrayBuffer());
  var doc=await lib.getDocument({data:data,isEvalSupported:false,disableFontFace:true,useSystemFonts:false,enableXfa:false}).promise;
  var total=doc.numPages,pages=Math.min(total,MAX_PDF_PAGES),out=[];
  if(forceOcr)pages=Math.min(pages,MAX_OCR_PAGES);
  if(total>pages)notes.push('قرئت أول '+pages+' صفحة فقط من '+total+'.');
  for(var p=1;p<=(forceOcr?0:pages);p++){
    hooks.status('قراءة الصفحة '+p+' من '+pages+'...');
    var page=await doc.getPage(p),tc=await page.getTextContent();
    out.push(pageText(tc.items));
  }
  var text=out.join('\n\n'),letters=(text.match(/[؀-ۿA-Za-z]/g)||[]).length;
  if(forceOcr||letters<40*Math.min(pages,3)){
    /* لا طبقة نصية: ملف ممسوح ضوئيا، نقرؤه بالتعرف الضوئي */
    var n=Math.min(pages,MAX_OCR_PAGES),parts=[];
    if(pages>n)notes.push('الملف ممسوح ضوئيا؛ قرئت أول '+n+' صفحات فقط.');
    for(var q=1;q<=n;q++){
      hooks.status('تعرف ضوئي على الصفحة '+q+' من '+n+'...');
      var pg=await doc.getPage(q),vp=pg.getViewport({scale:2.2}),cv=document.createElement('canvas');
      cv.width=Math.min(3000,Math.round(vp.width));cv.height=Math.round(vp.height*(cv.width/vp.width));
      var vp2=pg.getViewport({scale:2.2*(cv.width/vp.width)}),cx=cv.getContext('2d');
      cx.fillStyle='#fff';cx.fillRect(0,0,cv.width,cv.height);
      await pg.render({canvasContext:cx,canvas:cv,viewport:vp2}).promise;
      parts.push(await ocrBytes(await canvasToBytes(cv)));
    }
    notes.push('ملف ممسوح ضوئيا: النص مستخرج بالتعرف الضوئي وقد تكون فيه أخطاء.');
    return {text:parts.join('\n\n'),review:true,ocr:true};
  }
  return {text:text,review:true};
}

/* ---------- الواجهة العامة ---------- */
var busy=false;
async function read(file,hooks){
  if(busy)throw new Error('busy');
  hooks=hooks||{};hooks.status=hooks.status||function(){};
  var kind=kindOf(file),notes=[],review=false,text='';
  if(kind==='doc')throw new Error('doc_old');
  if(kind==='imgx')throw new Error('img_fmt');
  if(kind==='unknown')throw new Error('unsupported');
  var cap=MAX_BYTES[kind]||MAX_BYTES.txt;
  if(file.size>cap)throw new Error('too_big');
  ocrProgress=function(d){if(d&&typeof d.progress==='number'&&d.status)hooks.status('التعرف الضوئي: '+Math.round(d.progress*100)+'%')};
  busy=true;
  try{
    if(kind==='txt'){text=await file.text()}
    else if(kind==='docx'){hooks.status('قراءة ملف Word...');text=await readDocx(file)}
    else if(kind==='pdf'){var r=await readPdf(file,hooks,notes,!!hooks.forceOcr);text=r.text;review=r.review;if(!hooks.forceOcr&&!(r.ocr))notes.push('النص مستخرج من الطبقة النصية للـ PDF، وكثير من ملفات PDF العربية يختل فيها ترتيب الحروف.')}
    else if(kind==='img'){hooks.status('تحميل محرك التعرف الضوئي (مرة واحدة)...');text=await readImage(file);review=true;notes.push('نص مستخرج من صورة بالتعرف الضوئي: قد تكون فيه أخطاء في الحروف.')}
  }finally{ocrStop();busy=false}
  if(kind!=='txt')text=arabicPost(text,notes);else text=clean(text);
  if(kind!=='txt'&&text&&arabicRatio(text)<0.3)notes.push('أغلب الحروف المستخرجة ليست عربية. تأكد أن الملف هو المقصود.');
  if(!text)throw new Error('empty');
  return {text:text,kind:kind,notes:notes,review:review,ocr:!!(hooks.forceOcr||notes.some(function(n){return /التعرف الضوئي/.test(n)}))};
}
var ERR={
  doc_old:'صيغة Word القديمة (doc) غير مدعومة. احفظ الملف بصيغة docx ثم ارفعه.',
  img_fmt:'صيغة الصورة غير مدعومة. استعمل PNG أو JPG أو WebP.',
  unsupported:'نوع الملف غير مدعوم. المسموح: txt وmd وdocx وpdf وصور PNG أو JPG.',
  too_big:'الملف كبير جدا لقراءته داخل المتصفح.',
  empty:'لم أجد نصا قابلا للقراءة في الملف.',
  no_support:'متصفحك لا يدعم قراءة ملفات Word. حدّثه أو الصق النص.',
  bad_zip:'ملف Word تالف.',not_zip:'هذا ليس ملف Word صالحا.',no_doc:'ملف Word لا يحتوي نصا.',bad_xml:'ملف Word تالف.',bad_method:'ملف Word بضغط غير مدعوم.',
  busy:'ما زالت قراءة ملف سابق جارية. انتظر انتهاءها.',
  ocr_fail:'تعذر تشغيل محرك التعرف الضوئي في هذا المتصفح. الصق النص بدل رفع الصورة.'
};
function errText(e){var m=String(e&&e.message||e);return ERR[m]||'تعذرت قراءة الملف. جرّب ملفا آخر أو الصق النص.'}
window.Readers={read:read,errText:errText,kindOf:kindOf,_arabicPost:arabicPost};
})();
