/* معايرة المحرك من البيانات المفتوحة.
   الاستعمال:  node calibrate.mjs tadqiq-open-data.csv
   يقرأ الملف الذي تنزله من صفحة النتائج المفتوحة ويطبع القرائن المرشحة للمراجعة.
   لا يعدل شيئا: القرار لك. */
import fs from 'node:fs';
const MIN_N=10;        // أقل عدد من المساهمات المستقلة (batch) لكل قرينة
const text=fs.readFileSync(process.argv[2]||'tadqiq-open-data.csv','utf8').replace(/^﻿/,'');
const rows=text.trim().split('\n').slice(1).map(l=>l.match(/"((?:[^"]|"")*)"/g).map(x=>x.slice(1,-1).replace(/""/g,'"')));
const agg=new Map();let added=new Map();
for(const [ind,cue,decision,,,,,batch]of rows){
  if(decision==='added'){added.set(ind,(added.get(ind)||0)+1);continue}
  const k=ind+'|'+cue;const a=agg.get(k)||{ind,cue,c:0,r:0,b:new Set()};a.b.add(batch);
  if(decision==='confirmed')a.c++;else if(decision==='rejected')a.r++;agg.set(k,a);
}
const wilson=(c,r)=>{const n=c+r,z=1.96,p=r/n,d=1+z*z/n,m=(p+z*z/(2*n))/d,w=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return [m-w,m+w]};
const list=[...agg.values()].map(a=>({...a,n:a.b.size,ci:wilson(a.c,a.r),rate:a.r/(a.c+a.r)})).filter(a=>a.n>=MIN_N);
const show=(t,xs)=>{console.log('\n'+t);xs.forEach(a=>console.log(` م${a.ind}  "${a.cue}"  أكد ${a.c} | رفض ${a.r} | رفض ${Math.round(a.rate*100)}% | ${a.n} مساهمة`));if(!xs.length)console.log(' لا شيء');};
show('قرائن مرشحة للحذف أو التخفيض (الحد الأدنى لمجال الرفض 95% يبلغ 50%):',list.filter(a=>a.ci[0]>=0.5).sort((a,b)=>b.rate-a.rate));
show('قرائن مستقرة يمكن رفع ثقتها (الحد الأعلى لمجال الرفض 95% لا يتجاوز 20%):',list.filter(a=>a.ci[1]<=0.2).sort((a,b)=>b.n-a.n));
console.log('\nمؤشرات أضافها المستعملون يدويا (قد تدل على قرائن ناقصة):');
[...added].sort((a,b)=>b[1]-a[1]).forEach(([i,n])=>console.log(` م${i}: ${n}`));
console.log('\nحد أدنى للقرارات في كل قرينة:',MIN_N);
