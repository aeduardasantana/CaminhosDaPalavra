#!/usr/bin/env node
/* BLOCO 17B — extrai somente contagens e existência de versículos do JSON local.
 * Nunca publica a redação da Bíblia Ave-Maria, títulos ou comentários editoriais. */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const SOURCE='data/biblia-ave-maria/bibliaAveMaria.json';

function normalizeName(input) {
  return String(input||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/\b(iii|ii|i)\b/g,(_,roman)=>({i:'1',ii:'2',iii:'3'}[roman]))
    .replace(/\b(?:livro|carta|evangelho|segundo|sao|santa|de|do|da|dos|das|aos|as|os)\b/g,' ')
    .replace(/[^a-z0-9]+/g,' ').trim();
}

export function buildVerseIndex() {
  const sandbox={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'bible-data.js'),'utf8'),sandbox);
  const catalog=sandbox.window.LCE_BIBLE?.books;
  if(!Array.isArray(catalog)||catalog.length!==73) throw new Error('Catálogo bíblico inválido.');
  const source=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
  const sections=[
    {key:'antigoTestamento',testament:'AT',expected:46},
    {key:'novoTestamento',testament:'NT',expected:27}
  ];
  const books=Object.create(null);
  let bookCount=0,chapterCount=0,verseCount=0;
  for(const section of sections) {
    const sourceBooks=source[section.key];
    const catalogBooks=catalog.filter(b=>b.testament===section.testament);
    if(!Array.isArray(sourceBooks)||sourceBooks.length!==section.expected||
       catalogBooks.length!==section.expected) {
      throw new Error('Quantidade de livros divergente: '+section.key);
    }
    sourceBooks.forEach((original,pos)=>{
      const expected=catalogBooks[pos];
      const actualName=normalizeName(original.nome), expectedName=normalizeName(expected.name);
      // Correspondência canônica por posição, conferida por nome e número de capítulos.
      const nameCompatible=actualName===expectedName ||
        (actualName.length>=3&&expectedName.length>=3&&
          (actualName.includes(expectedName)||expectedName.includes(actualName)));
      if(!nameCompatible) {
        throw new Error('Livro divergente na ordem '+section.key+' #'+(pos+1)+
          ': fonte='+original.nome+'; catálogo='+expected.name);
      }
      if(!Array.isArray(original.capitulos)||original.capitulos.length!==expected.chapters) {
        throw new Error('Capítulos divergentes em '+expected.id+' ('+original.nome+').');
      }
      const counts=original.capitulos.map((chapter,index)=>{
        if(Number(chapter.capitulo)!==index+1||!Array.isArray(chapter.versiculos)||
           !chapter.versiculos.length) {
          throw new Error('Capítulo ausente ou desordenado: '+expected.id+' '+(index+1));
        }
        chapter.versiculos.forEach((verse,indexVerse)=>{
          if(Number(verse.versiculo)!==indexVerse+1 ||
             typeof verse.texto!=='string'||!verse.texto.trim()) {
            throw new Error('Versículo ausente ou desordenado: '+
              expected.id+' '+(index+1)+','+(indexVerse+1));
          }
        });
        verseCount+=chapter.versiculos.length;
        chapterCount++;
        return chapter.versiculos.length;
      });
      if(books[expected.id]) throw new Error('Livro duplicado: '+expected.id);
      books[expected.id]=counts;
      bookCount++;
    });
  }
  if(bookCount!==73||chapterCount!==1334||verseCount!==35450 ||
     Object.keys(books).length!==73) {
    throw new Error('Cobertura bíblica divergente: '+JSON.stringify({bookCount,chapterCount,verseCount}));
  }
  return {schemaVersion:1,source:'biblia-ave-maria-json-local',sourceStructure:'versiculos-numerados-em-sequencia',
    counts:{books:bookCount,chapters:chapterCount,verses:verseCount},books};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const index=buildVerseIndex();
  if(process.argv.includes('--json')) process.stdout.write(JSON.stringify(index)+'\n');
  else console.log('Índice de versículos validado: '+index.counts.books+' livros, '+
    index.counts.chapters+' capítulos, '+index.counts.verses+' versículos; nenhuma redação exportada.');
}
