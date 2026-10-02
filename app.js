const data = window.LCE_DATA;

const els = {
  query: document.querySelector('#query'),
  year: document.querySelector('#yearFilter'),
  item: document.querySelector('#itemFilter'),
  clear: document.querySelector('#clearFilters'),
  liturgyResults: document.querySelector('#liturgyResults'),
  musicResults: document.querySelector('#musicResults'),
  resultCount: document.querySelector('#resultCount'),
  template: document.querySelector('#liturgyCardTemplate'),
  liturgiaSection: document.querySelector('#liturgiaSection'),
  musicasSection: document.querySelector('#musicasSection'),
  navButtons: [...document.querySelectorAll('.nav-button')]
};

function normalize(value = '') {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function searchableText(entry) {
  return normalize([
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
  text.split('\n').forEach(line => {
    const el = document.createElement(line.trim().startsWith('(') ? 'span' : 'p');
    if (el.tagName === 'SPAN') el.className = 'visual-note';
    el.textContent = line;
    frag.appendChild(el);
  });
  return frag;
}

function renderLiturgia() {
  const q = normalize(els.query.value);
  const year = els.year.value;
  const item = els.item.value;

  const filtered = data.liturgia.filter(entry => {
    const matchesQuery = !q || searchableText(entry).includes(q);
    const matchesYear = !year || entry.ano === year;
    const matchesItem = !item || entry.item === item;
    return matchesQuery && matchesYear && matchesItem;
  });

  els.liturgyResults.replaceChildren();
  els.resultCount.textContent = filtered.length + ' ' + (filtered.length === 1 ? 'resultado' : 'resultados');

  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Nenhum conteúdo encontrado com esses filtros.';
    els.liturgyResults.appendChild(empty);
    return;
  }

  filtered.forEach(entry => {
    const node = els.template.content.cloneNode(true);
    node.querySelector('.card-kicker').textContent = 'Ano ' + entry.ano + ' · ' + entry.itemLabel;
    node.querySelector('.card-title').textContent = entry.celebracao + ' — ' + entry.referencia;
    node.querySelector('.card-meta').textContent = entry.tempo;
    node.querySelector('.status-pill').textContent = entry.status;
    node.querySelector('.original-text').textContent = entry.original;
    node.querySelector('.glosa-text').appendChild(formatGlosa(entry.glosa));
    els.liturgyResults.appendChild(node);
  });
}

function renderMusicas() {
  els.musicResults.replaceChildren();
  data.musicas.forEach(song => {
    const article = document.createElement('article');
    article.className = 'music-card';
    article.innerHTML = '<p class="eyebrow">' + song.tema + '</p>' +
      '<h3>' + song.titulo + '</h3>' +
      '<p class="music-meta"><strong>Função:</strong> ' + song.funcao + '</p>' +
      '<p class="music-meta"><strong>Tempo:</strong> ' + song.tempo + '</p>' +
      '<p class="music-meta"><strong>Ocasião:</strong> ' + song.ocasiao + '</p>' +
      '<span class="priority-tag">' + song.status + '</span>';
    els.musicResults.appendChild(article);
  });
}

function setSection(section) {
  const isLiturgia = section === 'liturgia';
  els.liturgiaSection.hidden = !isLiturgia;
  els.musicasSection.hidden = isLiturgia;
  els.navButtons.forEach(btn => btn.classList.toggle('is-active', btn.dataset.section === section));
}

[els.query, els.year, els.item].forEach(el => el.addEventListener('input', renderLiturgia));
els.clear.addEventListener('click', () => {
  els.query.value = '';
  els.year.value = '';
  els.item.value = '';
  renderLiturgia();
  els.query.focus();
});
els.navButtons.forEach(btn => btn.addEventListener('click', () => setSection(btn.dataset.section)));

renderLiturgia();
renderMusicas();
