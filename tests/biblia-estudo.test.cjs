const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const core=require(path.join(root,'biblia-estudo-core.js'));
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'bible-data.js'),'utf8'),scope);
const bible=scope.window.LCE_BIBLE;
const books=core.catalog(bible);
const verseIndex=JSON.parse(execFileSync(process.execPath,
  ['scripts/gerar-indice-versiculos.mjs','--json'],{cwd:root,encoding:'utf8'}));
assert.equal(core.validateVerseIndex(verseIndex,books),true);
const total=books.reduce((sum,book)=>sum+book.chapters,0);
assert.equal(books.length,73,'73 livros obrigatórios');
assert.equal(total,1334,'1.334 capítulos esperados');
assert.equal(books.filter(book=>book.testament==='AT').length,46);
assert.equal(books.filter(book=>book.testament==='NT').length,27);
assert.equal(core.GROUPS.length,9);
assert.equal(new Set(books.map(book=>book.id)).size,73);
assert.equal(core.GROUPS.reduce((n,g)=>n+g.ids.length,0),73);
assert.deepEqual(books.map(book=>book.canonOrder),Array.from({length:73},(_,i)=>i+1));
assert.equal(core.EDITION.id,'AVM-ESTUDOS-2');

function ref(input,id,ch,start=null,end=null){
  const got=core.parseReference(input,books,verseIndex);
  assert.equal(got.error,undefined,input+' => '+got.error);
  assert.equal(got.book.id,id,input);
  assert.equal(got.chapter,ch,input);
  assert.equal(got.start,start,input);
  assert.equal(got.end,end,input);
}
ref('Gn 1','GEN',1);
ref('Jo 3,16-18','JHN',3,16,18);
ref('Jó 1,1','JOB',1,1,1);
ref('1Cor 13,4-7','1CO',13,4,7);
ref('1 Coríntios 13,4','1CO',13,4,4);
ref('Tobias 4','TOB',4);
ref('Salmos 150','PSA',150);
ref('Mt 28','MAT',28);
assert.match(core.parseReference('Jn 444',books,verseIndex).error,/Capítulo/);
assert.match(core.parseReference('Jo 3,18-16',books,verseIndex).error,/Intervalo/);
assert.match(core.parseReference('Não é livro 1',books,verseIndex).error,/Livro/);
assert.match(core.parseReference('Gn 1,1-200',books,verseIndex).error,/Intervalo/);
assert.match(core.parseReference('Jo 3,17-17',books,verseIndex).key,/JHN:3:17/);
assert.equal(core.verseCount(verseIndex,'GEN',1),31,'Gênesis 1 = 31 versículos');
assert.equal(core.verseCount(verseIndex,'GEN',2),25,'Gênesis 2 = 25 versículos');
ref('Gn 1,31','GEN',1,31,31);
assert.match(core.parseReference('Gn 1,32',books,verseIndex).error,/1 a 31/);
assert.match(core.parseReference('Gn 2,26',books,verseIndex).error,/1 a 25/);
assert.match(core.parseReference('Jo 3,16',books).error,/Índice/,'falha fechada sem índice');
assert.equal(core.parseReference('Gn 1',books).chapter,1,'capítulos continuam navegáveis sem índice');
assert.match(core.validateVerseRange(verseIndex,'GEN',1,20,32),/1 a 31/);
assert.equal(core.validateVerseRange(verseIndex,'GEN',1,30,31),null);
assert.equal(core.validateVerseRange(verseIndex,'GEN',1,31,30).includes('inválido'),true);
assert.throws(()=>core.validateVerseIndex({...verseIndex,counts:{...verseIndex.counts,verses:1}},books));

const plan=core.planDays(bible);
assert.equal(plan.days.length,365);
assert.equal(plan.index.size,1334);
assert.equal(plan.index.get('PSA:1'),1);
assert.equal(plan.index.get('PSA:150'),150);
assert.equal(plan.index.get('1JN:1'),1,'NT inicia o plano');
for (const day of plan.days)assert.ok(day.length>=3 && day.length<=5,'3 a 5 capítulos por dia');
for (const book of books)for(let n=1;n<=book.chapters;n++)assert.ok(plan.index.has(book.id+':'+n));

const joao=books.find(b=>b.id==='JHN');
assert.ok(core.matchesChapterReference('Jo 3,16-18',joao,3,books));
assert.ok(!core.matchesChapterReference('Jó 3,16-18',joao,3,books));
assert.ok(!core.matchesChapterReference('Jo 4,16-18',joao,3,books));
const glosas=core.collectGlosas(joao,3,books,{'Jo 3,16-18':'TEXTO AUTORAL'},
  {A:{'A|ADVENTO|1º Domingo|evangelho|Jo 3,16-18':'VERSÃO A'}});
assert.equal(glosas.length,2);
assert.equal(glosas[0].version,'glosa-base');
assert.equal(glosas[1].version,'contextual-A');
assert.ok(glosas.every(item=>item.status==='preliminar'));
assert.ok(glosas.every(item=>item.source.includes('Ave-Maria')));

const payload={editionId:core.EDITION.id,authorizedForWeb:true,permissionReference:'TERMO-EXEMPLO',
  chapters:{'JHN:3':{verses:[{verse:16,text:'Exemplo autoral permitido',sourcePage:120,publicAuthorized:true},
    {verse:17,text:'Não autorizado',sourcePage:120,publicAuthorized:false},
    {verse:18,text:'Página não registrada',publicAuthorized:true}]}}};
assert.deepEqual(core.authorizedVerses(null,'JHN',3,verseIndex),[]);
assert.deepEqual(core.authorizedVerses({...payload,authorizedForWeb:false},'JHN',3,verseIndex),[]);
assert.deepEqual(core.authorizedVerses({...payload,permissionReference:''},'JHN',3,verseIndex),[]);
assert.deepEqual(core.authorizedVerses({...payload,editionId:'CNBB'},'JHN',3,verseIndex),[]);
assert.equal(core.authorizedVerses(payload,'JHN',3,verseIndex).length,1,'somente versículos explicitamente autorizados');

const html=fs.readFileSync(path.join(root,'biblia-estudo.html'),'utf8');
const script=fs.readFileSync(path.join(root,'biblia-estudo.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'biblia-estudo.css'),'utf8');
for(const id of ['studyBookSelect','studyChapterSelect','studyVerseStart','studyVerseEnd','studyPersonalNote',
  'studyOpenSource','studyPlanComplete','studyGlosaContent','studyTextQuery','studyTextResults','studyBookmark']){
  assert.ok(html.includes('id="'+id+'"'),'Controle obrigatório ausente '+id);
}
assert.ok(html.includes('biblia-estudo-core.js'));
assert.ok(html.includes('verse-index.js'));
assert.ok(script.includes('C.validateVerseRange'));
assert.ok(script.includes('C.validateVerseIndex'));
assert.ok(!html.includes('max="176"'));
assert.ok(html.includes('studyReadAloud'));
assert.ok(html.includes('studyStopAloud'));
assert.ok(!html.includes('https://www.bible.com/pt/versions/4542'));
assert.ok(!script.includes('externalUrl('));
assert.ok(script.includes('speechSynthesis'));
assert.ok(script.includes("fetch(url)"),'Leitura deve buscar texto do próprio domínio.');
assert.ok(script.includes("loadPublicBook"),'Leitor interno deve carregar os 73 arquivos.');
assert.ok(!script.includes('CDP_AVM_PUBLIC_DATA'),'Leitura não depende mais de payload parcial.');
assert.ok(html.includes('studyPrevChapter'));
assert.ok(html.includes('studyNextChapter'));
assert.ok(!html.includes('Indisponível sem texto autorizado'));
assert.ok(!html.includes('disabled>Buscar texto</button>'));
assert.ok(index.includes('href="./acessibilidade.html"'));
assert.ok(!index.includes('https://www.bible.com/pt/versions/4542'));
assert.ok(app.includes('return studyChapterUrl(bookId,chapter);'));
assert.ok(!app.includes('record.bibleUrl || chapterUrl'));

assert.ok(html.includes('id="studyTheologySection"'),'A área do estudo não está no leitor.');
assert.ok(html.includes('id="studyTheologyFields"'));
assert.ok(html.includes('id="studyTheologyTrace"'));
assert.ok(html.includes('href="#studyTheologySection"'),'Navegação ao estudo não existe.');
assert.ok(html.includes('theology-data.js'),'A matriz autoral pública não foi carregada.');
assert.ok(html.includes('publication-control.js'),'A autorização do conteúdo não foi carregada.');
assert.ok(script.includes('renderText();renderTheology();'),'O estudo precisa acompanhar o capítulo selecionado.');
assert.ok(script.includes('control?.publicAuthorized!==true'),'O painel deve respeitar a autorização da titular.');
assert.ok(script.includes("n+' · '+total+' versículos"),'O seletor deve indicar a contagem por capítulo.');
for(const field of [
  'record.cpId','record.testament','record.literaryGroup','record.book','record.chapter',
  'record.reference','record.bibleUrl','record.salvationHistory','record.narrativePeriod',
  'record.mainTheme','record.secondaryThemes','record.covenant','record.rosary?.mystery',
  'record.christRelation','record.biblicalConnections','record.connectionClass',
  'record.cic?.references','record.cic?.url','record.piusX?.references',
  'record.matrixStatus','record.matrixVersion','record.sourceType','record.sourceScope',
  'record.confidence','record.rosary?.nature','record.themeScope',
  'record.secondaryThemesScope','record.cic?.scope','record.piusX?.scope'
]){
  assert.ok(script.includes(field),'Campo da matriz não representado na página: '+field);
}
assert.ok(script.includes('C.parseReference(reference,books,verseIndex)'),'Conexões bíblicas precisam funcionar dentro do leitor.');
assert.ok(!script.includes('renderTheology()||'),'Estudo não pode ser omitido por condições de navegação.');
const sourceMatrix={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'theology-data.js'),'utf8'),sourceMatrix);
assert.equal(Object.keys(sourceMatrix.window.CDP_THEOLOGY.chapters).length,1334);
assert.equal(sourceMatrix.window.CDP_THEOLOGY.chapters['GEN:1'].mainTheme,'Criação');
assert.match(sourceMatrix.window.CDP_THEOLOGY.chapters['GEN:13'].confidence,/Pendente/);


for(const id of [
  'studyFootnotes','studyFootnotesStatus','studyFootnotesList','studyChapterReferences',
  'studyFootnoteDialog','studyFootnoteDialogTitle','studyFootnoteDialogScope',
  'studyFootnoteDialogBody','studyFootnoteDialogClose'
]){
  assert.ok(html.includes('id="'+id+'"'),'Rodapé ou diálogo ausente: '+id);
}
assert.ok(html.includes('vinculos-estudo-core.js'),'Núcleo de vínculos não carregado.');
assert.ok(script.includes('dados/vinculos-estudo.json'),'Índice documental não carregado.');
assert.ok(script.includes('linkCore.readingFootnotes('),'Versículos devem utilizar marcadores da fonte.');
assert.ok(script.includes("plan.markers[item.verse]"),'Marcador não ancorado no número do versículo.');
assert.ok(script.includes('study-footnote-marker-verse'));
assert.ok(script.includes('study-footnote-marker-passage'));
assert.ok(script.includes('renderFootnotes(plan,linksResult.index)'));
assert.ok(script.includes('study-footnote-list'));
assert.ok(script.includes('study-footnotes-general'));
assert.ok(script.includes('showModal'),'Painel de leitura deve ter abertura acessível.');
assert.ok(script.includes("link.scope==='verse'"),'Escopo pontual deve ser distinguido da passagem.');
assert.ok(script.includes('closeFootnote();'),'A mudança de leitura deve fechar a nota aberta.');
assert.ok(css.includes('.study-footnote-dialog::backdrop'));
assert.ok(css.includes('@media(max-width:790px)'),'Painel móvel não previsto.');


const inlineDocIds=['studyCicPane','studyPiusPane','studyCicReferences','studyCicScope',
  'studyPiusSummary','studyPiusReferences','studyPiusScope','studyThemeTags'];
for(const id of inlineDocIds)
  assert.ok(html.includes('id="'+id+'"'),'Consulta doutrinal na página ausente: '+id);
assert.ok(html.indexOf('id="studyTextPane"')<html.indexOf('id="studyCicPane"'),
  'A Bíblia deve anteceder o Catecismo no celular.');
assert.ok(html.indexOf('id="studyCicPane"')<html.indexOf('id="studyPiusPane"'),
  'O Catecismo e São Pio X precisam de áreas distintas.');
assert.ok(html.indexOf('id="studyPiusPane"')<html.indexOf('id="studyTheologySection"'),
  'Cartões teológicos não devem anteceder a leitura.');
assert.ok(html.includes('href="#studyCicPane"')&&html.includes('href="#studyPiusPane"'),
  'O acesso aos catecismos deve permanecer dentro da página.');
assert.ok(script.includes('renderDoctrine();'),'As referências devem acompanhar a passagem selecionada.');
assert.ok(script.includes('ui.cicReferences.textContent='));
assert.ok(script.includes('ui.piusReferences.textContent='));
assert.ok(!html.includes('id="studyEditorialContent"'),'Textos técnicos vazios não são necessários na leitura.');
assert.ok(!script.includes('renderEditorial();'),'Não renderizar introdução editorial sem conteúdo.');
assert.ok(html.includes('id="studyCatalogDisclosure"'),'Catálogo móvel precisa ser recolhível.');
assert.ok(script.includes('catalogDisclosure.open=false'),'Catálogo deve iniciar fechado no celular.');
assert.ok(css.includes('.study-layout>.study-main{order:1}'),'No celular a leitura deve aparecer antes do catálogo.');
const menu=fs.readFileSync(path.join(root,'site-menu.js'),'utf8');
assert.ok(menu.includes("./biblia-estudo.html#studyCicPane"));
assert.ok(menu.includes("./biblia-estudo.html#studyPiusPane"));

assert.ok(html.includes('biblia-estudo.js'));
assert.ok(html.includes('glosa-gospels.js'));
assert.ok(html.includes('site-menu.js'));
assert.ok(html.includes('name="viewport"'));
assert.ok(css.includes('@media(max-width:480px)'),'Layout pequeno não contemplado');
assert.ok(index.includes('href="./biblia-estudo.html"'));
assert.ok(index.includes('verse-index.js?v=20261107-17b'));
assert.ok(index.includes('biblia-estudo-core.js?v=20261107-17b'));
assert.ok(app.includes('parseDetailedBibleReference(query,type)'));
assert.ok(app.includes('verseRange'));
assert.ok(app.includes('core.parseReference(q,catalog,window.CDP_VERSE_INDEX)'));
assert.ok(app.includes('studyChapterUrl(step.bookId, step.chapter)'),'Plano não conecta estudo');
assert.match(script,/PLAN_KEY\s*=\s*['"]lce-bible365-plan-v1['"]/,'Plano deve compartilhar armazenamento');
assert.ok(script.includes('textContent'),'Campos devem usar texto e não HTML da pessoa usuária');
assert.ok(!html.includes('liturgia-br-acervo.js'),'Texto CNBB não deve ser carregado como texto Ave-Maria');
assert.ok(!html.includes('liturgia-ave-maria-acervo.js'),'Acervo litúrgico não é a Bíblia para estudo');
console.log('Bíblia para estudo: catálogo, referência, plano, controle de publicação e contratos de interface aprovados.');
