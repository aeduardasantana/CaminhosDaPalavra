/* Liturgia + Libras: texto e glosa no mesmo quadro horizontal, por versículo/estrofe.
   Só aplica pareamento quando referências e cobertura correspondem integralmente.
   Não inventa trechos nem altera a fonte armazenada. */
(function(root){
  'use strict';
  const normRef=ref=>String(ref||'').replace(/\s+/g,' ').trim();
  function refRange(reference){
    const match=normRef(reference).match(/,\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*$/);
    if(!match)return null;
    const from=Number(match[1]),to=match[2]?Number(match[2]):from;
    return to>=from&&to-from<30?{from,to}:null;
  }
  function numberedVerses(body){
    // Letras e aspas depois do número, como "1os", "4“Se": são marcadores
    // presentes no texto armazenado, não números arbitrários inseridos por IA.
    const source=String(body||'');
    const marks=[...source.matchAll(/(^|[\s.,;:!?“”«»(\[])(\d{1,3})(?=[\p{L}“”«»"'‘’])/gu)]
      .map(m=>({number:Number(m[2]),start:m.index+m[1].length,end:m.index+m[0].length}));
    if(!marks.length)return [];
    const result=[];
    for(let i=0;i<marks.length;i++){
      const m=marks[i],next=marks[i+1];
      const text=(i===0?source.slice(0,m.start):'')+
        source.slice(m.end,next?next.start:source.length);
      result.push({number:m.number,text:text.trim()});
    }
    return result;
  }
  function planVerses(entry,record,units){
    if(!Array.isArray(units)||!units.length)return null;
    const refs=units.map(u=>refRange(u.ref));
    if(refs.some(r=>!r))return null;
    const verses=numberedVerses(record.texto??record.text);
    if(!verses.length)return null;
    const wanted=refs.flatMap(r=>Array.from({length:r.to-r.from+1},(_,i)=>r.from+i));
    // Um número ausente ou diferente impede caixas falsamente alinhadas.
    if(verses.length!==wanted.length||verses.some((v,i)=>v.number!==wanted[i]))return null;
    let cursor=0;
    return units.map((unit,i)=>{
      const range=refs[i],slice=verses.slice(cursor,cursor+range.to-range.from+1);
      cursor+=slice.length;
      return {label:normRef(unit.ref),original:slice.map(s=>s.text).join(' '),
        glosas:[unit],title:i===0?String(record.titulo||record.title||''):''};
    });
  }
  function planPsalm(entry,record,units,source=root.LCE_FONTE_LOCAL){
    const ranges=source?.parsePsalmRanges?.(entry.referencia)||[];
    const stanzas=String(record.texto??record.text??'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
    if(!ranges.length||ranges.length!==stanzas.length)return null;
    const relevant=units.filter(u=>!/^R\./i.test(u.ref));
    const refrain=units.find(u=>/^R\./i.test(u.ref)&&!/repeti/i.test(u.ref));
    if(!relevant.length||!refrain||!String(record.refrao??record.refrain??'').trim())return null;
    const groups=ranges.map(range=>relevant.filter(u=>{
      const r=refRange(u.ref);return r&&r.from>=range.start&&r.to<=range.end;
    }));
    if(groups.some(g=>!g.length)||groups.flat().length!==relevant.length)return null;
    const items=[{label:'Refrão',original:'R. '+String(record.refrao??record.refrain).trim(),
      glosas:[refrain],refrain:true,repeat:'Repetir após cada estrofe'}];
    for(let i=0;i<ranges.length;i++){
      items.push({label:'Estrofe '+(i+1)+' · '+ranges[i].label,original:stanzas[i],glosas:groups[i]});
    }
    return items;
  }
  function makePlan(entry,record,units){
    if(!entry||!record||!Array.isArray(units)||!units.length)return null;
    return entry.item==='salmo'?planPsalm(entry,record,units):planVerses(entry,record,units);
  }
  function el(tag,content,cls){
    const x=document.createElement(tag);if(cls)x.className=cls;
    if(content!==undefined)x.textContent=content;return x;
  }
  function renderGlosa(into,unit){
    const box=el('div',undefined,'monthly-glosa-draft');
    if(typeof root.appendGlossWithDirections==='function')
      root.appendGlossWithDirections(box,unit.glosa);
    else box.textContent=unit.glosa||''; // Sem perda de conteúdo no fallback.
    into.append(box);
  }
  function reset(card){
    const parallel=card.querySelector('.parallel-view');
    if(!parallel?.hasAttribute('data-aligned'))return;
    const original=parallel.querySelector('.original-pane');
    const glosa=parallel.querySelector('.glosa-pane');
    const footer=parallel.querySelector('.lce-parallel-footer');
    if(footer){
      for(const child of [...footer.querySelector('.lce-parallel-footer-original')?.children||[]])
        original.appendChild(child);
      for(const child of [...footer.querySelector('.lce-parallel-footer-glosa')?.children||[]])
        glosa.appendChild(child);
      footer.remove();
    }
    parallel.querySelector('.lce-parallel-rows')?.remove();
    parallel.removeAttribute('data-aligned');
    original.querySelector('.original-text')?.removeAttribute('aria-hidden');
    glosa.querySelector('.glosa-text')?.removeAttribute('aria-hidden');
  }
  // Estrofes do legado só são emparelhadas se a segmentação do acervo
  // está declarada conferida e ambos os lados têm igual quantidade.
  function applyLegacyPsalm(card,parsed){
    if(!parsed?.structureVerified)return false;
    const parallel=card?.querySelector('.parallel-view');
    const original=parallel?.querySelector('.original-text');
    const gloss=parallel?.querySelector('.glosa-text');
    const leftSeq=original?.querySelector('.psalm-sequence');
    const rightSeq=gloss?.querySelector('.psalm-sequence');
    if(!leftSeq||!rightSeq)return false;
    const ls=[...leftSeq.querySelectorAll(':scope > .psalm-stanza')];
    const rs=[...rightSeq.querySelectorAll(':scope > .psalm-stanza')];
    if(!ls.length||ls.length!==rs.length||rs.some(n=>n.querySelector('.psalm-glosa-missing')))return false;
    const lr=leftSeq.querySelector(':scope > .psalm-refrain:not(.is-repeat)');
    const rr=rightSeq.querySelector(':scope > .psalm-refrain:not(.is-repeat)');
    if(!lr||!rr)return false;
    const rows=el('div',undefined,'lce-parallel-rows lce-legacy-psalm-rows');
    const origHeader=original.querySelector('.psalm-header');
    for(let i=-1;i<ls.length;i++){
      const row=el('section',undefined,'lce-parallel-row');
      const left=el('div',undefined,'lce-parallel-original');
      const right=el('div',undefined,'lce-parallel-glosa');
      if(i===-1){
        if(origHeader)left.append(origHeader.cloneNode(true));
        left.append(lr.cloneNode(true));right.append(rr.cloneNode(true));
      }else{
        left.append(ls[i].cloneNode(true));right.append(rs[i].cloneNode(true));
      }
      row.append(left,right);rows.append(row);
    }
    const footer=el('div',undefined,'lce-parallel-footer');
    const left=el('div',undefined,'lce-parallel-footer-original');
    const right=el('div',undefined,'lce-parallel-footer-glosa');
    for(const selector of ['.reading-source-details']){
      const part=parallel.querySelector('.original-pane '+selector);if(part)left.append(part);
    }
    footer.append(left,right);
    parallel.append(rows,footer);
    parallel.setAttribute('data-aligned','true');
    original.setAttribute('aria-hidden','true');gloss.setAttribute('aria-hidden','true');
    return true;
  }

  function apply(entry,card,record,units=entry?.verseUnits){
    if(!card?.querySelector)return false;
    reset(card);
    const plan=makePlan(entry,record,units);
    if(!plan?.length)return false;
    const parallel=card.querySelector('.parallel-view');
    const original=parallel?.querySelector('.original-pane'),glosa=parallel?.querySelector('.glosa-pane');
    if(!parallel||!original||!glosa)return false;
    const originalText=original.querySelector('.original-text'),glossText=glosa.querySelector('.glosa-text');
    if(!originalText||!glossText)return false;
    const rows=el('div',undefined,'lce-parallel-rows');
    rows.setAttribute('aria-label','Texto e glosa alinhados por trecho');
    for(const [i,item] of plan.entries()){
      const row=el('section',undefined,'lce-parallel-row');
      const left=el('div',undefined,'lce-parallel-original');
      const right=el('div',undefined,'lce-parallel-glosa');
      left.append(el('span',item.label,'lce-parallel-reference'));
      if(item.title)left.append(el('strong',item.title,'lce-parallel-title'));
      left.append(el('p',item.original,'lce-parallel-text'));
      right.append(el('span',i===0?'Glosa correspondente':'Glosa','lce-parallel-mobile-label'));
      for(const unit of item.glosas){
        if(item.glosas.length>1)right.append(el('span',unit.ref,'lce-parallel-unit-reference'));
        renderGlosa(right,unit);
      }
      if(item.repeat){
        left.append(el('small',item.repeat,'lce-parallel-repeat'));
        right.append(el('small',item.repeat,'lce-parallel-repeat'));
      }
      row.append(left,right);rows.append(row);
    }
    // As fórmulas rituais e a ficha de revisão ficam após os pares, sem
    // alongar artificialmente uma coluna ou confundir orientação com glosa.
    const footer=el('div',undefined,'lce-parallel-footer');
    const left=el('div',undefined,'lce-parallel-footer-original');
    const right=el('div',undefined,'lce-parallel-footer-glosa');
    for(const selector of ['.liturgical-dialogue','.reading-source-details']){
      const part=original.querySelector(selector);if(part)left.append(part);
    }
    const response=glosa.querySelector('.liturgical-dialogue');
    if(response)right.append(response);
    footer.append(left,right);
    parallel.append(rows,footer);
    parallel.setAttribute('data-aligned','true');
    originalText.setAttribute('aria-hidden','true');
    glossText.setAttribute('aria-hidden','true');
    return true;
  }
  // Leituras legadas: só criar pares quando existe correspondência 1:1
  // verificável entre linhas de origem e unidades da glosa. Não dividir
  // arbitrariamente o texto para simular equivalência linguística.
  function applyLegacyReading(card){
    const parallel=card?.querySelector('.parallel-view');
    if(!parallel||parallel.hasAttribute('data-aligned'))return false;
    const original=parallel.querySelector('.original-pane .original-text');
    const gloss=parallel.querySelector('.glosa-pane .glosa-text');
    if(!original||!gloss)return false;
    const source=original.textContent||'';
    const lines=source.split(/\n+/).map(x=>x.trim()).filter(Boolean);
    const glossLines=[...gloss.children].filter(x=>x.classList.contains('glosa-line'));
    const notes=[...gloss.children].filter(x=>x.classList.contains('visual-note'));
    // Não adivinhar a segmentação quando a transcrição não traz quebras.
    if(lines.length<2||lines.length!==glossLines.length||notes.length)return false;
    const rows=el('div',undefined,'lce-parallel-rows lce-legacy-reading-rows');
    rows.setAttribute('aria-label','Leitura e glosa organizadas por unidades correspondentes do acervo legado');
    lines.forEach((line,i)=>{
      const row=el('section',undefined,'lce-parallel-row');
      const left=el('div',undefined,'lce-parallel-original');
      const right=el('div',undefined,'lce-parallel-glosa');
      left.append(el('p',line,'lce-parallel-text'));
      const draft=el('div',undefined,'monthly-glosa-draft');
      const sign=el('span',glossLines[i].textContent,'monthly-glosa-signs');
      draft.append(sign);right.append(draft);
      row.append(left,right);rows.append(row);
    });
    parallel.append(rows);
    parallel.setAttribute('data-aligned','true');
    original.setAttribute('aria-hidden','true');
    gloss.setAttribute('aria-hidden','true');
    return true;
  }
  root.LCE_PARALELO=Object.freeze({refRange,numberedVerses,planVerses,planPsalm,makePlan,apply,applyLegacyPsalm,applyLegacyReading,reset});
})(window);
