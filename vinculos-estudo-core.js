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
  function forLexicalAnchor(index,bookId,chapter,verse,term){
    const folded=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    return (index?.lexicalAnchors||[]).filter(a=>a.bookId===bookId&&
      a.chapter===chapter&&a.verse===verse&&folded(a.term)===folded(term)&&
      a.reviewStatus==='verificado');
  }
  return Object.freeze({chapterKey,isDocumentedForVerse,overlapsSelection,forChapter,forPassage,forVerse,forLexicalAnchor});
});
