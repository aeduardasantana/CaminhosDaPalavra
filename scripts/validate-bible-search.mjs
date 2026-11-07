import fs from 'node:fs';
import vm from 'node:vm';

function loadWindowAssignment(path){
  const code=fs.readFileSync(path,'utf8');
  const context={window:{}};
  vm.createContext(context);
  vm.runInContext(code,context,{filename:path});
  return context.window;
}

const bible=loadWindowAssignment('bible-data.js').LCE_BIBLE;
const theology=loadWindowAssignment('theology-data.js').CDP_THEOLOGY;
const publication=loadWindowAssignment('publication-control.js').CDP_PUBLICATION_CONTROL;
const app=fs.readFileSync('app.js','utf8');

const errors=[];
const expected=bible.books.reduce((n,b)=>n+b.chapters,0);
const records=Object.values(theology.chapters||{});
const authorized=records.filter(r=>publication.chapters?.[r.cpId]?.publicAuthorized);

if(expected!==1334) errors.push('catálogo bíblico='+expected);
if(records.length!==1334) errors.push('registros teológicos='+records.length);
if(!app.includes('function searchBibleTransversal(')) errors.push('motor de busca transversal ausente');
if(!app.includes('function theologicalMatch(')) errors.push('busca teológica ausente');
if(!app.includes("if (!state.publicAuthorized) return {match:false")) errors.push('busca teológica não está fail-closed');
if(!app.includes("type === 'reference'")) errors.push('filtro livro/capítulo ausente');
for(const field of ["theme","christ","cic","rosary","connections"]){
  if(!app.includes(field+":")) errors.push('campo de busca ausente: '+field);
}
if(!app.includes('parseDetailedBibleReference(query,type)'))errors.push('busca exata de versículos ausente');
if(!app.includes('core.validateVerseIndex(window.CDP_VERSE_INDEX,catalog)'))errors.push('índice de versículos não é validado');
if(!app.includes('window.location.assign(studyChapterUrl(book.id,record.chapter)'))errors.push('link profundo para versículos ausente');
if(!app.includes('renderTheologyCard(book,record.chapter,record)')) errors.push('resultado não navega para capítulo');
if(authorized.length!==(publication.counts?.authorized??authorized.length)) errors.push('contagem de autorizados divergente');

if(errors.length){
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Busca transversal validada:',records.length,'capítulos;',authorized.length,'com conteúdo teológico autorizado.');
