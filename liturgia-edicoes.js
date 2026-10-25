/* Liturgia: o salmo é sempre CNBB; as outras leituras selecionam texto E glosa. */
(function(root){
 'use strict';
 const allowed=new Set(['primeira-leitura','segunda-leitura','evangelho']);
 const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
 function editionFor(kind,choice){return kind==='salmo'?'CNBB':allowed.has(kind)&&choice==='AVM'?'AVM':'CNBB';}
 function aveReadings(entry,archive=root.LCE_AVE_MARIA_ACERVO){
   if(!archive||archive.edition!=='AVM'||!allowed.has(entry?.item))return [];
   const ids=archive.dates?.[entry.data]?.[entry.item]??archive.byPassage?.[entry.item+'|'+norm(entry.referencia)]??[];
   return (Array.isArray(ids)?ids:[ids]).map(id=>archive.texts?.[id])
     .filter(item=>item?.edition==='AVM'&&item.kind===entry.item&&norm(item.reference)===norm(entry.referencia)&&
       typeof item.text==='string'&&item.text.trim().length>0);
 }
 const element=(tag,text,cls)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;return e;};
 function unavailable(textPane,glossPane){
   textPane.replaceChildren(element('p','Texto da Bíblia Ave-Maria ainda não incorporado para esta leitura.','liturgia-edicao-pendente'));
   glossPane.replaceChildren(element('p','Glosa correspondente à Bíblia Ave-Maria ainda não elaborada.','liturgia-edicao-pendente'));
 }
 function showAve(entry,card){
   const text=card.querySelector('.original-text'),gloss=card.querySelector('.glosa-text');
   if(!text||!gloss)return;
   card.dataset.edition='AVM';card.dataset.completeText='false';card.dataset.dynamicBrazilianText='false';
   card.querySelector('.original-pane .pane-label').textContent='Texto · Bíblia Ave-Maria';
   card.querySelector('.glosa-pane .pane-label').textContent='Glosa · Bíblia Ave-Maria';
   const oldNotes=card.querySelector('.liturgy-study-notes');if(oldNotes)oldNotes.hidden=true;
   const oldSource=card.querySelector('.original-source-link');if(oldSource)oldSource.hidden=true;
   const sourceNote=card.querySelector('.reading-source-note');
   if(sourceNote)sourceNote.textContent='Edição Ave-Maria; revisão de texto e glosa independentes da CNBB.';
   const records=aveReadings(entry);
   if(!records.length){unavailable(text,gloss);return;}
   const record=records[0];
   text.replaceChildren(element('p',record.text,'liturgia-ave-maria-texto'));
   if(record.gloss?.textId!==record.id||!Array.isArray(record.gloss.segments)||!record.gloss.segments.length){
     gloss.replaceChildren(element('p','Glosa da versão Ave-Maria ainda pendente.','liturgia-edicao-pendente'));
   }else{
     gloss.replaceChildren();
     for(const unit of record.gloss.segments){
       const area=document.createElement('section');area.className='liturgia-ave-maria-glosa';
       if(unit.orientation)area.append(element('small','Orientação · não sinalizar literalmente: '+unit.orientation,'monthly-glosa-direction'));
       area.append(element('p',unit.text,'monthly-glosa-signs'));gloss.append(area);
     }
   }
   const badge=card.querySelector('.status-pill');
   if(badge)badge.textContent=record.gloss?.textId===record.id?'Em revisão':'Glosa pendente';
 }
 function apply(entry,card,choice){
   const edition=editionFor(entry.item,choice);
   if(edition==='AVM'){
     // Não exportar um PDF de 'texto e glosa' contendo apenas avisos ou texto incompleto.
     card.dataset.editorialStudy='true';
     card.dataset.completeText='false';
     return showAve(entry,card);
   }
   card.dataset.edition=entry.editorialStudy?'CNBB':'LEGADO';
   if(!entry.editorialStudy){
     card.querySelector('.original-pane .pane-label').textContent='Texto legado · edição não cotejada como CNBB';
     card.querySelector('.glosa-pane .pane-label').textContent='Glosa de estudo do acervo legado';
     return;
   }
   const sourceNote=card.querySelector('.reading-source-note');
   if(sourceNote)sourceNote.textContent='Fonte comunitária importada; cotejo textual CNBB e revisão da glosa ainda pendentes.';
   card.querySelector('.original-pane .pane-label').textContent=entry.item==='salmo'?'Salmo · CNBB (em cotejo)':'Texto · CNBB (em cotejo)';
   if(root.LCE_FONTE_LOCAL)root.LCE_FONTE_LOCAL.loadForEntry(entry,card);
 }
 root.LCE_EDICOES=Object.freeze({editionFor,aveReadings,apply});
})(window);
