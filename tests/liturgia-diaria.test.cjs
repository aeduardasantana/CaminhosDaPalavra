/* Testes de regressão: calendário brasileiro, ciclos, cores e procedência dos dados. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ctx = {window:{}, Date, Math};
vm.runInNewContext(fs.readFileSync('calendar.js','utf8'),ctx,{filename:'calendar.js'});
vm.runInNewContext(fs.readFileSync('liturgia-diaria.js','utf8'),ctx,{filename:'liturgia-diaria.js'});
const cal=ctx.window.LCE_CALENDAR, daily=ctx.window.LCE_DAILY;
function feast(day, title){assert.equal(cal.infoForIso(day).celebration,title,day);}
feast('2026-06-28','São Pedro e São Paulo, Apóstolos');
feast('2027-07-04','São Pedro e São Paulo, Apóstolos');
feast('2026-08-16','Assunção da Bem-aventurada Virgem Maria');
feast('2027-08-15','Assunção da Bem-aventurada Virgem Maria');
feast('2027-11-07','Todos os Santos');
feast('2026-11-01','Todos os Santos');
feast('2027-04-05','Anunciação do Senhor');
feast('2026-10-12','Nossa Senhora da Conceição Aparecida');
assert.equal(cal.infoForIso('2026-11-28').cycle,'A');
assert.equal(cal.infoForIso('2026-11-29').cycle,'B');
assert.equal(cal.infoForIso('2027-11-28').cycle,'C');
assert.equal(daily.liturgicalYearFor(cal.infoForIso('2026-11-29')).begins,2026);
assert.equal(daily.colorFor(cal.infoForIso('2026-10-12')),'branco');
assert.equal(daily.colorFor(cal.infoForIso('2026-10-20')),'verde');
assert.equal(daily.readings['2026-10-12'].items.length,4);
assert.equal(daily.readings['2026-10-20'].items.length,3);
for(const [date,entry] of Object.entries(daily.readings)){
  assert.match(date,/^\d{4}-\d{2}-\d{2}$/);
  assert.match(entry.source,/^https:\/\//);
  for(const item of entry.items){assert.equal(item.length,2);assert.ok(item[1]);}
}
const h=fs.readFileSync('index.html','utf8');
for(const resource of ['liturgia-diaria.js','liturgia-diaria.css','app.js','calendar.js'])assert.ok(h.includes(resource));
console.log('OK: calendário brasileiro, ciclos, cores, fontes e scripts.');
