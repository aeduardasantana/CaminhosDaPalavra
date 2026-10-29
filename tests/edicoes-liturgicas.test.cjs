/* CNBB e Ave-Maria nunca misturam conteúdos; salmo é fixo CNBB. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const scope={window:{}};
for(const path of ['liturgia-ave-maria-acervo.js','liturgia-edicoes.js'])
 vm.runInNewContext(fs.readFileSync(path,'utf8'),scope,{filename:path});
const ed=scope.window.LCE_EDICOES;
const passages=[
 {item:'primeira-leitura',data:'2025-11-05',referencia:'Rm 13,8-10'},
 {item:'segunda-leitura',data:'2025-11-30',referencia:'Rm 13,11-14a'},
 {item:'evangelho',data:'2025-11-05',referencia:'Lc 14,25-33'},
 {item:'salmo',data:'2025-11-05',referencia:'Sl 111(112),1-2.4-5.9 (R. 5a)'}
];
assert.equal(passages.map(p=>ed.editionFor(p.item,'AVM')).join(','),'AVM,AVM,AVM,CNBB');
assert.equal(passages.map(p=>ed.editionFor(p.item,'CNBB')).join(','),'CNBB,CNBB,CNBB,CNBB');
assert.equal(ed.aveReadings(passages[0]).length,0);
const example={id:'avm-fixture',edition:'AVM',kind:'primeira-leitura',reference:'Rm 13,8-10',
 text:'Texto fictício criado apenas para testar a arquitetura sem importar conteúdo de Bíblia.',
 gloss:{textId:'avm-fixture',segments:[{text:'TESTE / GLOSA'}],status:'PRELIMINAR'}};
const corpus={edition:'AVM',texts:{'avm-fixture':example},
 dates:{'2025-11-05':{'primeira-leitura':['avm-fixture']}}};
assert.equal(ed.aveReadings(passages[0],corpus).length,1);
assert.equal(ed.aveReadings(passages[2],corpus).length,0);
assert.equal(ed.aveReadings(passages[0],{...corpus,texts:{'avm-fixture':{...example,edition:'CNBB'}}}).length,0);
assert.equal(ed.aveReadings(passages[0],{...corpus,texts:{'avm-fixture':{...example,reference:'Rm 13,1-5'}}}).length,0);
const html=fs.readFileSync('index.html','utf8'),app=fs.readFileSync('app.js','utf8');
assert.ok(html.includes('value="CNBB" checked'));
assert.ok(html.includes('value="AVM"'));
assert.ok(html.includes('O salmo responsorial permanece CNBB'));
assert.ok(html.indexOf('liturgia-ave-maria-acervo.js')<html.indexOf('liturgia-edicoes.js'));
assert.ok(html.indexOf('liturgia-edicoes.js')<html.indexOf('./app.js?v='));
assert.ok(app.includes('LCE_EDICOES.apply(entry,card,selectedLiturgyEdition())'));
assert.ok(app.includes("els.editionChoices.forEach(choice=>choice.addEventListener('change'"));
assert.ok(app.includes("same?.querySelector('.accordion-trigger')?.click()"));
const impl=fs.readFileSync('liturgia-edicoes.js','utf8');
assert.ok(impl.includes('record.gloss?.textId!==record.id'));
assert.ok(impl.includes('unavailable(text,gloss,entry)'));
assert.ok(impl.includes('if(oldNotes)oldNotes.hidden=true'));
assert.ok(impl.includes('if(oldSource)oldSource.hidden=true'));
const real=fs.readFileSync('liturgia-br-acervo.js','utf8');
assert.ok(real.includes('window.LCE_BR_ACERVO'));
// Exercitar o renderizador, não apenas o nome das funções.
class FakeElement {
  constructor(tag='div'){this.tagName=tag;this.children=[];this.dataset={};this.textContent='';this.hidden=false;}
  replaceChildren(...args){this.children=args;}
  append(...args){this.children.push(...args);}
}
const view={};
const selectors=['.original-text','.glosa-text','.original-pane .pane-label','.glosa-pane .pane-label',
 '.liturgy-study-notes','.original-source-link','.reading-source-note','.status-pill'];
for(const name of selectors)view[name]=new FakeElement();
const card={dataset:{},querySelector:name=>view[name]||null};
const browserContext={window:{LCE_AVE_MARIA_ACERVO:{edition:'AVM',texts:{},dates:{}}},
 document:{createElement:tag=>new FakeElement(tag)}};
vm.runInNewContext(fs.readFileSync('liturgia-edicoes.js','utf8'),browserContext);
browserContext.window.LCE_EDICOES.apply({...passages[0],editorialStudy:true},card,'AVM');
assert.equal(card.dataset.edition,'AVM');
assert.equal(card.dataset.editorialStudy,'true');
assert.equal(card.dataset.completeText,'false');
assert.ok(view['.original-text'].children[0].textContent.includes('incorporação integral ao acervo estiver pendente'));
assert.ok(view['.glosa-text'].children[0].textContent.includes('ainda não elaborada'));
assert.equal(view['.liturgy-study-notes'].hidden,true);
browserContext.window.LCE_AVE_MARIA_ACERVO=corpus;
browserContext.window.LCE_EDICOES.apply({...passages[0],editorialStudy:true},card,'AVM');
assert.equal(view['.original-text'].children[0].textContent,example.text);
assert.equal(view['.glosa-text'].children[0].children.at(-1).textContent,'TESTE / GLOSA');
let cnbbCalls=0;
browserContext.window.LCE_FONTE_LOCAL={loadForEntry:()=>{cnbbCalls++}};
browserContext.window.LCE_EDICOES.apply({...passages[3],editorialStudy:true},card,'AVM');
assert.equal(card.dataset.edition,'CNBB');
assert.equal(cnbbCalls,1,'O salmo continua CNBB, inclusive quando Ave-Maria foi escolhida');
assert.equal(view['.original-pane .pane-label'].textContent,'Salmo · CNBB (em cotejo)');
console.log('OK: alternância real de textos e glosas, salmo fixo e lacuna Ave-Maria independente.');

