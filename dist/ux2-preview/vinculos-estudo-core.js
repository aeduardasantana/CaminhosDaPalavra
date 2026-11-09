/* Índice de vínculos do estudo — funções puras, sem inferência teológica ou lexical. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.CDP_STUDY_LINKS_CORE=api;
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const chapterKey=(bookId,chapter)=>String(bookId)+':'+Number(chapter);
  const position=(chapter,verse)=>Number(chapter)*1000+Number(verse);
  const validSelection=(selection)=>selection&&/^[A-Z0-9]{3}$/.test(selection.bookId||'')&&
    Number.isInteger(selection.chapter)&&selection.chapter>0;
  function isDocumentedForVerse(link,bookId,chapter,verse){
    if(!link||!link.target||link.target.bookId!==bookId||!Number.isInteger(verse)||verse<1)return false;
    if(!['verse','passage','cross_chapter_passage'].includes(link.scope))return false;
    const target=link.target;
    const start=position(target.startChapter,target.startVerse||1);
    const end=position(target.endChapter,target.endVerse||999);
    const value=position(chapter,verse);
    return value>=start&&value<=end;
  }
  function overlapsSelection(link,selection){
    if(!validSelection(selection)||!link?.target||link.target.bookId!==selection.bookId)return false;
    if(selection.startVerse==null){
      return link.target.startChapter<=selection.chapter&&link.target.endChapter>=selection.chapter;
    }
    const start=position(selection.chapter,selection.startVerse);
    const end=position(selection.chapter,selection.endVerse??selection.startVerse);
    const linkStart=position(link.target.startChapter,link.target.startVerse||1);
    const linkEnd=position(link.target.endChapter,link.target.endVerse||999);
    return start<=linkEnd&&end>=linkStart;
  }
  function forChapter(index,bookId,chapter){
    const entry=index?.chapters?.[chapterKey(bookId,chapter)];
    if(!entry)return null;
    const byId=index.links||{};
    const referenced=(entry.linkIds||[]).map(id=>byId[id]).filter(Boolean);
    return {
      chapter:entry,
      contextualDictionary:referenced.filter(link=>link.kind==='dictionary-context'),
      observations:referenced.filter(link=>link.kind==='observation')
    };
  }
  function forPassage(index,selection){
    if(!validSelection(selection))return {chapter:null,contextualDictionary:[],observations:[]};
    const section=forChapter(index,selection.bookId,selection.chapter);
    if(!section)return {chapter:null,contextualDictionary:[],observations:[]};
    return {
      chapter:section.chapter,
      contextualDictionary:section.contextualDictionary.filter(link=>overlapsSelection(link,selection)),
      observations:section.observations.filter(link=>overlapsSelection(link,selection))
    };
  }
  function forVerse(index,bookId,chapter,verse){
    const scoped=forPassage(index,{bookId,chapter,startVerse:verse,endVerse:verse});
    return {
      contextualDictionary:scoped.contextualDictionary.filter(link=>isDocumentedForVerse(link,bookId,chapter,verse)),
      observations:scoped.observations.filter(link=>isDocumentedForVerse(link,bookId,chapter,verse))
    };
  }
  // Números de rodapé são atribuídos uma vez por vínculo à passagem exibida.
  // Uma relação com vários versículos ganha um único marcador no primeiro versículo
  // visível da sua abrangência; relações com todo o capítulo não ganham marcadores
  // individuais. Assim não se inventam comentários específicos por versículo.
  function readingFootnotes(index,bookId,chapter,startVerse=null,endVerse=null){
    const entry=index?.chapters?.[chapterKey(bookId,chapter)];
    if(!entry||!Number.isInteger(entry.verseCount)||entry.verseCount<1)
      return {markers:{},notes:[],chapterReferences:[]};
    const first=startVerse==null?1:Math.max(1,startVerse);
    const last=endVerse==null?entry.verseCount:Math.min(entry.verseCount,endVerse);
    if(!Number.isInteger(first)||!Number.isInteger(last)||first>last)
      return {markers:{},notes:[],chapterReferences:[]};
    const seen=new Set(),specific=[],chapterReferences=[];
    for(const id of entry.linkIds||[]){
      if(seen.has(id))continue;
      seen.add(id);
      const link=index?.links?.[id];
      if(!link||!link.target||link.target.bookId!==bookId)continue;
      if(link.scope==='chapter'||link.scope==='chapter_range'){
        if(link.target.startChapter<=chapter&&link.target.endChapter>=chapter)
          chapterReferences.push(link);
        continue;
      }
      if(!['verse','passage','cross_chapter_passage'].includes(link.scope))continue;
      const firstTarget=chapter===link.target.startChapter?link.target.startVerse:1;
      const lastTarget=chapter===link.target.endChapter?link.target.endVerse:entry.verseCount;
      const firstVisible=Math.max(first,firstTarget);
      const lastVisible=Math.min(last,lastTarget);
      if(link.target.startChapter<=chapter&&link.target.endChapter>=chapter&&
         Number.isInteger(firstVisible)&&Number.isInteger(lastVisible)&&firstVisible<=lastVisible)
        specific.push({link,anchorVerse:firstVisible,visibleEnd:lastVisible});
    }
    specific.sort((a,b)=>a.anchorVerse-b.anchorVerse||
      (a.link.scope==='verse'?-1:1)-(b.link.scope==='verse'?-1:1)||
      a.link.id.localeCompare(b.link.id));
    const markers={},notes=[];
    for(const item of specific){
      const number=notes.length+1;
      const note={number,id:item.link.id,link:item.link,scope:item.link.scope,
        anchorVerse:item.anchorVerse,visibleEnd:item.visibleEnd};
      notes.push(note);
      (markers[item.anchorVerse]??=[]).push(note);
    }
    return {markers,notes,chapterReferences};
  }
  function forLexicalAnchor(index,bookId,chapter,verse,term){
    const folded=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    return (index?.lexicalAnchors||[]).filter(a=>a.bookId===bookId&&
      a.chapter===chapter&&a.verse===verse&&folded(a.term)===folded(term)&&
      a.reviewStatus==='verificado');
  }
  return Object.freeze({chapterKey,isDocumentedForVerse,overlapsSelection,forChapter,forPassage,forVerse,readingFootnotes,forLexicalAnchor});
});
