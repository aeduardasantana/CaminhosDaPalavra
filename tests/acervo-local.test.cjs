/* A leitura diária deve funcionar sem depender de uma API no navegador. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={window:{},Date,console};
for(const p of ['calendar.js','liturgia-fonte-local.js'])vm.runInNewContext(fs.readFileSync(p,'utf8'),context,{filename:p});
const local=context.window.LCE_FONTE_LOCAL;
const fake={
  version:1,complete:true,period:'2025-11',
  texts:{
    a:{kind:'primeira-leitura',reference:'Rm 13,8-10',text:'Texto local de teste com comprimento suficiente e leitura verificada.'},
    b:{kind:'salmo',reference:'Sl 111(112),1-2.4-5.9 (R. 5a)',text:'Versículos da estrofe 1.\nVersículos da estrofe 2.',refrain:'Refrão de teste'},
    c:{kind:'evangelho',reference:'Lc 14,25-33',text:'Texto de Evangelho de teste com comprimento suficiente.'}
  },
  dates:{'2025-11-05':{byKind:{'primeira-leitura':['a'],salmo:['b'],evangelho:['c']}}},
  associations:{
    'FERIAL|TC|31|3|I|primeira-leitura':['a'],
    'FERIAL|TC|31|3|I|salmo':['b'],
    'FERIAL|TC|31|3|ANUAL|evangelho':['c']
  }
};
context.window.LCE_BR_ACERVO=fake;
(async()=>{
  const day=await local.fetchDate('2025-11-05');
  assert.equal(day.data,'05/11/2025');
  assert.equal(day.leituras.primeiraLeitura[0].texto,fake.texts.a.text);
  assert.equal(day.leituras.salmo[0].refrao,'Refrão de teste');
  assert.equal(local.resolveReading(day,'2025-11-05','evangelho','Lc 14,25-33').length,1);
  // O ano civil 2027 pertence ao mesmo ciclo I nas férias do Tempo Comum.
  assert.equal(context.window.LCE_CALENDAR.weekdayLectionaryCycle(new Date('2027-11-03T12:00:00Z')),'I');
  const repeat=await local.fetchDate('2027-11-03');
  if(repeat)assert.ok(repeat.leituras.evangelho);
  // Nenhuma data inexistente é preenchida por suposição.
  assert.equal(await local.fetchDate('1980-01-01'),null);
  assert.equal(await local.fetchDate('2026-11-05')?.then(v=>v?.leituras?.primeiraLeitura?.[0]?.texto||null),null);
  const html=fs.readFileSync('index.html','utf8');
  const app=fs.readFileSync('app.js','utf8');
  const source=fs.readFileSync('liturgia-fonte-local.js','utf8');
  assert.ok(html.includes('liturgia-br-acervo.js'));
  assert.ok(html.indexOf('liturgia-br-acervo.js')<html.indexOf('liturgia-fonte-local.js'));
  assert.ok(app.includes('LCE_FONTE_LOCAL.loadForEntry(entry,card)'));
  assert.ok(!source.includes('fetch(url,'));
  assert.ok(!source.includes('liturgia.up.railway.app'));
  assert.ok(fs.existsSync('scripts/importar-liturgia-br.mjs'));
  console.log('OK: acervo local por data e por ciclo, sem requisições durante a leitura.');
})().catch(e=>{console.error(e);process.exitCode=1});
