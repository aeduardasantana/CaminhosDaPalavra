const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'lce-import-'));
try{
 const output=path.join(temp,'avm.js'),input=path.join(temp,'input.json');
 fs.copyFileSync('liturgia-ave-maria-acervo.js',output);
 const base={edition:'AVM',period:'2025-11',sourceEdition:'Bíblia Ave-Maria (fixture interna)',publicationAuthorization:'Fixture de teste não publicada',
 entries:[{date:'2025-11-05',kind:'primeira-leitura',reference:'Rm 13,8-10',
 text:'Texto fictício de teste, sem qualquer transcrição bíblica real.',
 gloss:{segments:[{text:'SINAL / TESTE'}]}}]};
 function run(override={},success=true){
  fs.writeFileSync(input,JSON.stringify({...base,...override}));
  const r=cp.spawnSync(process.execPath,['scripts/importar-ave-maria.mjs','--input',input,'--output',output],{encoding:'utf8'});
  assert.equal(r.status===0,success,r.stderr);return r;
 }
 run();
 const a={window:{}};vm.runInNewContext(fs.readFileSync(output,'utf8'),a);
 assert.equal(Object.keys(a.window.LCE_AVE_MARIA_ACERVO.texts).length,1);
 assert.equal(Object.values(a.window.LCE_AVE_MARIA_ACERVO.texts)[0].gloss.textId,Object.keys(a.window.LCE_AVE_MARIA_ACERVO.texts)[0]);
 run();
 const b={window:{}};vm.runInNewContext(fs.readFileSync(output,'utf8'),b);
 assert.equal(Object.keys(b.window.LCE_AVE_MARIA_ACERVO.texts).length,1);
 run({entries:[{...base.entries[0],kind:'salmo'}]},false);
 run({entries:[{...base.entries[0],reference:'Rm 12,1-5'}]},false);
 run({publicationAuthorization:''},false);
 run({entries:[{...base.entries[0],text:''}]},false);
 console.log('OK: importação AVM idempotente, glosa vinculada, salmos e referências divergentes rejeitados.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
