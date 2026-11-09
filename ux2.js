/* Caminhos da Palavra — UX 2.0. Adição progressiva; nenhum conteúdo antigo é removido. */
(()=>{'use strict';
const path=location.pathname.split('/').pop()||'index.html';
const home=path==='index.html';
document.body.classList.add('cdp-ux2');
const href=(section)=>home?'#'+section:'./index.html#'+section;
const destinations=[
 ['⌂','Hoje','inicio','./index.html#inicio'],
 ['▤','Bíblia Sagrada','biblia','./index.html#biblia'],
 ['✎','Estudo Bíblico','historia','./historia-da-salvacao.html'],
 ['♜','Liturgia Diária','liturgia','./index.html#liturgia'],
 ['♧','Guia da Missa','missal','./index.html#missal'],
 ['◇','Formação','formacao','./biblia-estudo.html#studyCicPane'],
 ['♧','Minha Jornada','plano','./index.html#plano-de-leitura']];
const current=path==='historia-da-salvacao.html'?'historia':path==='biblia-estudo.html'?'biblia':'inicio';
function goto(key,url){
 if(home&&['inicio','biblia','liturgia','missal','plano'].includes(key)){
  const target=key==='inicio'?'projeto':key;
  const controller=document.querySelector('.site-menu-link[data-section="'+target+'"],.site-menu-home[data-section="'+target+'"]');
  if(controller){controller.click();history.replaceState(null,'',url.split('#')[1]?'#'+url.split('#')[1]:'');return}
 }
 location.href=url;
}
const icon=(which)=>{let shape={
 home:'<path d="m3 11 9-8 9 8v10h-7v-7h-4v7H3z"/>',
 book:'<path d="M12 5c-4-3-8-3-10-2v16c4-1 7-1 10 2 3-3 7-3 10-2V3c-3-1-7-1-10 2zM12 5v16"/>',
 feather:'<path d="M4 20c1-11 10-17 18-18-1 10-7 18-18 18zM4 20l13-13"/>',
 chalice:'<path d="M5 3h14v5c0 5-3 8-7 8s-7-3-7-8zM12 16v5M7 21h10M5 8H2m20 0h-3"/>',
 church:'<path d="M4 21V10l8-6 8 6v11M8 21v-9h8v9M2 21h20M12 4V1m-3 2h6"/>',
 cap:'<path d="m2 9 10-6 10 6-10 6zM6 11v7q6 5 12 0v-7M22 9v9"/>',
 path:'<circle cx="12" cy="4" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 6v6l-7 5m7-5 7 5"/>'
}[which]||'';return '<svg viewBox="0 0 24 24" aria-hidden="true">'+shape+'</svg>'};
const icons=['home','book','feather','chalice','church','cap','path'];
const aside=document.createElement('aside');aside.className='cdp-sidebar';aside.setAttribute('aria-label','Navegação principal');
aside.innerHTML='<a class="cdp-sidebar-brand" href="./index.html#inicio"><svg viewBox="0 0 70 54" aria-hidden="true"><path d="M35 18V2M26 10h18M35 28q-12-9-28-4v22q15-5 28 5 14-10 28-5V24q-17-5-28 4ZM35 28v23"/></svg><strong>Caminhos da Palavra</strong><small>CONHECER · CELEBRAR · VIVER</small></a><nav class="cdp-side-nav"></nav><div class="cdp-sidebar-art" role="img" aria-label="Ilustração de uma basílica"></div>';
const sideNav=aside.querySelector('nav');
destinations.forEach((d,i)=>{const a=document.createElement('a');a.href=d[3];a.innerHTML=icon(icons[i])+'<span>'+d[1]+'</span>';if(d[2]===current)a.classList.add('is-current');a.addEventListener('click',e=>{if(home&&['inicio','biblia','liturgia','missal','plano'].includes(d[2])){e.preventDefault();goto(d[2],d[3]);sideNav.querySelectorAll('.is-current').forEach(n=>n.classList.remove('is-current'));a.classList.add('is-current')}});sideNav.append(a)});
document.body.prepend(aside);
const header=document.querySelector('.site-header .header-inner');
if(header){const form=document.createElement('form');form.className='cdp-hero-search';form.role='search';form.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/></svg><input required name="busca" type="search" aria-label="Buscar no acervo" placeholder="Buscar na Bíblia, catecismos, liturgia, santos, orações…"><button type="submit">Buscar</button>';header.append(form);
const mobileSearch=document.createElement('button');
mobileSearch.type='button';mobileSearch.className='cdp-mobile-search-button';
mobileSearch.setAttribute('aria-label','Abrir pesquisa');
mobileSearch.setAttribute('aria-expanded','false');
mobileSearch.textContent='⌕';header.append(mobileSearch);
mobileSearch.addEventListener('click',()=>{const container=header.closest('.site-header');const open=container.classList.toggle('cdp-search-open');mobileSearch.setAttribute('aria-expanded',String(open));mobileSearch.setAttribute('aria-label',open?'Fechar pesquisa':'Abrir pesquisa');if(open)form.elements.busca.focus()});
form.addEventListener('submit',e=>{e.preventDefault();const q=form.elements.busca.value.trim();if(!q)return;const match=q.match(/^(?:Gn|G[eê]nesis)\s*(\d+)(?:[,.:](\d+))?$/i);if(match){location.href='./biblia-estudo.html?livro=GEN&capitulo='+match[1]+(match[2]?'&versiculo='+match[2]:'');return;}location.href='./biblia-estudo.html?uxbusca='+encodeURIComponent(q);});}
if(path==='biblia-estudo.html'){const q=new URLSearchParams(location.search).get('uxbusca');if(q){const field=document.querySelector('#studyTextQuery'),button=document.querySelector('#studyTextButton');if(field&&button){field.value=q;const details=field.closest('details');if(details)details.open=true;button.click();}}}
const tiles=[
 ['Bíblia Sagrada','Leia e explore as Escrituras','./index.html#biblia'],
 ['Estudo Bíblico','Aprofunde a Palavra','./historia-da-salvacao.html'],
 ['Liturgia Diária','Acompanhe a vida da Igreja','./index.html#liturgia'],
 ['Guia da Missa','Ritos e orientações','./index.html#missal'],
 ['Formação','Doutrina e Vida Cristã','./biblia-estudo.html#studyCicPane'],
 ['Minha Jornada','Seu progresso de leitura e estudo','./index.html#plano-de-leitura']
];
const tilesBox=document.createElement('nav');tilesBox.className='cdp-feature-cards';tilesBox.setAttribute('aria-label','Acessos às áreas do acervo');
tiles.forEach(([title,sub,url],i)=>{const a=document.createElement('a');a.className='cdp-feature-card';a.href=url;a.innerHTML='<strong>'+title+'</strong><small>'+sub+'</small>';if(home){const key=['biblia','historia','liturgia','missal','formacao','plano'][i];a.addEventListener('click',e=>{if(['biblia','liturgia','missal','plano'].includes(key)){e.preventDefault();goto(key,url)}})}tilesBox.append(a)});
const footer=document.querySelector('body>footer');if(footer)footer.before(tilesBox);else document.body.append(tilesBox);
const mobile=document.createElement('nav');mobile.className='cdp-mobile-nav';mobile.setAttribute('aria-label','Acesso rápido no celular');
[['⌂','Hoje','./index.html#inicio'],['▤','Bíblia','./index.html#biblia'],['✎','Estudo','./historia-da-salvacao.html'],['♜','Liturgia','./index.html#liturgia'],['···','Mais','#cdp-open-menu']].forEach(([sym,label,url],i)=>{const a=document.createElement('a');a.href=url;a.innerHTML='<span aria-hidden="true">'+sym+'</span>'+label;if((current==='historia'&&i===2)||(current==='inicio'&&i===0)||(current==='biblia'&&i===1))a.classList.add('active');if(i===4){a.onclick=e=>{e.preventDefault();document.querySelector('.site-menu-trigger')?.click()}}else if(home&&[0,1,3].includes(i)){a.onclick=e=>{e.preventDefault();goto(['inicio','biblia',null,'liturgia'][i],url)}}mobile.append(a)});document.body.append(mobile);
if(path!=='historia-da-salvacao.html')return;
const main=document.querySelector('main.history-main');if(!main)return;
const topics=[...main.querySelectorAll('.hs-topic')].filter(x=>x.querySelector('.chapter-head h2'));
if(!topics.length)return;
const featured=document.createElement('section');featured.className='cdp-feature-study';featured.id='estudo-biblico';featured.setAttribute('aria-label','Estudo bíblico com leitura integrada');
featured.innerHTML='<div class="cdp-study-titlebar"><div><span class="cdp-book" aria-hidden="true">▤</span><div><h2>Estudo Bíblico</h2><p>A História da Salvação passo a passo na Sagrada Escritura</p></div></div><div class="cdp-study-steps"><button type="button" id="cdp-prev">‹ Etapa anterior</button><button type="button" id="cdp-next">Próxima etapa ›</button></div></div><select class="cdp-stage-picker" aria-label="Selecionar etapa do estudo" id="cdp-step-select"></select><div class="cdp-study-columns"><div class="cdp-study-left"><h3 id="cdp-topic-title"></h3><p class="cdp-study-ref" id="cdp-topic-ref"></p><div class="cdp-study-theme"><h4>♧ &nbsp; O tema</h4><p id="cdp-topic-intro"></p></div><h4>▤ &nbsp; O que o texto nos ensina</h4><ul id="cdp-study-teachings"></ul></div><div><div class="cdp-reader-tabs" role="tablist" aria-label="Conteúdos do estudo"><button role="tab" type="button" data-cdp-tab="texto" aria-selected="true">▤ Texto Bíblico</button><button role="tab" type="button" data-cdp-tab="contexto" aria-selected="false">Contexto</button><button role="tab" type="button" data-cdp-tab="referencias" aria-selected="false">Referências</button><button role="tab" type="button" data-cdp-tab="aprofundar" aria-selected="false">Aprofundar</button></div><div class="cdp-reader-panel"><div class="cdp-reader-heading"><h4 id="cdp-reader-heading">Gênesis 1</h4><div class="cdp-reader-controls"><button type="button" id="cdp-font-minus" aria-label="Diminuir letras">A−</button><button type="button" id="cdp-font-plus" aria-label="Aumentar letras">A+</button><button type="button" id="cdp-fullscreen" aria-label="Expandir leitura">⛶</button></div></div><div class="cdp-reader-text" id="cdp-reader-text" tabindex="0" aria-live="polite"></div><div class="cdp-reader-footer"><a id="cdp-open-bible" href="./biblia-estudo.html?livro=GEN&capitulo=1">▤ Ler capítulo completo</a><button type="button" id="cdp-bookmark">♧ Marcar trecho</button></div></div></div></div>';
main.prepend(featured);
featured.after(tilesBox);
const $=id=>document.getElementById(id);
const stageInfo=topics.map((topic,i)=>{const title=topic.querySelector('.chapter-head h2')?.textContent.trim()||'Etapa '+(i+1);const paragraphs=[...topic.querySelectorAll('.narrative p')].map(x=>x.textContent.trim()).filter(Boolean);const theme=topic.querySelector('.role p')?.textContent.trim()||paragraphs[0]||'Leia o estudo completo no percurso abaixo.';const references=[...topic.querySelectorAll('.reading span')].map(x=>x.textContent.trim()).filter(Boolean);const connections=[...topic.querySelectorAll('.connection')].map(x=>x.textContent.trim()).filter(Boolean);return {title,theme,paragraphs,references,connections,topic};});
const picker=$('cdp-step-select');stageInfo.forEach((s,i)=>{const opt=document.createElement('option');opt.value=String(i);opt.textContent=i===0?'Gênesis — A Criação do mundo':(i+1)+'. '+s.title;picker.append(opt)});
let step=0,tab='texto',font=18,genesis=null,seq=0;
const bibleUrl='./dados/biblia-ave-maria/GEN.json';
async function bibleChapter(){if(genesis)return genesis;const r=await fetch(bibleUrl);if(!r.ok)throw Error('Não foi possível carregar o livro: '+r.status);const data=await r.json();if(data.bookId!=='GEN'||!Array.isArray(data.chapters))throw Error('Arquivo bíblico incompatível.');genesis=data;return data;}
const referenceOf=s=>s.references.length?s.references.join(' · '):'Consulte as referências do estudo completo.';
function textP(text){const p=document.createElement('p');p.textContent=text;return p}
function renderOther(){
 const s=stageInfo[step],box=$('cdp-reader-text');box.replaceChildren();
 if(tab==='contexto'){(s.paragraphs.length?s.paragraphs.slice(0,6):[s.theme]).forEach(t=>box.append(textP(t)));$('cdp-reader-heading').textContent='Contexto do estudo';}
 if(tab==='referencias'){$('cdp-reader-heading').textContent='Referências';(s.references.length?s.references:['As referências estão identificadas no estudo completo abaixo.']).forEach(t=>box.append(textP(t)));box.append(document.createElement('hr'));const a=document.createElement('a');a.href='#'+s.topic.id;a.textContent='Consultar fontes e ligações do tema';box.append(a)}
 if(tab==='aprofundar'){$('cdp-reader-heading').textContent='Aprofundar';(s.connections.length?s.connections.slice(0,8):s.paragraphs.slice(1,5)).forEach(t=>box.append(textP(t)));const a=document.createElement('a');a.href='#'+s.topic.id;a.textContent='Continuar no percurso completo';box.append(a)}
}
async function renderReading(){
 const id=++seq,box=$('cdp-reader-text');box.replaceChildren();
 if(tab!=='texto'){renderOther();return}
 const s=stageInfo[step];if(step!==0){$('cdp-reader-heading').textContent='Leitura do tema';box.append(textP('Escolha uma das referências do estudo para abrir o texto bíblico integral no leitor.'));s.references.slice(0,8).forEach(ref=>box.append(textP(ref)));$('cdp-open-bible').href='./biblia-estudo.html';return}
 $('cdp-reader-heading').textContent='Gênesis 1';box.append(textP('Carregando o texto bíblico da edição disponível no acervo…'));
 try{const data=await bibleChapter();if(id!==seq||tab!=='texto'||step!==0)return;box.replaceChildren();const ch=data.chapters[0];ch.verses.forEach(v=>{const p=document.createElement('p');const strong=document.createElement('b');strong.textContent=String(v.verse)+' ';p.append(strong,document.createTextNode(v.text));box.append(p)});$('cdp-open-bible').href='./biblia-estudo.html?livro=GEN&capitulo=1';}
 catch(error){if(id!==seq)return;box.replaceChildren(textP('O texto integral não pôde ser carregado. Use “Ler capítulo completo” para acessar a Bíblia.'));console.error(error)}
}
function renderStage(){const s=stageInfo[step];picker.value=String(step);$('cdp-topic-title').textContent=step===0?'1. A Criação do mundo':(step+1)+'. '+s.title;$('cdp-topic-ref').textContent=step===0?'Gênesis 1–2':referenceOf(s);$('cdp-topic-intro').textContent=step===0?'Deus cria o universo e o ser humano por amor, revelando-se como Senhor da vida e fonte de tudo o que existe.':s.theme;const list=$('cdp-study-teachings');list.replaceChildren();const brief=step===0?['Deus é o Criador de tudo.','A criação é boa e ordenada.','O ser humano é criado à imagem e semelhança de Deus.','O mundo é dom e responsabilidade.']:(s.paragraphs.length?s.paragraphs.slice(0,4):[s.theme]).map(p=>{const m=p.match(/^.{1,115}?[.!?](?:\s|$)/);return m?m[0].trim():(p.length>110?p.slice(0,107)+'…':p)});brief.forEach(t=>{const li=document.createElement('li');li.textContent=t;list.append(li)});$('cdp-prev').disabled=step===0;$('cdp-next').disabled=step===stageInfo.length-1;try{$('cdp-bookmark').textContent=localStorage.getItem('cdp-ux2-saved-stage')===String(step)?'✓ Etapa marcada':'♧ Marcar trecho'}catch{}renderReading();}
$('cdp-prev').onclick=()=>{if(step){step--;renderStage()}};$('cdp-next').onclick=()=>{if(step<stageInfo.length-1){step++;renderStage()}};picker.onchange=()=>{step=Number(picker.value);renderStage()};
featured.querySelectorAll('[data-cdp-tab]').forEach(button=>{button.onclick=()=>{tab=button.dataset.cdpTab;featured.querySelectorAll('[data-cdp-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===button)));renderReading()}});
$('cdp-font-minus').onclick=()=>{$('cdp-reader-text').style.fontSize=(font=Math.max(14,font-2))+'px'};$('cdp-font-plus').onclick=()=>{$('cdp-reader-text').style.fontSize=(font=Math.min(28,font+2))+'px'};
$('cdp-fullscreen').onclick=()=>{const p=featured.querySelector('.cdp-reader-panel');if(document.fullscreenElement)document.exitFullscreen?.();else p.requestFullscreen?.()};
$('cdp-bookmark').onclick=()=>{try{const key='cdp-ux2-saved-stage';if(localStorage.getItem(key)===String(step)){localStorage.removeItem(key)}else{localStorage.setItem(key,String(step))}renderStage()}catch{$('cdp-bookmark').textContent='Não foi possível salvar'}};renderStage();
})();