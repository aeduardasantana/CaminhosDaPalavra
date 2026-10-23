/* Diagnóstico de 30 dias (apenas referências, sem copiar textos). */
const fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{},console};for(const file of ['liturgia-2025-11.js','liturgia-fonte-online.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);
const days=ctx.window.LCE_MONTH_2025_11.readings,api=ctx.window.LCE_FONTE_ONLINE;
const kinds={'Primeira leitura':'primeira-leitura','Segunda leitura':'segunda-leitura','Salmo responsorial':'salmo','Cântico responsorial':'salmo','Evangelho':'evangelho'};
const result={days:0,daySuccess:0,items:0,matched:0,missing:[],failed:[]};
(async()=>{
 const dates=Object.keys(days).sort();
 for(let i=0;i<dates.length;i+=5){
  const group=dates.slice(i,i+5);
  await Promise.all(group.map(async date=>{
   const rec=days[date],d=date.slice(8),m=date.slice(5,7);
   result.days++;result.items+=rec.items.length;
   try{
     const r=await fetch('https://liturgia.up.railway.app/v2/?dia='+Number(d)+'&mes='+Number(m)+'&ano=2025',{signal:AbortSignal.timeout(10000)});
     if(!r.ok){result.failed.push(date+':HTTP'+r.status);return;}
     const json=await r.json();
     if(api.normalizeDate(json.data)!==date){result.failed.push(date+':data-divergente');return;}
     result.daySuccess++;
     for(const [type,reference] of rec.items){
       const match=api.resolveReading(json,date,kinds[type],reference);
       if(match)result.matched++;
       else result.missing.push(date+' '+type+': '+reference);
     }
   }catch(e){result.failed.push(date+':'+String(e).slice(0,40));}
  }));
 }
 console.log('COBERTURA_API_NOV_2025='+JSON.stringify(result));
 if(result.matched<result.items)console.error('A cobertura é parcial; isso não reprova a integridade do código.');
})().catch(e=>{console.error(e);process.exitCode=1});
