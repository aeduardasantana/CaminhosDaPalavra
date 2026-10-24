/* Responsório agrupado: refrão único, estrofes por referência, glosa alinhada. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const apiContext={window:{}};
vm.runInNewContext(fs.readFileSync('liturgia-fonte-local.js','utf8'),apiContext);
const api=apiContext.window.LCE_FONTE_LOCAL;
const studyContext={window:{LCE_FONTE_LOCAL:api}};
vm.runInNewContext(fs.readFileSync('estudo-versiculos-2025-11.js','utf8'),studyContext);
const units=studyContext.window.LCE_ESTUDO_VERSICULAR_2025_11['2025-11-05'].p;
const app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('function groupPsalmVerseDrafts(entry) {');
const end=app.indexOf('function renderPsalmStudyGlosa(',start);
assert.ok(start>=0&&end>start,'Agrupador versicular ausente');
const helper=app.slice(start,end);
const group=vm.runInNewContext(helper+
  '\ngroupPsalmVerseDrafts('+JSON.stringify({
    item:'salmo',referencia:'Sl 111(112),1-2.4-5.9 (R. 5a)',verseUnits:units
  })+')',studyContext);
assert.ok(group);
assert.equal(group.refrain.ref,'R. (cf. Sl 111(112),5a)');
assert.equal(group.groups.length,3);
assert.equal(group.groups[0].label,'vv. 1–2');
assert.equal(group.groups[0].units.length,2);
assert.equal(group.groups[1].label,'vv. 4–5');
assert.equal(group.groups[1].units.length,2);
assert.equal(group.groups[2].label,'v. 9');
assert.equal(group.groups[2].units.length,1);
assert.equal(group.groups.flatMap(g=>g.units).length,5);
assert.equal(api.psalmStanzaLabels('Sl 111(112),1-2.4-5.9 (R. 5a)',3)[2],'Estrofe 3 · v. 9');
const other=vm.runInNewContext(helper+
  '\ngroupPsalmVerseDrafts('+JSON.stringify({
    item:'salmo',referencia:'Sl 111(112),1-2.4-5.9 (R. 5a)',verseUnits:units.slice(0,3)
  })+')',studyContext);
assert.equal(other,null,'Não atribuir referências sem cobertura das estrofes');
const online=fs.readFileSync('liturgia-fonte-local.js','utf8');
assert.ok(online.includes("box.append(createText('p','R. '+refrain"));
assert.ok(online.includes("Repetir após cada estrofe"));
assert.ok(!online.includes("verses.forEach((stanza,i)=>{\n        parent.append(createText('p',stanza"));
assert.ok(app.includes("if(!renderPsalmStudyGlosa(glosaBox,entry)) glosaBox.appendChild(list)"));
console.log('OK: refrão único, 3 quadros vv.1–2/vv.4–5/v.9, glosa agrupada sem referência inventada.');
