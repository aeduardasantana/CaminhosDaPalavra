/* O paralelo mantém o texto original e só alinha versículos/estrofes cobertos. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{},Date,console};
for(const file of ['liturgia-2025-11.js','estudo-versiculos-2025-11.js',
  'liturgia-br-acervo.js','liturgia-fonte-local.js','liturgia-paralelo.js']){
  vm.runInNewContext(fs.readFileSync(file,'utf8'),context,{filename:file});
}
const data=context.window.LCE_BR_ACERVO,monthly=context.window.LCE_MONTH_2025_11.readings;
const glosas=context.window.LCE_ESTUDO_VERSICULAR_2025_11,parallel=context.window.LCE_PARALELO;
assert.ok(parallel);
const typeMap={f:'primeira-leitura',p:'salmo',e:'evangelho'};
const referenceType={f:'Primeira leitura',p:'Salmo responsorial',e:'Evangelho'};
const check=(date,type,length)=>{
  const kind=typeMap[type],verseUnits=glosas[date][type];
  const entry={data:date,item:kind,referencia:monthly[date].items
     .find(x=>x[0]===referenceType[type])[1]};
  const source=data.texts[data.dates[date].byKind[kind][0]];
  const previous=JSON.stringify(source);
  const plan=parallel.makePlan(entry,{texto:source.text,refrao:source.refrain,titulo:source.title},verseUnits);
  assert.ok(plan,kind+' não alinhado: '+date);
  assert.equal(plan.length,length);
  assert.ok(plan.every(p=>p.original.trim().length&&p.glosas.length>=1));
  assert.equal(JSON.stringify(source),previous,'Pareamento não pode alterar texto importado');
  return {entry,source,plan,verseUnits};
};
const nov5first=check('2025-11-05','f',3);
const nov5gospel=check('2025-11-05','e',8);
const nov6first=check('2025-11-06','f',6);
const nov6gospel=check('2025-11-06','e',10);
const nov5psalm=check('2025-11-05','p',4);
const nov6psalm=check('2025-11-06','p',4);
assert.equal(nov5psalm.plan.filter(row=>row.refrain).length,1);
assert.equal(nov6psalm.plan.filter(row=>row.refrain).length,1);
assert.equal(nov5psalm.plan[1].glosas.length,2);
assert.equal(nov5psalm.plan[2].glosas.length,2);
assert.equal(nov6psalm.plan[3].glosas.length,2);
assert.ok(nov6gospel.plan[3].original.includes('cem ovelhas'));
assert.ok(nov5gospel.plan[4].glosas[0].ref.includes('29-30'));
assert.ok(nov5gospel.plan[4].original.includes('alicerce'));
assert.ok(parallel.numberedVerses(nov6gospel.source.text).some(v=>v.number===4),'Aspa após marcador de versículo');
assert.equal(parallel.makePlan(nov6first.entry,{texto:'7Somente primeiro versículo.'},nov6first.verseUnits),null);
assert.equal(parallel.makePlan(nov6first.entry,{texto:nov6first.source.text},[]),null);
assert.equal(parallel.makePlan({...nov6first.entry,item:'evangelho'},{texto:nov6first.source.text},[]),null);
const local=fs.readFileSync('liturgia-fonte-local.js','utf8');
const editions=fs.readFileSync('liturgia-edicoes.js','utf8');
const css=fs.readFileSync('liturgia-diaria.css','utf8');
const html=fs.readFileSync('index.html','utf8');
assert.ok(local.includes("root.LCE_PARALELO.apply(entry,card,record)"));
assert.ok(editions.includes("root.LCE_PARALELO.apply(entry,card,"));
assert.ok(html.includes('liturgia-paralelo.js?v=20261028-sync1'));
assert.ok(css.includes('.lce-parallel-row'));
assert.ok(css.includes('grid-template-columns:minmax(0,1fr) minmax(0,1fr)'));
assert.ok(css.includes('grid-template-columns:minmax(0,1fr);'));
assert.ok(css.includes('lce-parallel-mobile-label'));
assert.ok(css.includes('lce-parallel-footer'));
assert.ok(fs.readFileSync('app.js','utf8').includes("Rascunho temático · glosa integral pendente"));
console.log('OK: 05–06/11 em duas colunas sincronizadas, salmos por estrofe e fallback seguro.');
