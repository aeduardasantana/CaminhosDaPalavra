import fs from 'node:fs';

const source=fs.readFileSync('publication-control.js','utf8');
const match=source.match(/window\.CDP_PUBLICATION_CONTROL\s*=\s*([\s\S]*);\s*$/);
if(!match) throw new Error('CDP_PUBLICATION_CONTROL não encontrado');
const data=JSON.parse(match[1]);
const entries=Object.entries(data.chapters||{});
const errors=[];

if(data.failClosed!==true) errors.push('failClosed precisa ser true');
if(entries.length!==1334) errors.push('chapterControlCount='+entries.length);

const allowedReview=new Set(data.rule?.reviewStatusesAllowed||[]);
const allowedDecision=new Set(data.rule?.internalDecisionsAllowed||[]);
let authorized=0;

for(const [cpId,state] of entries){
  if(!/^CP-\d{4}$/.test(cpId)) errors.push('cpId inválido '+cpId);
  const expected=allowedReview.has(state.reviewStatus)
    && allowedDecision.has(state.internalDecision)
    && (!state.adjustmentRequired || state.adjustmentExecuted);
  if(Boolean(state.publicAuthorized)!==expected){
    errors.push('autorização inconsistente '+cpId);
  }
  if(state.publicAuthorized) authorized++;
}

if(authorized!==(data.counts?.authorized??authorized)){
  errors.push('authorizedCount inconsistente');
}

const app=fs.readFileSync('app.js','utf8');
if(!app.includes('publicationStateForChapter(record)')) errors.push('app sem consulta ao gate editorial');
if(!app.includes('if (!publicationState.publicAuthorized)')) errors.push('app sem bloqueio fail-closed');
if(!app.includes('renderLockedChapter(')) errors.push('app sem experiência bloqueada');

if(errors.length){
  console.error(errors.slice(0,100).join('\n'));
  process.exit(1);
}
console.log('Controle de publicação validado:',entries.length,'capítulos;',authorized,'autorizados;',entries.length-authorized,'bloqueados.');
