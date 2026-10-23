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
    .replace(/\(cantico\)/g,'').replace(/[^a-z0-9]/g,'').replace(/^1cor(?=\d)/,'1co');
  const kinds={'primeira-leitura':'primeiraLeitura','segunda-leitura':'segundaLeitura','salmo':'salmo','evangelho':'evangelho'};
  function normalizeDate(value){
    const m=String(value||'').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return m?m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0'):null;
  }
  function referenceMatches(actual,expected,kind){
    const a=normalizeReference(actual),e=normalizeReference(expected);
    if(!a||!e)return false;
    if(a===e)return true;
    // A fonte pode abreviar um limite 16a/20a/14a como 16/20/14.
    // Exibimos o texto com alerta, nunca como recorte homologado.
    if(e.endsWith('a') && a===e.slice(0,-1))return true;
    // Um caso particular: refrão e indicação R. vêm após os versículos.
    // Não selecionar indiscriminadamente uma alternativa só pelo mesmo livro.
    const aWithoutRefrain=String(actual||'').replace(/\s*\(R\.[^)]+\)\s*$/i,'');
    const eWithoutRefrain=String(expected||'').replace(/\s*\(R\.[^)]+\)\s*$/i,'');
    if(normalizeReference(aWithoutRefrain)===normalizeReference(eWithoutRefrain))return true;
    if(kind==='salmo'){
      const head=v=>normalizeReference(String(v).split(',')[0].split('(')[0]);
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
      const body=String(record.texto||'');
      // Separar visualmente versículos numerados sem reescrever a fonte recebida.
      const marker='\u001f';
      const prepared=body.replace(/(^|[\s.,;:!?“”])(\d{1,2})(?=[A-ZÀ-Ú])/g,
        (match,before,n)=>before+marker+n+marker);
      const chunks=prepared.split(marker);
      if(chunks.length<3){
        parent.append(createText('p',body,'monthly-remote-scripture'));
      }else{
        if(chunks[0].trim())parent.append(createText('p',chunks[0].trim(),'monthly-remote-intro'));
        for(let i=1;i+1<chunks.length;i+=2){
          const paragraph=document.createElement('p');
          paragraph.className='monthly-remote-scripture monthly-remote-verse';
          const number=createText('sup',chunks[i],'monthly-verse-number');
          paragraph.append(number,document.createTextNode(chunks[i+1].trim()));
          parent.append(paragraph);
        }
      }
    }
  }
  async function loadForEntry(entry,card) {
    if(!entry?.editorialStudy||!card||!entry.data?.startsWith('2025-11-'))return false;
    const pane=card.querySelector('.original-text');
    const label=card.querySelector('.original-pane .pane-label');
    if(!pane||!label)return false;
    const status=createText('p','Carregando leitura…','monthly-remote-status');
    pane.replaceChildren(status);
    const data=await fetchDate(entry.data);
    if(!card.isConnected)return false;
    const matches=resolveReading(data,entry.data,entry.item,entry.referencia);
    if(!matches){
      status.textContent='Leitura indisponível nesta consulta. Consulte a fonte em “Fonte e revisão”.';
      return false;
    }
    // Escolhas litúrgicas independentes nunca são concatenadas.
    const renderMatch=record=>{
      const body=document.createElement('div');body.className='monthly-remote-text';
      appendReading(body,record,entry.item);
      pane.replaceChildren(body);
      label.textContent='Texto litúrgico';
    };
    renderMatch(matches[0]);
    const notes=card.querySelector('.reading-source-extra');
    if(notes && entry.item!=='salmo' &&
       normalizeReference(matches[0].referencia)!==normalizeReference(entry.referencia)){
      notes.append(createText('p','A fonte abrevia o recorte final desta leitura; confira os versículos antes da proclamação.'));
    }
    if(notes && entry.item==='salmo' && !String(matches[0].referencia).includes(',')){
      notes.append(createText('p','A fonte identifica o número do salmo, mas não discrimina o recorte da celebração. Confira os versículos e o refrão.'));
    }
    if(matches.length>1){
      const group=document.createElement('div');group.className='monthly-remote-options';
      const note=createText('p','Selecione a leitura correspondente à celebração:');
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
    // Procedência e status permanecem no campo recolhível "Fonte e revisão".
    const source=card.querySelector('.source-version');
    if(source)source.textContent='';
    card.dataset.dynamicBrazilianText='true';
    return true;
  }
  root.LCE_FONTE_ONLINE={normalizeReference,normalizeDate,referenceMatches,resolveReading,fetchDate,loadForEntry};
})(window);
