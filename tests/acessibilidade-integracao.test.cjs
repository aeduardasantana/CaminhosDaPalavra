const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');
const page=read('acessibilidade.html'),access=read('acessibilidade.js');
const menu=read('site-menu.js'),study=read('biblia-estudo.html');
const home=read('index.html'),app=read('app.js');
const control=read('scripts/preparar-publicacao.mjs');
for(const id of ['accessNarration','accessPlay','accessStop'])
  assert.ok(page.includes('id="'+id+'"'),'Acessibilidade: campo ausente '+id);
assert.match(page,/site-menu\.js/);
assert.match(access,/speechSynthesis/);
assert.match(menu,/vlibras\.gov\.br\/app\/vlibras-plugin\.js/);
assert.match(menu,/acessibilidade\.html/);
assert.match(study,/studyReadAloud/);
assert.match(study,/studyStopAloud/);
assert.ok(!study.includes('https://www.bible.com/pt/versions/4542'));
assert.ok(!home.includes('href="https://www.bible.com/pt/versions/4542"'));
const bibleBlock=home.match(/<section id="bibliaSection"[\s\S]*?<section class="bible-transversal-search"/);
assert.ok(bibleBlock,'Seção bíblica ausente da página inicial');
assert.match(bibleBlock[0], /<a class="primary-link" href="\.\/biblia-estudo\.html">Ler e estudar a Bíblia<\/a>/,
  'BLOCO 19: CTA deve direcionar ao leitor interno');
assert.doesNotMatch(bibleBlock[0], /Em\s+breve/i,
  'BLOCO 19: não reintroduzir teaser na seção da Bíblia');
assert.ok(!app.includes('read.href=record.bibleUrl'));
assert.ok(!app.includes('read.href = record.bibleUrl'));
assert.ok(app.includes('return studyChapterUrl(bookId,chapter);'));
assert.ok(!app.includes('A revisão eclesial externa não foi concluída'));
assert.ok(control.includes('const authorized = state?.publicAuthorized === true && ownerApproved;'));
assert.ok(page.includes('audiodescrição sincronizada'));
console.log('Leitor interno, VLibras, narração e independência eclesial: contratos aprovados.');
