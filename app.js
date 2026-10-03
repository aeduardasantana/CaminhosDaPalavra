const data = window.LCE_DATA;
const bible = window.LCE_BIBLE;
const litCalendar = window.LCE_CALENDAR;
const lectionary = window.LCE_LECTIONARY || {records: []};
const glossa = window.LCE_GLOSSA || {};
const liturgyOriginals = window.LCE_LITURGY_ORIGINALS || {};

const els = {
  query: document.querySelector('#query'),
  date: document.querySelector('#dateFilter'),
  year: document.querySelector('#yearFilter'),
  item: document.querySelector('#itemFilter'),
  clear: document.querySelector('#clearFilters'),
  liturgyResults: document.querySelector('#liturgyResults'),
  resultCount: document.querySelector('#resultCount'),
  template: document.querySelector('#liturgyCardTemplate'),
  navButtons: [...document.querySelectorAll('.nav-button')],
  sections: {
    projeto: document.querySelector('#projetoSection'),
    liturgia: document.querySelector('#liturgiaSection'),
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

  dailyTarget: document.querySelector('#dailyTarget'),
  planStartDate: document.querySelector('#planStartDate'),
  printPlan: document.querySelector('#printPlan'),
  resetPlan: document.querySelector('#resetPlan'),
  planPercent: document.querySelector('#planPercent'),
  planProgressBar: document.querySelector('#planProgressBar'),
  planProgressText: document.querySelector('#planProgressText'),
  biblePercent: document.querySelector('#biblePercent'),
  bibleProgressBar: document.querySelector('#bibleProgressBar'),
  bibleProgressText: document.querySelector('#bibleProgressText'),
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

    return {
      id: [record.cycle, record.section, record.celebration, item.type, item.reference].map(slug).join('--'),
      data: detailedPilot?.data || '',
      ano: record.cycle,
      tempo: lectionarySectionLabel(record.section),
      section: record.section,
      celebracao: fullCelebrationName(record),
      item: item.type,
      itemLabel: item.label,
      referencia: item.reference,
      status: detailedPilot ? detailedPilot.status : (glossa[item.reference] ? 'Glosa-base preliminar' : 'Glosa em produção'),
      sourceVersion: originalRecord?.sourceVersion || detailedPilot?.sourceVersion || 'Texto litúrgico — Lecionário: texto original ainda não incorporado',
      sourceUrl: originalRecord?.sourceUrl || detailedPilot?.sourceUrl || '',
      original: originalRecord?.text || detailedPilot?.original || (item.reference + ' — texto original ainda não incorporado.'),
      glosa: detailedPilot?.glosa || glossa[item.reference] || fallbackGlosa(item.reference),
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

function entriesForDate(isoDate) {
  const records = recordForDate(isoDate);
  return records.flatMap(record => recordItems(record).map(item => {
    const base = allLiturgyEntries.find(entry =>
      entry.ano === record.cycle &&
      entry.section === record.section &&
      entry.celebracao === fullCelebrationName(record) &&
      entry.item === item.type &&
      entry.referencia === item.reference
    );
    return Object.assign({}, base || {}, {data: isoDate});
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

function renderLiturgia() {
  const q = normalize(els.query.value);
  const date = els.date.value;
  const year = els.year.value;
  const item = els.item.value;

  const sourceEntries = date ? entriesForDate(date) : allLiturgyEntries;
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
  els.resultCount.textContent = filtered.length + ' ' + (filtered.length === 1 ? 'resultado' : 'resultados');

  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = date
      ? 'Ainda não há conteúdo cadastrado para esta data.'
      : 'Nenhum conteúdo encontrado com esses filtros.';
    els.liturgyResults.appendChild(empty);
    return;
  }

  filtered.forEach(entry => {
    const node = els.template.content.cloneNode(true);
    const trigger = node.querySelector('.accordion-trigger');

    node.querySelector('.card-kicker').textContent = 'Ano ' + entry.ano + ' · ' + entry.itemLabel;
    node.querySelector('.card-title').textContent = entry.celebracao + ' — ' + entry.referencia;
    node.querySelector('.card-meta').textContent = [formatDate(entry.data), entry.tempo, entry.note].filter(Boolean).join(' · ');
    node.querySelector('.status-pill').textContent = entry.status;
    node.querySelector('.source-version').textContent = entry.sourceVersion || '';
    node.querySelector('.original-text').textContent = entry.original;
    const originalSourceLink = node.querySelector('.original-source-link');
    if (entry.sourceUrl) {
      originalSourceLink.href = entry.sourceUrl;
      originalSourceLink.hidden = false;
    } else {
      originalSourceLink.hidden = true;
    }
    node.querySelector('.glosa-text').appendChild(formatGlosa(entry.glosa));

    els.liturgyResults.appendChild(node);
    bindAccordion(els.liturgyResults.lastElementChild.querySelector('.accordion-trigger'));
  });
}

function setSection(section) {
  Object.entries(els.sections).forEach(([key, el]) => { el.hidden = key !== section; });
  els.navButtons.forEach(btn => btn.classList.toggle('is-active', btn.dataset.section === section));
  if (section === 'liturgia') renderLiturgia();
  if (section === 'calendario') renderCalendar();
  if (section === 'biblia') renderBibleBooks();
  if (section === 'plano') renderPlan();
  window.scrollTo({top: 0, behavior: 'smooth'});
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

function contentForDate(isoDate) {
  return entriesForDate(isoDate);
}

function selectCalendarDate(dayInfo) {
  selectedCalendarDate = dayInfo.iso;
  const contents = contentForDate(dayInfo.iso);
  const title = dayInfo.celebration || dayInfo.season;

  els.calendarDetail.innerHTML =
    '<p class="eyebrow">Ano ' + dayInfo.cycle + ' · ' + dayInfo.season + '</p>' +
    '<h3>' + formatDate(dayInfo.iso) + '</h3>' +
    '<p><strong>' + title + '</strong></p>' +
    '<p>' + (contents.length
      ? contents.length + ' item(ns) de liturgia já cadastrado(s) para esta data.'
      : 'Calendário disponível; o conteúdo detalhado desta data ainda será alimentado.') + '</p>';

  if (contents.length) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary-button calendar-action';
    button.textContent = 'Abrir liturgia desta data';
    button.addEventListener('click', () => {
      els.date.value = dayInfo.iso;
      els.query.value = '';
      els.year.value = '';
      els.item.value = '';
      renderLiturgia();
      setSection('liturgia');
    });
    els.calendarDetail.appendChild(button);
  }

  renderCalendar();
}

function renderCalendar() {
  const year = Number(els.calendarYear.value);
  const month = Number(els.calendarMonth.value);
  const cells = litCalendar.monthMatrix(year, month);

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

    if (dayInfo.weekday === 0) button.classList.add('is-sunday');
    if (contentForDate(dayInfo.iso).length) button.classList.add('has-content');
    if (selectedCalendarDate === dayInfo.iso) button.classList.add('is-selected');

    const shortLabel = dayInfo.celebration || (dayInfo.weekday === 0 ? dayInfo.season : '');
    button.innerHTML =
      '<span class="day-number">' + dayInfo.day + '</span>' +
      (shortLabel ? '<span class="day-label">' + shortLabel + '</span>' : '') +
      '<span class="day-season">Ano ' + dayInfo.cycle + '</span>';

    button.setAttribute('aria-label', formatDate(dayInfo.iso) + ', ' + (dayInfo.celebration || dayInfo.season) + ', Ano ' + dayInfo.cycle);
    button.addEventListener('click', () => selectCalendarDate(dayInfo));
    els.calendarGrid.appendChild(button);
  });

  if (!selectedCalendarDate) {
    const first = litCalendar.infoForDate(new Date(Date.UTC(year, month, 1)));
    els.calendarDetail.innerHTML =
      '<p class="eyebrow">Ano ' + first.cycle + '</p>' +
      '<h3>' + litCalendar.monthNames[month] + ' de ' + year + '</h3>' +
      '<p>Selecione um dia para ver o tempo litúrgico, ciclo e conteúdos já cadastrados.</p>';
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

function renderBibleChapters(book) {
  els.bibleChapterPanel.classList.remove('empty-state');
  els.bibleChapterPanel.innerHTML =
    '<p class="eyebrow">' + (book.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento') + '</p>' +
    '<h3>' + book.name + '</h3>' +
    '<p class="supporting-text compact">Escolha um capítulo. A leitura abre na Bíblia Ave-Maria licenciada pela Editora Ave-Maria na YouVersion.</p>';

  const grid = document.createElement('div');
  grid.className = 'chapter-grid';

  for (let chapter = 1; chapter <= book.chapters; chapter++) {
    const link = document.createElement('a');
    link.className = 'chapter-link';
    link.href = chapterUrl(book.id, chapter);
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = String(chapter);
    link.setAttribute('aria-label', 'Abrir ' + book.name + ' capítulo ' + chapter + ' na Bíblia Ave-Maria');
    grid.appendChild(link);
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
const PLAN_STORAGE_KEY = 'lce-jonas-plan-v1';
const TARGET_STORAGE_KEY = 'lce-jonas-target-v1';
const START_STORAGE_KEY = 'lce-jonas-start-v1';
const VERSE_PROGRESS_STORAGE_KEY = 'lce-jonas-verse-progress-v1';
const VERSE_COUNTS_STORAGE_KEY = 'lce-avm-verse-counts-v1';
const LEGACY_VERSE_NOTES_STORAGE_KEY = 'lce-jonas-verse-notes-v1';
const AVM_STRUCTURE_URL = 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/pt_avm.json';

let avmVerseCounts = loadCachedVerseCounts();
let avmVerseCountsPromise = null;

function buildPlanSteps() {
  const steps = [];
  bible.planOrder.forEach((item, orderIndex) => {
    const book = bookById(item.book);
    if (!book) return;
    const from = item.from || 1;
    const to = item.to || book.chapters;
    const repeat = item.repeat || 1;
    for (let repetition = 1; repetition <= repeat; repetition++) {
      for (let chapter = from; chapter <= to; chapter++) {
        steps.push({
          key: orderIndex + ':' + repetition + ':' + book.id + ':' + chapter,
          coverageKey: book.id + ':' + chapter,
          bookId: book.id,
          bookName: book.name,
          chapter,
          label: item.label || book.name,
          repetition,
          repeat
        });
      }
    }
  });
  return steps;
}

const planSteps = buildPlanSteps();
const totalUniqueBibleChapters = bible.books.reduce((sum, book) => sum + book.chapters, 0);

function loadPlanProgress() {
  try { return new Set(JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY) || '[]')); }
  catch { return new Set(); }
}

function savePlanProgress(progress) {
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify([...progress]));
}

function loadVerseProgress() {
  try { return new Set(JSON.parse(localStorage.getItem(VERSE_PROGRESS_STORAGE_KEY) || '[]')); }
  catch { return new Set(); }
}

function saveVerseProgress(progress) {
  localStorage.setItem(VERSE_PROGRESS_STORAGE_KEY, JSON.stringify([...progress]));
}

function loadCachedVerseCounts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(VERSE_COUNTS_STORAGE_KEY) || 'null');
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length >= 70) return parsed;
  } catch {}
  return null;
}

function normalizedBookName(value) {
  return normalize(value)
    .replace(/^primeira\s+/, 'i ')
    .replace(/^segunda\s+/, 'ii ')
    .replace(/^terceira\s+/, 'iii ')
    .replace(/^1\s+/, 'i ')
    .replace(/^2\s+/, 'ii ')
    .replace(/^3\s+/, 'iii ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function ensureVerseCounts() {
  if (avmVerseCounts) return avmVerseCounts;
  if (avmVerseCountsPromise) return avmVerseCountsPromise;

  avmVerseCountsPromise = (async () => {
    const response = await fetch(AVM_STRUCTURE_URL, {cache: 'force-cache'});
    if (!response.ok) throw new Error('Não foi possível carregar a estrutura de versículos da Bíblia Ave-Maria.');

    const sourceBooks = await response.json();
    if (!Array.isArray(sourceBooks)) throw new Error('Estrutura bíblica inválida.');

    const targetByName = new Map(bible.books.map(book => [normalizedBookName(book.name), book]));
    const counts = {};

    sourceBooks.forEach((sourceBook, index) => {
      if (!sourceBook || !Array.isArray(sourceBook.chapters)) return;

      let target = targetByName.get(normalizedBookName(sourceBook.name || ''));
      if (!target) {
        const indexed = bible.books[index];
        if (indexed && indexed.chapters === sourceBook.chapters.length) target = indexed;
      }

      if (!target || target.chapters !== sourceBook.chapters.length) return;
      counts[target.id] = sourceBook.chapters.map(chapter => Array.isArray(chapter) ? chapter.length : 0);
    });

    if (Object.keys(counts).length < 70) {
      throw new Error('A estrutura de versículos não corresponde ao cânon católico configurado.');
    }

    localStorage.setItem(VERSE_COUNTS_STORAGE_KEY, JSON.stringify(counts));
    avmVerseCounts = counts;
    return counts;
  })();

  try { return await avmVerseCountsPromise; }
  finally { avmVerseCountsPromise = null; }
}

function verseCountForStep(step) {
  const counts = avmVerseCounts?.[step.bookId] || [];
  return Number(counts[step.chapter - 1] || 0);
}

function verseProgressKey(step, verse) {
  return step.key + ':v' + verse;
}

function stepHasVerseData(step, verseProgress) {
  const prefix = step.key + ':v';
  for (const key of verseProgress) if (key.startsWith(prefix)) return true;
  return false;
}

function seedLegacyCompletedStep(step, progress, verseProgress) {
  if (!progress.has(step.key) || stepHasVerseData(step, verseProgress)) return false;
  const total = verseCountForStep(step);
  if (!total) return false;
  for (let verse = 1; verse <= total; verse++) verseProgress.add(verseProgressKey(step, verse));
  return true;
}

function verseStats(step, progress, verseProgress) {
  const total = verseCountForStep(step);
  if (!total) return {done: 0, total: 0, complete: progress.has(step.key)};

  let done = 0;
  for (let verse = 1; verse <= total; verse++) {
    if (verseProgress.has(verseProgressKey(step, verse))) done++;
  }
  if (progress.has(step.key) && done === 0 && !stepHasVerseData(step, verseProgress)) done = total;
  return {done, total, complete: done === total};
}

function setChapterCompletion(step, checked, progress, verseProgress) {
  const total = verseCountForStep(step);
  if (checked) {
    progress.add(step.key);
    for (let verse = 1; verse <= total; verse++) verseProgress.add(verseProgressKey(step, verse));
  } else {
    progress.delete(step.key);
    for (let verse = 1; verse <= total; verse++) verseProgress.delete(verseProgressKey(step, verse));
  }
  savePlanProgress(progress);
  saveVerseProgress(verseProgress);
}

function syncStepCompletion(step, progress, verseProgress) {
  const total = verseCountForStep(step);
  if (!total) return;
  let done = 0;
  for (let verse = 1; verse <= total; verse++) {
    if (verseProgress.has(verseProgressKey(step, verse))) done++;
  }
  if (done === total) progress.add(step.key);
  else progress.delete(step.key);
  savePlanProgress(progress);
  saveVerseProgress(verseProgress);
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

function buildDatedSchedule(startDate, target) {
  const schedule = [];
  for (let i = 0, dayIndex = 0; i < planSteps.length; i += target, dayIndex++) {
    schedule.push({date: addLocalDays(startDate, dayIndex), steps: planSteps.slice(i, i + target)});
  }
  return schedule;
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
  els.planProgressText.textContent = planDone + ' de ' + planSteps.length + ' etapas do método concluídas.';
  els.biblePercent.textContent = biblePct + '%';
  els.bibleProgressBar.style.width = biblePct + '%';
  els.bibleProgressText.textContent = coverageDone + ' de ' + totalUniqueBibleChapters + ' capítulos distintos percorridos.';
}

function updateStepPresentations(step, progress, verseProgress) {
  const stats = verseStats(step, progress, verseProgress);
  document.querySelectorAll('[data-step-key="' + step.key + '"]').forEach(root => {
    root.classList.toggle('is-done', stats.complete);
    root.querySelectorAll('.verse-count-status').forEach(el => {
      el.textContent = stats.total ? stats.done + ' de ' + stats.total + ' versículos' : 'estrutura indisponível';
    });
    root.querySelectorAll('[data-chapter-toggle]').forEach(input => { input.checked = stats.complete; });
  });
  updateProgressIndicators(progress);
}

function createVerseGrid(step, progress, verseProgress) {
  const total = verseCountForStep(step);
  const grid = document.createElement('div');
  grid.className = 'verse-grid';
  grid.dataset.verseStep = step.key;

  if (!total) {
    grid.innerHTML = '<p class="verse-load-error">Não foi possível identificar os versículos deste capítulo.</p>';
    return grid;
  }

  if (seedLegacyCompletedStep(step, progress, verseProgress)) saveVerseProgress(verseProgress);

  for (let verse = 1; verse <= total; verse++) {
    const label = document.createElement('label');
    label.className = 'verse-check';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.verse = String(verse);
    checkbox.checked = verseProgress.has(verseProgressKey(step, verse));
    checkbox.setAttribute('aria-label', step.bookName + ' ' + step.chapter + ', versículo ' + verse);

    const number = document.createElement('span');
    number.textContent = String(verse);
    if (checkbox.checked) label.classList.add('is-done');

    checkbox.addEventListener('change', () => {
      if (seedLegacyCompletedStep(step, progress, verseProgress)) saveVerseProgress(verseProgress);
      const key = verseProgressKey(step, verse);
      if (checkbox.checked) verseProgress.add(key);
      else verseProgress.delete(key);
      label.classList.toggle('is-done', checkbox.checked);
      syncStepCompletion(step, progress, verseProgress);
      updateStepPresentations(step, progress, verseProgress);
    });

    label.append(checkbox, number);
    grid.appendChild(label);
  }
  return grid;
}

function createChapterToggle(step, progress, verseProgress) {
  const label = document.createElement('label');
  label.className = 'chapter-toggle';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.dataset.chapterToggle = 'true';
  checkbox.checked = verseStats(step, progress, verseProgress).complete;

  const text = document.createElement('span');
  text.textContent = 'Marcar capítulo inteiro';

  checkbox.addEventListener('change', () => {
    setChapterCompletion(step, checkbox.checked, progress, verseProgress);
    document.querySelectorAll('[data-verse-step="' + step.key + '"] .verse-check').forEach(verseLabel => {
      const input = verseLabel.querySelector('input');
      const verse = Number(input.dataset.verse);
      input.checked = checkbox.checked;
      verseLabel.classList.toggle('is-done', checkbox.checked);
      if (checkbox.checked) verseProgress.add(verseProgressKey(step, verse));
      else verseProgress.delete(verseProgressKey(step, verse));
    });
    saveVerseProgress(verseProgress);
    updateStepPresentations(step, progress, verseProgress);
  });

  label.append(checkbox, text);
  return label;
}

function createReadingDetail(step, progress, verseProgress) {
  const article = document.createElement('article');
  article.className = 'reading-detail';
  article.dataset.stepKey = step.key;

  const head = document.createElement('div');
  head.className = 'reading-detail-head';
  const title = document.createElement('strong');
  title.textContent = step.bookName + ' ' + step.chapter;

  const status = document.createElement('span');
  status.className = 'verse-count-status';
  const stats = verseStats(step, progress, verseProgress);
  status.textContent = stats.done + ' de ' + stats.total + ' versículos';

  const link = document.createElement('a');
  link.href = chapterUrl(step.bookId, step.chapter);
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'abrir Ave-Maria';

  head.append(title, status, link);
  article.append(head, createChapterToggle(step, progress, verseProgress), createVerseGrid(step, progress, verseProgress));
  article.classList.toggle('is-done', stats.complete);
  return article;
}

function createVerseDetails(step, progress, verseProgress) {
  const details = document.createElement('details');
  details.className = 'verse-details';
  details.dataset.stepKey = step.key;

  const summary = document.createElement('summary');
  const name = document.createElement('strong');
  name.textContent = step.bookName + ' ' + step.chapter;
  const status = document.createElement('span');
  status.className = 'verse-count-status';
  const stats = verseStats(step, progress, verseProgress);
  status.textContent = stats.done + ' de ' + stats.total + ' versículos';
  summary.append(name, status);

  const body = document.createElement('div');
  body.className = 'verse-details-body';
  const actions = document.createElement('div');
  actions.className = 'verse-details-actions';

  const link = document.createElement('a');
  link.href = chapterUrl(step.bookId, step.chapter);
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Abrir capítulo na Bíblia Ave-Maria';
  actions.append(createChapterToggle(step, progress, verseProgress), link);
  body.appendChild(actions);

  let rendered = false;
  const ensureGrid = () => {
    if (rendered) return;
    body.appendChild(createVerseGrid(step, progress, verseProgress));
    rendered = true;
    details.dataset.versesRendered = 'true';
  };

  details.addEventListener('toggle', () => { if (details.open) ensureGrid(); });
  details._ensureVerseGrid = ensureGrid;
  details.append(summary, body);
  details.classList.toggle('is-done', stats.complete);
  return details;
}

async function renderPlan() {
  els.todayReadings.innerHTML = '<div class="empty-state">Carregando a estrutura de capítulos e versículos da Bíblia Ave-Maria…</div>';
  els.fullPlanSchedule.innerHTML = '<div class="empty-state">Preparando o cronograma detalhado…</div>';

  try {
    await ensureVerseCounts();
  } catch {
    const message = 'Não foi possível carregar agora a estrutura de versículos da Bíblia Ave-Maria. Verifique a conexão e tente novamente.';
    els.todayReadings.innerHTML = '<div class="empty-state">' + message + '</div>';
    els.fullPlanSchedule.innerHTML = '<div class="empty-state">' + message + '</div>';
    return;
  }

  const progress = loadPlanProgress();
  const verseProgress = loadVerseProgress();
  const target = Number(els.dailyTarget.value || 3);
  const startDate = els.planStartDate.value || '2026-01-01';

  updateProgressIndicators(progress);

  const nextSteps = planSteps.filter(step => !progress.has(step.key)).slice(0, target);
  els.todayReadings.replaceChildren();
  if (!nextSteps.length) {
    els.todayReadings.innerHTML = '<div class="empty-state">Plano concluído.</div>';
  } else {
    nextSteps.forEach(step => els.todayReadings.appendChild(createReadingDetail(step, progress, verseProgress)));
  }

  renderFullSchedule(progress, verseProgress, startDate, target);
}

function renderFullSchedule(progress, verseProgress, startDate, target) {
  const schedule = buildDatedSchedule(startDate, target);
  const groups = new Map();
  const endDate = schedule.length ? schedule[schedule.length - 1].date : startDate;

  els.printPlanMeta.innerHTML =
    '<strong>Plano de leitura — Monsenhor Jonas Abib</strong>' +
    '<span>Início: ' + formatDate(startDate) + '</span>' +
    '<span>Previsão final: ' + formatDate(endDate) + '</span>' +
    '<span>Meta: ' + target + ' capítulos por dia</span>' +
    '<span>Controle: capítulo e versículo</span>' +
    '<span>Salmos: leitura paralela e livre</span>';

  schedule.forEach(day => {
    const key = monthKey(day.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(day);
  });

  els.fullPlanSchedule.replaceChildren();

  groups.forEach(days => {
    const monthSection = document.createElement('section');
    monthSection.className = 'plan-month';

    const heading = document.createElement('h4');
    heading.className = 'plan-month-title';
    heading.textContent = monthHeading(days[0].date);
    monthSection.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'plan-days';

    days.forEach(day => {
      const article = document.createElement('article');
      article.className = 'plan-day';

      const dateBox = document.createElement('div');
      dateBox.className = 'plan-date';
      const [y,m,d] = day.date.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d, 12);
      dateBox.innerHTML =
        '<strong>' + d + '</strong>' +
        '<span>' + new Intl.DateTimeFormat('pt-BR',{weekday:'short'}).format(dateObj).replace('.', '') + '</span>';

      const content = document.createElement('div');
      content.className = 'plan-day-content';
      const readings = document.createElement('div');
      readings.className = 'plan-day-readings';
      day.steps.forEach(step => readings.appendChild(createVerseDetails(step, progress, verseProgress)));

      content.appendChild(readings);
      article.append(dateBox, content);
      list.appendChild(article);
    });

    monthSection.appendChild(list);
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
  renderLiturgia();
  els.query.focus();
});

els.navButtons.forEach(btn => btn.addEventListener('click', () => setSection(btn.dataset.section)));
document.querySelectorAll('[data-go]').forEach(btn => btn.addEventListener('click', () => setSection(btn.dataset.go)));

els.calendarYear.addEventListener('change', () => {
  selectedCalendarDate = null;
  renderCalendar();
});
els.calendarMonth.addEventListener('change', () => {
  selectedCalendarDate = null;
  renderCalendar();
});
els.calendarPrev.addEventListener('click', () => moveCalendarMonth(-1));
els.calendarNext.addEventListener('click', () => moveCalendarMonth(1));

[els.bibleQuery, els.bibleTestament].forEach(el => el.addEventListener('input', renderBibleBooks));

const storedTarget = localStorage.getItem(TARGET_STORAGE_KEY);
if (storedTarget === '4') els.dailyTarget.value = '4';
const storedStart = localStorage.getItem(START_STORAGE_KEY);
if (storedStart) els.planStartDate.value = storedStart;

els.dailyTarget.addEventListener('change', () => {
  localStorage.setItem(TARGET_STORAGE_KEY, els.dailyTarget.value);
  renderPlan();
});

els.planStartDate.addEventListener('change', () => {
  if (els.planStartDate.value) localStorage.setItem(START_STORAGE_KEY, els.planStartDate.value);
  renderPlan();
});

els.printPlan.addEventListener('click', () => window.print());

window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.verse-details').forEach(details => {
    if (typeof details._ensureVerseGrid === 'function') details._ensureVerseGrid();
    details.dataset.openBeforePrint = details.open ? 'true' : 'false';
    details.open = true;
  });
});

window.addEventListener('afterprint', () => {
  document.querySelectorAll('.verse-details').forEach(details => {
    if (details.dataset.openBeforePrint === 'false') details.open = false;
    delete details.dataset.openBeforePrint;
  });
});

els.resetPlan.addEventListener('click', () => {
  if (window.confirm('Reiniciar todo o progresso deste plano neste dispositivo?')) {
    localStorage.removeItem(PLAN_STORAGE_KEY);
    localStorage.removeItem(VERSE_PROGRESS_STORAGE_KEY);
    localStorage.removeItem(LEGACY_VERSE_NOTES_STORAGE_KEY);
    renderPlan();
  }
});

initCalendarControls();
