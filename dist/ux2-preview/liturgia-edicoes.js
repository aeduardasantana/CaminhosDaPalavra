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
 const avmBooks={
  Gn:'GEN',Ex:'EXO',Lv:'LEV',Nm:'NUM',Dt:'DEU',Js:'JOS',Jz:'JDG',Rt:'RUT',
  '1Sm':'1SA','2Sm':'2SA','1Rs':'1KI','2Rs':'2KI','1Cr':'1CH','2Cr':'2CH',
  Esd:'EZR',Ne:'NEH',Tb:'TOB',Jt:'JDT',Est:'EST','1Mc':'1MA','2Mc':'2MA',
  Jó:'JOB',Sl:'PSA',Pr:'PRO',Ecl:'ECC',Ct:'SNG',Sb:'WIS',Eclo:'SIR',EcloS:'SIR',
  Is:'ISA',Jr:'JER',Lm:'LAM',Ez:'EZK',Dn:'DAN',Os:'HOS',Jl:'JOL',Am:'AMO',
  Ab:'OBA',Jn:'JON',Mq:'MIC',Na:'NAM',Hab:'HAB',Sf:'ZEP',Ag:'HAG',Zc:'ZEC',Ml:'MAL',
  Mt:'MAT',Mc:'MRK',Lc:'LUK',Jo:'JHN',At:'ACT',Rm:'ROM',
  '1Cor':'1CO','2Cor':'2CO','1Co':'1CO','2Co':'2CO',Gl:'GAL',Ef:'EPH',
  Fl:'PHP',Fp:'PHP',Cl:'COL','1Ts':'1TH','2Ts':'2TH','1Tm':'1TI','2Tm':'2TI',
  Tt:'TIT',Fm:'PHM',Hb:'HEB',Tg:'JAS','1Pd':'1PE','2Pd':'2PE',
  '1Pe':'1PE','2Pe':'2PE','1Jo':'1JN','2Jo':'2JN','3Jo':'3JN',Jd:'JUD',Ap:'REV'
 };
 function avmUrl(reference){
   const match=String(reference||'').trim().match(/^((?:[1-3]\\s*)?[A-Za-zÀ-ÿ]+)\\s+(\\d+)/);
   if(!match)return 'https://www.bible.com/pt/versions/4542';
   const key=match[1].replace(/\\s+/g,'');
   const book=avmBooks[key]||avmBooks[Object.keys(avmBooks).find(k=>norm(k)===norm(key))];
   return book?'https://www.bible.com/pt/bible/4542/'+book+'.'+Number(match[2])+'.AVM':
     'https://www.bible.com/pt/versions/4542';
 }
 function attachReference(pane,entry){
   const box=document.createElement('div');box.className='liturgia-edicao-pendente';
   box.append(element('strong','Bíblia Sagrada Ave-Maria — '+entry.referencia));
   box.append(element('p','A referência da leitura está organizada nesta edição. Consulte o texto original no editor autorizado enquanto a incorporação integral ao acervo estiver pendente.'));
   const a=document.createElement('a');a.href=avmUrl(entry.referencia);
   a.target='_blank';a.rel='noopener noreferrer';a.textContent='Ler na Bíblia Ave-Maria ↗';
   box.append(a);pane.replaceChildren(box);
 }
 function unavailable(textPane,glossPane,entry){
   attachReference(textPane,entry);
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
   if(!records.length){unavailable(text,gloss,entry);return;}
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
   // Pareamento Ave-Maria somente se o arquivo registrar referências de
   // CADA glosa; nunca inventar o alinhamento a partir de sua ordem.
   if(record.gloss?.textId===record.id && root.LCE_PARALELO &&
      record.gloss.segments.every(u=>typeof u.ref==='string'&&u.ref.trim()))
     root.LCE_PARALELO.apply(entry,card,{texto:record.text,titulo:record.title||''},
       record.gloss.segments.map(u=>({ref:u.ref,glosa:u.text,espaco:u.orientation||''})));
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
