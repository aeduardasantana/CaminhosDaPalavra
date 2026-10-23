/*
 * Caminhos da Palavra — integração opcional de leituras brasileiras.
 * A leitura é consultada no navegador, não transcrita para o repositório.
 * Fontes externas não substituem cotejo com o Lecionário brasileiro e
 * não tornam a glosa automaticamente revisada.
 */
(function(root){
  'use strict';
  const endpoint='https://liturgia.up.railway.app/v2/';
  const cache=new Map();
  const normalizeReference=value=>String(value||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/\(r\.?\s*[^)]*\)/g,'').replace(/\(forma\s+(?:longa|breve)\)/g,'')
    .replace(/[^a-z0-9]/g,'');
  const kinds={'primeira-leitura':'primeiraLeitura','segunda-leitura':'segundaLeitura','salmo':'salmo','evangelho':'evangelho'};
  function normalizeDate(value){
    const m=String(value||'').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return m?m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0'):null;
  }
  function referenceMatches(actual,expected,kind){
    const a=normalizeReference(actual),e=normalizeReference(expected);
    if(!a||!e)return false;
    if(a===e)return true;
    // Um caso particular: refrão e indicação R. vêm após os versículos.
    // Não selecionar indiscriminadamente uma alternativa só pelo mesmo livro.
    const aWithoutRefrain=String(actual||'').replace(/\s*\(R\.[^)]+\)\s*$/i,'');
    const eWithoutRefrain=String(expected||'').replace(/\s*\(R\.[^)]+\)\s*$/i,'');
    if(normalizeReference(aWithoutRefrain)===normalizeReference(eWithoutRefrain))return true;
    if(kind==='salmo'){
      const head=v=>normalizeReference(String(v).split(',')[0]);
      const aVerses=String(actual).split(',').slice(1).join(',').replace(/\s*\(R\.[^)]+\)/i,'').replace(/[^0-9a-z]/gi,'');
      const eVerses=String(expected).split(',').slice(1).join(',').replace(/\s*\(R\.[^)]+\)/i,'').replace(/[^0-9a-z]/gi,'');
      // Algumas respostas oficiais da API identificam só o Salmo.
      // Aceitar o mesmo salmo e informar explicitamente que o recorte não foi cotejado.
      return head(actual)===head(expected) && (!aVerses || aVerses===eVerses);
    }
    return false;
  }
  function resolveReading(payload,date,item,reference) {
    if(!payload||normalizeDate(payload.data)!==date)return null;
    const key=kinds[item],entries=payload.leituras?.[key];
    if(!key||!Array.isArray(entries))return null;
    const matches=entries.filter(row=>row&&referenceMatches(row.referencia,reference,item)&&
      typeof row.texto==='string'&&row.texto.trim().length>=30);
    return matches.length?matches:null;
  }
  function fetchDate(date) {
    if(!/^2025-11-(0[1-9]|[12][0-9]|30)$/.test(date))
      return Promise.resolve(null);
    if(!cache.has(date)){
      const [year,month,day]=date.split('-');
      const url=endpoint+'?dia='+Number(day)+'&mes='+Number(month)+'&ano='+year;
      const work=fetch(url,{method:'GET',mode:'cors',credentials:'omit'})
        .then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();})
        .then(data=>normalizeDate(data.data)===date?data:null)
        .catch(()=>null);
      cache.set(date,work);
    }
    return cache.get(date);
  }
  function createText(tag,content,cls){
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    node.textContent=content;
    return node;
  }
  function appendReading(parent,record,item) {
    if(record.titulo)parent.append(createText('strong',record.titulo,'monthly-remote-title'));
    if(item==='salmo'){
      if(record.refrao)parent.append(createText('p','R. '+record.refrao,'monthly-remote-refrain'));
      const verses=String(record.texto||'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
      verses.forEach((stanza,i)=>{
        parent.append(createText('p',stanza,'monthly-remote-stanza'));
        if(record.refrao)parent.append(createText('p','R. '+record.refrao,'monthly-remote-refrain'));
      });
    }else{
      parent.append(createText('p',record.texto,'monthly-remote-scripture'));
    }
  }
  async function loadForEntry(entry,card) {
    if(!entry?.editorialStudy||!card||!entry.data?.startsWith('2025-11-'))return false;
    const pane=card.querySelector('.original-text');
    const label=card.querySelector('.original-pane .pane-label');
    if(!pane||!label)return false;
    const status=createText('p','Consultando o texto brasileiro completo da data…','monthly-remote-status');
    pane.prepend(status);
    const data=await fetchDate(entry.data);
    if(!card.isConnected)return false;
    const matches=resolveReading(data,entry.data,entry.item,entry.referencia);
    if(!matches){
      status.textContent='Não foi possível confirmar nesta consulta um texto brasileiro correspondente à referência. Utilize a fonte indicada abaixo.';
      return false;
    }
    // Escolhas litúrgicas independentes nunca são concatenadas.
    const renderMatch=record=>{
      const body=document.createElement('div');body.className='monthly-remote-text';
      appendReading(body,record,entry.item);
      pane.replaceChildren(body);
      label.textContent='Texto em português brasileiro — fonte digital externa';
    };
    renderMatch(matches[0]);
    if(entry.item==='salmo' && !String(matches[0].referencia).includes(',')) {
      const note=createText('p',
        'A fonte externa identifica apenas o número do salmo. Confira o recorte, refrão e estrofes com a liturgia brasileira desta celebração antes de proclamar.',
        'monthly-remote-status');
      pane.prepend(note);
    }
    if(matches.length>1){
      const group=document.createElement('div');group.className='monthly-remote-options';
      const note=createText('p','Foram identificadas alternativas. Escolha apenas a leitura da celebração que está sendo preparada.');
      group.append(note);
      matches.forEach((record,i)=>{
        const button=createText('button','Opção '+(i+1)+' · '+record.referencia);
        button.type='button';button.setAttribute('aria-pressed',i===0?'true':'false');
        button.addEventListener('click',()=>{
          renderMatch(record);
          group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b===button?'true':'false'));
          pane.prepend(group);
        });
        group.append(button);
      });
      pane.prepend(group);
    }
    const source=card.querySelector('.source-version');
    if(source)source.textContent='Texto recuperado de serviço comunitário de liturgia brasileira; cotejo editorial com o Lecionário e validação da glosa pendentes.';
    card.dataset.dynamicBrazilianText='true';
    return true;
  }
  root.LCE_FONTE_ONLINE={normalizeReference,normalizeDate,referenceMatches,resolveReading,fetchDate,loadForEntry};
})(window);
