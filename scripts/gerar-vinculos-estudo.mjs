/* Consolidação dos vínculos com proveniência: Mapa Bíblico Mestre, fontes do dicionário e curadoria explícita.
 * O capítulo autoral não é tratado como observação de cada versículo.
 * A referência de um verbete a uma passagem não prova ocorrência lexical.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const core=require('../biblia-estudo-core.js');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');
const sourceMonth='liturgia-2025-11.js';
function parseFrozenMonth(source){
  const m=source.match(/window\.LCE_MONTH_2025_11\s*=\s*Object\.freeze\(([\s\S]*?)\);\s*$/);
  if(!m)throw new Error('Fonte canônica do dicionário não localizada.');
  return JSON.parse(m[1]);
}
function readCatalog(){
  const context={window:{}};
  vm.runInNewContext(read('bible-data.js'),context,{timeout:3000});
  return core.catalog(context.window.LCE_BIBLE);
}
const getBook=(name,books)=>core.findBook(name,books);
function citation(raw,books,verseIndex){
  const value=String(raw||'').trim().replace(/[–—−]/g,'-').replace(/\s+/g,' ');
  if(!value)return null;
  let match=value.match(/^(.+?)\s+(\d{1,3}),(\d{1,3})([a-d]?)\s*-\s*(\d{1,3}),(\d{1,3})([a-d]?)$/i);
  if(match){
    const book=getBook(match[1],books),a=Number(match[2]),av=Number(match[3]),
      b=Number(match[5]),bv=Number(match[6]);
    if(!book||a>b||a===b||core.verseCount(verseIndex,book.id,a)<av||
       core.verseCount(verseIndex,book.id,b)<bv)return null;
    return {scope:'cross_chapter_passage',bookId:book.id,startChapter:a,
      endChapter:b,startVerse:av,endVerse:bv,partialVerse:Boolean(match[4]||match[7])};
  }
  match=value.match(/^(.+?)\s+(\d{1,3})\s*-\s*(\d{1,3})$/);
  if(match){
    const book=getBook(match[1],books),a=Number(match[2]),b=Number(match[3]);
    if(!book||a>=b||b>book.chapters)return null;
    return {scope:'chapter_range',bookId:book.id,startChapter:a,endChapter:b,
      startVerse:null,endVerse:null,partialVerse:false};
  }
  const normalized=value.replace(/(\d)([a-d])(?=\s*(?:-|$))/gi,'$1');
  const parsed=core.parseReference(normalized,books,verseIndex);
  if(parsed.error)return null;
  return {scope:parsed.start===null?'chapter':parsed.end!==null&&parsed.start===parsed.end?'verse':'passage',
    bookId:parsed.book.id,startChapter:parsed.chapter,endChapter:parsed.chapter,
    startVerse:parsed.start,endVerse:parsed.end,
    partialVerse:normalized!==value};
}
function validateTarget(target,scope,books,verseIndex){
  const book=books.find(b=>b.id===target.bookId);
  if(!book||!Number.isInteger(target.startChapter)||!Number.isInteger(target.endChapter)||
     target.startChapter<1||target.endChapter>book.chapters||
     target.endChapter<target.startChapter)throw new Error('Destino bíblico inválido: '+JSON.stringify(target));
  if(!['chapter','chapter_range','passage','verse','cross_chapter_passage'].includes(scope))
    throw new Error('Escopo de vínculo inválido: '+scope);
  if(['verse','passage','cross_chapter_passage'].includes(scope)){
    const start=core.verseCount(verseIndex,book.id,target.startChapter);
    const end=core.verseCount(verseIndex,book.id,target.endChapter);
    if(!Number.isInteger(target.startVerse)||!Number.isInteger(target.endVerse)||
       target.startVerse<1||target.endVerse<1||target.startVerse>start||target.endVerse>end||
       (target.startChapter===target.endChapter&&target.startVerse>target.endVerse))
      throw new Error('Intervalo de versículos inválido: '+JSON.stringify(target));
  }else if(target.startVerse!=null||target.endVerse!=null)
    throw new Error('Vínculo de capítulo não pode simular intervalo de versículos.');
}
function chapterNames(target){
  const names=[];
  for(let n=target.startChapter;n<=target.endChapter;n++)names.push(core.referenceKey(target.bookId,n));
  return names;
}
export function buildStudyLinks({theology,publicationControl,verseIndex,month,curation,books=readCatalog()}){
  core.validateVerseIndex(verseIndex,books);
  if(!theology?.chapters||!publicationControl?.chapters||curation?.schemaVersion!==1)
    throw new Error('Matriz, controle público ou curadoria incompatíveis.');
  if(!Array.isArray(curation.observations)||!Array.isArray(curation.lexicalAnchors))
    throw new Error('Listas de curadoria ausentes.');
  const chapters=Object.create(null),links=Object.create(null),dictionary=Object.create(null),
    liturgicalLinks=[],unresolved=[];
  let authored=0;
  for(const book of books)for(let chapter=1;chapter<=book.chapters;chapter++){
    const key=core.referenceKey(book.id,chapter),record=theology.chapters[key],state=record?.cpId&&
      publicationControl.chapters[record.cpId];
    if(!record||state?.publicAuthorized!==true||record.bookId!==book.id||record.chapter!==chapter)
      throw new Error('Capítulo teológico não autorizado ou divergente: '+key);
    chapters[key]={bookId:book.id,chapter,verseCount:core.verseCount(verseIndex,book.id,chapter),
      theologyKey:key,cpId:record.cpId,linkIds:[]};
    authored++;
  }
  if(authored!==1334||Object.keys(theology.chapters).length!==1334)
    throw new Error('Cobertura autoral incompleta.');
  const dictEntries=Object.values(month?.dictionary||{});
  const dictionaryIds=new Set();
  function addLink(item){
    if(links[item.id])throw new Error('Vínculo duplicado: '+item.id);
    validateTarget(item.target,item.scope,books,verseIndex);
    for(const key of chapterNames(item.target)){
      if(!chapters[key])throw new Error('Vínculo fora da matriz: '+key);
      chapters[key].linkIds.push(item.id);
    }
    links[item.id]=item;
  }
  for(const entry of dictEntries){
    if(!entry?.id||!entry.title||dictionaryIds.has(entry.id))throw new Error('Verbete duplicado/inválido.');
    dictionaryIds.add(entry.id);
    dictionary[entry.id]={id:entry.id,title:entry.title,dimension:entry.dimension,
      context:entry.contexto,visualPreparation:entry.espaco,source:entry.source,
      review:entry.review,href:'./dicionario.html#'+encodeURIComponent(entry.id)};
    for(const [i,part] of String(entry.source||'').split(';').entries()){
      const text=part.trim();
      if(!text)continue;
      const target=citation(text,books,verseIndex);
      if(!target){
        // Referências ambíguas, patentes ou documentais não são forçadas a uma passagem.
        if(/^\s*(?:[1-3]\s*)?[\p{L}]+\s+\d/u.test(text)&&
          getBook(text.replace(/\s+\d[\s\S]*$/,''),books))
          unresolved.push({dictionaryId:entry.id,sourceReference:text,reason:'referência não normalizável sem revisão'});
        continue;
      }
      const {scope,partialVerse,...normalizedTarget}=target;
      addLink({id:'dict:'+entry.id+':'+i,kind:'dictionary-context',
        dictionaryId:entry.id,scope,target:normalizedTarget,
        sourceReference:text,sourceField:sourceMonth+'#dictionary.'+entry.id+'.source',
        evidence:'citação explícita na fonte documental do verbete',
        reviewStatus:'ficha preliminar',partialVerse});
    }
  }
  for(const [date,reading] of Object.entries(month?.readings||{})){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date))continue;
    for(const dictionaryId of reading.dictionaryRefs||[]){
      if(!dictionaryIds.has(dictionaryId))throw new Error('Referência litúrgica órfã: '+dictionaryId+' '+date);
      liturgicalLinks.push({date,dictionaryId,sourceField:sourceMonth+'#readings.'+date+'.dictionaryRefs'});
    }
  }
  for(const observation of curation.observations){
    if(!observation||typeof observation.id!=='string'||!observation.id.startsWith('obs:')||
       typeof observation.title!=='string'||!observation.title.trim()||
       typeof observation.content!=='string'||!observation.content.trim()||
       typeof observation.provenance!=='string'||!observation.provenance.trim()||
       observation.reviewStatus!=='verificado')throw new Error('Observação curada incompleta.');
    addLink({id:observation.id,kind:'observation',scope:observation.scope,
      target:observation.target,title:observation.title,content:observation.content,
      provenance:observation.provenance,reviewStatus:'verificado'});
  }
  for(const anchor of curation.lexicalAnchors){
    if(!anchor||typeof anchor.id!=='string'||typeof anchor.term!=='string'||
       !anchor.term.trim()||typeof anchor.provenance!=='string'||!anchor.provenance.trim()||
       anchor.reviewStatus!=='verificado'||!dictionaryIds.has(anchor.dictionaryId)||
       !Number.isInteger(anchor.chapter)||!Number.isInteger(anchor.verse))
      throw new Error('Âncora lexical não verificada.');
    const count=core.verseCount(verseIndex,anchor.bookId,anchor.chapter);
    if(!count||anchor.verse<1||anchor.verse>count)throw new Error('Versículo lexical não localizado.');
  }
  const counts={books:books.length,chapters:authored,verses:verseIndex.counts.verses,
    dictionaryEntries:dictEntries.length,
    contextualDictionaryLinks:Object.values(links).filter(l=>l.kind==='dictionary-context').length,
    liturgicalDictionaryLinks:liturgicalLinks.length,
    curatedObservations:curation.observations.length,
    verifiedLexicalAnchors:curation.lexicalAnchors.length,
    unresolvedSourceReferences:unresolved.length};
  return {schemaVersion:1,scopePolicy:'capitulo-nao-equivale-a-interpretacao-de-um-versiculo',
    chapterDataset:'teologia-autoral-1.5',
    counts,chapters,links,dictionary,liturgicalLinks,
    lexicalAnchors:curation.lexicalAnchors,unresolved};
}
export {citation,validateTarget};
export function fromRepository(publicTheology,publicControl,verseIndex){
  return buildStudyLinks({theology:publicTheology,publicationControl:publicControl,verseIndex,
    month:parseFrozenMonth(read(sourceMonth)),
    curation:JSON.parse(read('data/vinculos/curadoria.json'))});
}
