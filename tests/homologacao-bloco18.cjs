'use strict';
/* BLOCO 18 — homologação isolada; somente contagens e metadados são registrados.
 * Não registrar, exportar ou reproduzir os versículos do acervo protegido. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {chromium}=require('playwright-core');
const AxeBuilder=require('@axe-core/playwright').default;
const root=path.resolve(__dirname,'..');
const origin=process.env.B18_BASE_URL||'http://127.0.0.1:8765';
const startedAt=new Date().toISOString();
const results=[],metrics=[],links=[];
const pass=(id,detail)=>results.push({id,status:'APROVADO',detail});
const fail=(id,detail,critical=false)=>results.push({id,status:critical?'BLOQUEANTE':'FALHA',detail});
const warn=(id,detail)=>results.push({id,status:'PENDENTE',detail});
const judge=(id,condition,detail,critical=false)=>condition?pass(id,detail):fail(id,detail,critical);
const parseAssignment=(file,name)=>{
  const str=fs.readFileSync(path.join(root,file),'utf8');
  const found=str.match(new RegExp('window\\.'+name+'\\s*=\\s*([\\s\\S]*);\\s*$'));
  if(!found)throw Error('Objeto '+name+' não encontrado');
  return JSON.parse(found[1]);
};
async function testStructure(){
  const dist=path.join(root,'dist');
  const index=parseAssignment('dist/verse-index.js','CDP_VERSE_INDEX');
  const bible={books:index.books,counts:index.counts};
  judge('INTEGRIDADE-73-1334-35450',
    index.counts.books===73&&index.counts.chapters===1334&&index.counts.verses===35450,
    'Índice bíblico: '+JSON.stringify(index.counts),true);
  let chapterCount=0,verseCount=0,bookCount=0;
  for(const [id,chapters] of Object.entries(bible.books)){
    bookCount++;
    const file=path.join(dist,'dados','biblia-ave-maria',id+'.json');
    if(!fs.existsSync(file)){fail('INTEGRIDADE-ARQUIVO-'+id,'Arquivo ausente para '+id,true);continue;}
    const data=JSON.parse(fs.readFileSync(file,'utf8'));
    chapterCount+=chapters.length;
    judge('INTEGRIDADE-'+id, data.bookId===id && data.chapters.length===chapters.length &&
      chapters.every((count,i)=>count===data.chapters[i]?.verses?.length &&
        data.chapters[i].verses.every((v,k)=>v.verse===k+1&&typeof v.text==='string'&&v.text.trim().length>0)),
      id+': '+chapters.length+' capítulos');
    verseCount+=chapters.reduce((sum,count)=>sum+count,0);
  }
  judge('INTEGRIDADE-COBERTURA',bookCount===73&&chapterCount===1334&&verseCount===35450,
    'Cobertura dos arquivos: '+bookCount+' livros, '+chapterCount+' capítulos, '+verseCount+' versículos',true);
  const theology=parseAssignment('dist/theology-data.js','CDP_THEOLOGY');
  const control=parseAssignment('dist/publication-control.js','CDP_PUBLICATION_CONTROL');
  const keys=Object.keys(theology.chapters||{});
  judge('TEOLOGIA-REFERENCIAS', keys.length===1334 &&
    keys.every(key=>{
      const r=theology.chapters[key];
      return !!r.cpId&&r.bookId&&Number.isInteger(r.chapter)&&control.chapters?.[r.cpId] &&
        key===r.bookId+':'+r.chapter;
    }), '1334 capítulos teológicos vinculados ao livro, capítulo e controle editorial',true);
  judge('TEOLOGIA-CONTROLE',control.failClosed===true,
    'Controle de publicação em modo fail-closed',true);
  const privateControl=parseAssignment('publication-control.js','CDP_PUBLICATION_CONTROL');
  const fullTextIsPublished=Object.keys(index.books).some(id=>
    fs.existsSync(path.join(dist,'dados','biblia-ave-maria',id+'.json')));
  const licenseRecorded=privateControl.ownerAuthorization?.licensedBibleTextAuthorized===true;
  judge('DIREITOS-REPRODUCAO',!fullTextIsPublished||licenseRecorded,
    'O pacote possui arquivos com texto integral da tradução Ave-Maria, mas o registro editorial licensedBibleTextAuthorized='+
    String(privateControl.ownerAuthorization?.licensedBibleTextAuthorized)+
    '. Exige comprovação de autorização antes de homologar a distribuição pública.',true);
  const bareIndex=fs.readFileSync(path.join(dist,'verse-index.js'),'utf8');
  judge('DADOS-INDICE-SEM-TEXTO',!bareIndex.includes('"text"')&&!bareIndex.includes('"texto"'),
    'Índice numérico não incorpora redação bíblica');
}
async function verifyLinks(page){
  const hrefs=await page.locator('a[href]').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')).filter(Boolean));
  const unique=[...new Set(hrefs)];
  const checked=new Set();let bad=[];
  for(const href of unique){
    let url;
    try{url=new URL(href,page.url());}catch{bad.push(href+' (URL inválida)');continue;}
    if(url.origin!==origin||!['http:','https:'].includes(url.protocol))continue;
    const target=url.pathname+url.search;
    if(checked.has(target))continue;
    checked.add(target);
    try{
      const resp=await fetch(origin+target,{method:'HEAD',signal:AbortSignal.timeout(5000)});
      if(resp.status>=400)bad.push(target+' (HTTP '+resp.status+')');
    }catch(error){bad.push(target+' ('+error.message.slice(0,60)+')');}
  }
  links.push({pagina:new URL(page.url()).pathname,internos:checked.size,quebrados:bad});
  judge('LINKS-'+new URL(page.url()).pathname, bad.length===0,
    checked.size+' destinos internos verificados; falhas: '+bad.slice(0,15).join('; '));
}
async function exercise(browser,label,width,height){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:width<600,hasTouch:width<600,locale:'pt-BR'});
  const page=await context.newPage();const errors=[];const external=new Set();
  page.on('pageerror',e=>errors.push(String(e.message).slice(0,180)));
  await page.route('**/*',route=>{
    const u=new URL(route.request().url());
    if(u.origin===origin)return route.continue();
    external.add(u.host);return route.abort();
  });
  try{
    const start=Date.now();
    const response=await page.goto(origin+'/biblia-estudo.html',{waitUntil:'domcontentloaded',timeout:30000});
    judge('HTTP-BIBLIA-'+label,response?.status()===200,'Leitor bíblico HTTP '+response?.status());
    await page.waitForFunction(()=>window.CDP_VERSE_INDEX?.counts?.verses===35450 &&
      document.querySelector('#studyBookSelect')?.options?.length===73,{timeout:20000});
    await page.waitForFunction(()=>document.querySelectorAll('#studyVerseText .study-verse-row').length===31,{timeout:20000});
    judge('LEITURA-INICIAL-'+label,await page.locator('#studyVerseText .study-verse-row').count()===31,
      'Gênesis 1: 31 linhas versiculares no leitor');
    const overflow=await page.evaluate(()=>({body:document.body.scrollWidth,doc:document.documentElement.scrollWidth,viewport:innerWidth}));
    judge('RESPONSIVIDADE-'+label,overflow.doc<=overflow.viewport+2,
      'Área horizontal (px): documento '+overflow.doc+' / viewport '+overflow.viewport);
    await page.locator('#studyNextChapter').click();
    await page.waitForFunction(()=>document.querySelectorAll('#studyVerseText .study-verse-row').length===25,{timeout:12000});
    judge('NAVEGACAO-PROXIMO-'+label,await page.locator('#studyChapterSelect').inputValue()==='2',
      'Capítulo seguinte: Gênesis 2 com 25 versículos');
    await page.locator('#studyReferenceInput').fill('Jo 3,16-18');
    await page.locator('#studyReferenceForm button[type=submit]').click();
    await page.waitForFunction(()=>document.querySelectorAll('#studyVerseText .study-verse-row').length===3,{timeout:12000});
    judge('BUSCA-REFERENCIA-'+label,await page.locator('#studyBookSelect').inputValue()==='JHN',
      'João 3,16–18: três versículos encontrados, livro JHN');
    const previous=await page.locator('#studyCurrentReference').innerText();
    await page.locator('#studyReferenceInput').fill('Gn 1,32');
    await page.locator('#studyReferenceForm button[type=submit]').click();
    const feedback=await page.locator('#studyFeedback').innerText();
    judge('LIMITE-VERSICULO-'+label,feedback.includes('1 a 31') &&
      (await page.locator('#studyCurrentReference').innerText())===previous,
      'Versículo inexistente recusado sem trocar a passagem');
    await page.locator('#studyPersonalNote').fill('Homologação temporária do BLOCO 18');
    await page.locator('#studySaveNote').click();
    const noteMessage=await page.locator('#studyNoteStatus').innerText();
    judge('ANOTACAO-SALVAR-'+label,noteMessage.includes('salva'),
      'Anotação vinculada à passagem atual');
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#studyPersonalNote')?.value.includes('Homologação'),{timeout:15000});
    judge('ANOTACAO-PERSISTENCIA-'+label,
      (await page.locator('#studyPersonalNote').inputValue()).includes('Homologação'),
      'Persistência da anotação após recarregar a página');
    await page.locator('#studyPersonalNote').fill('');
    await page.locator('#studySaveNote').click();
    const doc=await page.evaluate(()=>({
      lang:document.documentElement.lang,main:document.querySelectorAll('main').length,
      missingLabels:[...document.querySelectorAll('input,select,textarea')].filter(x=>!x.labels?.length&&!x.getAttribute('aria-label')).length,
      nav:performance.getEntriesByType('navigation').map(n=>({domContentLoadedMs:Math.round(n.domContentLoadedEventEnd-n.startTime),loadMs:Math.round(n.loadEventEnd-n.startTime)})),
      resources:performance.getEntriesByType('resource').length,
      bytes:Math.round(performance.getEntriesByType('resource').reduce((sum,r)=>sum+(r.decodedBodySize||0),0)/1024)
    }));
    judge('ACESSIBILIDADE-SEMANTICA-'+label,doc.lang==='pt-BR'&&doc.main===1&&doc.missingLabels===0,
      'lang='+doc.lang+', main='+doc.main+', campos sem rótulo='+doc.missingLabels);
    const accessibility=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    const violations=accessibility.violations.map(v=>({id:v.id,impact:v.impact,ocorrencias:v.nodes.length,alvos:v.nodes.slice(0,3).map(n=>n.target.join(' > '))}));
    judge('ACESSIBILIDADE-AXE-'+label,violations.length===0,
      violations.length+' regras infringidas: '+JSON.stringify(violations));
    const focus=await page.keyboard.press('Tab').then(()=>page.evaluate(()=>document.activeElement?.tagName));
    judge('ACESSIBILIDADE-TECLADO-'+label,focus!==null&&focus!=='BODY',
      'Foco via Tab em '+focus);
    await verifyLinks(page);
    metrics.push({viewport:label,width,height,totalMs:Date.now()-start,doc,violations,externalResourcesBlocked:[...external]});
    judge('JAVASCRIPT-'+label,errors.length===0,
      errors.length+' exceções não tratadas: '+errors.slice(0,5).join('; '));
  }catch(error){fail('FLUXO-'+label,String(error.stack||error).slice(0,700),true);}
  finally{await context.close();}
}
async function auditHome(browser){
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message.slice(0,160)));
  await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
  try{
    const response=await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded',timeout:30000});
    judge('HOME-HTTP',response?.status()===200,'Página inicial HTTP '+response?.status());
    judge('HOME-BIBLIA-ACESSO',(await page.locator('a[href*="biblia-estudo.html"]').count())>0,
      'Página inicial possui acesso à experiência bíblica');
    await verifyLinks(page);
    judge('HOME-JAVASCRIPT',errors.length===0,errors.slice(0,4).join('; '));
  }catch(e){fail('HOME-TESTE',String(e).slice(0,250));}
  finally{await page.close();}
}
async function run(){
  try{await testStructure();}catch(error){fail('INTEGRIDADE-BASE',String(error.stack||error).slice(0,500),true);}
  let browser;
  try{
    browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
    for(const [label,w,h] of [['MOBILE-360',360,800],['MOBILE-390',390,844],['TABLET-768',768,1024],['DESKTOP-1440',1440,900]]){
      await exercise(browser,label,w,h);
    }
    await auditHome(browser);
  }catch(error){fail('NAVEGADOR-EXECUCAO',String(error.stack||error).slice(0,650),true);}
  finally{if(browser)await browser.close();}
  const counts=results.reduce((m,r)=>(m[r.status]=(m[r.status]||0)+1,m),{});
  const report={bloco:'18',ambiente:'Pacote dist servido localmente no runner; não substitui homologação visual humana do site Locaweb',startedAt,finishedAt:new Date().toISOString(),counts,results,metrics,links,conclusao:(counts.BLOQUEANTE||counts.FALHA)?'NAO HOMOLOGADO':'HOMOLOGADO TECNICAMENTE COM RESSALVAS'};
  const folder=path.join(root,'reports','bloco18');fs.mkdirSync(folder,{recursive:true});
  fs.writeFileSync(path.join(folder,'homologacao.json'),JSON.stringify(report,null,2)+'\n');
  console.log('BLOCO 18 — '+report.conclusao+'; '+JSON.stringify(counts));
  for(const r of results.filter(x=>x.status!=='APROVADO'))console.log(r.status+' | '+r.id+' | '+r.detail.slice(0,400));
  for(const m of metrics)console.log('METRICA | '+m.viewport+' | '+JSON.stringify(m.doc)+' | totalMs='+m.totalMs);
  for(const l of links)console.log('LINKS | '+l.pagina+' | internos='+l.internos+' | quebrados='+l.quebrados.length);
  if(counts.BLOQUEANTE||counts.FALHA)process.exitCode=1;
}
run().catch(error=>{console.error('B18 falhou sem relatório:',error);process.exitCode=1;});
