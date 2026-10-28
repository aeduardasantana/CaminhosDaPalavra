const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c={window:{}};
for(const path of ['liturgia-2025-11.js','estudo-versiculos-2025-11.js'])
 vm.runInNewContext(fs.readFileSync(path,'utf8'),c);
const day=c.window.LCE_MONTH_2025_11.readings['2025-11-06'];
assert.equal(day.items[1][1],'Sl 26(27),1.4.13-14 (R. 13)');
const study=c.window.LCE_ESTUDO_VERSICULAR_2025_11['2025-11-06'];
assert.equal(study.f.length,6);
assert.equal(study.p.length,5);
assert.equal(study.e.length,10);
assert.equal(study.p.filter(x=>/^R\./.test(x.ref)).length,1,'Refrão exibido uma vez');
for(const [part,refStart] of [['f','Rm 14,'],['p','Sl 26(27),'],['e','Lc 15,']]){
 for(const u of study[part]){
  assert.ok(u.ref.startsWith(refStart)||u.ref.startsWith('R. '));
  assert.ok(u.glosa.length>15&&u.sentido.length>25&&u.espaco.length>20);
 }
}
const app=fs.readFileSync('app.js','utf8');
assert.ok(app.includes('renderPsalmStudyGlosa(glosaBox,entry)'));
const csv=fs.readFileSync('RELATORIOS/COBERTURA-GLOSA-2025-11.csv','utf8').split('\n');
const date=csv.filter(line=>line.startsWith('"2025-11-06"'));
assert.equal(date.length,3);
assert.ok(date.every(line=>line.includes('"GLOSA_VERSICULAR_PRELIMINAR"')));
assert.ok(date.some(line=>line.includes('"5","GLOSA_VERSICULAR_PRELIMINAR"')));
console.log('OK: 06/11 cobre 6 versículos da leitura, 5 unidades do salmo e 10 do Evangelho.');
