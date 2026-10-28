const data = window.LCE_DATA;
const bible = window.LCE_BIBLE;\nconst theology = window.CDP_THEOLOGY || {chapters: {}};
const litCalendar = window.LCE_CALENDAR;
const saintsArchive = window.LCE_SAINTS || {highlights: {}};
const lectionary = window.LCE_LECTIONARY || {records: []};
const glossa = window.LCE_GLOSSA || {};
const glossaAnoARevisada = window.LCE_GLOSSA_ANO_A_REVISADA || {};
const glossaAnoBRevisada = window.LCE_GLOSSA_ANO_B_REVISADA || {};
const glossaAnoCRevisada = window.LCE_GLOSSA_ANO_C_REVISADA || {};
const liturgyOriginals = window.LCE_LITURGY_ORIGINALS || {};
const psalmStructures = window.LCE_PSALM_STRUCTURES || {};
const psalmGlossaContext = window.LCE_PSALM_GLOSSA_CONTEXT || {};
const yearAPsalmRefrains = window.LCE_PSALM_REFRAINS_ANO_A || {};
const yearBPsalmRefrains = window.LCE_PSALM_REFRAINS_ANO_B || {};

const els = {
  query: document.querySelector('#query'),
  date: document.querySelector('#dateFilter'),
  year: document.querySelector('#yearFilter'),
  item: document.querySelector('#itemFilter'),
  editionChoices: [...document.querySelectorAll('input[name="liturgyEdition"]')],
  clear: document.querySelector('#clearFilters'),
  liturgyResults: document.querySelector('#liturgyResults'),
  resultCount: document.querySelector('#resultCount'),
  template: document.querySelector('#liturgyCardTemplate'),
  navButtons: [...document.querySelectorAll('.nav-button')],
  sections: {
    projeto: document.querySelector('#projetoSection'),
    liturgia: document.querySelector('#liturgiaSection'),
    missal: document.querySelector('#missalSection'),
    calendario: document.querySelector('#calendarioSection'),
    biblia: document.querySelector('#bibliaSection'),
    plano: document.querySelector('#planoSection')
  },

  calendarYear: document.querySelector('#calendarYear'),
  calendarMonth: document.querySelector('#calendarMonth'),
  calendarPrev: document.querySelector('#calendarPrev'),
  calendarNext: document.querySelector('#calendarNext'),
  calendarGrid: document.querySelector('#calendarGrid'),
  calendarDetail: document.querySelector('#calendarDetail'),

  bibleQuery: document.querySelector('#bibleQuery'),
  bibleTestament: document.querySelector('#bibleTestament'),
  bibleBooks: document.querySelector('#bibleBooks'),
  bibleChapterPanel: document.querySelector('#bibleChapterPanel'),

  planStartDate: document.querySelector('#planStartDate'),
  printPlan: document.querySelector('#printPlan'),
  resetPlan: document.querySelector('#resetPlan'),
  storageInfoButton: document.querySelector('#storageInfoButton'),
  storageInfoDialog: document.querySelector('#storageInfoDialog'),
  storageInfoClose: document.querySelector('#storageInfoClose'),
  journeyDay: document.querySelector('#journeyDay'),
  journeyStart: document.querySelector('#journeyStart'),
  journeyPace: document.querySelector('#journeyPace'),
  journeyPaceDetail: document.querySelector('#journeyPaceDetail'),
  planPercent: document.querySelector('#planPercent'),
  planProgressBar: document.querySelector('#planProgressBar'),
  planProgressText: document.querySelector('#planProgressText'),
  biblePercent: document.querySelector('#biblePercent'),
  bibleProgressBar: document.querySelector('#bibleProgressBar'),
  bibleProgressText: document.querySelector('#bibleProgressText'),
  todayReadingTitle: document.querySelector('#todayReadingTitle'),
  todayReadingDate: document.querySelector('#todayReadingDate'),
  todayReadings: document.querySelector('#todayReadings'),
  printPlanMeta: document.querySelector('#printPlanMeta'),
  fullPlanSchedule: document.querySelector('#fullPlanSchedule')
};

const itemOrder = {
  'primeira-leitura': 1,
  'salmo': 2,
  'segunda-leitura': 3,
  'aclamacao': 4,
  'evangelho': 5
};

function normalize(value = '') {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [y,m,d] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

function lectionarySectionLabel(section) {
  if (section === 'ADVENTO') return 'Advento';
  if (section === 'QUARESMA') return 'Quaresma';
  if (section === 'PÁSCOA E TEMPO PASCAL') return 'Tempo Pascal';
  if (section === 'CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO') return 'Tempo do Natal';
  if (section === 'SOLENIDADES DOMINICAIS DO TEMPO COMUM') return 'Solenidade';
  if (section.startsWith('TEMPO COMUM')) return 'Tempo Comum';
  return section;
}

function fullCelebrationName(record) {
  const name = record.celebration;
  if (record.section.startsWith('TEMPO COMUM') && /^\d+º Domingo$/.test(name)) return name + ' do Tempo Comum';
  if (record.section === 'ADVENTO' && /^\d+º Domingo$/.test(name)) return name + ' do Advento';
  if (record.section === 'QUARESMA' && /^\d+º Domingo$/.test(name)) return name + ' da Quaresma';
  return name;
}

function slug(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function fallbackGlosa(reference) {
  return '(GLOSA PRELIMINAR EM PRODUÇÃO)\n' +
    'REFERÊNCIA ' + reference + ' / LEITURA JÁ INCLUÍDA NO CICLO DOMINICAL.\n' +
    '(REVISÃO OBRIGATÓRIA: produzir unidades de sentido, referentes, espaço, ações e mudanças de papel antes de uso.)';
}

function recordItems(record) {
  if (record.celebration === 'Batismo do Senhor' && (record.cycle === 'B' || record.cycle === 'C') && record.items.length === 1) {
    return [
      {type: 'primeira-leitura', label: 'Primeira leitura', reference: 'Is 42,1-4.6-7', note: ''},
      {type: 'salmo', label: 'Salmo responsorial', reference: 'Sl 29', note: ''},
      {type: 'segunda-leitura', label: 'Segunda leitura', reference: 'At 10,34-38', note: ''},
      ...record.items
    ];
  }
  return record.items;
}

function liturgyOriginalKey(record, item) {
  return [record.cycle, record.section, record.celebration, item.type, item.reference].join('|');
}

function genericLiturgyEntries() {
  return lectionary.records.flatMap(record => recordItems(record).map(item => {
    const detailedPilot = data.liturgia.find(p =>
      p.ano === record.cycle &&
      p.item === item.type &&
      p.referencia === item.reference &&
      fullCelebrationName(record).includes('27º Domingo do Tempo Comum')
    );
    const originalRecord = liturgyOriginals[liturgyOriginalKey(record, item)];

    const contextKey = liturgyOriginalKey(record, item);
    const unresolvedSource = record.cycle === 'B' && item.type === 'evangelho' &&
      record.celebration === 'Sagrada Família' && /^EVANGELHO Como atrás/i.test(originalRecord?.text || '');

    return {
      id: [record.cycle, record.section, record.celebration, item.type, item.reference].map(slug).join('--'),
      contextKey,
      data: detailedPilot?.data || '',
      ano: record.cycle,
      tempo: lectionarySectionLabel(record.section),
      section: record.section,
      celebracao: fullCelebrationName(record),
      item: item.type,
      itemLabel: item.label,
      referencia: item.reference,
      status: unresolvedSource
        ? 'Texto original integral ausente — revisão bloqueada'
        : (glossaAnoARevisada[contextKey] || glossaAnoBRevisada[contextKey] || glossaAnoCRevisada[contextKey])
        ? 'Roteiro editorial ampliado — validação linguística em Libras pendente'
        : (item.type === 'salmo' && ((record.cycle === 'A' && yearAPsalmRefrains[contextKey]) || (record.cycle === 'B' && yearBPsalmRefrains[contextKey])))
          ? 'Refrão contextual revisado — estrofes e Libras pendentes'
        : (item.type === 'salmo' && (record.cycle === 'A' || record.cycle === 'B') && psalmGlossaContext[contextKey])
          ? 'Estrutura de salmo preparada — validação linguística pendente'
        : detailedPilot ? detailedPilot.status
        : (glossa[item.reference]
          ? (record.cycle === 'A' || record.cycle === 'B' ? 'Glosa-base preliminar — validação linguística pendente' : 'Glosa-base preliminar')
          : 'Glosa em produção'),
      sourceVersion: unresolvedSource
        ? 'Fonte incompleta: somente remissão editorial de página; não usar esta comparação para interpretar a leitura.'
        : (originalRecord?.sourceVersion || detailedPilot?.sourceVersion || 'Texto litúrgico — Lecionário: texto original ainda não incorporado'),
      sourceUrl: originalRecord?.sourceUrl || detailedPilot?.sourceUrl || '',
      original: originalRecord?.text || detailedPilot?.original || (item.reference + ' — texto original ainda não incorporado.'),
      glosa: glossaAnoARevisada[contextKey] || glossaAnoBRevisada[contextKey] || glossaAnoCRevisada[contextKey] || detailedPilot?.glosa || glossa[item.reference] || fallbackGlosa(item.reference),
      glosaContext: item.type === 'salmo' ? (psalmGlossaContext[contextKey] || null) : null,
      glosaRefrainContext: item.type === 'salmo' ? (yearAPsalmRefrains[contextKey] || yearBPsalmRefrains[contextKey] || null) : null,
      note: item.note || '',
      keywords: [
        record.cycle,
        record.section,
        record.celebration,
        item.type,
        item.label,
        item.reference,
        item.note || ''
      ]
    };
  }));
}

const allLiturgyEntries = genericLiturgyEntries();

function ordinalFromCelebration(text) {
  const m = (text || '').match(/^(\d+)º/);
  return m ? m[1] + 'º Domingo' : '';
}

function recordForDate(isoDate) {
  const info = litCalendar.infoForIso(isoDate);
  const cycle = info.cycle;
  const celebration = info.celebration || '';
  const records = lectionary.records.filter(r => r.cycle === cycle);

  if (celebration === 'Natal do Senhor') {
    return records.filter(r => r.section === 'CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO' && r.celebration.startsWith('Natal —'));
  }

  if (celebration === 'Nosso Senhor Jesus Cristo, Rei do Universo') {
    return records.filter(r => r.celebration.includes('Cristo Rei'));
  }

  if (celebration === 'Santíssima Trindade' || celebration === 'Ascensão do Senhor' || celebration === 'Pentecostes' ||
      celebration === 'Epifania do Senhor' || celebration === 'Batismo do Senhor' || celebration === 'Santa Maria, Mãe de Deus' || celebration === 'Sagrada Família' ||
      celebration === 'Domingo da Páscoa' || celebration === 'Domingo de Ramos e da Paixão') {
    return records.filter(r => r.celebration === celebration);
  }

  if (/Domingo do Advento/.test(celebration)) {
    const ord = ordinalFromCelebration(celebration);
    return records.filter(r => r.section === 'ADVENTO' && r.celebration === ord);
  }

  if (/Domingo da Quaresma/.test(celebration)) {
    const ord = ordinalFromCelebration(celebration);
    return records.filter(r => r.section === 'QUARESMA' && r.celebration === ord);
  }

  if (/Domingo da Páscoa/.test(celebration)) {
    return records.filter(r => r.section === 'PÁSCOA E TEMPO PASCAL' && r.celebration === celebration);
  }

  if (/Domingo do Tempo Comum/.test(celebration)) {
    const ord = ordinalFromCelebration(celebration);
    return records.filter(r => r.section.startsWith('TEMPO COMUM') && r.celebration === ord);
  }

  return [];
}

// Apenas NOV/2025: 96 estudos autorais por ocorrência, sem misturar os ciclos aprovados.
function monthlyStudyEntries(isoDate) {
  const month = window.LCE_MONTH_2025_11?.readings?.[isoDate];
  const review = window.LCE_ESTUDO_NOV_2025?.[isoDate];
  if (!month || !review) return null;
  const dayInfo = litCalendar.infoForIso(isoDate);
  const cycle = dayInfo.cycle;
  const types = {'Primeira leitura':['f','primeira-leitura'],'Segunda leitura':['s','segunda-leitura'],'Salmo responsorial':['p','salmo'],'Cântico responsorial':['p','salmo'],'Evangelho':['e','evangelho']};
  return month.items.map(([label,reference],index)=>{
    const [shortKind,kind] = types[label] || [];
    const segments=review[shortKind] || [];
    const psalm = isoDate === '2025-11-30' && kind === 'salmo' ? month.salmoResponsorial : null;
    return {
      id:'estudo-2025-11-'+isoDate+'-'+kind,
      data:isoDate,ano:cycle,tempo:dayInfo.season,
      rank:month.rank,
      ferialCycle:month.rank==='Féria' ? dayInfo.ferialCycle : null,
      section:'REVISAO MENSAL — NOVEMBRO 2025',celebracao:month.label,item:kind,itemLabel:label,
      referencia:psalm?.reference||reference,
      editorialStudy:true,draftUnits:segments,verseUnits:window.LCE_ESTUDO_VERSICULAR_2025_11?.[isoDate]?.[shortKind]||[],partialBrazilianPsalm:psalm||null,
      salmoRefrainConfirmed:month.salmoRefrainConfirmed&&kind==='salmo'?month.salmoRefrainConfirmed:null,
      sourceVersion:'Registro por data: texto integral da edição brasileira não incorporado. Roteiros anteriores arquivados como preparação preliminar, não glosa completa.',
      sourceUrl:psalm?.source||month.individualDateSource||month.source,
      status:'Texto integral e glosa ainda não concluídos',
      note:isoDate==='2025-11-02'?'Finados: seleção exemplificativa; outras opções legítimas previstas pela CNBB.':'',
      original:'Síntese editorial em preparação. Consulte o texto brasileiro completo na fonte.',
      glosa:segments.map(unit=>unit.glosaPreliminar).join('\n'),
      keywords:[month.label,isoDate,reference,label,'estudo','glosa preliminar',...segments.map(s=>s.sentido)]
    };
  });
}
// Reaproveita um texto salvo em outras datas quando o ciclo litúrgico coincidir.
function associatedStudyEntries(isoDate) {
  const archive=window.LCE_BR_ACERVO,library=window.LCE_FONTE_LOCAL;
  if(!archive?.complete||!library)return null;
  const mapped=library.associatedDate(isoDate);
  if(!mapped?.leituras)return null;
  const kinds=[
    ['primeiraLeitura','primeira-leitura','Primeira leitura','f'],
    ['salmo','salmo','Salmo responsorial','p'],
    ['segundaLeitura','segunda-leitura','Segunda leitura','s'],
    ['evangelho','evangelho','Evangelho','e']
  ];
  const present=kinds.filter(([field])=>mapped.leituras[field]?.length);
  const info=litCalendar.infoForIso(isoDate);
  if(info.weekday!==0 && info.season==='Tempo Comum' &&
    !['primeiraLeitura','salmo','evangelho'].every(key=>present.some(([f])=>f===key)))return null;
  if(info.weekday===0 && present.length<3)return null;
  if(!present.length)return null;
  const sourceFor=(kind,row)=>{
    for(const [day,entry] of Object.entries(archive.dates)){
      for(const id of entry.byKind?.[kind]||[]){
        const old=archive.texts[id];
        if(old?.reference===row.referencia && old?.text===row.texto)return day;
      }
    }
    return null;
  };
  const items=[];
  for(const [field,kind,title,short] of present){
    for(const row of mapped.leituras[field]){
      const sourceDate=sourceFor(kind,row);
      const month=window.LCE_MONTH_2025_11?.readings?.[sourceDate];
      const drafts=window.LCE_ESTUDO_NOV_2025?.[sourceDate]?.[short]||[];
      const verses=window.LCE_ESTUDO_VERSICULAR_2025_11?.[sourceDate]?.[short]||[];
      items.push({
        id:'acervo-br-'+isoDate+'-'+kind+'-'+items.length,
        data:isoDate,ano:info.cycle,tempo:info.season,
        rank:info.weekday===0?'Domingo':'Féria',ferialCycle:info.ferialCycle,
        section:'ACERVO BRASILEIRO LOCAL',
        celebracao:info.celebration||'Féria do Tempo Comum',
        item:kind,itemLabel:title,referencia:row.referencia,
        editorialStudy:true,draftUnits:drafts,verseUnits:verses,partialBrazilianPsalm:null,
        sourceVersion:'',sourceUrl:month?.individualDateSource||month?.source||'',
        status:'Texto local importado · glosa em revisão',note:'',
        glosa:drafts.map(x=>x.glosaPreliminar).join('\n'),
        keywords:[title,row.referencia,isoDate,sourceDate||'']
      });
    }
  }
  return items;
}

function entriesForDate(isoDate) {
  const month = monthlyStudyEntries(isoDate);
  if (month) return month;
  const linked = associatedStudyEntries(isoDate);
  if (linked?.length) return linked;
  const records = recordForDate(isoDate);
  return records.flatMap(record => recordItems(record).map(item => {
    const base = allLiturgyEntries.find(entry =>
      entry.ano === record.cycle &&
      entry.section === record.section &&
      entry.celebracao === fullCelebrationName(record) &&
      entry.item === item.type &&
      entry.referencia === item.reference
    );
    const occurrence = Object.assign({}, base || {}, {data: isoDate});
    return occurrence;
  }));
}

function searchableText(entry) {
  return normalize([
    entry.data,
    formatDate(entry.data),
    entry.ano,
    'ano ' + entry.ano,
    entry.tempo,
    entry.celebracao,
    entry.item,
    entry.itemLabel,
    entry.referencia,
    entry.original,
    entry.glosa,
    ...(entry.keywords || [])
  ].join(' '));
}

function formatGlosa(text) {
  const frag = document.createDocumentFragment();
  text.split('\n').filter(Boolean).forEach(line => {
    const isNote = line.trim().startsWith('(');
    const el = document.createElement(isNote ? 'span' : 'div');
    el.className = isNote ? 'visual-note' : 'glosa-line';
    el.textContent = line;
    frag.appendChild(el);
  });
  return frag;
}

function psalmStanzaGroups(header) {
  const match = String(header || '').match(/,\s*(.+?)\s*\(R\./i);
  if (!match) return [];
  return match[1]
    .split('.')
    .map(part => part.trim())
    .filter(Boolean);
}

function psalmVerseGroupWeight(group) {
  const ranges = String(group || '').match(/\d+[a-z]*(?:\s*-\s*\d+[a-z]*)?/gi) || [];
  let total = 0;

  ranges.forEach(range => {
    const nums = range.match(/\d+/g)?.map(Number) || [];
    if (nums.length >= 2) total += Math.max(1, nums[1] - nums[0] + 1);
    else if (nums.length === 1) total += 1;
  });

  return Math.max(1, total);
}

function splitPsalmBody(lines, stanzaGroups) {
  if (!lines.length) return [];
  if (!stanzaGroups?.length || stanzaGroups.length <= 1) return [lines];

  const groupCount = Math.min(stanzaGroups.length, lines.length);
  const weights = stanzaGroups.slice(0, groupCount).map(psalmVerseGroupWeight);
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  const equalTarget = lines.length / groupCount;
  const weightedTargets = weights.map(weight => lines.length * weight / totalWeight);
  const punctuationEnd = index => /[.!?;:»”]$/.test(lines[index] || '');

  const dp = Array.from({length: groupCount + 1}, () => Array(lines.length + 1).fill(null));
  dp[0][0] = {cost: 0, cuts: []};

  for (let group = 1; group <= groupCount; group++) {
    const minEnd = group;
    const maxEnd = lines.length - (groupCount - group);

    for (let endPos = minEnd; endPos <= maxEnd; endPos++) {
      for (let startPos = group - 1; startPos < endPos; startPos++) {
        const prev = dp[group - 1][startPos];
        if (!prev) continue;

        const size = endPos - startPos;
        const equalPenalty = Math.pow(size - equalTarget, 2);
        const weightedPenalty = Math.pow(size - weightedTargets[group - 1], 2) * 0.35;
        const boundaryPenalty = group < groupCount && !punctuationEnd(endPos - 1) ? 4 : 0;
        const cost = prev.cost + equalPenalty + weightedPenalty + boundaryPenalty;

        if (!dp[group][endPos] || cost < dp[group][endPos].cost) {
          dp[group][endPos] = {cost, cuts: [...prev.cuts, endPos]};
        }
      }
    }
  }

  const solution = dp[groupCount][lines.length];
  if (!solution) return [lines];

  const groups = [];
  let startPos = 0;
  solution.cuts.forEach(endPos => {
    groups.push(lines.slice(startPos, endPos));
    startPos = endPos;
  });
  return groups.filter(group => group.length);
}

function normalizePsalmStructurePart(value = '') {
  return normalize(value).replace(/\s+/g, ' ').trim();
}

function psalmStructureKey(cycle, header, refrain, alternative) {
  const cleanHeader = String(header || '').replace(/^SALMO RESPONSORIAL\s*/i, '');
  return [
    cycle,
    normalizePsalmStructurePart(cleanHeader),
    normalizePsalmStructurePart((refrain || []).join(' ')),
    normalizePsalmStructurePart((alternative || []).join(' '))
  ].join('|');
}

function splitByPsalmStructure(lines, sizes) {
  if (!Array.isArray(sizes) || !sizes.length) return null;
  if (sizes.reduce((sum, n) => sum + n, 0) !== lines.length) return null;

  const groups = [];
  let cursor = 0;
  sizes.forEach(size => {
    groups.push(lines.slice(cursor, cursor + size));
    cursor += size;
  });
  return groups;
}

function parsePsalmOriginal(text, cycle = '') {
  const lines = String(text || '')
    .replace(/\r/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  if (!lines.length) return {header: '', refrain: [], alternative: [], stanzas: []};

  const header = lines[0];
  const refrainIndex = lines.findIndex(line => /^Refrão:/i.test(line));
  if (refrainIndex < 0) {
    return {header, refrain: [], alternative: [], stanzas: splitPsalmBody(lines.slice(1), psalmStanzaGroups(header))};
  }

  let index = refrainIndex;
  const refrain = [lines[index].replace(/^Refrão:\s*/i, '')];
  while (index + 1 < lines.length && !(cycle === 'B' ? /[.!?»”]$/ : /[.!?;»”]$/).test(refrain[refrain.length - 1])) {
    index += 1;
    refrain.push(lines[index]);
  }

  const alternative = [];
  const firstAlternative = [];
  let extraAlternativeLines = 0;
  // O mesmo salmo pode trazer mais de uma alternativa (ex.: 'Ou: Aleluia').
  // Preservar todas como refrão, nunca como falsa estrofe.
  while (index + 1 < lines.length && /^Ou:/i.test(lines[index + 1])) {
    const group = [];
    index += 1;
    group.push(lines[index].replace(/^Ou:\s*/i, ''));
    while (index + 1 < lines.length && !/[.!?;»”]$/.test(group[group.length - 1])) {
      index += 1;
      group.push(lines[index]);
    }
    if (!firstAlternative.length) firstAlternative.push(...group);
    else extraAlternativeLines += group.length;
    alternative.push(...group);
  }

  const body = lines.slice(index + 1);
  // Preserva a chave legada dos esquemas cadastrados com a primeira alternativa.
  const key = psalmStructureKey(cycle, header, refrain, firstAlternative);
  const structure = psalmStructures[key];
  let stanzaSizes = structure?.s;
  // Alguns esquemas antigos contavam 'Ou: Aleluia' como uma estrofe de uma linha.
  if (extraAlternativeLines && stanzaSizes?.[0] === extraAlternativeLines &&
      stanzaSizes.slice(1).reduce((sum, n) => sum + n, 0) === body.length) {
    stanzaSizes = stanzaSizes.slice(1);
  }
  const structuredStanzas = splitByPsalmStructure(body, stanzaSizes);

  if (structuredStanzas) {
    return {header, refrain, alternative, stanzas: structuredStanzas, structureVerified: true};
  }

  return {header, refrain, alternative, stanzas: [body], structureVerified: false};
}

function appendPsalmRefrain(container, refrain, alternative, compact = false) {
  const box = document.createElement('div');
  box.className = 'psalm-refrain' + (compact ? ' is-repeat' : '');

  const label = document.createElement('strong');
  label.className = 'psalm-part-label';
  label.textContent = compact ? 'REFRÃO — REPETIR' : 'REFRÃO';
  box.appendChild(label);

  const main = document.createElement('div');
  main.className = 'psalm-part-text';
  main.textContent = refrain.join('\n');
  box.appendChild(main);

  if (alternative?.length) {
    const alt = document.createElement('div');
    alt.className = 'psalm-alternative';
    alt.textContent = 'OU: ' + alternative.join('\n');
    box.appendChild(alt);
  }

  container.appendChild(box);
}

// O registro brasileiro parcial nunca reutiliza automaticamente a glosa da edição portuguesa.
// Correspondência ordinal explícita: cada resumo tem exatamente uma glosa de preparação.
// Sem texto integral, não exibir paráfrases como se fossem versículos.
// Conteúdo principal: glosa de estudo visível, notas editoriais sob demanda.
// Mantém o rascunho intacto e separa instruções parentéticas das palavras da glosa.
function splitGlossStudyText(raw) {
  const parts=[];
  const source=String(raw??'');
  let buffer='',depth=0;
  const add=(kind,text)=>{if(text.trim())parts.push({kind,text:text.trim()});};
  for(const char of source){
    if(char==='('){
      if(depth===0){add('gloss',buffer);buffer='';depth=1;}
      else{depth++;buffer+='(';}
    }else if(char===')' && depth>0){
      if(depth===1){add('direction',buffer);buffer='';depth=0;}
      else{depth--;buffer+=')';}
    }else{buffer+=char;}
  }
  if(depth>0) add('gloss','('+buffer);
  else add('gloss',buffer);
  return parts;
}

function appendGlossWithDirections(container,raw) {
  for(const part of splitGlossStudyText(raw)){
    if(part.kind==='direction'){
      const direction=document.createElement('span');
      direction.className='monthly-glosa-direction';
      const label=document.createElement('span');
      label.className='monthly-glosa-direction-label';
      label.textContent='Orientação · não sinalizar literalmente';
      const instructions=document.createElement('span');
      instructions.className='monthly-glosa-direction-text';
      instructions.textContent=part.text;
      direction.append(label,instructions);
      container.appendChild(direction);
    }else{
      const signs=document.createElement('span');
      signs.className='monthly-glosa-signs';
      signs.textContent=part.text;
      container.appendChild(signs);
    }
  }
}

// Nos salmos com estudo versicular, a glosa acompanha a mesma divisão das estrofes.
function groupPsalmVerseDrafts(entry) {
  if(entry.item!=='salmo'||!entry.verseUnits?.length)return null;
  const ranges=window.LCE_FONTE_LOCAL?.parsePsalmRanges(entry.referencia)||[];
  if(!ranges.length)return null;
  const refrain=entry.verseUnits.find(u=>/^R\./i.test(u.ref) && !/repeti/i.test(u.ref));
  const verseUnits=entry.verseUnits.filter(u=>!/^R\./i.test(u.ref));
  const getVerse=u=>{
    const m=String(u.ref||'').match(/,\s*(\d+)[a-z]*\s*$/i);
    return m?Number(m[1]):null;
  };
  const groups=ranges.map(range=>({
    label:range.label,
    units:verseUnits.filter(u=>getVerse(u)!==null&&getVerse(u)>=range.start&&getVerse(u)<=range.end)
  }));
  if(groups.some(g=>!g.units.length))return null;
  if(groups.reduce((n,g)=>n+g.units.length,0)!==verseUnits.length)return null;
  return {refrain,groups};
}

function renderPsalmStudyGlosa(glosaBox,entry) {
  const data=groupPsalmVerseDrafts(entry);
  if(!data)return false;
  const container=document.createElement('div');
  container.className='monthly-psalm-study';
  if(data.refrain){
    const box=document.createElement('section');box.className='monthly-psalm-refrain-box';
    const label=document.createElement('span');label.className='monthly-psalm-box-label';
    label.textContent='Glosa do refrão';
    const text=document.createElement('div');text.className='monthly-glosa-draft';
    appendGlossWithDirections(text,data.refrain.glosa);
    const note=document.createElement('small');note.className='monthly-psalm-repeat-note';
    note.textContent='Repetir após cada estrofe';
    box.append(label,text,note);container.append(box);
  }
  const stanzas=document.createElement('div');stanzas.className='monthly-psalm-stanzas';
  data.groups.forEach((group,i)=>{
    const box=document.createElement('section');box.className='monthly-psalm-stanza';
    const heading=document.createElement('h4');heading.className='monthly-psalm-box-label';
    heading.textContent='Estrofe '+(i+1)+' · '+group.label;
    box.append(heading);
    group.units.forEach(unit=>{
      const segment=document.createElement('div');segment.className='monthly-psalm-glosa-verse';
      const label=document.createElement('span');label.className='monthly-glosa-reference';
      const m=String(unit.ref).match(/,\s*(\d+[a-z]*)\s*$/i);
      label.textContent=m?'v. '+m[1]:unit.ref;
      const text=document.createElement('div');text.className='monthly-glosa-draft';
      appendGlossWithDirections(text,unit.glosa);
      segment.append(label,text);box.append(segment);
    });
    stanzas.append(box);
  });
  container.append(stanzas);
  glosaBox.append(container);
  return true;
}

// Diálogo ao fim da proclamação: duas falas com papéis distintos.
function appendLiturgicalAcclamation(entry,node){
  const dialogue=window.LCE_ACLAMACOES?.forItem(entry.item);
  if(!dialogue)return;
  const originalPane=node.querySelector('.original-pane');
  const glossPane=node.querySelector('.glosa-pane');
  const textAnchor=node.querySelector('.original-text');
  const glossAnchor=node.querySelector('.glosa-text');
  if(!originalPane||!glossPane||!textAnchor||!glossAnchor)return;
  const source=document.createElement('section');
  source.className='liturgical-dialogue';
  source.setAttribute('aria-label','Aclamação ao final da leitura');
  const title=document.createElement('span');
  title.className='liturgical-dialogue-title';
  title.textContent='Ao final da leitura';
  source.append(title);
  for(const [who,phrase] of [[dialogue.minister,dialogue.proclamation],['Assembleia',dialogue.response]]){
    const line=document.createElement('p');
    line.className='liturgical-dialogue-line';
    const role=document.createElement('strong');
    role.textContent=who+': ';
    line.append(role,document.createTextNode(phrase));
    source.append(line);
  }
  textAnchor.after(source);
  const study=document.createElement('section');
  study.className='liturgical-dialogue liturgical-dialogue-study';
  study.setAttribute('aria-label','Preparação de glosa para o diálogo litúrgico');
  const heading=document.createElement('span');
  heading.className='liturgical-dialogue-title';
  heading.textContent='Resposta da assembleia · glosa em estudo';
  study.append(heading);
  for(const [who,words] of [[dialogue.minister,dialogue.proclamationStudy],['Assembleia',dialogue.responseStudy]]){
    const line=document.createElement('p');
    line.className='liturgical-dialogue-line';
    const role=document.createElement('strong');
    role.textContent=who+': ';
    line.append(role,document.createTextNode(words));
    study.append(line);
  }
  const caution=document.createElement('small');
  caution.textContent='Roteiro preliminar, não validado em Libras.';
  study.append(caution);
  glossAnchor.after(study);
}

function renderMonthlyStudy(entry, originalBox, glosaBox) {
  const pending=document.createElement('p');
  pending.className='monthly-original-pending';
  pending.textContent='Carregando a leitura brasileira…';
  originalBox.replaceChildren(pending);

  glosaBox.replaceChildren();
  const units=entry.verseUnits?.length
    ? entry.verseUnits.map(unit=>({reference:unit.ref,draft:unit.glosa,meaning:unit.sentido,space:unit.espaco}))
    : (entry.draftUnits||[]).map((unit,index)=>({reference:'Trecho '+(index+1),draft:unit.glosaPreliminar,meaning:unit.sentido,space:''}));
  const key=document.createElement('p');
  key.className='monthly-glosa-legend';
  key.textContent='Glosa em destaque · orientações em cinza';
  glosaBox.appendChild(key);
  const list=document.createElement('div');
  list.className='monthly-glosa-list';
  units.forEach(unit=>{
    const section=document.createElement('section');
    section.className='monthly-glosa-unit';
    const title=document.createElement('span');
    title.className='monthly-glosa-reference';
    title.textContent=unit.reference;
    const text=document.createElement('div');
    text.className='monthly-glosa-draft';
    appendGlossWithDirections(text,unit.draft);
    section.append(title,text);
    list.appendChild(section);
  });
  if(!renderPsalmStudyGlosa(glosaBox,entry)){
    if(units.length) glosaBox.appendChild(list);
    else {
      const notice=document.createElement('p');
      notice.className='monthly-glosa-legend';
      notice.textContent='Glosa ainda não elaborada para esta leitura.';
      glosaBox.appendChild(notice);
    }
  }
  if(units.length){
    const details=document.createElement('details');
    details.className='monthly-editorial-details';
    const summary=document.createElement('summary');
    summary.textContent='Análise do texto (não é glosa)';
    details.appendChild(summary);
    const explanation=document.createElement('p');
    explanation.className='monthly-analysis-intro';
    explanation.textContent='Material de estudo: sentido da passagem e organização espacial. Não é conteúdo para sinalizar.';
    details.appendChild(explanation);
    const ol=document.createElement('ol');
    for(const unit of units.filter(u=>entry.item!=='salmo'||!/^R\.\s*\(repeti/i.test(u.reference))){
      const li=document.createElement('li');
      const heading=document.createElement('strong');
      heading.textContent=unit.reference;
      const sense=document.createElement('p');
      sense.className='monthly-analysis-sense';
      const senseLabel=document.createElement('strong');
      senseLabel.textContent='Sentido do trecho: ';
      sense.append(senseLabel,document.createTextNode(unit.meaning));
      li.append(heading,sense);
      if(unit.space){
        const note=document.createElement('p');
        note.className='monthly-analysis-space';
        const spaceLabel=document.createElement('strong');
        spaceLabel.textContent='Referentes e espaço: ';
        note.append(spaceLabel,document.createTextNode(unit.space));
        li.appendChild(note);
      }
      ol.appendChild(li);
    }
    details.appendChild(ol);
    glosaBox.appendChild(details);
  }
}

function renderPartialBrazilianPsalm(psalm, originalBox, glosaBox) {
  const originals = document.createElement('div');
  const glosas = document.createElement('div');
  originals.className = 'psalm-sequence psalm-br-partial';
  glosas.className = 'psalm-sequence psalm-glosa-sequence psalm-br-partial';
  const units = [
    ['REFRÃO · cf. v. 1', psalm.refrain, '(PEREGRINOS OUVEM CONVITE) QUE ALEGRIA / PESSOAS ME DIZER: VAMOS CASA SENHOR! (GLOSA EXPERIMENTAL, NÃO VALIDADA.)'],
    ['ESTROFE 1 · vv. 1–2', psalm.firstStanza, '(JERUSALÉM ESTABELECIDA NO ESPAÇO) EU OUVIR CONVITE / ALEGRIA / NÓS CAMINHAR / CHEGAR PORTAS JERUSALÉM. (GLOSA EXPERIMENTAL, NÃO VALIDADA.)'],
    ['REFRÃO · REPETIR', psalm.refrain, 'REPETIR ESTRUTURA EXPERIMENTAL DO REFRÃO; COMUNIDADE RESPONDE. (VALIDAÇÃO HUMANA PENDENTE.)'],
    ['ESTROFES 2–4 · vv. 4–9',
      'Texto brasileiro das demais estrofes ainda não incorporado por ausência de autorização editorial de reprodução. Consulte a fonte brasileira indicada.',
      'Correspondência textual e glosas das estrofes 2–4 pendentes.']
  ];
  for (const [title, textOriginal, textGlosa] of units) {
    for (const [container, content, pending] of [[originals,textOriginal,false],[glosas,textGlosa,true]]) {
      const section = document.createElement('section');
      section.className = 'psalm-stanza' + (pending ? ' glosa-pending' : '');
      const label = document.createElement('strong');
      label.className = 'psalm-part-label';
      label.textContent = title;
      const line = document.createElement('div');
      line.className = 'psalm-part-text';
      line.textContent = content;
      section.append(label,line);
      container.appendChild(section);
    }
  }
  originalBox.replaceChildren(originals);
  glosaBox.replaceChildren(glosas);
}

function formatPsalmOriginal(text, cycle) {
  const parsed = parsePsalmOriginal(text, cycle);
  const frag = document.createDocumentFragment();

  const header = document.createElement('div');
  header.className = 'psalm-header';
  header.textContent = parsed.header;
  frag.appendChild(header);

  if (!parsed.refrain.length) {
    const fallback = document.createElement('div');
    fallback.className = 'psalm-stanza';
    fallback.textContent = String(text || '');
    frag.appendChild(fallback);
    return {fragment: frag, parsed};
  }

  const sequence = document.createElement('div');
  sequence.className = 'psalm-sequence';
  appendPsalmRefrain(sequence, parsed.refrain, parsed.alternative);

  parsed.stanzas.forEach((stanza, index) => {
    const block = document.createElement('section');
    block.className = 'psalm-stanza';

    const label = document.createElement('strong');
    label.className = 'psalm-part-label';
    label.textContent = parsed.structureVerified ? ('ESTROFE ' + (index + 1)) : 'ESTROFES — separação ainda não conferida';

    const body = document.createElement('div');
    body.className = 'psalm-part-text';
    body.textContent = stanza.join('\n');

    block.append(label, body);
    sequence.appendChild(block);
    appendPsalmRefrain(sequence, parsed.refrain, parsed.alternative, true);
  });

  frag.appendChild(sequence);
  return {fragment: frag, parsed};
}

function glosaUnits(text, options = {}) {
  const lines = String(text || '').replace(/\r/g, '').split('\n').map(line => line.trim()).filter(Boolean);
  const units = [];
  const explicitGroups = [];
  let currentExplicitGroup = null;
  let notes = [];
  let refrain = '';
  let explicitRefrain = false;

  lines.forEach(line => {
    if (/^\(REFRÃO/i.test(line)) {
      // Ao receber o refrão específico do dia, nenhuma linha da primeira estrofe
      // deve ser consumida como se fosse um refrão genérico.
      explicitRefrain = !options.refrainSupplied;
      return;
    }

    if (/^\(ESTROFE\s+\d+/i.test(line)) {
      currentExplicitGroup = [];
      explicitGroups.push(currentExplicitGroup);
      notes = [];
      return;
    }

    if (line.startsWith('(')) {
      notes.push(line);
      return;
    }

    if (explicitRefrain && !refrain) {
      refrain = line;
      return;
    }

    if (refrain && line === refrain) return;

    const unit = {notes, text: line};
    notes = [];
    if (currentExplicitGroup) currentExplicitGroup.push(unit);
    else units.push(unit);
  });

  return {refrain, units, explicitGroups, trailingNotes: notes};
}

function distributeGlosaUnits(units, stanzaLineCounts) {
  if (!stanzaLineCounts.length) return [units];
  const groups = [];
  let cursor = 0;
  const totalWeight = stanzaLineCounts.reduce((sum, value) => sum + Math.max(1, value), 0);

  stanzaLineCounts.forEach((weight, index) => {
    const remainingGroups = stanzaLineCounts.length - index;
    const remainingUnits = units.length - cursor;
    let count;

    if (index === stanzaLineCounts.length - 1) {
      count = remainingUnits;
    } else {
      count = Math.max(0, Math.round(units.length * Math.max(1, weight) / totalWeight));
      count = Math.min(count, Math.max(0, remainingUnits - (remainingGroups - 1)));
    }

    groups.push(units.slice(cursor, cursor + count));
    cursor += count;
  });

  if (cursor < units.length && groups.length) groups[groups.length - 1].push(...units.slice(cursor));
  return groups;
}

function formatPsalmGlosa(text, parsedOriginal, contextual = null, refrainOverride = null, cycle = '') {
  const frag = document.createDocumentFragment();
  const wrapper = document.createElement('div');
  wrapper.className = 'psalm-sequence psalm-glosa-sequence';

  let refrain = '';
  let alternativeRefrain = '';
  let groups = [];

  if (contextual && typeof contextual === 'object') {
    refrain = String(contextual.refrain || '').trim();
    alternativeRefrain = String(contextual.alternativeRefrain || '').trim();
    groups = Array.isArray(contextual.stanzas)
      ? contextual.stanzas.map(stanza => (Array.isArray(stanza) ? stanza : []).map(line => ({
          notes: [],
          text: String(line || '').trim()
        })).filter(unit => unit.text))
      : [];
  } else {
    const parsedGlosa = glosaUnits(text, {refrainSupplied: Boolean(refrainOverride)});
    refrain = parsedGlosa.refrain;
    const stanzaCounts = parsedOriginal.stanzas.map(stanza => stanza.length);
    groups = parsedGlosa.explicitGroups.length
      ? parsedGlosa.explicitGroups
      : distributeGlosaUnits(parsedGlosa.units, stanzaCounts);
  }

  // Um refrão pode mudar mesmo quando a referência do salmo é a mesma.
  // Corrigimos o refrão por celebração sem insinuar que as estrofes estão homologadas.
  if (!contextual && refrainOverride && typeof refrainOverride === 'object') {
    refrain = String(refrainOverride.refrain || '').trim();
    alternativeRefrain = String(refrainOverride.alternativeRefrain || '').trim();
  }

  const refrainBox = document.createElement('div');
  refrainBox.className = 'psalm-refrain glosa-refrain';
  const refrainLabel = document.createElement('strong');
  refrainLabel.className = 'psalm-part-label';
  refrainLabel.textContent = 'REFRÃO — GLOSA';
  const refrainText = document.createElement('div');
  refrainText.className = 'psalm-part-text';
  refrainText.textContent = refrain || 'Glosa do refrão ainda precisa ser estruturada.';
  refrainBox.append(refrainLabel, refrainText);
  if (alternativeRefrain) {
    const alt = document.createElement('div');
    alt.className = 'psalm-alternative';
    alt.textContent = 'OU — GLOSA: ' + alternativeRefrain;
    refrainBox.appendChild(alt);
  }
  wrapper.appendChild(refrainBox);

  parsedOriginal.stanzas.forEach((_, index) => {
    const block = document.createElement('section');
    block.className = 'psalm-stanza glosa-stanza';

    const label = document.createElement('strong');
    label.className = 'psalm-part-label';
    label.textContent = 'ESTROFE ' + (index + 1) +
      ((cycle === 'A' || cycle === 'B')
        ? (contextual ? ' — GLOSA PRELIMINAR' : ' — GLOSA-BASE (ALINHAMENTO PENDENTE)')
        : ' — GLOSA');
    block.appendChild(label);

    const group = groups[index] || [];
    if (!group.length) {
      const missing = document.createElement('div');
      missing.className = 'psalm-glosa-missing';
      missing.textContent = 'Glosa desta estrofe ainda precisa ser completada.';
      block.appendChild(missing);
    } else {
      group.forEach(unit => {
        (unit.notes || []).forEach(note => {
          const noteEl = document.createElement('span');
          noteEl.className = 'visual-note';
          noteEl.textContent = note;
          block.appendChild(noteEl);
        });
        const line = document.createElement('div');
        line.className = 'glosa-line';
        line.textContent = unit.text;
        block.appendChild(line);
      });
    }

    wrapper.appendChild(block);

    const repeat = document.createElement('div');
    repeat.className = 'psalm-refrain glosa-refrain is-repeat';
    const repeatLabel = document.createElement('strong');
    repeatLabel.className = 'psalm-part-label';
    repeatLabel.textContent = 'REFRÃO — REPETIR';
    const repeatText = document.createElement('div');
    repeatText.className = 'psalm-part-text';
    repeatText.textContent = refrain || 'Glosa do refrão ainda precisa ser estruturada.';
    repeat.append(repeatLabel, repeatText);
    wrapper.appendChild(repeat);
  });

  frag.appendChild(wrapper);
  return frag;
}

function closeOtherAccordions(currentTrigger) {
  document.querySelectorAll('.accordion-trigger[aria-expanded="true"]').forEach(trigger => {
    if (trigger !== currentTrigger) {
      trigger.setAttribute('aria-expanded', 'false');
      const panel = trigger.parentElement.querySelector('.accordion-panel');
      if (panel) panel.hidden = true;
    }
  });
}

function bindAccordion(trigger) {
  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    closeOtherAccordions(trigger);
    trigger.setAttribute('aria-expanded', String(!expanded));
    trigger.parentElement.querySelector('.accordion-panel').hidden = expanded;
  });
}

// Default view follows the closest upcoming celebration with available readings.
let showFullLiturgyArchive = false;
function todayIsoLocal() {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth()+1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
}
function upcomingLiturgyDate() {
  const today = todayIsoLocal();
  const start = new Date(today + 'T12:00:00');
  for (let offset = 0; offset <= 370; offset++) {
    const candidate = new Date(start);
    candidate.setDate(start.getDate() + offset);
    const iso = [candidate.getFullYear(), String(candidate.getMonth()+1).padStart(2,'0'), String(candidate.getDate()).padStart(2,'0')].join('-');
    if (candidate.getFullYear() > litCalendar.maxYear) break;
    if (candidate.getFullYear() < litCalendar.minYear) continue;
    if (recordForDate(iso).length) return iso;
  }
  return '';
}
function updateLiturgyArchiveControl(defaultDate) {
  const parent = els.resultCount.parentElement;
  let control = parent.querySelector('.liturgy-archive-toggle');
  if (!control) {
    control = document.createElement('button');
    control.className = 'secondary-button liturgy-archive-toggle';
    control.type = 'button';
    control.style.cssText = 'margin-top:8px;font-size:.82rem;padding:8px 12px;white-space:normal';
    control.addEventListener('click', () => {
      showFullLiturgyArchive = !showFullLiturgyArchive;
      els.query.value = '';
      els.date.value = '';
      els.year.value = '';
      els.item.value = '';
      renderLiturgia();
    });
    parent.appendChild(control);
  }
  const hasFilters = Boolean(els.query.value.trim() || els.date.value || els.year.value || els.item.value);
  control.textContent = showFullLiturgyArchive && !hasFilters ? 'Ver próxima celebração' : 'Consultar acervo completo';
  control.hidden = hasFilters;
  let hint = parent.querySelector('.liturgy-date-hint');
  if (!hint) {
    hint = document.createElement('div');
    hint.className = 'liturgy-date-hint';
    hint.style.cssText = 'font-size:.82rem;color:#6f6a60;margin-top:6px';
    parent.appendChild(hint);
  }
  hint.textContent = !hasFilters && !showFullLiturgyArchive && defaultDate
    ? 'Próxima celebração: ' + formatDate(defaultDate)
    : '';
}

// Os textos do Lecionário podem incluir duas FORMAS no mesmo registro.
 // Seleção visual não altera o texto-fonte nem homologa uma glosa distinta.
function splitLectionaryVariants(text) {
  const source = String(text || '');
  const markers = [...source.matchAll(/^(?:EVANGELHO|LEITURA(?:\s+[IVX]+)?)\s+Forma (longa|breve)\b/gmi)];
  const long = markers.find(marker => marker[1].toLowerCase() === 'longa');
  const brief = markers.find(marker => marker[1].toLowerCase() === 'breve' && marker.index > (long?.index ?? -1));
  if (!long || !brief) return null;
  return {
    longa: source.slice(long.index, brief.index).trim(),
    breve: source.slice(brief.index).trim()
  };
}

// Ano B: alguns registros do acervo contêm duas leituras ALTERNATIVAS,
 // que não são uma única leitura longa (e nem sempre constituem forma breve).
function splitYearBAlternativeReading(entry) {
  if (entry.ano !== 'B') return null;
  const source = String(entry.original || '');
  const patterns = [
    { marker: /^Ou a leitura seguinte:\s*Gal\s*5,\s*16-25\s*$/mi,
      labels: ['1Cor 12,3-7.12-13', 'Gl 5,16-25'], prefix: 'LEITURA II Gal 5,16-25\n' },
    { marker: /^Ou a seguinte leitura facultativa:\s*$/mi,
      labels: ['Ef 1,17-23', 'Ef 4,1-13'], prefix: '' },
    { marker: /^Ou\s+1\s*Cor\s*5,\s*6b-8\s*$/mi,
      labels: ['Cl 3,1-4', '1Cor 5,6-8'], prefix: 'LEITURA II 1 Cor 5,6b-8\n' },
    { marker: /^Ou Jo\s*12,\s*12-16\s*$/mi,
      labels: ['Mc 11,1-10', 'Jo 12,12-16'], prefix: 'EVANGELHO Jo 12,12-16\n' }
  ];
  for (const pattern of patterns) {
    const hit = pattern.marker.exec(source);
    if (!hit) continue;
    const after = source.slice(hit.index + hit[0].length);
    const sequenceIndex = after.search(/^SEQUÊNCIA\s*$/mi);
    const second = sequenceIndex >= 0 ? after.slice(0, sequenceIndex) : after;
    const sequence = sequenceIndex >= 0 ? after.slice(sequenceIndex).trim() : '';
    const allGlosa = String(entry.glosa || '');
    const firstMark = allGlosa.search(/^\[OPÇÃO 1:/mi);
    const secondMark = allGlosa.search(/^\[OPÇÃO 2:/mi);
    if (firstMark < 0 || secondMark < 0 || secondMark <= firstMark) return null;
    const firstGlosa = allGlosa.slice(firstMark, secondMark).trim();
    const secondGlosa = allGlosa.slice(secondMark).split(/^\[SEQUÊNCIA/i)[0].trim();
    return {
      labels: pattern.labels,
      originals: [source.slice(0, hit.index).trim(), (pattern.prefix + second).trim()],
      glosas: [firstGlosa, secondGlosa],
      sequence
    };
  }
  return null;
}

function selectedLiturgyEdition(){return els.editionChoices.find(x=>x.checked)?.value==='AVM'?'AVM':'CNBB';}
function renderLiturgia() {
  const q = normalize(els.query.value);
  const date = els.date.value;
  const year = els.year.value;
  const item = els.item.value;

  const noFilters = !q && !date && !year && !item;
  const defaultDate = noFilters && !showFullLiturgyArchive ? upcomingLiturgyDate() : '';
  const sourceEntries = date ? entriesForDate(date) : defaultDate ? entriesForDate(defaultDate) : allLiturgyEntries;
  updateLiturgyArchiveControl(defaultDate);
  const filtered = sourceEntries
    .filter(entry => {
      const matchesQuery = !q || searchableText(entry).includes(q);
      const matchesDate = !date || entry.data === date;
      const matchesYear = !year || entry.ano === year;
      const matchesItem = !item || entry.item === item;
      return matchesQuery && matchesDate && matchesYear && matchesItem;
    })
    .sort((a,b) => (a.data || '').localeCompare(b.data || '') || (itemOrder[a.item] || 99) - (itemOrder[b.item] || 99));

  els.liturgyResults.replaceChildren();
  if(date==='2025-11-02'){
    const note=document.createElement('p');
    note.className='monthly-selection-note';
    note.textContent='Finados possui diferentes formulários e leituras; confira a seleção da celebração.';
    els.liturgyResults.appendChild(note);
  }
  els.resultCount.textContent = filtered.length + ' ' + (filtered.length === 1 ? 'resultado' : 'resultados');

  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = date
      ? 'Ainda não há conteúdo cadastrado para esta data. Experimente outra data ou consulte o acervo completo.'
      : 'Nenhum conteúdo encontrado. Ajuste a pesquisa ou limpe os filtros.';
    els.liturgyResults.appendChild(empty);
    return;
  }

  filtered.forEach(entry => {
    const node = els.template.content.cloneNode(true);
    const trigger = node.querySelector('.accordion-trigger');

    const cycleLabel=entry.ferialCycle
      ? 'Ferial '+entry.ferialCycle
      : entry.editorialStudy && entry.rank && !['Domingo','Solenidade'].includes(entry.rank)
        ? entry.rank
        : 'Ano '+entry.ano;
    node.querySelector('.card-kicker').textContent = cycleLabel+' · '+entry.itemLabel;
    node.querySelector('.card-title').textContent = entry.editorialStudy
      ? entry.referencia : entry.celebracao + ' — ' + entry.referencia;
    node.querySelector('.card-meta').textContent = entry.editorialStudy
      ? [formatDate(entry.data),entry.celebracao].filter(Boolean).join(' · ')
      : [formatDate(entry.data),entry.tempo,entry.note].filter(Boolean).join(' · ');
    const statusPill=node.querySelector('.status-pill');
    statusPill.textContent=entry.editorialStudy?'Em estudo':entry.status;
    statusPill.title=entry.status;
    node.querySelector('.source-version').textContent = entry.editorialStudy?'':(entry.sourceVersion||'');
    const originalTextBox = node.querySelector('.original-text');
    const glosaTextBox = node.querySelector('.glosa-text');
    if(entry.editorialStudy){
      node.querySelector('.original-pane .pane-label').textContent='Texto litúrgico';
      node.querySelector('.glosa-pane .pane-label').textContent='Glosa de estudo';
      node.querySelector('.glosa-pane .pane-label').title='Preparação preliminar, não validada em Libras';
    }
    let parsedPsalm = null;

    if (entry.editorialStudy) {
      renderMonthlyStudy(entry, originalTextBox, glosaTextBox);
    } else if (entry.item === 'salmo' && entry.partialBrazilianPsalm) {
      renderPartialBrazilianPsalm(entry.partialBrazilianPsalm, originalTextBox, glosaTextBox);
    } else if (entry.item === 'salmo') {
      originalTextBox.replaceChildren();
      const formattedPsalm = formatPsalmOriginal(entry.original, entry.ano);
      parsedPsalm = formattedPsalm.parsed;
      originalTextBox.appendChild(formattedPsalm.fragment);
      glosaTextBox.replaceChildren(formatPsalmGlosa(entry.glosa, parsedPsalm, entry.glosaContext, entry.glosaRefrainContext, entry.ano));
    } else {
      const alternate = splitYearBAlternativeReading(entry);
      const variants = (entry.ano === 'A' || entry.ano === 'B') && !alternate
        ? splitLectionaryVariants(entry.original) : null;
      originalTextBox.textContent = alternate ? alternate.originals[0]
        : variants ? variants.longa : entry.original;
      glosaTextBox.replaceChildren(formatGlosa(alternate ? alternate.glosas[0] : entry.glosa));
      if (alternate || variants) {
        const switcher = document.createElement('div');
        switcher.className = 'lectionary-variant-switch';
        switcher.setAttribute('role', 'group');
        switcher.setAttribute('aria-label', 'Escolher a leitura que será proclamada');
        const notice = document.createElement('p');
        notice.className = 'lectionary-variant-notice';
        notice.textContent = alternate
          ? 'Este registro oferece leituras alternativas: selecione somente a que será proclamada. As glosas são roteiros de preparação pendentes de validação em Libras.'
          : 'O Lecionário apresenta duas formas. Escolha a proclamada e confira a glosa para a forma escolhida.';
        const choices = alternate
          ? alternate.labels.map((label, i) => ({key:i, title:label}))
          : Object.entries({longa:'Forma longa', breve:'Forma breve'}).map(([key,title])=>({key,title}));
        choices.forEach(({key, title}, i) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'secondary-button lectionary-variant-button';
          button.textContent = title;
          button.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
          button.addEventListener('click', () => {
            originalTextBox.textContent = alternate ? alternate.originals[key] : variants[key];
            if (alternate) glosaTextBox.replaceChildren(formatGlosa(alternate.glosas[key]));
            switcher.querySelectorAll('button').forEach(item =>
              item.setAttribute('aria-pressed', item === button ? 'true' : 'false')
            );
          });
          switcher.appendChild(button);
        });
        originalTextBox.before(switcher, notice);
        if (alternate?.sequence) {
          const extra = document.createElement('details');
          extra.className = 'lectionary-sequence';
          const summary = document.createElement('summary');
          summary.textContent = 'Sequência de Pentecostes — texto litúrgico complementar';
          const body = document.createElement('div');
          body.className = 'text-content';
          body.textContent = alternate.sequence;
          extra.append(summary, body);
          originalTextBox.after(extra);
        }
      }
    }

    // Não aplicar aos salmos nem aos cânticos: neles a resposta é o refrão.
    appendLiturgicalAcclamation(entry,node);

    const originalSourceLink = node.querySelector('.original-source-link');
    if(entry.editorialStudy) originalSourceLink.textContent='Consultar fonte brasileira ↗';
    if (entry.sourceUrl) {
      originalSourceLink.href = entry.sourceUrl;
      originalSourceLink.hidden = false;
    } else {
      originalSourceLink.hidden = true;
    }

    els.liturgyResults.appendChild(node);
    const card = els.liturgyResults.lastElementChild;
    card.dataset.entryId=entry.id||[entry.data,entry.item,entry.referencia].join('|');
    if(entry.editorialStudy) {
      card.dataset.editorialStudy='true';
      card.dataset.completeText='false';
      // Notas de interpretação são opcionais e não alongam a coluna direita.
      const comparison=card.querySelector('.parallel-view');
      const studyNotes=card.querySelector('.glosa-text > .monthly-editorial-details');
      if(comparison && studyNotes){
        const aside=document.createElement('aside');
        aside.className='liturgy-study-notes';
        aside.setAttribute('aria-label','Análise do texto, material de estudo que não é glosa');
        studyNotes.open=false;
        aside.appendChild(studyNotes);
        comparison.after(aside);
      }
      if(window.LCE_EDICOES)window.LCE_EDICOES.apply(entry,card,selectedLiturgyEdition());
      else if(window.LCE_FONTE_LOCAL)window.LCE_FONTE_LOCAL.loadForEntry(entry,card);
    }
    if(!entry.editorialStudy && window.LCE_EDICOES)
      window.LCE_EDICOES.apply(entry,card,selectedLiturgyEdition());
    if (entry.data && entry.item) {
      const share = document.createElement('button');
      share.type = 'button';
      share.className = 'secondary-button share-liturgy-link';
      share.textContent = 'Copiar link';
      share.setAttribute('aria-label', 'Copiar link direto para ' + entry.itemLabel + ', ' + formatDate(entry.data));
      share.addEventListener('click', async () => {
        const params = new URLSearchParams({data:entry.data,item:entry.item});
        const url = window.location.origin + window.location.pathname + '#liturgia-e-libras?' + params.toString();
        try {
          await navigator.clipboard.writeText(url);
          share.textContent = 'Link copiado';
        } catch {
          window.prompt('Copie o link desta leitura:', url);
        }
      });
      card.querySelector('.accordion-panel')?.appendChild(share);
    }
    bindAccordion(card.querySelector('.accordion-trigger'));
  });
}

// Links compartilháveis por seção sem criar subdiretórios na Locaweb.
const SECTION_PATHS = Object.freeze({
  projeto: 'inicio',
  biblia: 'biblia',
  plano: 'plano-de-leitura',
  calendario: 'calendario-liturgico',
  liturgia: 'liturgia-e-libras',
  missal: 'ritos-da-missa'
});
const PATH_SECTIONS = Object.fromEntries(Object.entries(SECTION_PATHS).map(([key, path]) => [path, key]));
PATH_SECTIONS['missal-romano-e-libras'] = 'missal'; // preserva links publicados na primeira versão
function sectionFromUrl() {
  const slug = decodeURIComponent(window.location.hash.slice(1).split('?')[0]).replace(/^\/+/, '').toLowerCase();
  return PATH_SECTIONS[slug] || 'projeto';
}
function syncSectionUrl(section, options = {}) {
  const params = new URLSearchParams();
  if (section === 'liturgia' && options.liturgyDate) {
    params.set('data', options.liturgyDate);
    if (options.liturgyItem) params.set('item', options.liturgyItem);
  }
  if (section === 'calendario') {
    if (options.calendarDate) params.set('data', options.calendarDate);
    else if (options.calendarMonth) params.set('mes', options.calendarMonth);
  }
  const hash = '#' + SECTION_PATHS[section] + (params.size ? '?' + params.toString() : '');
  if (window.location.hash !== hash) {
    window.history.pushState({section}, '', hash);
  }
}

function setSection(section, options = {}) {
  if (!els.sections[section]) section = 'projeto';
  if (!options.fromHistory) syncSectionUrl(section, options);
  const titles = {projeto:'Início',biblia:'Bíblia',plano:'Plano de Leitura',calendario:'Calendário Litúrgico',liturgia:'Liturgia da Palavra',missal:'Ritos e Orações da Missa'};
  document.title = titles[section] + ' — Caminhos da Palavra';
  els.navButtons.forEach(btn => {
    if (btn.dataset.section === section) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });
  if (section === 'liturgia' && options.fromHistory) {
    const rawParams = window.location.hash.split('?')[1] || '';
    const params = new URLSearchParams(rawParams);
    const date = params.get('data') || '';
    const item = params.get('item') || '';
    els.date.value = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
    els.item.value = [...els.item.options].some(opt => opt.value === item) ? item : '';
    if (els.date.value) { els.query.value = ''; els.year.value = ''; }
  }
  Object.entries(els.sections).forEach(([key, el]) => { el.hidden = key !== section; });
  els.navButtons.forEach(btn => btn.classList.toggle('is-active', btn.dataset.section === section));
  if (section === 'liturgia') renderLiturgia();
  if (section === 'calendario' && (!options.fromHistory || !restoreCalendarHash())) renderCalendar();
  if (section === 'biblia') renderBibleBooks();
  if (section === 'plano') renderPlan();
  if (options.scrollToResults && section === 'liturgia') {
    // Only scroll after the destination is made visible and its cards are rendered.
    requestAnimationFrame(() => {
      const target = els.liturgyResults.closest('#liturgiaSection')?.querySelector('.section-heading') || els.liturgyResults;
      const header = document.querySelector('.site-header');
      const offset = (header?.getBoundingClientRect().height || 0) + 18;
      const y = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
      window.scrollTo({top: y, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    });
  } else {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}

/* Calendário 2026–2030 */
let selectedCalendarDate = null;

function initCalendarControls() {
  litCalendar.monthNames.forEach((name, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = name;
    els.calendarMonth.appendChild(option);
  });

  const now = new Date();
  const currentYear = now.getFullYear();
  const initialYear = Math.min(litCalendar.maxYear, Math.max(litCalendar.minYear, currentYear));
  els.calendarYear.value = String(initialYear);
  els.calendarMonth.value = String(currentYear === initialYear ? now.getMonth() : 0);
}

// Aceita links compartilháveis por dia e por mês; rejeita datas inexistentes.
function restoreCalendarHash() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const day = params.get('data') || '';
  const month = params.get('mes') || '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    const info = litCalendar.infoForIso(day);
    if (info.iso === day && info.year >= litCalendar.minYear && info.year <= litCalendar.maxYear) {
      els.calendarYear.value = String(info.year);
      els.calendarMonth.value = String(info.month);
      selectCalendarDate(info, {suppressUrl:true});
      return true;
    }
  }
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    const year = Number(month.slice(0,4)), number = Number(month.slice(5,7));
    if (year >= litCalendar.minYear && year <= litCalendar.maxYear) {
      els.calendarYear.value = String(year);
      els.calendarMonth.value = String(number - 1);
      selectedCalendarDate = null;
      renderCalendar();
      return true;
    }
  }
  return false;
}
function updateCalendarMonthUrl() {
  if (sectionFromUrl() === 'calendario') {
    const month = String(Number(els.calendarMonth.value)+1).padStart(2,'0');
    syncSectionUrl('calendario', {calendarMonth: els.calendarYear.value + '-' + month});
  }
}
function contentForDate(isoDate) {
  return entriesForDate(isoDate);
}

function openLiturgicalDate(iso) {
  els.query.value = '';
  els.date.value = iso;
  els.year.value = '';
  els.item.value = '';
  setSection('liturgia', {scrollToResults: true, liturgyDate: iso});
}

function selectCalendarDate(dayInfo, options = {}) {
  selectedCalendarDate = dayInfo.iso;
  const contents = contentForDate(dayInfo.iso);
  if (!options.suppressUrl && sectionFromUrl() === 'calendario') {
    syncSectionUrl('calendario', {calendarDate:dayInfo.iso});
  }

  els.calendarDetail.replaceChildren();
  window.LCE_DAILY.renderDetail(els.calendarDetail, dayInfo, contents);

  // A ação principal pertence à Liturgia da Palavra, não ao final da hagiografia.
  const readingsBox = els.calendarDetail.querySelector('.daily-references');
  if (readingsBox) {
    const tools = document.createElement('div');
    tools.className = 'calendar-reading-tools';
    const existing = contents.length > 0;
    const draft = window.LCE_DAILY.readings[dayInfo.iso];
    // Roteiros de revisão são dados internos, não uma segunda interface de glosa.
    if (existing) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'primary-action calendar-action';
      button.textContent = 'Abrir Liturgia + Libras desta data';
      button.setAttribute('aria-label', 'Abrir leituras e glosas de apoio relativas a ' + formatDate(dayInfo.iso));
      button.addEventListener('click', () => openLiturgicalDate(dayInfo.iso));
      tools.appendChild(button);
      const note = document.createElement('p');
      note.className = 'calendar-reading-notice';
      note.textContent = 'Consulte o texto e a glosa de apoio na página especializada; a validação humana em Libras permanece pendente.';
      tools.appendChild(note);
    } else {
      const note = document.createElement('p');
      note.className = 'calendar-reading-notice';
      note.textContent = 'A liturgia comparativa desta data ainda não está cadastrada. As referências aparecem acima.';
      tools.appendChild(note);
    }
    readingsBox.insertBefore(tools, readingsBox.children[1] || null);
  }

  // Memórias hagiográficas: não determinar a celebração principal por esta lista.
  const saintsSection = document.createElement('section');
  saintsSection.className = 'calendar-saints';
  const heading = document.createElement('h4');
  heading.textContent = 'Santos e beatos recordados nesta data';
  saintsSection.appendChild(heading);

  const note = document.createElement('p');
  note.textContent = 'Destaques editoriais e fontes de consulta. Não equivale à íntegra do Martirológio Romano nem determina a celebração litúrgica no Brasil.';
  saintsSection.appendChild(note);

  const key = dayInfo.iso.slice(5);
  const highlights = saintsArchive.highlights[key] || [];
  if (highlights.length) {
    const list = document.createElement('ul');
    list.className = 'calendar-saints-list';
    highlights.forEach(name => {
      const item = document.createElement('li');
      item.textContent = name;
      list.appendChild(item);
    });
    saintsSection.appendChild(list);
  } else {
    const pending = document.createElement('p');
    pending.textContent = 'A seleção editorial desta data ainda não foi cadastrada. Consulte o repertório completo nos acervos externos.';
    saintsSection.appendChild(pending);
  }

  const month = dayInfo.iso.slice(5, 7);
  const day = dayInfo.iso.slice(8, 10);
  const catholicMonths = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const linkBox = document.createElement('div');
  linkBox.className = 'calendar-saints-links';
  [
    ['Consultar Santi e Beati', 'https://www.santiebeati.it/' + month + '/' + day + '/index.html'],
    ['Consultar Catholic.org', 'https://www.catholic.org/saints/f_day/' + catholicMonths[Number(month) - 1] + '.php']
  ].forEach(([label, href]) => {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label + ' ↗';
    linkBox.appendChild(link);
  });
  saintsSection.appendChild(linkBox);
  els.calendarDetail.appendChild(saintsSection);

  renderCalendar();
}

function renderCalendar() {
  const year = Number(els.calendarYear.value);
  const month = Number(els.calendarMonth.value);
  const cells = litCalendar.monthMatrix(year, month);
  const info = selectedCalendarDate ? litCalendar.infoForIso(selectedCalendarDate) : litCalendar.infoForDate(new Date(Date.UTC(year,month,1)));
  const litYear = window.LCE_DAILY.liturgicalYearFor(info);
  const yTitle = document.querySelector('#liturgicalYearTitle');
  const yPeriod = document.querySelector('#liturgicalYearPeriod');
  const ySelect = document.querySelector('#liturgicalYearSelect');
  if (yTitle) yTitle.textContent = 'Ano litúrgico ' + litYear.begins + '–' + litYear.ends + ' · Ciclo ' + litYear.cycle;
  if (yPeriod) yPeriod.textContent = 'Começa em ' + litYear.start.toLocaleDateString('pt-BR',{timeZone:'UTC'}) + ' (Advento) e encerra em ' + litYear.end.toLocaleDateString('pt-BR',{timeZone:'UTC'}) + '. Cristo Rei é o último domingo.';
  if (ySelect && [...ySelect.options].some(opt=>opt.value===String(litYear.begins))) ySelect.value=String(litYear.begins);

  els.calendarGrid.replaceChildren();

  cells.forEach(dayInfo => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'calendar-day';

    if (!dayInfo) {
      button.classList.add('is-outside');
      button.tabIndex = -1;
      els.calendarGrid.appendChild(button);
      return;
    }

    if (dayInfo.iso === localIsoToday()) { button.classList.add('is-today'); button.setAttribute('aria-current', 'date'); }
    const dayColor = window.LCE_DAILY.colorFor(dayInfo);
    button.classList.add('daily-theme-' + dayColor);
    if (dayInfo.weekday === 0) button.classList.add('is-sunday');
    if (contentForDate(dayInfo.iso).length) button.classList.add('has-content');
    if (selectedCalendarDate === dayInfo.iso) button.classList.add('is-selected');

    const shortLabel = dayInfo.celebration || (dayInfo.weekday === 0 ? dayInfo.season : '');
    button.innerHTML =
      '<span class="day-number">' + dayInfo.day + '</span>' +
      (shortLabel ? '<span class="day-label">' + shortLabel + '</span>' : '') +
      '<span class="day-season">Ano ' + dayInfo.cycle + '</span>' +
      '<span class="day-color-name">Cor: ' + ({verde:'verde',roxo:'roxa',branco:'branca',vermelho:'vermelha',rosa:'rosa (opcional)',nenhum:'sem Missa diurna'}[dayColor]) + '</span>';

    button.setAttribute('aria-label', formatDate(dayInfo.iso) + ', ' + (dayInfo.celebration || dayInfo.season) + ', Ano ' + dayInfo.cycle + ', cor ' + dayColor + (contentForDate(dayInfo.iso).length || window.LCE_DAILY.readings[dayInfo.iso] ? ', possui referências' : ', referências ainda não conferidas'));
    button.addEventListener('click', () => {
      selectCalendarDate(dayInfo);
      requestAnimationFrame(() => els.calendarDetail.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'nearest'
      }));
    });
    els.calendarGrid.appendChild(button);
  });

  if (!selectedCalendarDate) {
    const first = litCalendar.infoForDate(new Date(Date.UTC(year, month, 1)));
    els.calendarDetail.innerHTML =
      '<p class="eyebrow">Ano ' + first.cycle + '</p>' +
      '<h3>' + litCalendar.monthNames[month] + ' de ' + year + '</h3>' +
      '<p>Selecione um dia para consultar a celebração, os santos recordados e as leituras já cadastradas.</p>';
  }
}

function moveCalendarMonth(delta) {
  let year = Number(els.calendarYear.value);
  let month = Number(els.calendarMonth.value) + delta;

  if (month < 0) { month = 11; year -= 1; }
  if (month > 11) { month = 0; year += 1; }
  if (year < litCalendar.minYear || year > litCalendar.maxYear) return;

  els.calendarYear.value = String(year);
  els.calendarMonth.value = String(month);
  selectedCalendarDate = null;
  updateCalendarMonthUrl();
  renderCalendar();
}

/* Bíblia Ave-Maria */
let selectedBookId = null;

function bookById(id) {
  return bible.books.find(book => book.id === id);
}

function chapterUrl(bookId, chapter) {
  return bible.readBase + bookId + '.' + chapter + '.AVM';
}

function renderBibleBooks() {
  const q = normalize(els.bibleQuery.value);
  const testament = els.bibleTestament.value;
  const filtered = bible.books.filter(book => {
    return (!q || normalize(book.name).includes(q)) && (!testament || book.testament === testament);
  });

  els.bibleBooks.replaceChildren();

  filtered.forEach(book => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'book-button' + (selectedBookId === book.id ? ' is-active' : '');
    button.innerHTML = '<span>' + book.name + '</span><small>' + book.chapters + ' cap.</small>';
    button.addEventListener('click', () => {
      selectedBookId = book.id;
      renderBibleBooks();
      renderBibleChapters(book);
    });
    els.bibleBooks.appendChild(button);
  });

  if (!filtered.length) {
    els.bibleBooks.innerHTML = '<div class="empty-state">Nenhum livro encontrado.</div>';
  }
}

function theologyForChapter(bookId, chapter) {
  return theology.chapters?.[bookId + ':' + chapter] || null;
}

function renderTheologyCard(book, chapter, record) {
  els.bibleChapterPanel.classList.remove('empty-state');
  els.bibleChapterPanel.replaceChildren();

  const header = document.createElement('div');
  header.className = 'chapter-experience-header';
  header.innerHTML =
    '<div><p class="eyebrow">Nova experiência · prévia</p>' +
    '<h3>' + record.reference + '</h3>' +
    '<p class="chapter-experience-theme">' + record.mainTheme + '</p></div>' +
    '<span class="chapter-preview-badge">Mapa Bíblico Mestre</span>';

  const notice = document.createElement('div');
  notice.className = 'chapter-review-notice';
  notice.innerHTML =
    '<strong>Conteúdo em etapa de revisão eclesial</strong>' +
    '<p>Esta prévia apresenta dados do Mapa Bíblico Mestre ' + theology.methodologyVersion +
    '. A revisão metodológica está concluída, mas a revisão eclesial externa ainda não equivale a conteúdo oficialmente aprovado pela Igreja.</p>';

  const grid = document.createElement('div');
  grid.className = 'chapter-experience-grid';

  const cards = [
    ['Na História da Salvação', record.salvationHistory + ' · ' + record.narrativePeriod],
    ['Cristo neste capítulo', record.christRelation],
    ['Veja também na Escritura', record.biblicalConnections],
    ['Catecismo da Igreja Católica', record.cic.references + ' — ' + record.cic.scope],
    ['Aliança / marco', record.covenant],
    ['Rosário', record.rosary.mystery + '. ' + record.rosary.nature]
  ];

  cards.forEach(([title, body]) => {
    const card = document.createElement('article');
    card.className = 'chapter-experience-card';
    const h4 = document.createElement('h4');
    h4.textContent = title;
    const p = document.createElement('p');
    p.textContent = body;
    card.append(h4, p);
    grid.appendChild(card);
  });

  const meta = document.createElement('details');
  meta.className = 'chapter-methodology-details';
  const summary = document.createElement('summary');
  summary.textContent = 'Como esta relação foi classificada';
  const content = document.createElement('div');
  content.className = 'chapter-methodology-content';
  content.innerHTML =
    '<p><strong>ID:</strong> ' + record.cpId + '</p>' +
    '<p><strong>Classe:</strong> ' + record.connectionClass + '</p>' +
    '<p><strong>Fonte:</strong> ' + record.sourceType + '</p>' +
    '<p><strong>Escopo:</strong> ' + record.sourceScope + '</p>' +
    '<p><strong>Confiabilidade:</strong> ' + record.confidence + '</p>' +
    '<p><strong>Status da matriz:</strong> ' + record.matrixStatus + '</p>';
  meta.append(summary, content);

  const actions = document.createElement('div');
  actions.className = 'chapter-experience-actions';

  const read = document.createElement('a');
  read.className = 'primary-link';
  read.href = record.bibleUrl || chapterUrl(book.id, chapter);
  read.target = '_blank';
  read.rel = 'noopener';
  read.textContent = 'Ler ' + record.reference + ' na Bíblia Ave-Maria';

  const cic = document.createElement('a');
  cic.className = 'secondary-link';
  cic.href = record.cic.url;
  cic.target = '_blank';
  cic.rel = 'noopener';
  cic.textContent = 'Abrir Catecismo';

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'secondary-button';
  back.textContent = 'Voltar aos capítulos';
  back.addEventListener('click', () => renderBibleChapters(book));

  actions.append(read, cic, back);
  els.bibleChapterPanel.append(header, notice, grid, meta, actions);
}

function renderBibleChapters(book) {
  els.bibleChapterPanel.classList.remove('empty-state');
  els.bibleChapterPanel.innerHTML =
    '<p class="eyebrow">' + (book.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento') + '</p>' +
    '<h3>' + book.name + '</h3>' +
    '<p class="supporting-text compact">Escolha um capítulo. Quando já houver conteúdo integrado ao Mapa Bíblico Mestre, ele abre primeiro a nova experiência; nos demais casos, a leitura continua na Bíblia Ave-Maria.</p>';

  const grid = document.createElement('div');
  grid.className = 'chapter-grid';

  for (let chapter = 1; chapter <= book.chapters; chapter++) {
    const record = theologyForChapter(book.id, chapter);

    if (record) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chapter-link chapter-link-enriched';
      button.innerHTML = '<span>' + chapter + '</span><small>Novo</small>';
      button.setAttribute('aria-label', 'Abrir nova experiência de ' + book.name + ' capítulo ' + chapter);
      button.addEventListener('click', () => renderTheologyCard(book, chapter, record));
      grid.appendChild(button);
    } else {
      const link = document.createElement('a');
      link.className = 'chapter-link';
      link.href = chapterUrl(book.id, chapter);
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = String(chapter);
      link.setAttribute('aria-label', 'Abrir ' + book.name + ' capítulo ' + chapter + ' na Bíblia Ave-Maria');
      grid.appendChild(link);
    }
  }

  els.bibleChapterPanel.appendChild(grid);

  const audio = document.createElement('a');
  audio.className = 'secondary-link';
  audio.href = bible.audioUrl;
  audio.target = '_blank';
  audio.rel = 'noopener';
  audio.textContent = 'Ouvir versão em áudio';
  audio.style.marginTop = '16px';
  els.bibleChapterPanel.appendChild(audio);
}

/* Plano de leitura da Bíblia */
const PLAN_STORAGE_KEY = 'lce-bible365-plan-v1';
const START_STORAGE_KEY = 'lce-bible365-start-v1';
const JOURNEY_START_STORAGE_KEY = 'lce-bible365-journey-start-v1';
const LEGACY_PLAN_STORAGE_KEY = 'lce-jonas-plan-v1';
const LEGACY_START_STORAGE_KEY = 'lce-jonas-start-v1';
const PLAN_DAYS = 365;

function buildPlanSteps() {
  const steps = [];
  const seen = new Set();

  bible.planOrder.forEach(item => {
    const book = bookById(item.book);
    if (!book) return;
    const from = item.from || 1;
    const to = item.to || book.chapters;

    for (let chapter = from; chapter <= to; chapter++) {
      const coverageKey = book.id + ':' + chapter;
      if (seen.has(coverageKey)) continue;
      seen.add(coverageKey);
      steps.push({
        key: coverageKey,
        coverageKey,
        bookId: book.id,
        bookName: book.name,
        chapter,
        label: item.label || book.name
      });
    }
  });

  bible.books.forEach(book => {
    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      const coverageKey = book.id + ':' + chapter;
      if (seen.has(coverageKey)) continue;
      seen.add(coverageKey);
      steps.push({
        key: coverageKey,
        coverageKey,
        bookId: book.id,
        bookName: book.name,
        chapter,
        label: book.name
      });
    }
  });

  return steps;
}

const planSteps = buildPlanSteps();
const totalUniqueBibleChapters = bible.books.reduce((sum, book) => sum + book.chapters, 0);

function normalizeLegacyChapterKey(key) {
  const parts = String(key || '').split(':');
  if (parts.length >= 4) return parts[parts.length - 2] + ':' + parts[parts.length - 1];
  if (parts.length === 2) return parts[0] + ':' + parts[1];
  return '';
}



function loadPlanProgress() {
  try {
    const current = JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY) || 'null');
    if (Array.isArray(current)) return new Set(current);

    const legacy = JSON.parse(localStorage.getItem(LEGACY_PLAN_STORAGE_KEY) || '[]');
    const migrated = new Set(legacy.map(normalizeLegacyChapterKey).filter(Boolean));
    if (migrated.size) savePlanProgress(migrated);
    return migrated;
  } catch {
    return new Set();
  }
}

function savePlanProgress(progress) {
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify([...progress]));
}



function ensureJourneyStarted() {
  let start = localStorage.getItem(JOURNEY_START_STORAGE_KEY);
  if (!start) {
    start = localIsoToday();
    localStorage.setItem(JOURNEY_START_STORAGE_KEY, start);
  }
  return start;
}

function journeyStartDate() {
  return localStorage.getItem(JOURNEY_START_STORAGE_KEY) || '';
}

function dayDiff(fromIso, toIso) {
  const [fy,fm,fd] = fromIso.split('-').map(Number);
  const [ty,tm,td] = toIso.split('-').map(Number);
  const from = Date.UTC(fy, fm - 1, fd);
  const to = Date.UTC(ty, tm - 1, td);
  return Math.floor((to - from) / 86400000);
}

function completedPlanDays(schedule, progress) {
  let completed = 0;
  for (const day of schedule) {
    if (day.steps.every(step => progress.has(step.key))) completed++;
    else break;
  }
  return completed;
}

function setChapterCompletion(step, checked, progress) {
  if (checked) {
    progress.add(step.key);
    ensureJourneyStarted();
  } else {
    progress.delete(step.key);
  }
  savePlanProgress(progress);
}

function addLocalDays(isoDate, amount) {
  const [y,m,d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d + amount, 12, 0, 0);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}

function monthKey(isoDate) { return isoDate.slice(0, 7); }

function monthHeading(isoDate) {
  const [y,m] = isoDate.split('-').map(Number);
  const label = new Intl.DateTimeFormat('pt-BR', {month:'long', year:'numeric'}).format(new Date(y, m - 1, 1, 12));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function distributePlanChapters(steps, numberOfDays) {
  const base = Math.floor(steps.length / numberOfDays);
  const extra = steps.length % numberOfDays;
  let offset = 0;
  return Array.from({length: numberOfDays}, (_, index) => {
    const before = Math.floor(index * extra / numberOfDays);
    const after = Math.floor((index + 1) * extra / numberOfDays);
    const count = base + (after > before ? 1 : 0);
    const daySteps = steps.slice(offset, offset + count);
    offset += count;
    return daySteps;
  });
}

// A mesma sequência alimenta o plano online e a impressão.
// O NT ocupa 75 dias; no AT há um Salmo por dia nos primeiros 150 dias.
function buildDatedSchedule(startDate) {
  const NT_DAYS = 75;
  const atDays = PLAN_DAYS - NT_DAYS;
  const newTestament = planSteps.filter(step => bookById(step.bookId)?.testament === 'NT');
  const oldTestament = planSteps.filter(step => bookById(step.bookId)?.testament === 'AT' && step.bookId !== 'PSA');
  const psalms = planSteps.filter(step => step.bookId === 'PSA')
    .sort((left, right) => left.chapter - right.chapter);
  const ntChunks = distributePlanChapters(newTestament, NT_DAYS);
  const atChunks = distributePlanChapters(oldTestament, atDays);

  return Array.from({length: PLAN_DAYS}, (_, dayIndex) => {
    const isNT = dayIndex < NT_DAYS;
    const atIndex = dayIndex - NT_DAYS;
    const steps = isNT ? [...ntChunks[dayIndex]] : [...atChunks[atIndex]];
    // Salmo do dia é pré-definido: Salmo 1 no dia 1, até Salmo 150 no dia 150.
    if (dayIndex < psalms.length) steps.push(psalms[dayIndex]);
    return {date: addLocalDays(startDate, dayIndex), steps};
  });
}

function completedCoverage(progress) {
  const unique = new Set();
  planSteps.forEach(step => { if (progress.has(step.key)) unique.add(step.coverageKey); });
  return unique;
}

function updateProgressIndicators(progress) {
  const planDone = planSteps.filter(step => progress.has(step.key)).length;
  const coverageDone = completedCoverage(progress).size;
  const planPct = Math.round((planDone / planSteps.length) * 100);
  const biblePct = Math.round((coverageDone / totalUniqueBibleChapters) * 100);

  els.planPercent.textContent = planPct + '%';
  els.planProgressBar.style.width = planPct + '%';
  els.planProgressText.textContent = planDone + ' de ' + planSteps.length + ' capítulos do plano concluídos.';
  els.biblePercent.textContent = biblePct + '%';
  els.bibleProgressBar.style.width = biblePct + '%';
  els.bibleProgressText.textContent = coverageDone + ' de ' + totalUniqueBibleChapters + ' capítulos da Bíblia concluídos.';
}

function createReadingDetail(step, progress) {
  const article = document.createElement('article');
  article.className = 'reading-detail chapter-only-detail';
  article.dataset.stepKey = step.key;
  article.classList.toggle('is-done', progress.has(step.key));
  const label = document.createElement('label');
  label.className = 'chapter-only-check';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = progress.has(step.key);
  checkbox.setAttribute('aria-label', 'Concluir ' + step.bookName + ' capítulo ' + step.chapter);
  const name = document.createElement('strong');
  name.textContent = step.bookName + ' ' + step.chapter;
  label.append(checkbox, name);
  const link = document.createElement('a');
  link.href = chapterUrl(step.bookId, step.chapter);
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Ler capítulo';
  checkbox.addEventListener('change', () => {
    setChapterCompletion(step, checkbox.checked, progress);
    renderPlan();
  });
  article.append(label, link);
  return article;
}

function localIsoToday() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');
}

function renderPlan() {
  const progress = loadPlanProgress();
  const printStartDate = els.planStartDate.value || '2026-01-01';
  const schedule = buildDatedSchedule('2000-01-01');
  const completedDays = completedPlanDays(schedule, progress);
  const currentDayIndex = Math.min(completedDays, PLAN_DAYS - 1);
  const currentDay = schedule[currentDayIndex];
  const start = journeyStartDate();
  const today = localIsoToday();

  updateProgressIndicators(progress);
  els.todayReadings.replaceChildren();

  if (completedDays >= PLAN_DAYS) {
    els.todayReadingTitle.textContent = 'Plano concluído';
    els.todayReadingDate.textContent = 'Você completou os 365 dias de leitura.';
    els.todayReadings.innerHTML = '<div class="empty-state">Parabéns pela conclusão da caminhada bíblica.</div>';
  } else {
    els.todayReadingTitle.textContent = 'Dia ' + (currentDayIndex + 1) + ' de ' + PLAN_DAYS;
    els.todayReadingDate.textContent = start
      ? 'Continue de onde parou. Esta etapa avança quando todas as leituras do dia forem concluídas.'
      : 'Sua caminhada começa quando você registrar a primeira leitura.';
    currentDay.steps.forEach(step => els.todayReadings.appendChild(createReadingDetail(step, progress)));
  }

  if (!start) {
    els.journeyDay.textContent = 'Ainda não iniciada';
    els.journeyStart.textContent = 'A caminhada começa no primeiro dia em que você registrar uma leitura.';
    els.journeyPace.textContent = 'Sem atraso';
    els.journeyPaceDetail.textContent = 'O ritmo será calculado a partir do primeiro dia de leitura.';
  } else if (completedDays >= PLAN_DAYS) {
    els.journeyDay.textContent = '365 de 365 dias concluídos';
    els.journeyStart.textContent = 'Início da caminhada: ' + formatDate(start) + '.';
    els.journeyPace.textContent = 'Caminhada concluída';
    els.journeyPaceDetail.textContent = 'Você completou todas as etapas do plano.';
  } else {
    const elapsedCalendarDays = Math.max(1, dayDiff(start, today) + 1);
    const activePlanDay = currentDayIndex + 1;
    const delta = elapsedCalendarDays - activePlanDay;

    els.journeyDay.textContent = 'Dia ' + activePlanDay + ' de ' + PLAN_DAYS;
    els.journeyStart.textContent = 'Início da caminhada: ' + formatDate(start) + '.';

    if (delta > 0) {
      els.journeyPace.textContent = delta + (delta === 1 ? ' dia em atraso' : ' dias em atraso');
      els.journeyPaceDetail.textContent = 'Conclua etapas adicionais quando puder para retomar o ritmo de 365 dias.';
    } else if (delta < 0) {
      const ahead = Math.abs(delta);
      els.journeyPace.textContent = ahead + (ahead === 1 ? ' dia adiantado' : ' dias adiantados');
      els.journeyPaceDetail.textContent = 'Você está avançando acima do ritmo mínimo do plano.';
    } else {
      els.journeyPace.textContent = 'Em dia';
      els.journeyPaceDetail.textContent = 'Seu progresso está alinhado ao ritmo de 365 dias.';
    }
  }

  renderFullSchedule(progress, printStartDate);

}


function renderFullSchedule(progress, startDate) {
  const schedule = buildDatedSchedule(startDate);
  const groups = new Map();
  const endDate = schedule.length ? schedule[schedule.length - 1].date : startDate;
  const daysWithPsalm = schedule.filter(day => day.steps.some(step => step.bookId === 'PSA')).length;
  const minDaily = Math.min(...schedule.map(day => day.steps.length));
  const maxDaily = Math.max(...schedule.map(day => day.steps.length));

  els.printPlanMeta.innerHTML =
    '<strong>Plano de leitura — Bíblia completa em 365 dias</strong>' +
    '<span>Início: ' + formatDate(startDate) + '</span>' +
    '<span>Previsão final: ' + formatDate(endDate) + '</span>' +
    '<span>Cobertura: ' + planSteps.length + ' de ' + totalUniqueBibleChapters + ' capítulos</span>' +
    '<span>Ritmo: ' + minDaily + '–' + maxDaily + ' capítulos/dia · Salmos: dias 1–150 (' + daysWithPsalm + ' dias)</span>' +
    '<span>Organização: Caminhos da Palavra · referência metodológica: Pe. Jonas Abib e Revista Ave Maria (setembro/2026, p. 6). Sequência diária própria; sem releituras; um Salmo por dia nos primeiros 150 dias, em paralelo à sequência bíblica.</span>';

  schedule.forEach(day => {
    const key = monthKey(day.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(day);
  });

  els.fullPlanSchedule.replaceChildren();

  let overallDay = 0;
  groups.forEach(days => {
    const monthSection = document.createElement('section');
    monthSection.className = 'plan-month';
    const heading = document.createElement('h4');
    heading.className = 'plan-month-title';
    heading.textContent = monthHeading(days[0].date);
    monthSection.appendChild(heading);

    // Quando terminam os Salmos, a coluna deixa de existir completamente.
    // Um mês que inclua o dia 150 é dividido em dois segmentos na própria ordem.
    const segments = [];
    days.forEach(day => {
      overallDay++;
      const hasPsalm = day.steps.some(step => step.bookId === 'PSA');
      const last = segments[segments.length - 1];
      if (!last || last.hasPsalm !== hasPsalm) {
        segments.push({hasPsalm, days: []});
      }
      segments[segments.length - 1].days.push({day, number: overallDay});
    });

    function addChapter(container, step) {
      const label = document.createElement('span');
      label.className = 'print-chapter-check';
      const tick = document.createElement('span');
      tick.className = 'print-check-box';
      tick.setAttribute('aria-hidden', 'true');
      const name = document.createElement('span');
      name.className = 'print-chapter-name';
      name.textContent = step.bookName + ' ' + step.chapter;
      label.append(tick, name);
      container.appendChild(label);
    }

    segments.forEach(segment => {
      const table = document.createElement('table');
      table.className = 'plan-print-table' + (segment.hasPsalm ? ' has-psalm' : ' without-psalm');
      const thead = document.createElement('thead');
      thead.innerHTML = segment.hasPsalm
        ? '<tr><th scope="col">Dia</th><th scope="col">Data</th><th scope="col">Capítulos da leitura</th><th scope="col">Salmo diário</th></tr>'
        : '<tr><th scope="col">Dia</th><th scope="col">Data</th><th scope="col">Capítulos da leitura</th></tr>';
      const tbody = document.createElement('tbody');

      segment.days.forEach(({day, number: dayNumber}) => {
        const dateParts = day.date.split('-');
        const row = document.createElement('tr');
        const number = document.createElement('td');
        number.className = 'plan-print-number';
        number.textContent = String(dayNumber).padStart(3, '0');
        const date = document.createElement('td');
        date.className = 'plan-print-date';
        date.textContent = dateParts[2] + '/' + dateParts[1];
        const main = document.createElement('td');
        main.className = 'plan-print-readings';
        day.steps.filter(step => step.bookId !== 'PSA').forEach(step => addChapter(main, step));
        row.append(number, date, main);

        if (segment.hasPsalm) {
          const psalm = document.createElement('td');
          psalm.className = 'plan-print-psalm';
          day.steps.filter(step => step.bookId === 'PSA').forEach(step => addChapter(psalm, step));
          row.appendChild(psalm);
        }
        tbody.appendChild(row);
      });
      table.append(thead, tbody);
      monthSection.appendChild(table);
    });
    els.fullPlanSchedule.appendChild(monthSection);
  });
}

/* Eventos */
[els.query, els.date, els.year, els.item].forEach(el => el.addEventListener('input', renderLiturgia));

els.clear.addEventListener('click', () => {
  els.query.value = '';
  els.date.value = '';
  els.year.value = '';
  els.item.value = '';
  showFullLiturgyArchive = false;
  renderLiturgia();
  els.query.focus();
});

window.addEventListener('popstate', () => setSection(sectionFromUrl(), {fromHistory:true}));
window.addEventListener('hashchange', () => setSection(sectionFromUrl(), {fromHistory:true}));

els.editionChoices.forEach(choice=>choice.addEventListener('change',()=>{
  const id=[...els.liturgyResults.querySelectorAll('.accordion-item')]
    .find(card=>card.querySelector('.accordion-trigger')?.getAttribute('aria-expanded')==='true')?.dataset.entryId;
  renderLiturgia();
  if(id){
    const same=[...els.liturgyResults.querySelectorAll('.accordion-item')]
      .find(card=>card.dataset.entryId===id);
    same?.querySelector('.accordion-trigger')?.click();
  }
}));
els.navButtons.forEach(btn => btn.addEventListener('click', () => setSection(btn.dataset.section)));
document.querySelectorAll('[data-go]').forEach(btn => btn.addEventListener('click', () => setSection(btn.dataset.go)));

els.calendarYear.addEventListener('change', () => {
  selectedCalendarDate = null;
  updateCalendarMonthUrl();
  renderCalendar();
});
els.calendarMonth.addEventListener('change', () => {
  selectedCalendarDate = null;
  updateCalendarMonthUrl();
  renderCalendar();
});
els.calendarPrev.addEventListener('click', () => moveCalendarMonth(-1));
els.calendarNext.addEventListener('click', () => moveCalendarMonth(1));
const litYearSelect=document.querySelector('#liturgicalYearSelect');
if (litYearSelect) litYearSelect.addEventListener('change',()=>{
  const start=litCalendar.adventStart(Number(litYearSelect.value));
  els.calendarYear.value=String(start.getUTCFullYear());
  els.calendarMonth.value=String(start.getUTCMonth());
  selectCalendarDate(litCalendar.infoForDate(start));
});

[els.bibleQuery, els.bibleTestament].forEach(el => el.addEventListener('input', renderBibleBooks));

const storedStart = localStorage.getItem(START_STORAGE_KEY) || localStorage.getItem(LEGACY_START_STORAGE_KEY);
if (storedStart) {
  els.planStartDate.value = storedStart;
  localStorage.setItem(START_STORAGE_KEY, storedStart);
}

els.planStartDate.addEventListener('change', () => {
  if (els.planStartDate.value) localStorage.setItem(START_STORAGE_KEY, els.planStartDate.value);
  renderPlan();
});

function printReadingPlan() {
  // Cria um documento autônomo para imprimir somente o cronograma,
  // sem recursos flutuantes de acessibilidade ou navegação da página.
  const heading = document.querySelector('.full-plan-section .compact-heading');
  const meta = els.printPlanMeta;
  const schedule = els.fullPlanSchedule;
  if (!schedule || !schedule.querySelector('.plan-print-table')) {
    window.alert('O cronograma ainda não foi preparado. Aguarde e tente novamente.');
    return;
  }

  const popup = window.open('', '_blank');
  if (!popup) {
    window.alert('Permita a abertura de janelas para gerar o PDF do plano.');
    return;
  }
  const documentTitle = 'Caminhos da Palavra — Plano de Leitura em 365 dias';
  const escapeTitle = value => String(value).replace(/[&<>"]/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'
  })[ch]);

  const css = `
    @page { size: A4 portrait; margin: 12mm 12mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; color: #29251c; background: white; font: 9pt/1.35 Arial, sans-serif; }
    .print-brand { font-size: 8pt; letter-spacing: .08em; text-transform: uppercase; color: #84601c; font-weight: 700; margin: 0 0 3mm; }
    .compact-heading { margin: 0 0 4mm; padding-bottom: 2mm; border-bottom: 1px solid #baaa8b; }
    .compact-heading .eyebrow { display: none; }
    .compact-heading h3 { font: bold 16pt/1.15 Georgia, serif; margin: 0 0 1mm; }
    .compact-heading p { margin: 0; color: #605b52; font-size: 8.5pt; }
    .print-plan-meta { border: 1px solid #c8bdab; border-left: 3px solid #9d721d; padding: 3mm; margin: 0 0 5mm; display: grid; grid-template-columns: 1fr 1fr; gap: 1mm 4mm; font-size: 8pt; break-inside: avoid; }
    .print-plan-meta strong { grid-column: 1/-1; font-size: 11pt; }
    .print-plan-meta span:last-child { grid-column: 1/-1; border-top: 1px solid #ded6c7; padding-top: 1mm; color: #5e584e; font-size: 7pt; }
    .plan-month { margin: 0 0 5mm; break-inside: auto; }
    .plan-month-title { margin: 0; padding: 2mm 3mm; border-left: 3px solid #9d721d; background: #ede7dc; font: bold 10pt Arial, sans-serif; break-after: avoid; }
    .plan-print-table { display: table; width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 8.3pt; }
    .plan-print-table thead { display: table-header-group; }
    .plan-print-table tr { break-inside: avoid; page-break-inside: avoid; }
    .plan-print-table th { background: #faf8f4; color: #51483a; border-bottom: 1px solid #aa9d88; padding: 2mm 2mm; font: bold 7.5pt Arial, sans-serif; text-align: left; }
    .plan-print-table td { padding: 2.4mm 2mm; border-bottom: 1px solid #ded7cd; vertical-align: top; }
    .plan-print-table tr:nth-child(even) td { background: #faf9f6; }
    .plan-print-table th:nth-child(1),.plan-print-table td:nth-child(1) { width: 11mm; }
    .plan-print-table th:nth-child(2),.plan-print-table td:nth-child(2) { width: 18mm; }
    .plan-print-table.has-psalm th:nth-child(4),.plan-print-table.has-psalm td:nth-child(4) { width: 33mm; border-left: 1px solid #ded7cd; }
    .plan-print-table.without-psalm th:nth-child(3),.plan-print-table.without-psalm td:nth-child(3) { width: auto; }
    .plan-print-number { color: #8a6117; font-weight: 700; }
    .plan-print-readings, .plan-print-psalm { line-height: 1.5; }
    .print-chapter-check { display: inline-flex; align-items: center; vertical-align: top; gap: 1.2mm; margin: 0 3mm 1.4mm 0; white-space: nowrap; max-width: 100%; }
    .print-chapter-name { line-height: 1.35; }
    .print-check-box { display: inline-block; width: 3mm; height: 3mm; flex: 0 0 3mm; border: 1px solid #514b43; }
    .print-footer { color: #6a6256; font-size: 8pt; margin: 6mm 0 0; border-top: 1px solid #ded7cd; padding-top: 2mm; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;

  let printStarted = false;
  const openPrintPreview = () => {
    if (printStarted) return;
    printStarted = true;
    popup.focus();
    popup.print();
  };
  popup.addEventListener('load', openPrintPreview, { once: true });
  popup.document.open();
  popup.document.write(
    '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>' +
    escapeTitle(documentTitle) + '</title><style>' + css +
    '</style></head><body><main><p class="print-brand">Caminhos da Palavra · por Libras com Eduarda</p>' +
    (heading?.outerHTML || '') + meta.outerHTML + schedule.outerHTML +
    '<footer class="print-footer">Caminhos da Palavra · Plano pessoal de leitura bíblica</footer>' +
    '</main></body></html>'
  );
  popup.document.close();
  // Evita disparar a impressão duas vezes quando o carregamento já terminou.
  if (popup.document.readyState === 'complete') openPrintPreview();
}

els.printPlan.addEventListener('click', printReadingPlan);

if (els.storageInfoButton && els.storageInfoDialog) {
  els.storageInfoButton.addEventListener('click', () => {
    if (typeof els.storageInfoDialog.showModal === 'function') els.storageInfoDialog.showModal();
    else els.storageInfoDialog.setAttribute('open', '');
  });
}

if (els.storageInfoClose && els.storageInfoDialog) {
  els.storageInfoClose.addEventListener('click', () => els.storageInfoDialog.close());
}

if (els.storageInfoDialog) {
  els.storageInfoDialog.addEventListener('click', event => {
    const rect = els.storageInfoDialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) els.storageInfoDialog.close();
  });
}

els.resetPlan.addEventListener('click', () => {
  if (window.confirm('Reiniciar todo o progresso deste plano neste dispositivo?')) {
    localStorage.removeItem(PLAN_STORAGE_KEY);
    localStorage.removeItem(JOURNEY_START_STORAGE_KEY);
    localStorage.removeItem(LEGACY_PLAN_STORAGE_KEY);
    renderPlan();
  }
});

initCalendarControls();
if (new Date().getFullYear() >= litCalendar.minYear && new Date().getFullYear() <= litCalendar.maxYear) {
  selectCalendarDate(litCalendar.infoForIso(localIsoToday()), {suppressUrl:true});
}
const todayButton = document.querySelector('#calendarToday');
if (todayButton) todayButton.addEventListener('click', () => {
  const now = new Date();
  const year = Math.max(litCalendar.minYear, Math.min(litCalendar.maxYear, now.getFullYear()));
  els.calendarYear.value = String(year);
  els.calendarMonth.value = String(year === now.getFullYear() ? now.getMonth() : 0);
  selectCalendarDate(litCalendar.infoForIso(localIsoToday()));
});
// Abre o destino correto inclusive ao carregar ou atualizar um link compartilhado.
setSection(sectionFromUrl(), {fromHistory:true});

