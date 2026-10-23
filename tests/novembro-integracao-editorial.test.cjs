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
assert.equal(ctx.window.LCE_MONTH_2025_11.readings['2025-11-02'].options.length,2);
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const pdf=fs.readFileSync('liturgy-pdf.js','utf8');
assert.ok(app.includes('function monthlyStudyEntries(isoDate)'));
assert.ok(app.includes('if (month) return month;'));
assert.ok(app.includes('function renderMonthlyStudy(entry, originalBox, glosaBox)'));
assert.ok(app.includes('if(entry.editorialStudy) card.dataset.editorialStudy'));
assert.ok(app.includes('if(date===\'2025-11-02\')'));
assert.ok(html.includes('estudo-liturgico-2025-11-01a15.js'));
assert.ok(html.includes('estudo-liturgico-2025-11-16a30.js'));
assert.ok(pdf.includes('editorialStudy?\'Síntese editorial'));
console.log('OK: 30 datas, 96 estudos por ocorrência, 288 unidades paralelas e nenhuma homologação fictícia.');
