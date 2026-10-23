/* Testes offline de integridade da API brasileira. Nenhum texto externo é armazenado no GitHub. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('liturgia-fonte-online.js','utf8'),ctx);
const a=ctx.window.LCE_FONTE_ONLINE;
assert.equal(a.normalizeDate('05/11/2025'),'2025-11-05');
assert.equal(a.normalizeDate('04/11/2025'),'2025-11-04');
assert.equal(a.normalizeReference('Rm 13, 8-10'),a.normalizeReference('Rm 13,8-10'));
assert.equal(a.referenceMatches('Sl 111(112),1-2.4-5.9','Sl 111(112),1-2.4-5.9 (R. 5a)','salmo'),true);
assert.equal(a.referenceMatches('Sl 111(112)','Sl 111(112),1-2.4-5.9 (R. 5a)','salmo'),true);
assert.equal(a.referenceMatches('Sl 110(111)','Sl 111(112),1-2.4-5.9 (R. 5a)','salmo'),false);
assert.equal(a.referenceMatches('Sl 45','Sl 45(46)','salmo'),true);
assert.equal(a.referenceMatches('Dn 3','Dn 3 (cântico)','salmo'),true);
assert.equal(a.referenceMatches('Lc 1,46-55','Lc 1,46-55 (cântico)','salmo'),true);
assert.equal(a.referenceMatches('1Co 3,9c-11.16-17','1Cor 3,9c-11.16-17','segunda-leitura'),true);
assert.equal(a.referenceMatches('Rm 13,11-14','Rm 13,11-14a','segunda-leitura'),true);
assert.equal(a.referenceMatches('Rm 13,8-10','Rm 14,8-10','primeira-leitura'),false);
const sample={data:'05/11/2025',leituras:{
 primeiraLeitura:[{referencia:'Rm 13, 8-10',texto:'Um texto brasileiro de demonstração para teste interno, sem publicar conteúdo litúrgico protegido.'}],
 salmo:[{referencia:'Sl 111(112),1-2.4-5.9',refrao:'Refrão de teste',texto:'Estrofe de teste.\nSegunda estrofe de teste.'}],
 evangelho:[{referencia:'Lc 14,25-33',texto:'Texto de demonstração do Evangelho com extensão suficiente para o teste de seleção.'}]
}};
assert.equal(a.resolveReading(sample,'2025-11-05','primeira-leitura','Rm 13,8-10').length,1);
assert.equal(a.resolveReading(sample,'2025-11-05','salmo','Sl 111(112),1-2.4-5.9 (R. 5a)').length,1);
assert.equal(a.resolveReading(sample,'2025-11-04','salmo','Sl 111(112),1-2.4-5.9 (R. 5a)'),null);
assert.equal(a.resolveReading(sample,'2025-11-05','evangelho','Mt 14,25-33'),null);
assert.equal(a.resolveReading(sample,'2025-11-05','segunda-leitura','Rm 13,8-10'),null);
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8');
assert.ok(app.includes('LCE_FONTE_ONLINE.loadForEntry(entry,card)'));
assert.ok(html.indexOf('liturgia-fonte-online.js')<html.indexOf('./app.js?v='));
assert.ok(html.includes('liturgia-fonte-online.js?v=20261023-leitura-limpa1'));
console.log('OK: leitura externa só é exibida quando data e referência coincidem; opções independentes e fallback.');
