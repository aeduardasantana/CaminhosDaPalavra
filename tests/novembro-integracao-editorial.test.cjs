/* Compatibilidade — competência 01/36. Mantém distinção entre glosa preliminar e homologação. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{},Date,Math,console};
for(const path of ['calendar.js','liturgia-2025-11.js','estudo-liturgico-2025-11-01a15.js','estudo-liturgico-2025-11-16a30.js']){
  vm.runInNewContext(fs.readFileSync(path,'utf8'),ctx,{filename:path});
}
const days=ctx.window.LCE_MONTH_2025_11.readings, studies=ctx.window.LCE_ESTUDO_NOV_2025;
const codes={'Primeira leitura':'f','Segunda leitura':'s','Salmo responsorial':'p','Cântico responsorial':'p','Evangelho':'e'};
assert.equal(Object.keys(days).length,30);
assert.equal(Object.keys(studies).length,30);
let readings=0,units=0,missing=[];
for(let n=1;n<=30;n++){
  const key='2025-11-'+String(n).padStart(2,'0'), rec=days[key], lesson=studies[key];
  assert.ok(rec,key);assert.ok(lesson,key);
  assert.ok(rec.source.startsWith('https://'));
  for(const [label,ref] of rec.items){
    const code=codes[label];
    assert.ok(code,'Unknown kind: '+label);
    if(!Array.isArray(lesson[code]))missing.push(key+' '+label);
    const segments=lesson[code];
    assert.equal(segments.length,3,key+' '+ref);
    const keys=new Set();
    for(const unit of segments){
      assert.ok(unit.sentido.length>=25,key+' '+ref);
      assert.ok(unit.glosaPreliminar.length>=15,key+' '+ref);
      assert.ok(unit.glosaPreliminar!==unit.sentido);
      assert.ok(!keys.has(unit.id));keys.add(unit.id);units++;
    }
    readings++;
  }
  assert.equal(rec.contentStatus.meaningUnitsDrafted,rec.items.length*3);
  assert.equal(rec.contentStatus.fullBrazilianTextChecked,false);
  assert.equal(rec.contentStatus.completeGlosaDraft,false);
  assert.equal(rec.contentStatus.specializedLibrasValidation,false);
}
assert.equal(missing.length,0,missing.join(', '));
assert.equal(readings,96);assert.equal(units,288);
assert.equal(studies['2025-11-29'].e.length,3);
assert.equal(studies['2025-11-30'].s.length,3);
assert.equal(Object.values(days).filter(rec=>rec.contentStatus.singleDateSourceRead).length,30);
assert.equal(new Set(Object.values(days).map(rec=>rec.individualDateSource)).size,30);
assert.equal(days['2025-11-02'].lectionaryChoices.first.length,7);
assert.equal(days['2025-11-02'].lectionaryChoices.psalm.length,7);
assert.equal(days['2025-11-02'].lectionaryChoices.second.length,15);
assert.equal(days['2025-11-02'].lectionaryChoices.gospel.length,19);

assert.equal(ctx.window.LCE_MONTH_2025_11.readings['2025-11-02'].options.length,2);
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const pdf=fs.readFileSync('liturgy-pdf.js','utf8');
assert.ok(app.includes('function monthlyStudyEntries(isoDate)'));
assert.ok(app.includes('if (month) return month;'));
assert.ok(app.includes('function renderMonthlyStudy(entry, originalBox, glosaBox)'));
assert.ok(app.includes("card.dataset.editorialStudy='true'"));
assert.ok(app.includes("entry.verseUnits"));
assert.ok(app.includes('if(date===\'2025-11-02\')'));
assert.ok(html.includes('estudo-liturgico-2025-11-01a15.js'));
assert.ok(html.includes('estudo-liturgico-2025-11-16a30.js'));
assert.ok(pdf.includes("article.dataset.editorialStudy==='true'"));
assert.ok(!pdf.includes("button.disabled=true"));
assert.ok(app.includes("function renderMonthlyStudy(entry, originalBox, glosaBox)"));
assert.ok(app.includes("originalBox.replaceChildren(pending)"));
assert.ok(app.includes("monthly-glosa-list"));
assert.ok(!app.includes("O texto litúrgico brasileiro integral desta leitura ainda não foi incorporado ou cotejado"));
assert.ok(app.includes('LCE_FONTE_LOCAL.loadForEntry(entry,card)'));
assert.ok(app.includes("monthly-editorial-details"));
assert.ok(html.includes('min="2025-11-01" max="2028-10-31"'));
assert.equal(days["2025-11-05"].items[1][1],"Sl 111(112),1-2.4-5.9 (R. 5a)");
assert.equal(days["2025-11-05"].salmoRefrainConfirmed,"Feliz quem tem piedade e empresta!");
const manifest=fs.readFileSync('AUDITORIA-LEITURAS-2025-11.csv','utf8').trim().split('\n');
vm.runInNewContext(fs.readFileSync('estudo-versiculos-2025-11.js','utf8'),ctx);
const five=ctx.window.LCE_ESTUDO_VERSICULAR_2025_11['2025-11-05'];
assert.equal(five.f.length,3);assert.equal(five.p.length,7);assert.equal(five.e.length,8);
assert.ok(five.p.some(u=>u.ref.includes('Sl 111(112),9')));
assert.ok(html.includes('estudo-versiculos-2025-11.js'));
assert.equal(manifest.length,97);
assert.ok(manifest.every((line,i)=>i===0||line.includes('"PENDENTE"')));
console.log('OK: 30 datas, 96 estudos por ocorrência, 288 unidades paralelas e nenhuma homologação fictícia.');
