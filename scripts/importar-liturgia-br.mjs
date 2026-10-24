#!/usr/bin/env node
/**
 * IMPORTAÇÃO ÚNICA DA COMPETÊNCIA 01/36.
 *
 * Consome a fonte externa somente quando o acervo local ainda não está completo.
 * Deduplica textos e grava uma cópia estática usada pelo navegador sem rede.
 * Leitura da API não substitui revisão humana do Lecionário e das glosas.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';

const output='liturgia-br-acervo.js';
const manifest='RELATORIOS/IMPORTACAO-LOCAL-2025-11.json';
const check=process.argv.includes('--check');
const force=process.argv.includes('--force');

function loadCode(path,context){
  vm.runInNewContext(fs.readFileSync(path,'utf8'),context,{filename:path});
}
function readArchive(){
  const scope={window:{},Date,console};
  if(fs.existsSync(output))loadCode(output,scope);
  return scope.window.LCE_BR_ACERVO;
}
function assertComplete(a){
  if(!a?.complete)throw Error('Acervo brasileiro local ainda não importado');
  const dates=Object.keys(a.dates||{});
  const count=dates.reduce((n,d)=>n+Object.values(a.dates[d].byKind||{}).reduce((s,ids)=>s+ids.length,0),0);
  if(dates.length!==30||count!==96)throw Error('Acervo incompleto: '+dates.length+' dias, '+count+' ocorrências');
  for(const record of Object.values(a.texts||{})){
    if(!record.text||record.text.length<30||!record.reference)throw Error('Texto local corrompido');
  }
  return {days:dates.length,occurrences:count,uniqueTexts:Object.keys(a.texts).length};
}
if(check){
  const result=assertComplete(readArchive());
  console.log('OK ACERVO LOCAL:',result);
  process.exit(0);
}
const stored=readArchive();
if(stored?.complete&&!force){
  console.log('ACERVO JÁ IMPORTADO; nenhuma consulta à API.',assertComplete(stored));
  process.exit(0);
}
const ctx={window:{},Date,console};
loadCode('calendar.js',ctx);
loadCode('liturgia-2025-11.js',ctx);
loadCode('liturgia-fonte-local.js',ctx);
const month=ctx.window.LCE_MONTH_2025_11?.readings;
const helper=ctx.window.LCE_FONTE_LOCAL;
const calendar=ctx.window.LCE_CALENDAR;
if(!month||!helper||!calendar)throw Error('Bases litúrgicas locais indisponíveis');
const dates=Object.keys(month).sort();
if(dates.length!==30)throw Error('Indexação de novembro não contém 30 dias');

const typeMap={
  'Primeira leitura':'primeira-leitura',
  'Segunda leitura':'segunda-leitura',
  'Salmo responsorial':'salmo',
  'Cântico responsorial':'salmo',
  'Evangelho':'evangelho'
};
const texts={},days={},associations={},conflicts=[],unmatched=[];
const uniqueId=record=>'lbr-'+crypto.createHash('sha256').update(JSON.stringify([
  record.kind,record.reference,record.text,record.refrain,record.title
])).digest('hex').slice(0,24);

const addAssociation=(key,id)=>{
  const list=(associations[key]??=[]);
  if(!list.includes(id))list.push(id);
};
function pairKeys(date,rec,kind){
  const info=calendar.infoForIso(date);
  const keys=[];
  // Férias do Tempo Comum: I/II na 1ª leitura e no salmo; Evangelho é anual.
  if(rec.rank==='Féria' && info.season==='Tempo Comum' && info.weekday!==0){
    const match=rec.label.match(/(\d+)[ªº]\s+semana\s+do\s+Tempo\s+Comum/i);
    if(match){
      const cycle=kind==='evangelho'?'ANUAL':info.ferialCycle;
      if(cycle)keys.push(['FERIAL','TC',match[1],info.weekday,cycle,kind].join('|'));
    }
  }
  // Um domingo só se repete no mesmo domingo litúrgico e ciclo A/B/C.
  if(rec.rank==='Domingo' && info.celebration){
    keys.push(['SUNDAY',info.celebration,info.cycle,kind].join('|'));
  }
  // Festas e solenidades com seleção própria: associação restrita à celebração.
  if(['Solenidade','Festa'].includes(rec.rank)&&info.celebration){
    keys.push(['PROPER',info.celebration,info.cycle,kind].join('|'));
  }
  return keys;
}
async function getDay(date){
  const [year,month,day]=date.split('-');
  const endpoint='https://liturgia.up.railway.app/v2/?dia='+Number(day)+'&mes='+Number(month)+'&ano='+year;
  let last;
  for(let attempt=0;attempt<3;attempt++){
    try{
      const result=await fetch(endpoint,{signal:AbortSignal.timeout(20000)});
      if(!result.ok)throw Error('HTTP '+result.status);
      const data=await result.json();
      if(helper.normalizeDate(data.data)!==date)throw Error('Data incorreta: '+data.data);
      return data;
    }catch(e){
      last=e;
      if(attempt<2)await new Promise(ok=>setTimeout(ok,900*(attempt+1)));
    }
  }
  throw Error(date+': '+last);
}
// Limitar concorrência para não sobrecarregar o fornecedor.
for(let offset=0;offset<dates.length;offset+=4){
  const batch=dates.slice(offset,offset+4);
  const fetched=await Promise.all(batch.map(async date=>({date,payload:await getDay(date)})));
  for(const {date,payload} of fetched){
    const rec=month[date],byKind={};
    for(const [label,reference] of rec.items){
      const kind=typeMap[label];
      if(!kind)throw Error('Tipo desconhecido '+label+' em '+date);
      const matches=helper.resolveReading(payload,date,kind,reference);
      if(!matches?.length){
        unmatched.push({date,label,reference});
        continue;
      }
      const ids=[];
      for(const row of matches){
        const record={
          kind,
          reference,
          sourceReference:String(row.referencia||''),
          text:String(row.texto||'').trim(),
          refrain:String(row.refrao||'').trim(),
          title:String(row.titulo||'').trim()
        };
        if(record.text.length<30)throw Error('Leitura inválida: '+date+' '+reference);
        const id=uniqueId(record);
        if(!texts[id])texts[id]=record;
        ids.push(id);
        for(const key of pairKeys(date,rec,kind))addAssociation(key,id);
      }
      byKind[kind]=[...new Set(ids)];
    }
    days[date]={byKind,celebration:rec.label,rank:rec.rank};
    console.log('Importado',date,Object.values(byKind).reduce((n,v)=>n+v.length,0),'leituras');
  }
}
if(unmatched.length)throw Error('Não gravar importação parcial: '+JSON.stringify(unmatched));
const imported={
  version:1,complete:true,period:'2025-11',
  importedAt:new Date().toISOString(),
  source:'https://liturgia.up.railway.app/v2/',
  copyrightReview:'Verificar condições da edição e atribuição antes de redistribuição fora do projeto.',
  texts,dates:days,associations
};
const summary=assertComplete(imported);
fs.mkdirSync('RELATORIOS',{recursive:true});
fs.writeFileSync(output,
  '/* Arquivo estático importado UMA VEZ. Não editar textos sem revisão editorial. */\n'+
  'window.LCE_BR_ACERVO='+JSON.stringify(imported,null,2)+';\n');
fs.writeFileSync(manifest,JSON.stringify({
  period:'2025-11',importedAt:imported.importedAt,source:imported.source,
  ...summary,associationKeys:Object.keys(associations).length,
  days:dates.map(date=>({date,celebration:days[date].celebration,items:Object.keys(days[date].byKind)})),
  note:'Dados arquivados localmente. Associação do calendário separada; textos e glosas não homologados automaticamente.'
},null,2)+'\n');
console.log('IMPORTAÇÃO CONCLUÍDA:',summary,'chaves de associação',Object.keys(associations).length);
