/* Auditoria real: 96 ocorrências, 93 sínteses e 3 glosas versiculares rascunhadas. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={window:{}};
for(const p of ['liturgia-2025-11.js','estudo-liturgico-2025-11-01a15.js',
 'estudo-liturgico-2025-11-16a30.js','estudo-versiculos-2025-11.js'])
 vm.runInNewContext(fs.readFileSync(p,'utf8'),context);
const dates=context.window.LCE_MONTH_2025_11.readings;
const drafts=context.window.LCE_ESTUDO_NOV_2025;
const verses=context.window.LCE_ESTUDO_VERSICULAR_2025_11;
const kinds={'Primeira leitura':'f','Segunda leitura':'s','Salmo responsorial':'p','Cântico responsorial':'p','Evangelho':'e'};
let total=0,summary=0,perVerse=0,unitCount=0,verseUnitCount=0;
for(const [date,day] of Object.entries(dates)){
 for(const [kind] of day.items){
  total++;
  const key=kinds[kind];
  const units=drafts[date]?.[key]||[];
  const verseList=verses[date]?.[key]||[];
  unitCount+=units.length;
  if(verseList.length){perVerse++;verseUnitCount+=verseList.length;}
  else{summary++;assert.equal(units.length,6);}
 }
}
assert.equal(total,96);
assert.equal(summary,90);
assert.equal(perVerse,6);
assert.equal(unitCount,288);
assert.equal(verseUnitCount,39);
const csv=fs.readFileSync('RELATORIOS/COBERTURA-GLOSA-2025-11.csv','utf8').trim().split('\n');
assert.equal(csv.length,97);
assert.equal(csv.filter(x=>x.includes('"GLOSA_VERSICULAR_PRELIMINAR"')).length,6);
assert.equal(csv.filter(x=>x.includes('"SINTESE_TEMATICA_NAO_INTEGRAL"')).length,90);
const editorial=fs.readFileSync('RELATORIOS/STATUS-EDICOES-2025-11.csv','utf8').trim().split('\n');
assert.equal(editorial.length,97);
assert.equal(editorial.filter(x=>x.includes('"GLOSA_VERSICULAR_PRELIMINAR"')).length,6);
assert.equal(editorial.filter(x=>x.includes('"SINTESE_TEMATICA_NAO_INTEGRAL"')).length,90);
assert.ok(!verses['2025-11-05'].p[0].glosa.includes('REFRÃO DE ESTUDO'));
const app=fs.readFileSync('app.js','utf8');
assert.ok(app.includes("SINTESE_TEMATICA"));
assert.ok(app.includes('Rascunho temático · glosa integral pendente'));
console.log('OK: 30 dias/96 ocorrências/288 sínteses, 3 estudos versiculares e 93 sínteses não integrais.');
