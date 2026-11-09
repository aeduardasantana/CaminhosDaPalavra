import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const url='http://127.0.0.1:8765/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const warnings=[];
page.on('pageerror',err=>warnings.push(err.message));
try{
 await page.goto(url+'historia-da-salvacao.html',{waitUntil:'domcontentloaded',timeout:45000});
 await page.locator('.cdp-feature-study').waitFor({timeout:30000});
 assert.equal(await page.locator('.cdp-sidebar').count(),1,'menu desktop');
 assert.equal(await page.locator('.cdp-feature-card').count(),6,'seis cartões');
 assert.equal(await page.locator('.cdp-reader-tabs [role="tab"]').count(),4,'quatro abas');
 await page.waitForFunction(()=>document.querySelectorAll('#cdp-reader-text p b').length>=5,{timeout:45000});
 const verses=await page.locator('#cdp-reader-text').innerText();
 assert.ok(verses.includes('Deus')&&verses.includes('terra'),'versículos reais de Gênesis');
 await page.locator('[data-cdp-tab="contexto"]').click();
 assert.match(await page.locator('#cdp-reader-heading').innerText(),/Contexto/);
 await page.locator('[data-cdp-tab="referencias"]').click();
 assert.match(await page.locator('#cdp-reader-heading').innerText(),/Referências/);
 await page.locator('[data-cdp-tab="texto"]').click();
 await page.locator('#cdp-next').click();
 assert.notEqual(await page.locator('#cdp-topic-title').innerText(),'1. Criação e comunhão original','avanço da etapa');
 await page.locator('#cdp-prev').click();
 await mkdir('ux2-capturas',{recursive:true});
 await page.screenshot({path:'ux2-capturas/desktop.png',fullPage:false});
 const images=await page.evaluate(async()=>{
  const paths=['hero-foto.webp','biblia-foto.webp','estudo-foto.webp','liturgia-foto.webp','missa-foto.webp','formacao-foto.webp','jornada-foto.webp'];
  return await Promise.all(paths.map(async p=>{const r=await fetch('./assets/ux2/'+p);return {name:p,status:r.status,ok:r.ok}}))
 });
 assert.ok(images.every(i=>i.ok),'imagens locais: '+JSON.stringify(images));
 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('.cdp-mobile-nav').waitFor();
 assert.equal(await page.locator('.cdp-mobile-nav a').count(),5,'cinco atalhos móveis');
 assert.equal(await page.locator('.cdp-stage-picker').isVisible(),true,'etapas móveis');
 await page.screenshot({path:'ux2-capturas/mobile.png',fullPage:false});
 console.log(JSON.stringify({status:'success',url,images,uncaught:warnings.slice(0,8)},null,2));
}finally{await browser.close()}
