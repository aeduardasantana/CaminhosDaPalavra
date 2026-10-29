/* Caminhos da Palavra — módulo Bíblia para estudo (metadados públicos).
 * Não contém nem autoriza texto integral da Bíblia Ave-Maria.
 * Núcleo puro e testável em Node e navegador. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CDP_BIBLE_STUDY_CORE = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const EDITION = Object.freeze({
    id: 'AVM-ESTUDOS-2',
    label: 'Bíblia Sagrada — Ave-Maria',
    edition: '2ª edição (identificada no arquivo recebido)',
    note: 'Obra para estudo; texto integral não disponibilizado neste módulo sem autorização.',
    externalUrl: 'https://www.bible.com/pt/versions/4542'
  });
  const GROUPS = [
    {testament:'AT',name:'Pentateuco',ids:'GEN EXO LEV NUM DEU'},
    {testament:'AT',name:'Livros Históricos',ids:'JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH TOB JDT EST 1MA 2MA'},
    {testament:'AT',name:'Livros Sapienciais',ids:'JOB PSA PRO ECC SNG WIS SIR'},
    {testament:'AT',name:'Profetas Maiores',ids:'ISA JER LAM BAR EZK DAN'},
    {testament:'AT',name:'Profetas Menores',ids:'HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL'},
    {testament:'NT',name:'Evangelhos e Histórico',ids:'MAT MRK LUK JHN ACT'},
    {testament:'NT',name:'Cartas de São Paulo (Paulinas)',ids:'ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB'},
    {testament:'NT',name:'Cartas Católicas (Universais)',ids:'JAS 1PE 2PE 1JN 2JN 3JN JUD'},
    {testament:'NT',name:'Livro Profético',ids:'REV'}
  ].map(group=>({...group,ids:group.ids.split(' ')}));
  const ABBR = {
    GEN:'Gn',EXO:'Ex',LEV:'Lv',NUM:'Nm',DEU:'Dt',JOS:'Js',JDG:'Jz',RUT:'Rt',
    '1SA':'1Sm','2SA':'2Sm','1KI':'1Rs','2KI':'2Rs','1CH':'1Cr','2CH':'2Cr',
    EZR:'Esd',NEH:'Ne',TOB:'Tb',JDT:'Jt',EST:'Est','1MA':'1Mc','2MA':'2Mc',
    JOB:'Jó',PSA:'Sl',PRO:'Pr',ECC:'Ecl',SNG:'Ct',WIS:'Sb',SIR:'Eclo',
    ISA:'Is',JER:'Jr',LAM:'Lm',BAR:'Br',EZK:'Ez',DAN:'Dn',
    HOS:'Os',JOL:'Jl',AMO:'Am',OBA:'Ab',JON:'Jn',MIC:'Mq',
    NAM:'Na',HAB:'Hab',ZEP:'Sf',HAG:'Ag',ZEC:'Zc',MAL:'Ml',
    MAT:'Mt',MRK:'Mc',LUK:'Lc',JHN:'Jo',ACT:'At',ROM:'Rm',
    '1CO':'1Cor','2CO':'2Cor',GAL:'Gl',EPH:'Ef',PHP:'Fl',COL:'Cl',
    '1TH':'1Ts','2TH':'2Ts','1TI':'1Tm','2TI':'2Tm',TIT:'Tt',
    PHM:'Fm',HEB:'Hb',JAS:'Tg','1PE':'1Pd','2PE':'2Pd',
    '1JN':'1Jo','2JN':'2Jo','3JN':'3Jo',JUD:'Jd',REV:'Ap'
  };
  const SPECIAL_ALIASES = {
    GEN:['genesis'],EXO:['exodo'],JDG:['juizes'],RUT:['rute'],
    '1SA':['1 samuel','i samuel','1sm'],'2SA':['2 samuel','ii samuel','2sm'],
    '1KI':['1 reis','i reis'],'2KI':['2 reis','ii reis'],
    '1CH':['1 cronicas','i cronicas'],'2CH':['2 cronicas','ii cronicas'],
    JOB:['jó'],PSA:['salmo','salmos','psalm'],
    ECC:['coeleth','qohelet','eclesiastes'],SIR:['siracida','sirácida','eclesiastico'],
    SNG:['cantico dos canticos','canticos'],WIS:['sabedoria'],
    MAT:['mateus','sao mateus'],MRK:['marcos','sao marcos'],
    LUK:['lucas','sao lucas'],JHN:['joao','sao joao','jo'],
    ACT:['atos','atos dos apostolos'],ROM:['romanos'],
    '1CO':['1 corintios','i corintios'], '2CO':['2 corintios','ii corintios'],
    JAS:['tiago','sao tiago'],JUD:['judas','sao judas'],REV:['apocalipse']
  };
  function fold(str) {return String(str||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[.º°]/g,'').replace(/\s+/g,' ').trim();}
  function catalog(bible) {
    const books=bible&&Array.isArray(bible.books)?bible.books:[];
    const byId=new Map(books.map(book=>[book.id,book]));
    const seen=new Set();
    const rows=[];
    GROUPS.forEach(group=>group.ids.forEach(id=>{
      if(seen.has(id)||!byId.has(id)) throw new Error('Catálogo bíblico inconsistente: '+id);
      seen.add(id);
      rows.push({...byId.get(id),group:group.name,abbrev:ABBR[id],canonOrder:rows.length+1});
    }));
    if(rows.length!==73||books.length!==73||books.some(book=>!seen.has(book.id))||
      rows.filter(row=>row.testament==='AT').length!==46||
      rows.reduce((a,b)=>a+b.chapters,0)!==1334) throw new Error('Cobertura bíblica inesperada.');
    return rows;
  }
  function aliasesFor(book) {
    const parts=[book.name,book.id,book.abbrev,...(SPECIAL_ALIASES[book.id]||[])];
    return [...new Set(parts.map(fold).filter(Boolean))];
  }
  function findBook(name, books) {
    const source=String(name||'').trim();
    const exact=books.find(b=>[b.name,b.id,b.abbrev,...(SPECIAL_ALIASES[b.id]||[])].some(alias=>String(alias).toLowerCase()===source.toLowerCase()));
    if(exact)return exact;
    const value=fold(source);
    const candidates=books.filter(book=>aliasesFor(book).includes(value));
    return candidates.length===1?candidates[0]:null;
  }
  function parseReference(input, books) {
    const raw=String(input||'').trim().replace(/[–—]/g,'-');
    if(raw.length>110)return {error:'Referência muito longa.'};
    const found=raw.match(/^(.+?)\s+(\d{1,3})(?:\s*[,.:]\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?)?\s*$/);
    if(!found)return {error:'Use livro, capítulo e, opcionalmente, versículos. Ex.: Jo 3,16-18.'};
    const book=findBook(found[1],books);
    if(!book)return {error:'Livro não identificado no catálogo católico.'};
    const chapter=Number(found[2]),start=found[3]?Number(found[3]):null,end=found[4]?Number(found[4]):start;
    if(!Number.isInteger(chapter)||chapter<1||chapter>book.chapters)return {error:'Capítulo fora do intervalo cadastrado para este livro.'};
    if(start!==null&&(start<1||start>176||end<start||end>176))
      return {error:'Intervalo de versículos inválido; a numeração exata deve ser conferida na fonte.'};
    return {book,chapter,start,end,key:referenceKey(book.id,chapter,start,end)};
  }
  function referenceKey(bookId,chapter,start=null,end=null) {
    return String(bookId)+':'+Number(chapter)+(start===null?'':':'+Number(start)+(end!==null&&Number(end)!==Number(start)?'-'+Number(end):''));
  }
  function formatReference(book,chapter,start=null,end=null) {
    return (book.abbrev||book.name)+' '+chapter+(start===null?'':','+start+(end!==null&&end!==start?'-'+end:''));
  }
  function uniqueSteps(bible) {
    const bookMap=new Map(bible.books.map(book=>[book.id,book]));const seen=new Set(),steps=[];
    function add(id,ch) {const key=referenceKey(id,ch);if(!seen.has(key)){seen.add(key);steps.push({bookId:id,chapter:ch,key});}}
    (bible.planOrder||[]).forEach(item=>{const book=bookMap.get(item.book);if(!book)return;for(let n=item.from||1;n<=(item.to||book.chapters);n++)add(book.id,n);});
    bible.books.forEach(book=>{for(let n=1;n<=book.chapters;n++)add(book.id,n);});
    return steps;
  }
  function chunks(arr,days) {
    const base=Math.floor(arr.length/days),extra=arr.length%days;let offset=0;
    return Array.from({length:days},(_,i)=>{const count=base+(Math.floor((i+1)*extra/days)>Math.floor(i*extra/days)?1:0);const slice=arr.slice(offset,offset+count);offset+=count;return slice;});
  }
  function planDays(bible) {
    const steps=uniqueSteps(bible),lookup=new Map(bible.books.map(x=>[x.id,x]));
    const nt=chunks(steps.filter(s=>lookup.get(s.bookId)?.testament==='NT'),75);
    const at=chunks(steps.filter(s=>lookup.get(s.bookId)?.testament==='AT'&&s.bookId!=='PSA'),290);
    const psalms=steps.filter(s=>s.bookId==='PSA').sort((a,b)=>a.chapter-b.chapter);
    const days=Array.from({length:365},(_,index)=>[...(index<75?nt[index]:at[index-75]),...(index<psalms.length?[psalms[index]]:[])]);
    const index=new Map();
    days.forEach((items,d)=>items.forEach(item=>{if(index.has(item.key))throw new Error('Capítulo repetido no plano.');index.set(item.key,d+1);}));
    if(index.size!==1334)throw new Error('Plano incompleto.');
    return {days,index};
  }
  function matchesChapterReference(ref,book,chapter,books) {
    const match=String(ref||'').match(/^(.+?)\s+(\d{1,3})(?:\s*\(|\s*[,.:]|$)/);
    if(!match)return false;
    const linked=findBook(match[1],books);
    return linked?.id===book.id&&Number(match[2])===Number(chapter);
  }
  function collectGlosas(book,chapter,books,base,contextual) {
    const out=[],seen=new Set();
    Object.entries(base||{}).forEach(([ref,glosa])=>{
      if(!matchesChapterReference(ref,book,chapter,books)||!String(glosa||'').trim())return;
      const id='base|'+ref;if(seen.has(id))return;seen.add(id);
      out.push({reference:ref,glosa:String(glosa),version:'glosa-base',status:'preliminar',source:'Preparação para liturgia dominical; não é o texto Ave-Maria.'});
    });
    Object.entries(contextual||{}).forEach(([cycle,obj])=>Object.entries(obj||{}).forEach(([key,glosa])=>{
      const ref=key.split('|').slice(4).join('|');
      if(!matchesChapterReference(ref,book,chapter,books)||!String(glosa||'').trim())return;
      const id=cycle+'|'+key;if(seen.has(id))return;seen.add(id);
      out.push({reference:ref,glosa:String(glosa),version:'contextual-'+cycle,status:'preliminar',source:'Roteiro por celebração; referência ao Lecionário, não à tradução Ave-Maria.'});
    }));
    return out;
  }
  function authorizedVerses(payload,bookId,chapter) {
    if(!payload||payload.editionId!==EDITION.id||payload.authorizedForWeb!==true||
      typeof payload.permissionReference!=='string'||!payload.permissionReference.trim())return [];
    const list=payload.chapters?.[referenceKey(bookId,chapter)]?.verses;
    if(!Array.isArray(list))return [];
    return list.filter(item=>item&&Number.isInteger(item.verse)&&item.verse>0&&item.verse<=176&&
      item.publicAuthorized===true&&typeof item.text==='string'&&item.text.trim()&&
      typeof item.sourcePage==='number'&&item.sourcePage>0).sort((a,b)=>a.verse-b.verse);
  }
  return Object.freeze({EDITION,GROUPS,ABBR,fold,catalog,findBook,parseReference,referenceKey,formatReference,uniqueSteps,planDays,matchesChapterReference,collectGlosas,authorizedVerses});
});
