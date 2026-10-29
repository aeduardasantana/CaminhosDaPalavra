const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const core=require(path.join(root,'biblia-estudo-core.js'));
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'bible-data.js'),'utf8'),scope);
const bible=scope.window.LCE_BIBLE;
const books=core.catalog(bible);
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
  const got=core.parseReference(input,books);
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
assert.match(core.parseReference('Jn 444',books).error,/Capítulo/);
assert.match(core.parseReference('Jo 3,18-16',books).error,/Intervalo/);
assert.match(core.parseReference('Não é livro 1',books).error,/Livro/);
assert.match(core.parseReference('Gn 1,1-200',books).error,/Intervalo/);
assert.match(core.parseReference('Jo 3,17-17',books).key,/JHN:3:17/);

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
assert.deepEqual(core.authorizedVerses(null,'JHN',3),[]);
assert.deepEqual(core.authorizedVerses({...payload,authorizedForWeb:false},'JHN',3),[]);
assert.deepEqual(core.authorizedVerses({...payload,permissionReference:''},'JHN',3),[]);
assert.deepEqual(core.authorizedVerses({...payload,editionId:'CNBB'},'JHN',3),[]);
assert.equal(core.authorizedVerses(payload,'JHN',3).length,1,'somente versículos explicitamente autorizados');

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
assert.ok(html.includes('biblia-estudo.js'));
assert.ok(html.includes('glosa-gospels.js'));
assert.ok(html.includes('site-menu.js'));
assert.ok(html.includes('name="viewport"'));
assert.ok(css.includes('@media(max-width:480px)'),'Layout pequeno não contemplado');
assert.ok(index.includes('href="./biblia-estudo.html"'));
assert.ok(app.includes('studyChapterUrl(step.bookId, step.chapter)'),'Plano não conecta estudo');
assert.match(script,/PLAN_KEY\s*=\s*['"]lce-bible365-plan-v1['"]/,'Plano deve compartilhar armazenamento');
assert.ok(script.includes('textContent'),'Campos devem usar texto e não HTML da pessoa usuária');
assert.ok(!html.includes('liturgia-br-acervo.js'),'Texto CNBB não deve ser carregado como texto Ave-Maria');
assert.ok(!html.includes('liturgia-ave-maria-acervo.js'),'Acervo litúrgico não é a Bíblia para estudo');
console.log('Bíblia para estudo: catálogo, referência, plano, controle de publicação e contratos de interface aprovados.');
