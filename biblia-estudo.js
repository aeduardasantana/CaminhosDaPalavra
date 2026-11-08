/* Caminhos da Palavra — Bíblia integral Ave-Maria no leitor interno.
 * Glosas preliminares e progresso existentes não são alterados. */
(() => {
  'use strict';
  const C=window.CDP_BIBLE_STUDY_CORE,bible=window.LCE_BIBLE;
  if(!C||!bible){document.querySelector('#studyFeedback').textContent='Catálogo indisponível nesta sessão.';return;}
  let books,plan;
  try{books=C.catalog(bible);plan=C.planDays(bible);}
  catch(error){document.querySelector('#studyFeedback').textContent='Erro de integridade do catálogo: '+error.message;return;}
  const verseIndex=window.CDP_VERSE_INDEX;
  let verseIndexReady=false, verseIndexError='';
  try{verseIndexReady=C.validateVerseIndex(verseIndex,books);}
  catch(error){verseIndexError=error.message;console.error('Índice bíblico:',error);}
  const $=id=>document.getElementById(id);
  const ui={
    bookFilter:$('studyBookFilter'),testament:$('studyTestamentFilter'),list:$('studyBookList'),
    book:$('studyBookSelect'),chapter:$('studyChapterSelect'),start:$('studyVerseStart'),end:$('studyVerseEnd'),limit:$('studyVerseLimit'),
    form:$('studyReferenceForm'),query:$('studyReferenceInput'),feedback:$('studyFeedback'),
    selected:$('studyCurrentReference'),edition:$('studyCurrentEdition'),source:$('studyOpenSource'),
    copy:$('studyCopyReference'),bookmark:$('studyBookmark'),bookmarks:$('studyBookmarksList'),
    planDay:$('studyPlanDay'),planText:$('studyPlanText'),planComplete:$('studyPlanComplete'),
    text:$('studyVerseText'),editorial:$('studyEditorialContent'),glosas:$('studyGlosaContent'),
    note:$('studyPersonalNote'),saveNote:$('studySaveNote'),export:$('studyExportNotes'),
    noteStatus:$('studyNoteStatus'),textQuery:$('studyTextQuery'),textButton:$('studyTextButton'),
    textStatus:$('studyTextStatus'),textResults:$('studyTextResults'),
    readAloud:$('studyReadAloud'),stopAloud:$('studyStopAloud')
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
  const speechAvailable=typeof window.speechSynthesis!=='undefined' && typeof window.SpeechSynthesisUtterance==='function';
  let speechText='';
  const bookCache=new Map();
  let renderTextSequence=0;
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
    const error=C.validateVerseRange(verseIndex,ui.book.value,Number(ui.chapter.value),start,end);
    return error?{error}:{start,end};
  }
  function select(bookId,chapter,start=null,end=null,{replace=false}={}){
    const book=books.find(b=>b.id===bookId);
    if(!book||!Number.isInteger(chapter)||chapter<1||chapter>book.chapters){feedback('Livro ou capítulo não encontrado.');return false;}
    const error=C.validateVerseRange(verseIndex,book.id,chapter,start,end);
    if(error){feedback(error);return false;}
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
    const count=verseIndexReady?C.verseCount(verseIndex,active.book.id,active.chapter):null;
    for(const field of [ui.start,ui.end]){
      field.disabled=count===null;
      if(count!==null)field.max=String(count);
      else field.removeAttribute('max');
    }
    ui.limit.textContent=count===null
      ? 'Índice de versículos indisponível nesta sessão; navegação por capítulo preservada.'
      : 'Capítulo com '+count+' versículo(s) registrado(s) na fonte JSON incorporada. Intervalos acima desse limite não são aceitos.';
    ui.start.value=active.start===null?'':String(active.start);
    ui.end.value=active.start===null||active.end===active.start?'':String(active.end);
  }
  function stopSpeech(){
    if(speechAvailable)window.speechSynthesis.cancel();
    ui.stopAloud.disabled=true;
  }
  function loadPublicBook(book){
    if(!bookCache.has(book.id)){
      const url='./dados/biblia-ave-maria/'+encodeURIComponent(book.id)+'.json';
      const promise=fetch(url).then(async response=>{
        if(!response.ok)throw new Error('HTTP '+response.status+' ao carregar '+book.name);
        const data=await response.json();
        if(data.schemaVersion!==1||data.editionId!==C.EDITION.id||
           data.bookId!==book.id||!Array.isArray(data.chapters)||
           data.chapters.length!==book.chapters)
          throw new Error('Arquivo do livro '+book.name+' não corresponde ao catálogo.');
        for(let n=1;n<=book.chapters;n++){
          const chapter=data.chapters[n-1],count=C.verseCount(verseIndex,book.id,n);
          if(chapter?.chapter!==n||!Array.isArray(chapter.verses)||chapter.verses.length!==count)
            throw new Error('Contagem inconsistente em '+book.name+' '+n+'.');
          for(let v=1;v<=count;v++){
            const item=chapter.verses[v-1];
            if(item?.verse!==v||typeof item.text!=='string'||!item.text.trim())
              throw new Error('Versículo inválido em '+book.name+' '+n+','+v+'.');
          }
        }
        return data;
      }).catch(error=>{bookCache.delete(book.id);throw error;});
      bookCache.set(book.id,promise);
    }
    return bookCache.get(book.id);
  }
  async function renderText(){
    const sequence=++renderTextSequence;
    const current={...active};
    stopSpeech();
    speechText='';
    ui.readAloud.disabled=true;
    ui.text.replaceChildren(make('p','study-help','Carregando '+current.book.name+' '+current.chapter+' no leitor interno…'));
    try{
      const content=await loadPublicBook(current.book);
      if(sequence!==renderTextSequence)return;
      const all=content.chapters[current.chapter-1].verses;
      const selected=all.filter(item=>current.start===null||
        (item.verse>=current.start&&item.verse<=current.end));
      ui.text.replaceChildren();
      for(const item of selected){
        const row=make('p','study-verse-row');
        row.id='versiculo-'+item.verse;
        row.append(make('b','',item.verse+' '),document.createTextNode(item.text));
        ui.text.appendChild(row);
      }
      speechText=selected.map(item=>'Versículo '+item.verse+'. '+item.text).join(' ');
      ui.readAloud.disabled=!speechAvailable||!speechText;
      if(!selected.length)ui.text.appendChild(make('p','study-help','Não há versículos neste intervalo.'));
    }catch(error){
      if(sequence!==renderTextSequence)return;
      ui.text.replaceChildren(make('p','study-empty','Não foi possível carregar o texto deste livro. '+error.message));
      ui.readAloud.disabled=true;
    }
  }
  function renderEditorial(){
    ui.editorial.replaceChildren();
    ui.editorial.appendChild(make('p','','Introduções, títulos, comentários e notas da edição de estudos estão catalogados separadamente do texto bíblico na preparação técnica. Não há material editorial autorizado para exibição pública vinculado a esta referência.'));
    ui.editorial.appendChild(make('p','study-help','Isso não impede suas anotações próprias no leitor interno.'));
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
    ui.source.href='#studyVerseText';
    ui.query.value=C.formatReference(active.book,active.chapter,active.start,active.end);
    renderText();renderEditorial();renderNotes();renderGlosas();renderPlan();
  }
  function resolveInputs(){
    const selected=Number(ui.chapter.value);const verse=parsedFields();
    if(verse.error){feedback(verse.error);return;}
    select(ui.book.value,selected,verse.start,verse.end);
  }
  ui.book.addEventListener('change',()=>select(ui.book.value,1));
  ui.chapter.addEventListener('change',()=>select(ui.book.value,Number(ui.chapter.value)));
  ui.start.addEventListener('change',resolveInputs);
  ui.end.addEventListener('change',resolveInputs);
  ui.bookFilter.addEventListener('input',renderBooks);
  ui.testament.addEventListener('change',renderBooks);
  ui.form.addEventListener('submit',event=>{
    event.preventDefault();const parsed=C.parseReference(ui.query.value,books,verseIndex);
    if(parsed.error){feedback(parsed.error);return;}
    select(parsed.book.id,parsed.chapter,parsed.start,parsed.end);
  });
  ui.readAloud.addEventListener('click',()=>{
    if(!speechAvailable||!speechText)return;
    stopSpeech();
    const utterance=new window.SpeechSynthesisUtterance(speechText);
    utterance.lang='pt-BR';
    utterance.rate=0.92;
    utterance.onend=()=>{ui.stopAloud.disabled=true;};
    utterance.onerror=()=>{ui.stopAloud.disabled=true;feedback('A leitura por voz não está disponível neste navegador.');};
    ui.stopAloud.disabled=false;
    window.speechSynthesis.speak(utterance);
  });
  ui.stopAloud.addEventListener('click',stopSpeech);
  window.addEventListener('pagehide',stopSpeech);
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
  ui.textQuery.disabled=false;
  ui.textButton.disabled=false;
  ui.textQuery.placeholder='Digite uma palavra ou expressão da Bíblia';
  ui.textStatus.textContent='Busca textual nos 73 livros da Bíblia Ave-Maria disponíveis neste site.';
  let searchSequence=0;
  async function searchBibleText(){
    const sequence=++searchSequence,query=C.fold(ui.textQuery.value);
    ui.textResults.replaceChildren();
    if(query.length<3){
      ui.textResults.appendChild(make('p','study-help','Informe pelo menos três caracteres.'));
      return;
    }
    ui.textButton.disabled=true;
    let matches=0,failures=0;
    const results=make('div','study-results');
    ui.textResults.appendChild(results);
    for(let i=0;i<books.length;i+=4){
      const batch=await Promise.allSettled(books.slice(i,i+4).map(book=>loadPublicBook(book)));
      if(sequence!==searchSequence)return;
      for(let j=0;j<batch.length;j++){
        const entry=batch[j],book=books[i+j];
        if(entry.status!=='fulfilled'){failures++;continue;}
        for(const chapter of entry.value.chapters)for(const item of chapter.verses){
          if(!C.fold(item.text).includes(query))continue;
          matches++;
          if(matches>50)continue;
          const button=make('button','',C.formatReference(book,chapter.chapter,item.verse,item.verse)+' · '+item.text.slice(0,130));
          button.type='button';
          button.addEventListener('click',()=>select(book.id,chapter.chapter,item.verse,item.verse));
          results.appendChild(button);
        }
      }
      ui.textStatus.textContent='Pesquisando: '+Math.min(i+4,books.length)+' de '+books.length+' livros…';
    }
    ui.textStatus.textContent=matches+' versículo(s) encontrado(s) em 73 livros'+
      (failures?' ('+failures+' livro(s) indisponível(is); tente novamente).':'.')+
      (matches>50?' Mostrando os primeiros 50.':'');
    if(!matches)results.appendChild(make('p','study-help','Nenhuma ocorrência encontrada.'));
    ui.textButton.disabled=false;
  }
  ui.textButton.addEventListener('click',searchBibleText);
  ui.textQuery.addEventListener('keydown',event=>{
    if(event.key==='Enter'){event.preventDefault();searchBibleText();}
  });
  function restoreUrl(){
    const url=new URL(window.location.href),p=url.searchParams;
    const book=books.find(b=>b.id===p.get('livro')),chapter=Number(p.get('capitulo')||1);
    const v=(p.get('versiculo')||'').match(/^(\d{1,3})(?:-(\d{1,3}))?$/);
    if(book&&Number.isInteger(chapter)&&chapter>=1&&chapter<=book.chapters){
      const requested=p.get('versiculo')||'';
      const error=requested&&!v
        ? 'Intervalo de versículos inválido no link direto.'
        : C.validateVerseRange(verseIndex,book.id,chapter,v?Number(v[1]):null,v?Number(v[2]||v[1]):null);
      if(error){
        select(book.id,chapter,null,null,{replace:true});
        feedback(error+' Foi aberto apenas o capítulo.');
      }else select(book.id,chapter,v?Number(v[1]):null,v?Number(v[2]||v[1]):null,{replace:true});
    }else select(books[0].id,1,null,null,{replace:true});
  }
  window.addEventListener('popstate',restoreUrl);
  window.addEventListener('storage',event=>{if(event.key===PLAN_KEY)renderPlan();});
  fillBookSelect();restoreUrl();
  if(!verseIndexReady)feedback('Aviso: '+verseIndexError+' Navegação por versículos desativada até o índice ser restaurado.');
})();
