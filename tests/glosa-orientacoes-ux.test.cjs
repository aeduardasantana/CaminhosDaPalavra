/* Não converter instruções entre parênteses em sinais. Manter texto-fonte intacto. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('function splitGlossStudyText(raw) {');
const end=app.indexOf('function appendGlossWithDirections(',start);
assert.ok(start>=0&&end>start,'Parser de glosa ausente');
const fragment=app.slice(start,end);
const split=value=>vm.runInNewContext(fragment+'\nsplitGlossStudyText('+JSON.stringify(value)+')',{}).map(x=>({kind:x.kind,text:x.text}));
const sample='(ASSEMBLEIA RESPONDE SALMISTA) PESSOA MISERICORDIOSA / EMPRESTAR AJUDAR / FELIZ! (REFRÃO DE ESTUDO).';
const items=split(sample);
assert.equal(items[0].kind,'direction');
assert.equal(items[0].text,'ASSEMBLEIA RESPONDE SALMISTA');
assert.equal(items[1].kind,'gloss');
assert.ok(items[1].text.startsWith('PESSOA MISERICORDIOSA'));
assert.equal(items[2].kind,'direction');
assert.equal(items[2].text,'REFRÃO DE ESTUDO');
assert.equal(items[3].kind,'gloss');
assert.equal(items[3].text,'.');
assert.equal(split('DEUS / AMAR / PRÓXIMO')[0].kind,'gloss');
assert.equal(split('(CENA (PASSADO)) DEUS EXPLICAR')[0].text,'CENA (PASSADO)');
assert.equal(split('(ORIENTAÇÃO INCOMPLETA')[0].kind,'gloss'); // não silenciar texto com parêntese incompleto
assert.ok(app.includes('instructions.textContent=part.text'));
assert.ok(app.includes('signs.textContent=part.text'));
assert.ok(!app.includes('text.innerHTML=unit.draft'));
const css=fs.readFileSync('liturgia-diaria.css','utf8');
assert.ok(css.includes('background:#edf2f6'));
assert.ok(css.includes('background:#f1f4f6'));
console.log('OK: glosa destacada, instruções não sinalizáveis separadas, notas de análise independentes.');
