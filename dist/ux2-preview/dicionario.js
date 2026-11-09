/* Apresentação pública progressiva do dicionário; sem glosas automáticas. */
(() => {
  'use strict';
  const list=document.getElementById('dictionary-entries');
  const count=document.getElementById('dictionary-count');
  const search=document.getElementById('dictionary-search');
  const dimension=document.getElementById('dictionary-dimension');
  const clear=document.getElementById('dictionary-clear');
  if(!list||!count||!search||!dimension||!clear) return;
  const sources=[window.LCE_MONTH_2025_11,...(window.LCE_DICTIONARY_EXTRA_MONTHS||[])].filter(Boolean);
  const byId=new Map();
  const occurrences=new Map();
  for(const month of sources) {
    for(const entry of Object.values(month.dictionary||{})) {
      if(!entry?.id||!entry.title) continue;
      if(!byId.has(entry.id)) byId.set(entry.id,entry);
    }
    for(const [date,record] of Object.entries(month.readings||{})) {
      if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      for(const id of record.dictionaryRefs||[]) {
        if(!occurrences.has(id)) occurrences.set(id,new Set());
        occurrences.get(id).add(date);
      }
    }
  }
  const records=[...byId.values()].sort((a,b)=>a.title.localeCompare(b.title,'pt-BR'));
  const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
  const humanDimension=value=>String(value||'').split('-').map(w=>w[0]?.toLocaleUpperCase('pt-BR')+w.slice(1)).join(' · ');
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  function makeEntry(entry) {
    const article=el('article','dictionary-entry');
    article.id=entry.id;
    const top=el('div','dictionary-entry-top');
    top.append(el('span','dictionary-dimension',humanDimension(entry.dimension)));
    top.append(el('span','dictionary-status','Ficha em revisão'));
    article.append(top,el('h2','',entry.title));
    article.append(el('h3','','Contexto bíblico, histórico e cultural'),el('p','',entry.contexto));
    article.append(el('h3','','Preparação visual em Libras'),el('p','',entry.espaco));
    article.append(el('p','dictionary-source','Referências documentais: '+entry.source+'. Validação humana especializada em Libras: pendente.'));
    const days=[...(occurrences.get(entry.id)||[])].sort();
    if(days.length) {
      article.append(el('h3','','Celebrado ou mencionado nas fichas'));
      const links=el('div','dictionary-occurrences');
      for(const day of days) {
        const [year,month,date]=day.split('-');
        const anchor=el('a','',date+'/'+month+'/'+year);
        anchor.href='./index.html#calendario-liturgico?data='+encodeURIComponent(day);
        anchor.setAttribute('aria-label','Abrir contexto litúrgico de '+date+'/'+month+'/'+year);
        links.append(anchor);
      }
      article.append(links);
    }
    return article;
  }
  const filter=()=>{
    const q=norm(search.value.trim()),dim=dimension.value;
    const filtered=records.filter(e=>(!dim||e.dimension===dim)&&(!q||norm([e.title,e.dimension,e.contexto,e.espaco,e.source].join(' ')).includes(q)));
    const fragment=document.createDocumentFragment();
    filtered.forEach(e=>fragment.append(makeEntry(e)));
    if(!filtered.length)fragment.append(el('p','dictionary-empty','Nenhum verbete corresponde à pesquisa. Tente outro termo ou remova os filtros.'));
    list.replaceChildren(fragment);
    count.textContent=filtered.length+' de '+records.length+' verbetes preliminares exibidos.';
  };
  [...new Set(records.map(x=>x.dimension))].sort((a,b)=>a.localeCompare(b,'pt-BR')).forEach(key=>{
    const option=document.createElement('option');option.value=key;option.textContent=humanDimension(key);dimension.append(option);
  });
  if(!records.length) {
    count.textContent='A base do dicionário não está disponível.';
    list.append(el('p','dictionary-empty','O carregamento das fichas não foi concluído. Consulte novamente mais tarde.'));
    return;
  }
  const q=new URLSearchParams(location.search).get('q');
  if(q)search.value=q;
  search.addEventListener('input',filter);
  dimension.addEventListener('change',filter);
  clear.addEventListener('click',()=>{search.value='';dimension.value='';filter();search.focus();});
  filter();
  function focusTarget(){
    const id=decodeURIComponent(location.hash.slice(1));
    if(!id) return;
    const target=document.getElementById(id);
    if(!target)return;
    if(search.value||dimension.value){search.value='';dimension.value='';filter();}
    const refreshed=document.getElementById(id);
    if(refreshed){refreshed.setAttribute('tabindex','-1');refreshed.scrollIntoView({behavior:'auto',block:'start'});}
  }
  window.addEventListener('hashchange',focusTarget);
  if(location.hash)requestAnimationFrame(focusTarget);
})();
