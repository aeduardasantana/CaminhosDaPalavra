const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync('liturgia-2025-11.js','utf8'),scope);
const list=Object.values(scope.window.LCE_MONTH_2025_11.readings);
const expected=list.reduce((n,d)=>n+d.items.length,0);
const csv=fs.readFileSync('RELATORIOS/STATUS-EDICOES-2025-11.csv','utf8').trim().split('\n');
assert.equal(expected,96);assert.equal(csv.length,expected+1);
const head=csv[0];assert.ok(head.includes('"ave_maria_texto"'));assert.ok(head.includes('"cnbb_cotejo"'));
for(const line of csv.slice(1)){
 assert.ok(line.includes('"API_COMUNITARIA_LOCAL"'));
 assert.ok(line.includes('"PENDENTE_COTEJO_CNBB"'));
 assert.ok(line.includes('"GLOSA_PRELIMINAR"'));
 assert.ok(line.includes('"NAO_REALIZADA"'));
 if(line.includes('"salmo"')){
  assert.ok(line.includes('"NAO_APLICAVEL_SALMO_CNBB"'));
 }else{
  assert.ok(line.includes('"NAO_IMPORTADO"'));
  assert.ok(line.includes('"NAO_ELABORADA"'));
 }
}
console.log('OK: 96 ocorrências com situação editorial separada CNBB/Ave-Maria e salmos CNBB.');
