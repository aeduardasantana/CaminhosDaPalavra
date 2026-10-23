/* Apresentação catequética da liturgia diária — dados verificados, sem textos ou sermões fabricados. */
(() => {
  'use strict';
  const SOURCES = Object.freeze({
    igmr: 'https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_en.html',
    ano: 'https://www.vatican.va/content/dam/wss/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19631204_sacrosanctum-concilium_po.html',
    brasil: year => 'https://gcatholic.org/calendar/' + year + '/BR-pt'
  });
  const readings = Object.freeze({
    ...((window.LCE_MONTH_2025_11 || {}).readings || {}),
    '2026-10-12': {
      label: 'Solenidade de Nossa Senhora da Conceição Aparecida',
      rank: 'Solenidade', color: 'branco',
      items: [['Primeira leitura','Est 5,1b-2; 7,2b-3'], ['Salmo responsorial','Sl 44(45)'], ['Segunda leitura','Ap 12,1.5.13a.15-16a'], ['Evangelho','Jo 2,1-11']],
      source: 'https://fundacaonazare.com.br/liturgiadiaria/?data_liturgia=2026-10-12',
      scripture: 'Em Jo 2,1-11, Maria aponta para a obediência a Jesus. O sinal de Caná manifesta a glória de Cristo; a veneração mariana não substitui a adoração devida a Deus.',
      scriptureRef: 'Jo 2,1-11',
      tradition: 'A celebração de Nossa Senhora da Conceição Aparecida pertence ao calendário próprio do Brasil e recorda a história da devoção à Padroeira.',
      magisterium: 'A veneração prestada à Virgem Maria difere essencialmente da adoração reservada à Santíssima Trindade (Catecismo da Igreja Católica, §971).',
      sermon: {
        author: 'Santo Agostinho de Hipona', title: 'Tratado VIII sobre o Evangelho de João',
        location: 'In Ioannis Evangelium Tractatus, VIII, §§1–4 (Jo 2,1-4)',
        url: 'https://www.augustinus.it/latino/commento_vsg/omelia_008_testo.htm',
        note: 'Comentário patrístico sobre as bodas de Caná, não um sermão sobre Nossa Senhora Aparecida. Apresentado sem citações literais não conferidas.'
      }
    },
    '2026-10-20': {
      label: 'Terça-feira da 29ª semana do Tempo Comum',
      rank: 'Féria', color: 'verde',
      items: [['Primeira leitura','Ef 2,12-22'], ['Salmo responsorial','Sl 84(85),9ab-10.11-12.13-14'], ['Evangelho','Lc 12,35-38']],
      source: 'https://www.liriocatolico.com.br/liturgia_diaria/dia/26/10/20/',
      scripture: 'A Carta aos Efésios apresenta Cristo como nossa paz (Ef 2,12-22); o Evangelho convida à vigilância fiel (Lc 12,35-38). Trata-se de síntese catequética, não de citação do Lecionário.',
      scriptureRef: 'Ef 2,12-22; Lc 12,35-38',
      tradition: 'No Tempo Comum, a Igreja acompanha de modo continuado o mistério de Cristo e a vida cristã, especialmente pelo ritmo semanal do domingo.',
      magisterium: 'O ano litúrgico distribui os mistérios de Cristo ao longo do ano (Sacrosanctum Concilium, §102).'
    }
  });
  const seasonal = Object.freeze({
    'Advento': ['Tempo de preparação para a vinda do Senhor, marcado pela vigilância e pela esperança.', 'A cor roxa sublinha o caráter de preparação e sobriedade do Advento.'],
    'Tempo do Natal': ['A Igreja celebra o nascimento e a manifestação de Jesus Cristo, o Verbo encarnado.', 'O branco expressa a alegria própria do tempo natalício.'],
    'Quaresma': ['Tempo de preparação para a Páscoa, com apelo à conversão, à oração e à penitência.', 'O roxo indica preparação penitencial; o rosa, quando utilizado no domingo Laetare, é facultativo.'],
    'Tríduo Pascal': ['A Igreja celebra a Paixão, Morte e Ressurreição do Senhor como centro do ano litúrgico.', 'As cores e os ritos variam conforme a celebração de cada dia do Tríduo.'],
    'Tempo Pascal': ['A Igreja celebra a Ressurreição do Senhor ao longo de cinquenta dias, até Pentecostes.', 'O branco caracteriza o tempo pascal; o vermelho é usado em Pentecostes.'],
    'Tempo Comum': ['O Tempo Comum acompanha o mistério de Cristo no ritmo da vida da Igreja e dos domingos.', 'O verde é a cor habitual deste tempo, salvo quando uma celebração própria determina outra cor.']
  });
  const colorDetails = {
    verde: ['Verde','Sinal do caminho ordinário de crescimento e perseverança na vida cristã.'],
    roxo: ['Roxo','Expressa preparação, conversão e sobriedade, especialmente no Advento e na Quaresma.'],
    branco: ['Branco','Expressa a alegria própria do Natal, da Páscoa e de diversas festas do Senhor, da Virgem Maria e dos santos não mártires.'],
    vermelho: ['Vermelho','Recorda o Espírito Santo, a Paixão do Senhor e o testemunho dos mártires, conforme a celebração.'],
    rosa: ['Rosa (facultativo)','Pode ser usado nos domingos Gaudete e Laetare; o roxo também é permitido.'],
    nenhum: ['Sem cor para Missa do dia','No Sábado Santo não se celebra a Missa durante o dia; a Vigília Pascal começa à noite.']
  };
  const is = (name, patterns) => patterns.some(word => name.includes(word));
  function colorFor(info) {
    if (readings[info.iso]?.color) return readings[info.iso].color;
    const name = info.celebration || '';
    if (name === 'Sábado Santo') return 'nenhum';
    if (is(name,['Domingo de Ramos','Sexta-feira da Paixão','Pentecostes'])) return 'vermelho';
    if (name === '3º Domingo do Advento' || name === '4º Domingo da Quaresma') return 'rosa';
    if (is(name,['Natal do Senhor','Epifania do Senhor','Batismo do Senhor','Santa Maria, Mãe de Deus','Sagrada Família','Domingo da Páscoa','Ascensão do Senhor','Santíssima Trindade','Santíssimo Corpo','Nosso Senhor Jesus Cristo, Rei','Nossa Senhora da Conceição Aparecida','Assunção da','Todos os Santos','São Pedro e São Paulo','Anunciação do Senhor','Quinta-feira Santa'])) return 'branco';
    if (info.season === 'Advento' || info.season === 'Quaresma') return 'roxo';
    if (info.season === 'Tempo do Natal' || info.season === 'Tempo Pascal') return 'branco';
    if (info.season === 'Tríduo Pascal') return 'roxo';
    return 'verde';
  }
  function rankFor(info) {
    if (readings[info.iso]?.rank) return readings[info.iso].rank;
    const name=info.celebration || '';
    if (is(name,['Natal do Senhor','Epifania do Senhor','Santa Maria, Mãe de Deus','Domingo da Páscoa','Ascensão do Senhor','Santíssima Trindade','Santíssimo Corpo','Nosso Senhor Jesus Cristo, Rei','Nossa Senhora da Conceição Aparecida','Assunção da','Todos os Santos','São Pedro e São Paulo','Anunciação do Senhor','Pentecostes'])) return 'Solenidade';
    if (is(name,['Batismo do Senhor','Sagrada Família'])) return 'Festa';
    if (name.includes('Domingo')) return 'Domingo';
    return name ? 'Celebração / dia especial' : 'Féria ou memória a confirmar';
  }
  function liturgicalYearFor(info) {
    const cal = window.LCE_CALENDAR, d=info.date, y=d.getUTCFullYear();
    const begins = d >= cal.adventStart(y) ? y : y-1;
    const endsDate = new Date(cal.adventStart(begins+1).getTime()-86400000);
    return {begins, ends:begins+1, start:cal.adventStart(begins), end:endsDate, cycle:cal.liturgicalCycle(d)};
  }
  function text(parent, tag, value, cls) {
    const e=document.createElement(tag); if(cls)e.className=cls; e.textContent=value;parent.appendChild(e);return e;
  }
  function link(parent,label,url) {
    const e=document.createElement('a');e.textContent=label;e.href=url;e.target='_blank';e.rel='noopener noreferrer';parent.appendChild(e);return e;
  }
  function card(parent,title,body,sourceLabel,sourceUrl) {
    const s=document.createElement('section');s.className='daily-catechesis-card';
    text(s,'h4',title);text(s,'p',body);
    if(sourceUrl){const p=text(s,'p','', 'daily-source-link');link(p,sourceLabel,sourceUrl);}
    parent.appendChild(s);return s;
  }
  function verifiedFor(info,entries) {
    const d=readings[info.iso]; if(d) return {items:d.items,source:d.source,verified:!d.validation || d.validation==='referencias-cotejadas',validation:d.validation||'legado',notes:d.notes||[],options:d.options||[]};
    const seen = new Set();
    const items=(entries||[]).filter(x=>x&&x.referencia).map(x=>[x.itemLabel||x.item,x.referencia]).filter(pair=>{
      const k=pair.join('|');if(seen.has(k))return false;seen.add(k);return true;
    });
    return {items,source:null,verified:false};
  }
  function renderDetail(parent, info, entries) {
    const data=readings[info.iso], theme=colorFor(info), color=colorDetails[theme], season=seasonal[info.season] || seasonal['Tempo Comum'];
    const litYear=liturgicalYearFor(info), status=verifiedFor(info,entries);
    const wrap=document.createElement('div');wrap.className='daily-liturgy daily-theme-'+theme;parent.appendChild(wrap);
    const hdr=document.createElement('div');hdr.className='daily-title-block';wrap.appendChild(hdr);
    const date=new Date(info.iso+'T12:00:00Z');
    text(hdr,'p',new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date),'daily-kicker');
    text(hdr,'h3',data?.label || info.celebration || info.season);
    text(hdr,'p',info.season+' · '+(data?.rank||rankFor(info))+' · Ano dominical '+info.cycle+' · Ferial '+(info.year%2===0?'II':'I'),'daily-metadata');
    const colorBox=document.createElement('div');colorBox.className='daily-color-note';
    const sw=document.createElement('span');sw.className='daily-color-dot';sw.setAttribute('aria-hidden','true');colorBox.appendChild(sw);
    const copy=document.createElement('div');text(copy,'strong','Cor: '+color[0]);text(copy,'p',color[1]);colorBox.appendChild(copy);wrap.appendChild(colorBox);
    text(wrap,'p','Ano litúrgico '+litYear.begins+'–'+litYear.ends+' · Do 1º Domingo do Advento ao sábado posterior a Cristo Rei.','daily-liturgical-year');

    const readingsBox=document.createElement('section');readingsBox.className='daily-references';wrap.appendChild(readingsBox);
    text(readingsBox,'h4','Liturgia da Palavra');
    if(status.items.length){
      const ul=document.createElement('dl');ul.className='daily-readings-list';
      status.items.forEach(([label,ref])=>{
        text(ul,'dt',label);text(ul,'dd',ref);
      });readingsBox.appendChild(ul);
      if(status.validation==='referencias-cotejadas'){
        text(readingsBox,'p','Referências cotejadas pontualmente com fonte brasileira. Redação do Lecionário, salmo completo e glosa ainda não homologados.','daily-validation');
      }else if(status.validation){
        text(readingsBox,'p','Levantamento provisório de referências. A conferência individual da edição brasileira ainda está pendente.','daily-validation');
      }else if(status.verified){
        text(readingsBox,'p','Referências conferidas para esta data em fonte brasileira consultável.','daily-validation');
      }else{
        text(readingsBox,'p','Referências provenientes do acervo dominical existente; conferência da edição brasileira ainda pendente.','daily-validation');
      }
      if(status.source)link(readingsBox,'Consultar fonte da seleção ↗',status.source);
      if(status.notes?.length){const notes=document.createElement('ul');notes.className='daily-notes';status.notes.forEach(n=>text(notes,'li',n));readingsBox.appendChild(notes);}
    }else{
      text(readingsBox,'p','As referências do Lecionário brasileiro para esta data ainda não foram conferidas. Não serão substituídas por leituras presumidas.','daily-pending');
      link(readingsBox,'Consultar o calendário brasileiro ↗',SOURCES.brasil(info.year));
    }
    if(status.options?.length){
      const alternatives=document.createElement('section');alternatives.className='daily-alternatives';wrap.appendChild(alternatives);
      text(alternatives,'h4','Leituras alternativas e normas de escolha');
      status.options.forEach(opt=>{
        const group=document.createElement('div');group.className='daily-option';alternatives.appendChild(group);
        text(group,'strong',opt.title);if(opt.items.length){const dl=document.createElement('dl');dl.className='daily-readings-list';group.appendChild(dl);opt.items.forEach(([l,r])=>{text(dl,'dt',l);text(dl,'dd',r);});}
        if(opt.source)link(group,'Consultar a proveniência ↗',opt.source);
      });
      text(alternatives,'p','As alternativas apresentadas são exemplos rastreáveis, não um rol exaustivo das opções previstas pela CNBB.','daily-pending');
    }
    if(data?.glosaBlocks?.length){
      const glosa=document.createElement('section');glosa.className='daily-pairing';wrap.appendChild(glosa);
      text(glosa,'h4','Roteiros visuais em estudo — referência × preparação de glosa');
      text(glosa,'p','Coluna esquerda: referência e unidade narrativa (não transcrição do Lecionário). Coluna direita: proposta escrita para ensaio em Libras, não tradução, glosa integral nem validação por pessoa surda.','daily-pending');
      const table=document.createElement('table');table.className='daily-pair-table';
      const thead=document.createElement('thead');const tr=document.createElement('tr');text(tr,'th','Referência / unidade');text(tr,'th','Construção espacial e sequência');thead.appendChild(tr);table.appendChild(thead);
      const tbody=document.createElement('tbody');table.appendChild(tbody);
      data.glosaBlocks.forEach(b=>{const r=document.createElement('tr');const a=text(r,'td',b.passage);a.dataset.unit=b.id;const g=text(r,'td',b.proposal);g.dataset.status=b.status;tbody.appendChild(r);});
      glosa.appendChild(table);
      const print=document.createElement('button');print.type='button';print.className='secondary-button daily-print';print.textContent='Imprimir esta ficha / salvar em PDF';
      print.addEventListener('click',()=>{document.body.classList.add('printing-nov-2025');const clear=()=>document.body.classList.remove('printing-nov-2025');window.addEventListener('afterprint',clear,{once:true});window.print();});glosa.appendChild(print);
    }
    if(data?.dictionaryRefs?.length){
      const dic=(window.LCE_MONTH_2025_11||{}).dictionary||{};
      const sec=document.createElement('section');sec.className='daily-dictionary';wrap.appendChild(sec);
      text(sec,'h4','Dicionário bíblico, histórico e visual — fichas preliminares');
      data.dictionaryRefs.forEach(id=>{const entry=dic[id];if(!entry)return;
        const article=document.createElement('article');article.className='daily-dictionary-entry';sec.appendChild(article);
        text(article,'strong',entry.title+' · '+entry.dimension);
        text(article,'p',entry.contexto);
        text(article,'p','Orientação espacial para estudo: '+entry.espaco);
        text(article,'small','Referências: '+entry.source+' · Revisão humana pendente.');
      });
    }
    const cate=document.createElement('section');cate.className='daily-catechesis';wrap.appendChild(cate);
    text(cate,'h4','Compreenda a celebração');
    card(cate,'O que celebramos?',data?.tradition || (info.celebration ? 'Hoje o calendário registra '+info.celebration+'. '+season[0] : season[0]),'Calendário litúrgico do Brasil ↗',SOURCES.brasil(info.year));
    card(cate,'Por que esta cor?',color[1]+' '+season[1],'Instrução Geral do Missal Romano, §§345–346 ↗',SOURCES.igmr);
    card(cate,'Sagrada Escritura',data?.scripture || 'As leituras próprias deste dia serão comentadas após conferência das referências brasileiras. Não há comentário bíblico específico validado nesta ficha.',null,null);
    card(cate,'Sagrada Tradição',data?.tradition || 'A Igreja transmite e celebra os mistérios de Cristo ao longo do ano. A pesquisa histórica específica desta data permanece em desenvolvimento.','Sacrosanctum Concilium, §§102–106 ↗',SOURCES.ano);
    card(cate,'Magistério',data?.magisterium || 'O ano litúrgico recorda a obra salvadora de Cristo e oferece aos fiéis a oportunidade de participar de seus mistérios (Sacrosanctum Concilium, §102).','Consultar o documento ↗',SOURCES.ano);

    const historical=document.createElement('section');historical.className='daily-historical';wrap.appendChild(historical);
    text(historical,'h4','A voz dos Santos através dos séculos');
    const sermon=data?.sermon || (info.celebration==='Natal do Senhor'?{
      author:'São Leão Magno',title:'Sermão XXI — Natividade do Senhor',
      location:'Sermones, XXI · Patrologia Latina 54, col. 190–193',
      url:'https://www.newadvent.org/fathers/360321.htm',
      note:'Fonte anterior ao Vaticano II. O texto deverá ser conferido antes da publicação de qualquer citação literal.'
    }:null);
    if(sermon){
      text(historical,'strong',sermon.author+' — '+sermon.title);
      text(historical,'p',sermon.location);text(historical,'p',sermon.note,'daily-note');
      link(historical,'Consultar obra e localizar passagem ↗',sermon.url);
    }else{
      text(historical,'p','Não há sermão antigo autenticado e vinculado a esta data no acervo. Nenhuma citação será atribuída a um santo sem autor, obra, localização e fonte consultável.','daily-pending');
    }
    const sources=document.createElement('p');sources.className='daily-footnote';sources.append('Fontes litúrgicas: ');
    link(sources,'GCatholic Brasil',SOURCES.brasil(info.year));sources.append(' · ');
    link(sources,'normas de cores (IGMR)',SOURCES.igmr);wrap.appendChild(sources);
  }
  window.LCE_DAILY = {readings,colorFor,rankFor,liturgicalYearFor,renderDetail};
})();
