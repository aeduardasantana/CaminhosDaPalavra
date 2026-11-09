import assert from 'node:assert/strict';
import fs from 'node:fs';
const pages=['index.html','biblia-estudo.html','historia-da-salvacao.html','acessibilidade.html','dicionario.html','heresias.html','papas.html'];
for(const p of pages){const s=fs.readFileSync(p,'utf8');assert.match(s,/ux2\.css/,p+': stylesheet ausente');assert.match(s,/ux2\.js/,p+': script ausente');assert.match(s,/<main\b/,p+': landmark main ausente');}
for(const name of ['hero','biblia','estudo','liturgia','missa','formacao','jornada']){const p='assets/ux2/'+name+'.svg';assert.ok(fs.existsSync(p),'imagem ausente: '+p);assert.match(fs.readFileSync(p,'utf8'),/<svg\b/,p+': formato inválido')}
const ux=fs.readFileSync('ux2.js','utf8');
assert.match(ux,/dados\/biblia-ave-maria\/GEN\.json/,'leitura deve usar acervo real');
assert.match(ux,/data-cdp-tab="referencias"/);
assert.match(ux,/cdp-mobile-nav/);
console.log('UX2: 7 páginas integradas; 7 imagens locais; leitor vinculado à Bíblia; abas e menu móvel encontrados.');
