import fs from 'node:fs';
import crypto from 'node:crypto';

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
const approval=data.ownerAuthorization;
const theologySource=fs.readFileSync('theology-data.js');
const hash=crypto.createHash('sha1').update('blob '+theologySource.length+'\0').update(theologySource).digest('hex');
const theologyMatch=theologySource.toString('utf8').match(/window\.CDP_THEOLOGY\s*=\s*([\s\S]*);\s*$/);
if(!theologyMatch) throw new Error('Snapshot teológico não encontrado');
const theology=JSON.parse(theologyMatch[1]);
const ownerApprovalValid=approval?.authorizedForPublicWeb===true
  && approval.licensedBibleTextAuthorized===false
  && approval.futureRevisionsAutomaticallyAuthorized===false
  && approval.authorizedSourceBlobSha===hash
  && approval.authorizedSnapshotVersion===theology.manifest?.datasetVersion
  && approval.authorizedChapterCount===entries.length
  && approval.id==='AUT-TITULAR-CDP-2026-11-07-001';
if(approval&&!ownerApprovalValid) errors.push('Autorização da titular não corresponde ao snapshot atual');
let authorized=0,ecclesialApproved=0,authorizedByOwner=0;

for(const [cpId,state] of entries){
  if(!/^CP-\d{4}$/.test(cpId)) errors.push('cpId inválido '+cpId);
  const reviewed=allowedReview.has(state.reviewStatus)
    && allowedDecision.has(state.internalDecision)
    && (!state.adjustmentRequired || state.adjustmentExecuted);
  const ownerAuthorized=ownerApprovalValid&&state.ownerApprovalId===approval.id;
  const expected=reviewed||ownerAuthorized;
  if(Boolean(state.publicAuthorized)!==expected){
    errors.push('autorização inconsistente '+cpId);
  }
  if(state.publicAuthorized)authorized++;
  if(reviewed)ecclesialApproved++;
  if(ownerAuthorized)authorizedByOwner++;
}

if(authorized!==(data.counts?.authorized??authorized))errors.push('authorizedCount inconsistente');
if(authorizedByOwner!==(data.counts?.authorizedByOwner??0))errors.push('ownerAuthorizedCount inconsistente');
if(ecclesialApproved!==(data.counts?.approvedByEcclesialReview??0))errors.push('ecclesialApprovedCount inconsistente');
if(entries.length-authorized!==(data.counts?.blocked??-1))errors.push('blockedCount inconsistente');
if(approval&&(!ownerApprovalValid||approval.licensedBibleTextAuthorized!==false)){
  errors.push('Autorização inválida para publicação bíblica/editorial');
}

const app=fs.readFileSync('app.js','utf8');
if(!app.includes('publicationStateForChapter(record)')) errors.push('app sem consulta ao gate editorial');
if(!app.includes('if (!publicationState.publicAuthorized)')) errors.push('app sem bloqueio fail-closed');
if(!app.includes('renderLockedChapter(')) errors.push('app sem experiência bloqueada');

if(errors.length){
  console.error(errors.slice(0,100).join('\n'));
  process.exit(1);
}
console.log('Controle de publicação validado:',entries.length,'capítulos;',authorized,'autorizados para publicação;',ecclesialApproved,'com aprovação eclesial;',entries.length-authorized,'bloqueados.');
