/* Teste de roteamento e integridade do Dicionário Bíblico, Histórico e Visual. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const page=fs.readFileSync('dicionario.html','utf8');
const menu=fs.readFileSync('site-menu.js','utf8');
const ui=fs.readFileSync('dicionario.js','utf8');
const calendar=fs.readFileSync('liturgia-diaria.js','utf8');
const home=fs.readFileSync('index.html','utf8');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('liturgia-2025-11.js','utf8'),ctx);
const data=ctx.window.LCE_MONTH_2025_11;
assert.ok(Object.keys(data.dictionary).length>=46);
assert.equal(Object.keys(data.readings).length,30);
for(const [id,entry] of Object.entries(data.dictionary)){assert.equal(id,entry.id);assert.ok(entry.title);assert.ok(entry.contexto);assert.ok(entry.espaco);assert.ok(entry.source);}
for(const rec of Object.values(data.readings)){for(const key of rec.dictionaryRefs){assert.ok(data.dictionary[key],'Missing definition: '+key);}}
assert.ok(menu.includes("url:'./dicionario.html',page:'dicionario'"));
assert.ok(menu.includes("/\\/dicionario\\.html$/"));
assert.ok(home.includes('href="./dicionario.html"'));
assert.ok(page.includes('<title>Dicionário Bíblico, Histórico e Visual'));
assert.ok(page.includes('src="./liturgia-2025-11.js'));
assert.ok(page.includes('src="./dicionario.js'));
assert.ok(ui.includes("window.LCE_DICTIONARY_EXTRA_MONTHS"));
assert.ok(ui.includes("function makeEntry(entry)"));
assert.ok(ui.includes("const occurrences=new Map()"));
assert.ok(calendar.includes("'./dicionario.html#'+encodeURIComponent(entry.id)"));
assert.ok(!calendar.includes("text(article,'p',entry.contexto)"));
assert.ok(fs.readFileSync('heresias.html','utf8').includes('site-menu.js?v=20261023-dicionario1'));
assert.ok(fs.readFileSync('historia-da-salvacao.html','utf8').includes('site-menu.js?v=20261023-dicionario1'));
console.log('OK: dicionário acessível, 12 verbetes iniciais, menu e navegação contextual.');
