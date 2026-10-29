/* Caminhos da Palavra — Bíblia para estudo (somente metadados e dados autorizados).
 * Glosas preliminares e progresso existentes não são alterados. */
(() => {
  'use strict';
  const C=window.CDP_BIBLE_STUDY_CORE,bible=window.LCE_BIBLE;
  if(!C||!bible){document.querySelector('#studyFeedback').textContent='Catálogo indisponível nesta sessão.';return;}
  let books,plan;
  try{books=C.catalog(bible);plan=C.planDays(bible);}
  catch(error){document.querySelector('#studyFeedback').textContent='Erro de integridade do catálogo: '+error.message;return;}
  const $=id=>document.getElementById(id);
  const ui={
    bookFilter:$('studyBookFilter'),testament:$('studyTestamentFilter'),list:$('studyBookList'),
    book:$('studyBookSelect'),chapter:$('studyChapterSelect'),start:$('studyVerseStart'),end:$('studyVerseEnd'),
    form:$('studyReferenceForm'),query:$('studyReferenceInput'),feedback:$('studyFeedback'),
    selected:$('studyCurrentReference'),edition:$('studyCurrentEdition'),source:$('studyOpenSource'),
    copy:$('studyCopyReference'),bookmark:$('studyBookmark'),bookmarks:$('studyBookmarksList'),
    planDay:$('studyPlanDay'),planText:$('studyPlanText'),planComplete:$('studyPlanComplete'),
    text:$('studyVerseText'),editorial:$('studyEditorialContent'),glosas:$('studyGlosaContent'),
    note:$('studyPersonalNote'),saveNote:$('studySaveNote'),export:$('studyExportNotes'),
    noteStatus:$('studyNoteStatus'),textQuery:$('studyTextQuery'),textButton:$('studyTextButton'),
    textStatus:$('studyTextStatus'),textResults:$('studyTextResults')
  };
  const NOTES_KEY='cdp-avm-study-notes-v1',PLAN_KEY='lce-bible365-plan-v1',JOURNEY_KEY='lce-bible365-journey-start-v1';
  const VALID_KEY=/^[A-Z0-9]{2,4}:\d{1,3}(?::\d{1,3}(?:-\d{1,3})?)?$/;
  const blankNotes=()=>({schemaVersion:1,notes:Object.create(null),bookmarks:[]});
  let state=blankNotes(),storageReady=true;
  try{
    const parsed=JSON.parse(localStorage.getItem(NOTES_KEY)||'null');
    if(parsed&&parsed.schemaVersion===1){
      for(const [key,value] of Object.entries(parsed.notes||{})){
        if(VALID_KEY.test(key)&&typeof value==='string')state.notes[key]=value.slice(0,5000);
      }
      state.bookmarks=Array.isArray(parsed.bookmarks)?
        [...new Set(parsed.bookmarks.filter(x=>typeof x==='string'&&VALID_KEY.test(x)))].slice(0,3000):[];
    }
  }catch(error){storageReady=false;console.warn('Anotações pessoais indisponíveis.',error);}
  const writeNotes=()=>{try{localStorage.setItem(NOTES_KEY,JSON.stringify(state));storageReady=true;return true;}
    catch(error){storageReady=false;ui.noteStatus.textContent='O navegador não permitiu salvar: exporte suas anotações.';return false;}};
  const readProgress=()=>{try{const found=JSON.parse(localStorage.getItem(PLAN_KEY)||'[]');return new Set(Array.isArray(found)?found:[]);}catch{return new Set();}};
  const writeProgress=values=>{try{localStorage.setItem(PLAN_KEY,JSON.stringify([...values]));return true;}catch{return false;}};
  let active={book:books[0],chapter:1,start:null,end:null,key:C.referenceKey(books[0].id,1)};
  const externalUrl=(book,chapter)=>bible.readBase+encodeURIComponent(book.id)+'.'+chapter+'.AVM';
  const make=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=String(text);return node;};
  const feedback=(text)=>{ui.feedback.textContent=text||'';};
  const linkTo=part=>'./biblia-estudo.html?livro='+encodeURIComponent(part.book.id)+'&capitulo='+part.chapter+
    (part.start!==null?'&versiculo='+part.start+(part.end!==part.start?'-'+part.end:''):'');
  const dateToday=()=>{const date=new Date();return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');};
  function syncUrl(replace=false) {
    const target=linkTo(active).replace(/^\.\//,'');
    const url=new URL(target,window.location.href);
    const relative=url.pathname.split('/').pop()+url.search;
    if(window.location.pathname.split('/').pop()+window.location.search!==relative)history[replace?'replaceState':'pushState']({study:active.key},'',relative);
  }
  function parsedFields() {
    const startRaw=ui.start.value.trim(),endRaw=ui.end.value.trim();
    const start=startRaw?Number(startRaw):null,end=endRaw?Number(endRaw):start;
    if(endRaw&&!startRaw)return {error:'Informe o versículo inicial antes do final.'};
    if(start!==null&&(!Number.isInteger(start)||start<1||start>176||!Number.isInteger(end)||end<start||end>176))
      return {error:'Faixa de versículos inválida. Confirme a numeração na edição.'};
    return {start,end};
  }
  function select(bookId,chapter,start=null,end=null,{replace=false}={}){
    const book=books.find(b=>b.id===bookId);
    if(!book||!Number.isInteger(chapter)||chapter<1||chapter>book.chapters){feedback('Livro ou capítulo não encontrado.');return false;}
    if(start!==null&&(!Number.isInteger(start)||start<1||start>176||!Number.isInteger(end)||end<start||end>176)){
      feedback('Faixa de versículos fora do intervalo de entrada permitido.');return false;
    }
    active={book,chapter,start,end,key:C.referenceKey(book.id,chapter,start,end)};
    render();syncUrl(replace);feedback('');return true;
  }
  function fillBookSelect(){
    ui.book.replaceChildren();
    C.GROUPS.forEach(group=>{
      const optgroup=make('optgroup');optgroup.label=group.name;
      books.filter(book=>book.group===group.name).forEach(book=>{const opt=make('option','',book.name);opt.value=book.id;optgroup.appendChild(opt);});
      ui.book.appendChild(optgroup);
    });
  }
  function renderBooks(){
    const query=C.fold(ui.bookFilter.value),testament=ui.testament.value;
    ui.list.replaceChildren();
    let found=0;
    C.GROUPS.forEach(group=>{
      if(testament&&testament!==group.testament)return;
      const matches=books.filter(book=>book.group===group.name&&(!query||C.fold(book.name).includes(query)||C.fold(book.abbrev).includes(query)));
      if(!matches.length)return;
      const container=make('section','study-group');container.appendChild(make('h4','',group.name));
      matches.forEach(book=>{
        const button=make('button','',book.name);button.type='button';
        button.setAttribute('aria-current',String(book.id===active.book.id));
        button.appendChild(make('small','',book.chapters+' cap.'));
        button.addEventListener('click',()=>select(book.id,1));
        container.appendChild(button);found++;
      });
      ui.list.appendChild(container);
    });
    if(!found)ui.list.appendChild(make('p','study-empty','Nenhum livro corresponde ao filtro.'));
  }
  function renderChapters(){
    ui.book.value=active.book.id;
    ui.chapter.replaceChildren();
    for(let n=1;n<=active.book.chapters;n++){const option=make('option','',String(n));option.value=String(n);ui.chapter.appendChild(option);}
    ui.chapter.value=String(active.chapter);
    ui.start.value=active.start===null?'':String(active.start);
    ui.end.value=active.start===null||active.end===active.start?'':String(active.end);
  }
  function renderText(){
    ui.text.replaceChildren();
    const payload=window.CDP_AVM_PUBLIC_DATA;
    const allowed=C.authorizedVerses(payload,active.book.id,active.chapter);
    const selected=allowed.filter(item=>active.start===null||(item.verse>=active.start&&item.verse<=active.end));
    if(selected.length){
      selected.forEach(item=>{
        const row=make('p','study-verse-row');row.append(make('b','',item.verse),document.createTextNode(item.text));ui.text.appendChild(row);
      });
      ui.text.appendChild(make('p','study-help','Trechos com autorização registrada para publicação; confira a página da edição para notas e variantes.'));
    }else{
      const box=make('div','study-not-licensed');
      box.append(make('strong','','Texto integral indisponível nesta plataforma'),
        make('p','','A referência e as suas anotações estão disponíveis aqui. A transcrição da tradução Ave-Maria depende de autorização específica. Nenhum versículo foi reconstruído ou substituído por outra edição.'));
      const a=make('a','','Abrir o capítulo na Bíblia Ave-Maria');a.href=externalUrl(active.book,active.chapter);a.target='_blank';a.rel='noopener noreferrer';
      box.appendChild(a);ui.text.appendChild(box);
    }
  }
  function renderEditorial(){
    ui.editorial.replaceChildren();
    ui.editorial.appendChild(make('p','','Introduções, títulos, comentários e notas da edição de estudos estão catalogados separadamente do texto bíblico na preparação técnica. Não há material editorial autorizado para exibição pública vinculado a esta referência.'));
    ui.editorial.appendChild(make('p','study-help','Isso não impede suas anotações próprias nem o acesso ao exemplar na fonte licenciada.'));
  }
  function renderGlosas(){
    ui.glosas.replaceChildren();
    const contextual={A:window.LCE_GLOSSA_ANO_A_REVISADA||{},B:window.LCE_GLOSSA_ANO_B_REVISADA||{},C:window.LCE_GLOSSA_ANO_C_REVISADA||{}};
    const entries=C.collectGlosas(active.book,active.chapter,books,window.LCE_GLOSSA||{},contextual);
    if(!entries.length){ui.glosas.appendChild(make('p','study-empty','Não há glosa preliminar vinculada a este capítulo no repertório carregado.'));return;}
    ui.glosas.appendChild(make('p','study-help',entries.length+' referência(s) de glosa associada(s) ao capítulo. São perícopes de celebrações, não glosa integral do capítulo.'));
    entries.slice(0,40).forEach(item=>{
      const details=make('details','study-glosa-item');
      const summary=make('summary','',item.reference+' · '+item.version+' · '+item.status);
      const note=make('small','',item.source+' Versão identificada: '+item.version+'. Estado: preliminar; não certificada.');
      const pre=make('pre','',item.glosa);
      details.append(summary,note,pre);ui.glosas.appendChild(details);
    });
    if(entries.length>40)ui.glosas.appendChild(make('p','study-help','Mais resultados estão disponíveis no acervo litúrgico.'));
  }
  function labelForKey(key) {
    const m=String(key).match(/^([A-Z0-9]+):(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if(!m)return key;
    const book=books.find(b=>b.id===m[1]);
    return book?C.formatReference(book,Number(m[2]),m[3]?Number(m[3]):null,m[4]?Number(m[4]):(m[3]?Number(m[3]):null)):key;
  }
  function renderBookmarks(){
    ui.bookmarks.replaceChildren();
    if(!state.bookmarks.length){ui.bookmarks.appendChild(make('p','study-empty','Nenhuma passagem marcada.'));return;}
    const wrap=make('div','study-marked-list');
    state.bookmarks.slice().reverse().forEach(key=>{
      const button=make('button','',labelForKey(key));button.type='button';
      button.addEventListener('click',()=>{const match=key.match(/^([A-Z0-9]+):(\d+)(?::(\d+)(?:-(\d+))?)?$/);if(!match)return;
        select(match[1],Number(match[2]),match[3]?Number(match[3]):null,match[4]?Number(match[4]):(match[3]?Number(match[3]):null));});
      wrap.appendChild(button);
    });ui.bookmarks.appendChild(wrap);
  }
  function renderNotes(){
    ui.note.value=state.notes[active.key]||'';
    const marked=state.bookmarks.includes(active.key);
    ui.bookmark.textContent=marked?'Remover marcação':'Marcar passagem';
    ui.bookmark.setAttribute('aria-pressed',String(marked));
    ui.noteStatus.textContent=storageReady?'Suas anotações permanecem neste navegador.':'Armazenamento local indisponível nesta sessão.';
    renderBookmarks();
  }
  function renderPlan(){
    const day=plan.index.get(C.referenceKey(active.book.id,active.chapter));
    const progress=readProgress(),complete=progress.has(C.referenceKey(active.book.id,active.chapter));
    ui.planDay.textContent=day?'Dia '+day+' do plano de 365 dias':'Capítulo fora do plano';
    ui.planText.textContent='Uma única marcação por capítulo. Seu progresso é compartilhado com o plano já existente no Caminhos da Palavra.';
    ui.planComplete.checked=complete;ui.planComplete.disabled=!day;
  }
  function render(){
    renderBooks();renderChapters();
    ui.selected.textContent=C.formatReference(active.book,active.chapter,active.start,active.end);
    ui.edition.textContent=C.EDITION.label+' · '+C.EDITION.edition;
    ui.source.href=externalUrl(active.book,active.chapter);
    ui.query.value=C.formatReference(active.book,active.chapter,active.start,active.end);
    renderText();renderEditorial();renderNotes();renderGlosas();renderPlan();
  }
  function resolveInputs(){
    const selected=Number(ui.chapter.value);const verse=parsedFields();
    if(verse.error){feedback(verse.error);return;}
    select(ui.book.value,selected,verse.start,verse.end);
  }
  ui.book.addEventListener('change',()=>select(ui.book.value,1));
  ui.chapter.addEventListener('change',resolveInputs);
  ui.start.addEventListener('change',resolveInputs);
  ui.end.addEventListener('change',resolveInputs);
  ui.bookFilter.addEventListener('input',renderBooks);
  ui.testament.addEventListener('change',renderBooks);
  ui.form.addEventListener('submit',event=>{
    event.preventDefault();const parsed=C.parseReference(ui.query.value,books);
    if(parsed.error){feedback(parsed.error);return;}
    select(parsed.book.id,parsed.chapter,parsed.start,parsed.end);
  });
  ui.copy.addEventListener('click',async()=>{
    const txt=ui.selected.textContent;
    try{await navigator.clipboard.writeText(txt);feedback('Referência copiada.');}catch{window.prompt('Copie a referência:',txt);}
  });
  ui.bookmark.addEventListener('click',()=>{
    const index=state.bookmarks.indexOf(active.key);
    if(index<0)state.bookmarks.push(active.key);else state.bookmarks.splice(index,1);
    writeNotes();renderNotes();
  });
  ui.saveNote.addEventListener('click',()=>{
    const note=ui.note.value.slice(0,5000);
    if(note.trim())state.notes[active.key]=note;else delete state.notes[active.key];
    if(writeNotes())ui.noteStatus.textContent='Anotação salva para '+ui.selected.textContent+'.';
  });
  ui.export.addEventListener('click',()=>{
    const output=JSON.stringify({schemaVersion:1,editionId:C.EDITION.id,exportedAt:new Date().toISOString(),
      notes:state.notes,bookmarks:state.bookmarks},null,2);
    const blob=new Blob([output],{type:'application/json'}),url=URL.createObjectURL(blob),a=make('a');
    a.href=url;a.download='caminhos-palavra-anotacoes-avm.json';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  });
  ui.planComplete.addEventListener('change',()=>{
    const key=C.referenceKey(active.book.id,active.chapter),progress=readProgress();
    if(ui.planComplete.checked){
      progress.add(key);
      try{if(!localStorage.getItem(JOURNEY_KEY))localStorage.setItem(JOURNEY_KEY,dateToday());}catch{}
    }else progress.delete(key);
    if(!writeProgress(progress)){ui.planComplete.checked=!ui.planComplete.checked;feedback('Não foi possível salvar o progresso neste navegador.');}
    else feedback('Progresso atualizado no plano de 365 dias.');
  });
  function authorizedTextIndex(){
    const data=window.CDP_AVM_PUBLIC_DATA;
    if(!data||data.editionId!==C.EDITION.id||data.authorizedForWeb!==true||
      !data.permissionReference)return [];
    const result=[];
    for(const key of Object.keys(data.chapters||{})){
      const match=key.match(/^([A-Z0-9]+):(\d+)$/);if(!match)continue;
      const book=books.find(b=>b.id===match[1]);if(!book)continue;
      C.authorizedVerses(data,book.id,Number(match[2])).forEach(v=>result.push({book,chapter:Number(match[2]),verse:v.verse,text:v.text}));
    }
    return result;
  }
  const searchable=authorizedTextIndex();
  if(searchable.length){
    ui.textQuery.disabled=false;ui.textButton.disabled=false;ui.textQuery.placeholder='Buscar somente nos textos autorizados';
    ui.textStatus.textContent=searchable.length+' versículo(s) autorizado(s) disponível(is) para pesquisa textual.';
    ui.textButton.addEventListener('click',()=>{
      const query=C.fold(ui.textQuery.value);ui.textResults.replaceChildren();
      if(query.length<3){ui.textResults.appendChild(make('p','study-help','Informe pelo menos três caracteres.'));return;}
      const matches=searchable.filter(row=>C.fold(row.text).includes(query)).slice(0,30);
      const box=make('div','study-results');
      matches.forEach(row=>{
        const button=make('button','',C.formatReference(row.book,row.chapter,row.verse,row.verse)+' · '+row.text.slice(0,130));
        button.type='button';button.addEventListener('click',()=>select(row.book.id,row.chapter,row.verse,row.verse));
        box.appendChild(button);
      });if(!matches.length)box.appendChild(make('p','study-help','Nenhum resultado nos trechos autorizados.'));
      ui.textResults.appendChild(box);
    });
  }
  function restoreUrl(){
    const url=new URL(window.location.href),p=url.searchParams;
    const book=books.find(b=>b.id===p.get('livro')),chapter=Number(p.get('capitulo')||1);
    const v=(p.get('versiculo')||'').match(/^(\d{1,3})(?:-(\d{1,3}))?$/);
    if(book&&Number.isInteger(chapter)&&chapter>=1&&chapter<=book.chapters){
      select(book.id,chapter,v?Number(v[1]):null,v?Number(v[2]||v[1]):null,{replace:true});
    }else select(books[0].id,1,null,null,{replace:true});
  }
  window.addEventListener('popstate',restoreUrl);
  window.addEventListener('storage',event=>{if(event.key===PLAN_KEY)renderPlan();});
  fillBookSelect();restoreUrl();
})();
