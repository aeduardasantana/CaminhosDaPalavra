/* As aclamações não são versículos do salmo; I/II é independente do A/B/C. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync('aclamacoes.js','utf8'),scope);
const item=scope.window.LCE_ACLAMACOES.forItem;
for(const kind of ['primeira-leitura','segunda-leitura']){
  assert.equal(item(kind).proclamation,'Palavra do Senhor');
  assert.equal(item(kind).response,'Graças a Deus');
  assert.equal(item(kind).minister,'Leitor');
}
assert.equal(item('evangelho').proclamation,'Palavra da Salvação');
assert.equal(item('evangelho').response,'Glória a Vós, Senhor');
assert.equal(item('evangelho').minister,'Ministro');
for(const kind of ['salmo','cantico','sequencia',null]){
  assert.equal(item(kind),null,'Não adicionar a mesma resposta a salmo/cântico');
}
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('liturgia-diaria.css','utf8');
assert.ok(app.includes('appendLiturgicalAcclamation(entry,node)'));
assert.ok(app.includes('source.setAttribute(\'aria-label\',\'Aclamação ao final da leitura\')'));
assert.ok(app.includes('study.setAttribute(\'aria-label\',\'Preparação de glosa para o diálogo litúrgico\')'));
assert.ok(app.includes('textAnchor.after(source)'));
assert.ok(app.includes('glossAnchor.after(study)'));
assert.ok(app.includes("entry.ferialCycle"));
assert.ok(app.includes("'Ferial '+entry.ferialCycle"));
assert.ok(html.indexOf('aclamacoes.js')<html.indexOf('./app.js?v='));
assert.ok(css.includes('.liturgical-dialogue-study'));
console.log('OK: assembleia e leitor identificados; exclui salmo; ferial I/II separado do ano dominical.');
