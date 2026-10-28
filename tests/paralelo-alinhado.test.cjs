/* Layout comparativo: alinhamento só com cobertura textual verificável. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{},Date,console};
for(const script of ['calendar.js','liturgia-fonte-local.js','liturgia-2025-11.js','estudo-versiculos-2025-11.js','liturgia-br-acervo.js','liturgia-paralelo.js'])
  vm.runInNewContext(fs.readFileSync(script,'utf8'),ctx,{filename:script});
const api=ctx.window.LCE_PARALELO,source=ctx.window.LCE_FONTE_LOCAL;
const ac=ctx.window.LCE_BR_ACERVO,verses=ctx.window.LCE_ESTUDO_VERSICULAR_2025_11,month=ctx.window.LCE_MONTH_2025_11;
const codes={f:'primeira-leitura',p:'salmo',e:'evangelho'};
let checked=0;
for(const date of ['2025-11-05','2025-11-06']){
  for(const [short,kind] of Object.entries(codes)){
    const rec=ac.texts[ac.dates[date].byKind[kind][0]];
    const unit=verses[date][short];
    const reference=month.readings[date].items.find(x=>(kind==='salmo'?x[0].includes('Salmo'):kind==='evangelho'?x[0]==='Evangelho':x[0]==='Primeira leitura'))[1];
    const plan=api.makePlan({item:kind,referencia:reference},rec,unit);
    assert.ok(plan,'Paralelo ausente '+date+' '+kind);
    if(kind==='salmo'){
      assert.equal(plan.length,4,'Salmo tem 1 refrão e 3 estrofes');
      assert.equal(plan[0].label,'Refrão');
      assert.equal(plan.filter(x=>x.refrain).length,1);
      assert.ok(plan.slice(1).every(x=>x.label.startsWith('Estrofe')));
      assert.ok(plan[0].repeat.includes('Repetir'));
    }else{
      assert.equal(plan.length,unit.length,'Uma caixa por unidade versicular');
      assert.equal(plan[0].label,unit[0].ref);
      assert.ok(plan.every(x=>x.original.length>5&&x.glosas.length===1));
      assert.ok(!plan.some(x=>x.original.includes('undefined')));
    }
    checked++;
  }
}
assert.equal(checked,6);
const gospel=ac.texts[ac.dates['2025-11-06'].byKind.evangelho[0]];
const pieces=api.numberedVerses(gospel.text);
assert.deepEqual(pieces.map(x=>x.number).join(','),'1,2,3,4,5,6,7,8,9,10');
assert.ok(pieces[0].text.startsWith('Naquele tempo'));
assert.equal(api.makePlan({item:'evangelho',referencia:'Lc 15,1-10'},gospel,verses['2025-11-06'].e.slice(0,3)),null,'Parcial não é apresentado como integral');
const mismatch=verses['2025-11-06'].e.map(x=>({...x}));
mismatch[2].ref='Lc 15,15';
assert.equal(api.makePlan({item:'evangelho',referencia:'Lc 15,1-10'},gospel,mismatch),null,'Não inventar alinhamento com versículo errado');
const noGloss={...gospel,gloss:null};
assert.equal(api.makePlan({item:'evangelho',referencia:'Lc 15,1-10'},noGloss,[]),null);
assert.equal(api.makePlan({item:'evangelho',referencia:'Lc 15,1-10'},gospel,null),null);
const original=fs.readFileSync('app.js','utf8'),css=fs.readFileSync('liturgia-diaria.css','utf8'),html=fs.readFileSync('index.html','utf8'),local=fs.readFileSync('liturgia-fonte-local.js','utf8');
assert.ok(original.includes('LCE_PARALELO.applyLegacyPsalm(card,parsedPsalm)'));
assert.ok(local.includes('LCE_PARALELO.apply(entry,card,record)'));
assert.ok(html.indexOf('liturgia-paralelo.js')<html.indexOf('liturgia-fonte-local.js'));
assert.ok(css.includes('.lce-parallel-row'));
assert.ok(css.includes('.lce-parallel-mobile-label'));
assert.equal((original.match(/appendPsalmRefrain\(sequence, parsed\.refrain/g)||[]).length,1,'Sem repetição de refrão por estrofe no legado');
assert.ok(!original.includes("repeatLabel.textContent = 'REFRÃO — REPETIR'"));
console.log('OK: 6 leituras alinhadas por versículo/estrofe, refrão único, cobertura rigorosa e responsividade.');
