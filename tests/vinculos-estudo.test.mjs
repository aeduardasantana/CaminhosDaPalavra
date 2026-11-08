import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {buildVerseIndex} from '../scripts/gerar-indice-versiculos.mjs';
import {fromRepository,citation} from '../scripts/gerar-vinculos-estudo.mjs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const core=require('../vinculos-estudo-core.js');
const bibleCore=require('../biblia-estudo-core.js');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const scope={window:{}};
vm.runInNewContext(read('bible-data.js'),scope);
const books=bibleCore.catalog(scope.window.LCE_BIBLE);
function parseAssigned(file,name){
  const match=read(file).match(new RegExp('window\\.'+name+'\\s*=\\s*([\\s\\S]*);\\s*$'));
  assert.ok(match,'Fonte de '+name+' ausente');
  return JSON.parse(match[1]);
}
const theology=parseAssigned('theology-data.js','CDP_THEOLOGY');
const control=parseAssigned('publication-control.js','CDP_PUBLICATION_CONTROL');
const index=buildVerseIndex();
const links=fromRepository(theology,control,index);
assert.equal(links.schemaVersion,1);
assert.equal(links.counts.books,73);
assert.equal(links.counts.chapters,1334);
assert.equal(links.counts.verses,35450);
assert.equal(links.counts.dictionaryEntries,46);
assert.ok(links.counts.contextualDictionaryLinks>20,'Verbetes com referências explícitas devem produzir vínculos.');
assert.equal(links.counts.curatedObservations,0,'Não inventar observações por versículo.');
assert.equal(links.counts.verifiedLexicalAnchors,0,'Não associar palavras automaticamente.');
assert.equal(Object.keys(links.chapters).length,1334);
assert.equal(Object.keys(links.dictionary).length,46);
assert.equal(links.chapters['GEN:1'].theologyKey,'GEN:1');
assert.equal(links.chapters['GEN:1'].cpId,'CP-0001');
assert.equal(links.chapters['GEN:1'].verseCount,31);
assert.equal(core.forVerse(links,'GEN',1,1).observations.length,0);
assert.equal(core.forLexicalAnchor(links,'JHN',2,14,'Templo').length,0);
const j2=core.forChapter(links,'JHN',2);
assert.ok(j2.contextualDictionary.some(l=>l.dictionaryId==='templo-jerusalem'));
const templ=Object.values(links.links).find(l=>l.dictionaryId==='templo-jerusalem');
assert.deepEqual({scope:templ.scope,bookId:templ.target.bookId,
  chapter:templ.target.startChapter,start:templ.target.startVerse,end:templ.target.endVerse},
  {scope:'passage',bookId:'JHN',chapter:2,start:13,end:22});
assert.ok(core.forVerse(links,'JHN',2,14).contextualDictionary.some(l=>l.dictionaryId==='templo-jerusalem'));
assert.ok(!core.forVerse(links,'JHN',2,12).contextualDictionary.some(l=>l.dictionaryId==='templo-jerusalem'));
assert.ok(!core.forChapter(links,'JHN',1).contextualDictionary.some(l=>l.dictionaryId==='templo-jerusalem'));
const explicit=core.forPassage(links,{bookId:'JHN',chapter:2,startVerse:13,endVerse:22});
assert.ok(explicit.contextualDictionary.some(l=>l.dictionaryId==='templo-jerusalem'));
const mt=citation('Mt 5,1-12a',books,index);
assert.equal(mt.scope,'passage');
assert.equal(mt.startVerse,1);assert.equal(mt.endVerse,12);
assert.equal(mt.partialVerse,true);
const dn=citation('Dn 1–7',books,index);
assert.equal(dn.scope,'chapter_range');assert.equal(dn.startChapter,1);assert.equal(dn.endChapter,7);
const wisdom=citation('Sb 7,22–8,1',books,index);
assert.equal(wisdom.scope,'cross_chapter_passage');
assert.equal(wisdom.endChapter,8);
assert.equal(citation('Sl 81(82)',books,index),null,'Numeração divergente não deve ser presumida.');
for(const link of Object.values(links.links)){
  assert.equal(link.kind,'dictionary-context');
  assert.ok(link.sourceReference);
  assert.ok(link.sourceField.includes('dictionary.'));
  for(let n=link.target.startChapter;n<=link.target.endChapter;n++)
    assert.ok(links.chapters[link.target.bookId+':'+n].linkIds.includes(link.id));
}
for(const liturgy of links.liturgicalLinks)
  assert.ok(links.dictionary[liturgy.dictionaryId],'Vínculo litúrgico deve apontar para verbete real.');
const sample=JSON.stringify(links);
assert.ok(!sample.includes('versiculos:'));
console.log('Vínculos documentais consolidados: '+links.counts.chapters+' capítulos, '+
  links.counts.contextualDictionaryLinks+' referências de verbetes, '+
  links.counts.liturgicalDictionaryLinks+' vínculos litúrgicos; nenhuma interpretação lexical/versicular inventada.');
