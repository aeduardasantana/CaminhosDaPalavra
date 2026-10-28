#!/usr/bin/env node
/* Importação local idempotente. NÃO recupera textos da Internet. */
import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';
const args=process.argv.slice(2);
const get=(flag,otherwise)=>{const pos=args.indexOf(flag);return pos<0?otherwise:args[pos+1]||otherwise};
const input=get('--input'),output=get('--output','liturgia-ave-maria-acervo.js');
if(!input)throw Error('Informe --input com arquivo JSON de textos da edição Ave-Maria.');
const incoming=JSON.parse(fs.readFileSync(input,'utf8'));
if(incoming.edition!=='AVM'||incoming.period!=='2025-11'||!Array.isArray(incoming.entries))throw Error('Lote edition/period/entries inválido');
if(String(incoming.publicationAuthorization||'').trim().length<12)throw Error('Registrar a base de autorização para publicação');
if(String(incoming.sourceEdition||'').trim().length<8)throw Error('Identificar a edição Ave-Maria');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync('liturgia-2025-11.js','utf8'),sandbox);
const calendar=sandbox.window.LCE_MONTH_2025_11.readings;
const previous={window:{}};vm.runInNewContext(fs.readFileSync(output,'utf8'),previous);
const saved=previous.window.LCE_AVE_MARIA_ACERVO;
if(saved?.edition!=='AVM')throw Error('Edição de destino incorreta');
const kinds={'Primeira leitura':'primeira-leitura','Segunda leitura':'segunda-leitura','Evangelho':'evangelho'};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const corpus={edition:'AVM',version:1,sourceEdition:incoming.sourceEdition,publicationAuthorization:incoming.publicationAuthorization,
 texts:{...saved.texts},dates:JSON.parse(JSON.stringify(saved.dates||{})),byPassage:JSON.parse(JSON.stringify(saved.byPassage||{}))};
let inserted=0,reused=0;
const seen=new Set();
for(const item of incoming.entries){
 const date=item.date,kind=item.kind,reference=item.reference;
 if(!Object.values(kinds).includes(kind))throw Error('A edição AVM não contém salmo ou tipo desconhecido: '+kind);
 const day=calendar[date];if(!day)throw Error('Data ausente do mês: '+date);
 if(!day.items.some(([name,ref])=>kinds[name]===kind&&norm(ref)===norm(reference)))throw Error('Referência divergente do calendário: '+date+' '+reference);
 const occurrence=date+'|'+kind+'|'+norm(reference);
 if(seen.has(occurrence))throw Error('Ocorrência duplicada no lote: '+occurrence);
 seen.add(occurrence);
 if(typeof item.text!=='string'||item.text.trim().length<30)throw Error('Texto não fornecido ou curto: '+occurrence);
 const text=item.text.replace(/\r\n/g,'\n').trim();
 const id='avm-'+crypto.createHash('sha256').update(JSON.stringify([kind,norm(reference),text])).digest('hex').slice(0,24);
 const rec={id,edition:'AVM',kind,reference,text,textStatus:'IMPORTADO_PENDENTE_COTEJO',sourceEdition:incoming.sourceEdition};
 if(item.gloss){
  if(!Array.isArray(item.gloss.segments)||!item.gloss.segments.length||
      item.gloss.segments.some(x=>typeof x.text!=='string'||!x.text.trim()))throw Error('Glosa inválida: '+occurrence);
  rec.gloss={textId:id,segments:item.gloss.segments.map(x=>({text:x.text,orientation:x.orientation||''})),status:'PRELIMINAR_NAO_VALIDADA'};
 }
 if(corpus.texts[id]){
  if(corpus.texts[id].edition!=='AVM'||corpus.texts[id].text!==text)throw Error('Conflito de texto: '+id);
  if(corpus.texts[id].gloss&&!rec.gloss)rec.gloss=corpus.texts[id].gloss;
  reused++;
 }else inserted++;
 corpus.texts[id]=rec;
 const ids=((corpus.dates[date]??={})[kind]??=[]);
 if(!ids.includes(id))ids.push(id);
 corpus.dates[date][kind]=ids;
 const key=kind+'|'+norm(reference),lookup=(corpus.byPassage[key]??=[]);
 if(!lookup.includes(id))lookup.push(id);
 corpus.byPassage[key]=lookup;
}
if(!args.includes('--dry-run'))fs.writeFileSync(output,
 '/* Arquivo de edição Ave-Maria. Salmos responsoriais nunca entram aqui. */\n'+
 'window.LCE_AVE_MARIA_ACERVO=Object.freeze('+JSON.stringify(corpus,null,2)+');\n');
console.log(JSON.stringify({result:args.includes('--dry-run')?'DRY_RUN':'IMPORTED',inserted,reused,total:Object.keys(corpus.texts).length}));
