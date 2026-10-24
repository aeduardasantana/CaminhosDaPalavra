/* Acervo litúrgico brasileiro estático — nenhuma requisição externa durante a leitura. */
(function(root){
  'use strict';
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
  // Reutilização sem consultas externas: data precisa ou chave litúrgica verificada.
  function associatedDate(date) {
    const archive=root.LCE_BR_ACERVO;
    if(!archive?.complete) return null;
    const direct=archive.dates?.[date];
    if(direct) return direct;
    if(!root.LCE_CALENDAR || !/^\d{4}-\d{2}-\d{2}$/.test(date))return null;
    const info=root.LCE_CALENDAR.infoForIso(date),byKey=archive.associations||{};
    const weekday=info.weekday,season=info.season;
    const findWeek=()=>{
      if(season!=='Tempo Comum')return null;
      const day=new Date(date+'T12:00:00Z'),offset=(day.getUTCDay()+7)%7;
      const sunday=new Date(day.getTime()-offset*86400000);
      let celebration=root.LCE_CALENDAR.majorCelebration(sunday);
      if(celebration==='Nosso Senhor Jesus Cristo, Rei do Universo')return 34;
      if(!/^\d+º Domingo do Tempo Comum$/.test(celebration)){
        const nextSunday=new Date(sunday.getTime()+7*86400000);
        const next=root.LCE_CALENDAR.majorCelebration(nextSunday);
        if(/^\d+º Domingo do Tempo Comum$/.test(next))return Number(next.split('º')[0])-1;
        return null;
      }
      return Number(celebration.split('º')[0]);
    };
    const result={data:date.split('-').reverse().join('/'),leituras:{}};
    const types={'primeira-leitura':'primeiraLeitura','segunda-leitura':'segundaLeitura','salmo':'salmo','evangelho':'evangelho'};
    const populate=(key,kind)=>{
      const ids=byKey[key],records=Array.isArray(ids)?ids:ids?[ids]:[];
      for(const id of records){
        const reading=archive.texts?.[id];
        if(!reading || reading.kind!==kind)continue;
        const field=types[kind];
        (result.leituras[field]??=[]).push({
          referencia:reading.reference,refrao:reading.refrain||'',
          texto:reading.text,titulo:reading.title||''
        });
      }
    };
    if(info.celebration && !/^\d+º Domingo/.test(info.celebration)){
      const prefix='PROPER|'+info.celebration+'|'+info.cycle;
      for(const kind of Object.keys(types))populate(prefix+'|'+kind,kind);
      // Sem prova de que a seleção independe do ano dominical, não inferir.
    }else if(weekday===0){
      if(info.celebration){
        for(const kind of Object.keys(types))populate('SUNDAY|'+info.celebration+'|'+info.cycle+'|'+kind,kind);
      }
    }else if(season==='Tempo Comum'){
      const week=findWeek();
      if(week!==null){
        for(const kind of Object.keys(types)){
          const cycle=kind==='evangelho'?'ANUAL':info.ferialCycle;
          if(cycle)populate('FERIAL|TC|'+week+'|'+weekday+'|'+cycle+'|'+kind,kind);
        }
      }
    }
    return Object.values(result.leituras).some(a=>a.length)?result:null;
  }
  function fetchDate(date) {
    const archive=root.LCE_BR_ACERVO;
    if(!archive?.complete)return Promise.resolve(null);
    // As datas importadas prevalecem. Associações futuras nunca recorrem à API.
    const selected=associatedDate(date);
    if(!selected)return Promise.resolve(null);
    if(selected.leituras)return Promise.resolve(selected);
    const leituras={};
    for(const [kind,ids] of Object.entries(selected.byKind||{})){
      const key=kinds[kind];if(!key)continue;
      const entries=ids.map(id=>archive.texts[id]).filter(Boolean);
      if(entries.length)leituras[key]=entries.map(row=>({
        referencia:row.reference,texto:row.text,refrao:row.refrain||'',titulo:row.title||''
      }));
    }
    return Promise.resolve({data:date.split('-').reverse().join('/'),leituras});
  }
  function createText(tag,content,cls){
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    node.textContent=content;
    return node;
  }
  // Rótulos das estrofes vêm da referência local, não da simples ordem da API.
  // Se o número de estrofes não coincidir, a referência não é atribuída por suposição.
  function parsePsalmRanges(reference) {
    const ref=String(reference||'').replace(/\s*\(R\.[^)]*\)\s*$/i,'').trim();
    const comma=ref.indexOf(',');
    if(comma<0)return [];
    const part=ref.slice(comma+1).trim();
    const fragments=part.split('.').map(s=>s.trim()).filter(Boolean);
    if(!fragments.length||fragments.some(s=>!/^\d+[a-z]*(?:\s*-\s*\d+[a-z]*)?$/i.test(s)))return [];
    return fragments.map(fragment=>{
      const ends=fragment.split('-').map(v=>v.trim());
      const lo=parseInt(ends[0],10),hi=parseInt(ends.at(-1),10);
      if(!Number.isFinite(lo)||!Number.isFinite(hi)||hi<lo)return null;
      const suffix=ends[0]===ends.at(-1)?'v. ':'vv. ';
      const pretty=fragment.replace(/\s*-\s*/g,'–');
      return {raw:fragment,start:lo,end:hi,label:suffix+pretty};
    }).filter(Boolean);
  }
  function psalmStanzaLabels(reference,numberOfStanzas){
    const ranges=parsePsalmRanges(reference);
    if(ranges.length===numberOfStanzas)
      return ranges.map((r,i)=>'Estrofe '+(i+1)+' · '+r.label);
    return Array.from({length:numberOfStanzas},(_,i)=>'Estrofe '+(i+1));
  }
  function appendReading(parent,record,item,reference) {
    if(record.titulo)parent.append(createText('strong',record.titulo,'monthly-remote-title'));
    if(item==='salmo'){
      const refrain=String(record.refrao||'').trim();
      if(refrain){
        const box=document.createElement('section');
        box.className='monthly-psalm-refrain-box';
        box.append(createText('span','Refrão','monthly-psalm-box-label'));
        box.append(createText('p','R. '+refrain,'monthly-remote-refrain'));
        box.append(createText('small','Repetir após cada estrofe','monthly-psalm-repeat-note'));
        parent.append(box);
      }
      const verses=String(record.texto||'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
      const labels=psalmStanzaLabels(reference||record.referencia,verses.length);
      const container=document.createElement('div');container.className='monthly-psalm-stanzas';
      verses.forEach((stanza,i)=>{
        const box=document.createElement('section');
        box.className='monthly-psalm-stanza';
        box.append(createText('h4',labels[i],'monthly-psalm-box-label'));
        box.append(createText('p',stanza,'monthly-remote-stanza'));
        container.append(box);
      });
      parent.append(container);
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
    if(!entry?.editorialStudy||!card)return false;
    const pane=card.querySelector('.original-text');
    const label=card.querySelector('.original-pane .pane-label');
    if(!pane||!label)return false;
    const status=createText('p','Abrindo leitura salva…','monthly-remote-status');
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
      appendReading(body,record,entry.item,entry.referencia);
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
  root.LCE_FONTE_LOCAL={normalizeReference,normalizeDate,referenceMatches,resolveReading,fetchDate,loadForEntry,parsePsalmRanges,psalmStanzaLabels,associatedDate};
})(window);
