/* Competência 01/36: não regressão, proveniência, datas especiais e glosa preliminar. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},Date,Math};for(const file of ['calendar.js','liturgia-2025-11.js','liturgia-diaria.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
const cal=ctx.window.LCE_CALENDAR,layer=ctx.window.LCE_MONTH_2025_11,daily=ctx.window.LCE_DAILY;
assert.equal(layer.competence,'01/36');
const dates=Object.keys(layer.readings);assert.equal(dates.length,30);
for(let day=1;day<=30;day++){const date='2025-11-'+String(day).padStart(2,'0');const d=layer.readings[date];assert.ok(d,date);assert.ok(d.items.length>=3,date);assert.match(d.source,/^https:\/\//);assert.equal(d.textLicensed,false);assert.equal(d.librasValidated,false);assert.equal(d.glosaReviewed,false);assert.equal(daily.readings[date].label,d.label);}
assert.equal(cal.infoForIso('2025-11-01').celebration,'Todos os Santos');
assert.equal(cal.infoForIso('2025-11-02').celebration,'Comemoração de Todos os Fiéis Defuntos');
assert.equal(cal.infoForIso('2025-11-09').celebration,'Dedicação da Basílica de Latrão');
assert.equal(daily.colorFor(cal.infoForIso('2025-11-02')),'roxo');
assert.equal(daily.colorFor(cal.infoForIso('2025-11-12')),'vermelho');
assert.equal(cal.infoForIso('2025-11-29').cycle,'C');
assert.equal(cal.infoForIso('2025-11-30').cycle,'A');
assert.equal(layer.readings['2025-11-02'].options.length,2);
assert.equal(layer.readings['2025-11-01'].items[1][1],'Sl 23(24)');
assert.ok(Object.keys(layer.dictionary).length>=10);
assert.ok(layer.readings['2025-11-30'].glosaBlocks.every(b=>b.status==='roteiro-contextual-preliminar'));
assert.ok(fs.readFileSync('index.html','utf8').includes('./liturgia-2025-11.js'));
assert.ok(!fs.readFileSync('index.html','utf8').includes('liturgy-originals-br-licensed.js'));
console.log('OK: competência 01/36 — 30 datas, fontes, exceções e pendências editoriais preservadas.');
