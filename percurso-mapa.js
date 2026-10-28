/* Caminhos da Palavra — jornada visual navegável.
 * Reorganiza os painéis existentes em um mapa, sem apagar os textos originais.
 * Sem JavaScript, a página mantém os capítulos e os submenus tradicionais. */
(() => {
  'use strict';

  const definitions = [
    {
      pane: 'eixo-historia',
      selector: '.hs-stage',
      title: 'A História da Salvação',
      kicker: 'DA CRIAÇÃO À ETERNIDADE',
      description: 'Siga o caminho dos acontecimentos. Escolha um marco para conhecer sua história, as personagens e as passagens bíblicas.',
      marker: ['✦','◈','✧','♛','✶','✝','✝','✦'],
      mapHint: 'O caminho representa a sequência do estudo, não uma localização geográfica.'
    },
    {
      pane: 'eixo-pessoa',
      selector: '.hs-life-stage',
      title: 'O caminho da vida cristã',
      kicker: 'DA CRIAÇÃO À VIDA ETERNA',
      description: 'Percorra as etapas para compreender quem somos, como recebemos a graça de Deus e como somos chamados a viver.',
      marker: ['✦','✝','✥','✧','✦'],
      mapHint: 'Escolha uma etapa e descubra os temas. Você pode voltar ao mapa quando quiser.'
    }
  ];

  const states = new Map();
  const originalLocations = new Map();
  let currentReader = null;
  let lastFocus = null;

  const find = id => document.getElementById(id);
  const normalize = node => (node?.textContent || '').replace(/\s+/g, ' ').trim();
  const stageName = (node, personal) => normalize(node.querySelector(personal ? '.hs-life-stage-title strong' : '.hs-stage-label strong'));
  const stageDescription = (node, personal) => normalize(node.querySelector(personal ? '.hs-life-stage-title > span:nth-child(2) > span' : '.hs-stage-label > span'));
  const text = (tag, cls, str) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    el.textContent = str;
    return el;
  };
  const coords8 = [[12,24],[37,24],[62,24],[87,24],[87,74],[62,74],[37,74],[12,74]];
  const coords5 = [[17,24],[50,24],[83,24],[83,74],[50,74]];
  const path8 = 'M144 144 L444 144 L744 144 L1044 144 Q1130 144 1130 224 L1130 360 Q1130 444 1044 444 L744 444 L444 444 L144 444';
  const path5 = 'M204 144 L600 144 L996 144 Q1100 144 1100 254 L1100 350 Q1100 444 996 444 L600 444';

  function makeMap(def) {
    const pane = find(def.pane);
    if (!pane) return null;
    const nodes = [...pane.querySelectorAll(def.selector)];
    if (nodes.length !== (def.pane === 'eixo-historia' ? 8 : 5)) return null;
    const personal = def.pane === 'eixo-pessoa';
    const shell = text('section','cj-map-shell','');
    shell.setAttribute('aria-label', def.title);
    const intro = text('div','cj-map-intro','');
    const introCopy = text('div','cj-map-intro-copy','');
    introCopy.append(text('span','cj-map-kicker',def.kicker),text('h2','',def.title),text('p','',def.description));
    const status = text('div','cj-map-status','');
    status.append(text('i','', ''), text('span','', nodes.length + ' etapas para descobrir'));
    intro.append(introCopy,status);
    const route = text('div','cj-route','');
    route.setAttribute('role','group');
    route.setAttribute('aria-label', 'Mapa com ' + nodes.length + ' estações');
    const svgNS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(svgNS,'svg');
    svg.setAttribute('viewBox','0 0 1200 600');
    svg.setAttribute('preserveAspectRatio','none');
    svg.setAttribute('class','cj-route-svg');
    svg.setAttribute('aria-hidden','true');
    for(const cls of ['cj-route-under','cj-route-dashes']){
      const path=document.createElementNS(svgNS,'path');
      path.setAttribute('class',cls);
      path.setAttribute('d',personal?path5:path8);
      svg.append(path);
    }
    route.append(svg);
    const positions = personal ? coords5 : coords8;
    const buttons = nodes.map((node,i)=>{
      const name=stageName(node,personal);
      const description=stageDescription(node,personal);
      const btn=text('button','cj-map-station','');
      btn.type='button';
      btn.style.left=positions[i][0]+'%';
      btn.style.top=positions[i][1]+'%';
      btn.setAttribute('aria-label','Abrir etapa '+(i+1)+': '+name);
      btn.dataset.station=String(i);
      const pin=text('span','cj-station-pin',String(i+1).padStart(2,'0'));
      const copy=text('span','cj-station-copy','');
      copy.append(text('strong','',name),text('small','', description.length>125?description.slice(0,122).trim()+'…':description));
      btn.append(pin,copy);
      btn.addEventListener('click',()=>openStation(def.pane,i));
      route.append(btn);
      const placeholder=document.createComment('Etapa preservada no ponto original');
      node.parentNode.insertBefore(placeholder,node);
      originalLocations.set(node,placeholder);
      return btn;
    });
    const bottom=text('div','cj-map-bottom','');
    const legend=text('span','cj-map-legend',def.mapHint);
    const ref=document.createElement('a');
    ref.href=personal?'#pessoa-fontes':'#fontes';
    ref.textContent='Consultar fontes e referências →';
    bottom.append(legend,ref);
    shell.append(intro,route,bottom);

    const reader=document.createElement('dialog');
    reader.className='cj-reader';
    reader.setAttribute('aria-label','Leitura da estação selecionada');
    const header=text('div','cj-reader-head','');
    const titleBlock=text('div','', '');
    const overline=text('small','', 'ESTAÇÃO');
    const title=text('h2','', '');
    title.id='cj-title-'+def.pane;
    reader.setAttribute('aria-labelledby',title.id);
    titleBlock.append(overline,title);
    const close=text('button','cj-reader-close','Voltar ao mapa ×');close.type='button';
    close.addEventListener('click',()=>reader.close());
    header.append(titleBlock,close);
    const container=text('div','cj-reader-content','');
    const explanation=text('div','cj-reader-intro','');
    const content=text('div','cj-reader-main','');
    container.append(explanation,content);
    const nav=text('nav','cj-reader-nav','');
    nav.setAttribute('aria-label','Percorrer as estações');
    const prev=text('button','','← Anterior'),next=text('button','','Próxima →'),back=text('button','cj-reader-mapbtn','Ver o mapa');
    for(const btn of [prev,next,back])btn.type='button';
    prev.addEventListener('click',()=>openStation(def.pane,Number(reader.dataset.index)-1));
    next.addEventListener('click',()=>openStation(def.pane,Number(reader.dataset.index)+1));
    back.addEventListener('click',()=>reader.close());
    nav.append(prev,back,next);
    reader.append(header,container,nav);
    reader.addEventListener('close',()=>{
      if(currentReader===reader)currentReader=null;
      const stage=reader.__stage;
      if(stage)restore(stage);
      reader.__stage=null;
      if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});
      lastFocus=null;
    });
    pane.insertBefore(shell,pane.firstChild);
    pane.append(reader);
    const state={...def,pane,nodes,buttons,reader,overline,title,explanation,content,prev,next,status};
    states.set(def.pane,state);
    return state;
  }

  function restore(node){
    const anchor=originalLocations.get(node);
    if(anchor?.parentNode)anchor.after(node);
  }
  function switchAxis(id){
    for(const el of document.querySelectorAll('.hs-perspective-pane')){
      const active=el.id===id;
      el.classList.toggle('is-active',active);
      el.setAttribute('aria-hidden',active?'false':'true');
    }
    for(const tab of document.querySelectorAll('[data-axis]')){
      const active=tab.dataset.axis===id;
      tab.classList.toggle('is-active',active);
      tab.setAttribute('aria-selected',active?'true':'false');
      tab.tabIndex=active?0:-1;
    }
  }
  function openStation(axis,index,deepId){
    const state=states.get(axis);
    if(!state||index<0||index>=state.nodes.length)return;
    const {nodes,buttons,reader,overline,title,explanation,content,prev,next,status}=state;
    const node=nodes[index];
    if(currentReader&&currentReader!==reader)currentReader.close();
    if(!reader.open){lastFocus=document.activeElement;}
    if(reader.__stage&&reader.__stage!==node)restore(reader.__stage);
    content.append(node);
    reader.__stage=node;
    node.open=true;
    reader.dataset.index=String(index);
    const personal=axis==='eixo-pessoa';
    const heading=stageName(node,personal);
    overline.textContent='ETAPA '+(index+1)+' DE '+nodes.length;
    title.textContent=heading;
    explanation.replaceChildren(text('p','',stageDescription(node,personal)));
    buttons.forEach((btn,i)=>{
      btn.dataset.current=String(i===index);
    });
    buttons[index].dataset.visited='true';
    status.lastElementChild.textContent='Etapa '+(index+1)+' de '+nodes.length;
    prev.disabled=index===0;next.disabled=index===nodes.length-1;
    if(!reader.open){
      if(typeof reader.showModal==='function')reader.showModal();else reader.setAttribute('open','');
    }
    currentReader=reader;
    reader.scrollTop=0;
    if(deepId&&deepId!==node.id){
      const target=find(deepId);
      if(target&&node.contains(target)){
        let at=target;
        while(at&&at!==node){if(at.tagName==='DETAILS')at.open=true;at=at.parentElement;}
        requestAnimationFrame(()=>{target.scrollIntoView({block:'start'});});
      }
    }else requestAnimationFrame(()=>reader.querySelector('.cj-reader-close')?.focus({preventScroll:true}));
  }

  function openReferences(id){
    const personal=id==='pessoa-fontes';
    const axis=personal?'eixo-pessoa':'eixo-historia';
    const state=states.get(axis);
    if(!state)return false;
    const node=find(id);
    if(!node)return false;
    if(currentReader&&currentReader!==state.reader)currentReader.close();
    const reader=state.reader;
    if(reader.__stage)restore(reader.__stage);
    if(!reader.open)lastFocus=document.activeElement;
    reader.__stage=null;
    state.title.textContent='Fontes para aprofundar';
    state.overline.textContent='REFERÊNCIAS DO ESTUDO';
    state.explanation.textContent='';
    state.content.replaceChildren();
    // The bibliography remains in its original location and is shown in an expanded copy.
    const clone=node.cloneNode(true);clone.removeAttribute('id');
    state.content.append(clone);
    state.prev.disabled=true;state.next.disabled=true;
    reader.dataset.index='-1';
    if(!reader.open){if(typeof reader.showModal==='function')reader.showModal();else reader.setAttribute('open','');}
    currentReader=reader;
    reader.scrollTop=0;
    return true;
  }

  function navigate(id){
    if(id==='eixo-pessoa'||id==='eixo-historia'){if(currentReader)currentReader.close();switchAxis(id);return true;}
    if(id==='fontes'||id==='pessoa-fontes')return openReferences(id);
    const target=find(id);
    if(!target)return false;
    const parentStage=target.closest('.hs-stage,.hs-life-stage');
    if(!parentStage)return false;
    for(const [axis,state] of states){
      const index=state.nodes.indexOf(parentStage);
      if(index>=0){
        switchAxis(axis);
        openStation(axis,index,id);
        return true;
      }
    }
    return false;
  }

  // Build before changing the visible layout, so an error leaves the accessible page intact.
  const built=definitions.map(makeMap);
  if(built.some(x=>!x)){
    for(const s of states.values())for(const n of s.nodes)restore(n);
    return;
  }
  document.documentElement.classList.add('cj-enhanced');

  for(const tab of document.querySelectorAll('[data-axis]')){
    tab.addEventListener('click',()=>{if(currentReader)currentReader.close();});
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link||!document.documentElement.classList.contains('cj-enhanced'))return;
    const id=decodeURIComponent(link.getAttribute('href').slice(1));
    if(!id||!find(id))return;
    // Handle deep links and the cross-links between the two journeys.
    if(navigate(id)){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(location.hash!=='#'+id)history.pushState(null,'','#'+encodeURIComponent(id));
    }
  },true);
  window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(id)navigate(id);});
  window.addEventListener('popstate',()=>{const id=decodeURIComponent(location.hash.slice(1));if(id)navigate(id);else if(currentReader)currentReader.close();});
  const initial=decodeURIComponent(location.hash.slice(1));
  if(initial)requestAnimationFrame(()=>navigate(initial));
})();
