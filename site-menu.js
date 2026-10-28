/* Navegação vertical do Caminhos da Palavra.
 * Mantém botões internos de index.html para interoperar com app.js.
 * Links de páginas internas usam âncoras reais nas demais páginas. */
(() => {
  'use strict';
  const host = document.querySelector('.site-nav-host');
  if (!host) return;
  const isHome = /(?:^|\/)(?:index\.html)?$/.test(window.location.pathname);
  const current = /\/historia-da-salvacao\.html$/.test(window.location.pathname) ? 'historia' :
    /\/papas\.html$/.test(window.location.pathname) ? 'papas' :
    /\/heresias\.html$/.test(window.location.pathname) ? 'heresias' :
    /\/dicionario\.html$/.test(window.location.pathname) ? 'dicionario' : 'inicio';

  const items = [
    {group:'Sagrada Escritura',note:'Estudo e leitura', links:[
      {label:'Bíblia Sagrada',section:'biblia',hash:'biblia'},
      {label:'Mapa da História da Salvação',url:'./historia-da-salvacao.html',page:'historia'},
      {label:'Plano de leitura bíblica',section:'plano',hash:'plano-de-leitura'}
    ]},
    {group:'Sagrada Tradição',note:'A fé transmitida pela Igreja',links:[
      {label:'Vida cristã · sacramentos e virtudes',url:'./historia-da-salvacao.html#eixo-pessoa',page:'historia'},
      {label:'Os 267 Papas · Sucessão Apostólica',url:'./historia-da-salvacao.html#sucessao-pontificia',page:'papas'}
    ]},
    {group:'Magistério',note:'Doutrina e pronunciamentos oficiais',links:[
      {label:'Heresias e condenações doutrinais',url:'./heresias.html',page:'heresias'}
    ]},
    {group:'Vida litúrgica',note:'A celebração da Igreja',links:[
      {label:'Calendário litúrgico',section:'calendario',hash:'calendario-liturgico'},
      {label:'Dicionário Bíblico, Histórico e Visual',url:'./dicionario.html',page:'dicionario'},
      {label:'Liturgia dominical e apoio em Libras',section:'liturgia',hash:'liturgia-e-libras'},
      {label:'Ritos da Santa Missa',section:'missal',hash:'ritos-da-missa'}
    ]}
  ];
  host.innerHTML = '<button type="button" class="site-menu-trigger" aria-controls="site-global-menu" aria-expanded="false"><span class="site-menu-symbol" aria-hidden="true">☰</span> Explorar o acervo <span class="site-menu-chevron" aria-hidden="true">⌄</span></button>';
  const trigger = host.firstElementChild;
  const backdrop = document.createElement('div');
  backdrop.className='site-menu-backdrop';
  backdrop.hidden=true;
  const panel = document.createElement('aside');
  panel.id='site-global-menu';
  panel.className='site-menu-panel';
  panel.setAttribute('aria-label','Navegação do acervo');
  panel.hidden=true;
  const top=document.createElement('div');
  top.className='site-menu-top';
  top.innerHTML='<div><span class="site-menu-kicker">Caminhos da Palavra</span><h2>Explorar o acervo</h2><p>Escritura, Tradição e Magistério</p></div><button type="button" class="site-menu-close" aria-label="Fechar menu">×</button>';
  const links=document.createElement('nav');
  links.className='site-menu-links';
  links.setAttribute('aria-label','Áreas de estudo');
  const home=document.createElement(isHome?'button':'a');
  home.className='site-menu-home'+(current==='inicio'?' current':'');
  home.textContent='Início';
  if(isHome){home.type='button';home.classList.add('nav-button');home.dataset.section='projeto';}
  else home.href='./index.html#inicio';
  links.append(home);
  items.forEach(group=>{
    const box=document.createElement('section');
    box.className='site-menu-group';
    const title=document.createElement('h3');title.textContent=group.group;box.append(title);
    const hint=document.createElement('p');hint.textContent=group.note;box.append(hint);
    group.links.forEach(item=>{
      const el=document.createElement(isHome&&item.section?'button':'a');
      el.className='site-menu-link';
      el.textContent=item.label;
      if(isHome&&item.section){
        el.type='button';el.classList.add('nav-button');el.dataset.section=item.section;
      }else el.href=item.url || './index.html#'+item.hash;
      if(item.page===current){el.classList.add('current');el.setAttribute('aria-current','page');}
      box.append(el);
    });
    links.append(box);
  });
  const bottom=document.createElement('p');
  bottom.className='site-menu-note';
  bottom.textContent='O recurso VLibras está disponível para navegação acessível. Glosas próprias são reservadas à liturgia dominical.';
  panel.append(top,links,bottom);
  document.body.append(backdrop,panel);
  const closeButton=top.querySelector('.site-menu-close');
  let previousFocus=null;
  function closeMenu({restoreFocus=true}={}){
    if(panel.hidden)return;
    panel.hidden=true;backdrop.hidden=true;
    trigger.setAttribute('aria-expanded','false');
    document.body.classList.remove('site-menu-open');
    if(restoreFocus)trigger.focus();
  }
  function openMenu(){
    previousFocus=document.activeElement;
    panel.hidden=false;backdrop.hidden=false;
    trigger.setAttribute('aria-expanded','true');
    document.body.classList.add('site-menu-open');
    closeButton.focus();
  }
  trigger.addEventListener('click',()=>panel.hidden?openMenu():closeMenu());
  closeButton.addEventListener('click',()=>closeMenu());
  backdrop.addEventListener('click',()=>closeMenu());
  links.addEventListener('click',event=>{
    if(event.target.closest('a,button'))closeMenu({restoreFocus:false});
  });
  window.addEventListener('keydown',event=>{
    if(panel.hidden)return;
    if(event.key==='Escape'){event.preventDefault();closeMenu();return;}
    if(event.key!=='Tab')return;
    const focusable=[...panel.querySelectorAll('a[href],button:not([disabled])')];
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  window.addEventListener('popstate',()=>closeMenu({restoreFocus:false}));
  // VLibras é uma ferramenta transversal de acessibilidade. Não cria glosas.
  // O script oficial é carregado uma única vez, nas três páginas do acervo.
  if(!document.querySelector('[vw]')){
    const widgetRoot=document.createElement('div');
    widgetRoot.className='enabled';
    widgetRoot.setAttribute('vw','');
    widgetRoot.innerHTML='<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';
    document.body.appendChild(widgetRoot);
  }
  let initialized=false;
  function startVLibras(){
    if(initialized||!window.VLibras||typeof window.VLibras.Widget!=='function')return;
    try{new window.VLibras.Widget('https://vlibras.gov.br/app');initialized=true;}
    catch(error){console.warn('VLibras indisponível nesta sessão.',error);}
  }
  const vlScript=document.createElement('script');
  vlScript.src='https://vlibras.gov.br/app/vlibras-plugin.js';
  vlScript.async=true;
  vlScript.onload=startVLibras;
  document.head.appendChild(vlScript);
  window.addEventListener('load',startVLibras);
})();
