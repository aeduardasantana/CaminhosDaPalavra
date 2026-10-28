import fs from 'node:fs';

const source=fs.readFileSync('theology-data.js','utf8');
const match=source.match(/window\.CDP_THEOLOGY\s*=\s*([\s\S]*);\s*$/);
if(!match) throw new Error('CDP_THEOLOGY não encontrado');
const data=JSON.parse(match[1]);
const records=Object.values(data.chapters||{});
const ids=new Set(records.map(r=>r.cpId));
const keys=new Set(records.map(r=>r.bookId+':'+r.chapter));

const bibleSource=fs.readFileSync('bible-data.js','utf8');
const bibleMatch=bibleSource.match(/window\.LCE_BIBLE\s*=\s*([\s\S]*);\s*$/);
if(!bibleMatch) throw new Error('LCE_BIBLE não encontrado');
const bible=Function('return ('+bibleMatch[1]+')')();
const expectedKeys=new Set();
for(const book of bible.books){
  for(let chapter=1;chapter<=book.chapters;chapter++) expectedKeys.add(book.id+':'+chapter);
}
const allowed=new Set(['A','B','C','D','—','']);
const errors=[];
if(records.length!==1334) errors.push('recordCount='+records.length);
if(ids.size!==1334) errors.push('uniqueCpIds='+ids.size);
if(keys.size!==1334) errors.push('uniqueChapterKeys='+keys.size);
if(expectedKeys.size!==1334) errors.push('catalogChapterKeys='+expectedKeys.size);
for(const key of expectedKeys) if(!keys.has(key)) errors.push('missingTheory='+key);
for(const key of keys) if(!expectedKeys.has(key)) errors.push('orphanTheory='+key);
for(const r of records){
  if(!/^CP-\d{4}$/.test(r.cpId)) errors.push('cpId '+r.cpId);
  if(!r.bookId||!Number.isInteger(r.chapter)||r.chapter<1) errors.push('key '+r.cpId);
  if(!allowed.has(r.connectionClass||'')) errors.push('class '+r.cpId+': '+r.connectionClass);
  for(const field of ['matrixVersion','sourceType','sourceScope','confidence']){
    if(typeof r[field]!=='string') errors.push(field+' '+r.cpId);
  }
}
if(errors.length){
  console.error(errors.slice(0,100).join('\n'));
  process.exit(1);
}
console.log('Mapa Bíblico Mestre validado:',records.length,'capítulos,',ids.size,'CP-IDs únicos e cobertura 1:1 do catálogo bíblico.');
