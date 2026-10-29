/* Integridade editorial transversal: calendário, ciclos, edições, glosas e vínculos.
 * Não altera conteúdo litúrgico; registra explicitamente as pendências conhecidas. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { window: {}, Date, Math, console };
const load = file => vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
[
  'calendar.js',
  'lectionary-data.js',
  'glosa-psalms.js',
  'glosa-gospels.js',
  'glosa-new-testament.js',
  'glosa-old-testament.js',
  'glosas-revisadas-ano-a.js',
  'glosas-revisadas-ano-b.js',
  'glosas-revisadas-ano-c.js',
  'liturgia-2025-11.js',
  'liturgia-br-acervo.js',
  'liturgia-ave-maria-acervo.js',
  'liturgia-edicoes.js'
].forEach(load);

const normalize = value => String(value ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
const normalizeKey = value => String(value).split('|').map(normalize).join('|');
const validIso = value => /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value + 'T00:00:00Z'));

const calendar = context.window.LCE_CALENDAR;
const master = context.window.LCE_LECTIONARY;
assert.ok(calendar, 'API do calendário não carregada');
assert.ok(master, 'Mapa bíblico mestre não carregado');
assert.equal(master.records.length, 180, 'Quantidade de celebrações do mapa mestre mudou; revisar inventário');
for (const cycle of ['A', 'B', 'C']) {
  assert.equal(master.records.filter(record => record.cycle === cycle).length, 60,
    'Cada ciclo deve manter 60 celebrações: ' + cycle);
}

const itemLabels = {
  'primeira-leitura': 'Primeira leitura',
  salmo: 'Salmo responsorial',
  'segunda-leitura': 'Segunda leitura',
  evangelho: 'Evangelho',
  procissao: 'Evangelho da procissão',
  paixao: 'Paixão do Senhor'
};
const identities = new Set();
const rows = [];
const references = new Set();
let itemCount = 0;
for (const record of master.records) {
  assert.ok(['A', 'B', 'C'].includes(record.cycle), 'Ciclo inválido: ' + record.cycle);
  assert.ok(record.section && record.celebration && record.sourceLine,
    'Celebração sem seção, nome ou proveniência');
  const identity = [record.cycle, record.section, record.celebration].map(normalize).join('|');
  assert.ok(!identities.has(identity), 'Celebração duplicada no mesmo ciclo: ' + identity);
  identities.add(identity);
  assert.ok(Array.isArray(record.items) && record.items.length > 0,
    'Celebração sem itens: ' + record.celebration);
  for (const item of record.items) {
    assert.ok(itemLabels[item.type], 'Tipo litúrgico desconhecido: ' + item.type);
    assert.equal(item.label, itemLabels[item.type],
      'Rótulo divergente do tipo ' + item.type + ' em ' + record.celebration);
    assert.ok(typeof item.reference === 'string' && item.reference.trim(),
      'Referência vazia em ' + record.celebration);
    itemCount++;
    references.add(normalize(item.reference));
    rows.push({
      cycle: record.cycle, section: record.section, celebration: record.celebration,
      type: item.type, reference: item.reference
    });
  }
}
assert.equal(itemCount, 717, 'Total de itens litúrgicos mudou; revisar inventário');
assert.equal(references.size, 554, 'Total de referências distintas mudou; revisar inventário');

// Conferência de ciclo dominical A/B/C e ciclo ferial I/II em todos os dias de 2025–2030.
const cycleBoundaries = [
  ['2025-11-29', 'C'], ['2025-11-30', 'A'],
  ['2026-11-28', 'A'], ['2026-11-29', 'B'],
  ['2027-11-27', 'B'], ['2027-11-28', 'C'],
  ['2028-12-02', 'C'], ['2028-12-03', 'A'],
  ['2029-12-01', 'A'], ['2029-12-02', 'B'],
  ['2030-11-30', 'B'], ['2030-12-01', 'C']
];
for (const [date, expected] of cycleBoundaries) {
  assert.equal(calendar.infoForIso(date).cycle, expected, 'Transição de ciclo incorreta em ' + date);
}
for (let year = 2025; year <= 2030; year++) {
  for (let month = 0; month < 12; month++) {
    const matrix = calendar.monthMatrix(year, month);
    assert.equal(matrix.length % 7, 0, 'Matriz mensal sem semanas completas: ' + year + '-' + month);
    const cells = matrix.filter(Boolean);
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    assert.equal(cells.length, daysInMonth, 'Quantidade de dias incorreta: ' + year + '-' + month);
    assert.equal(new Set(cells.map(day => day.iso)).size, daysInMonth,
      'Dia repetido na matriz: ' + year + '-' + month);
  }
  const date = new Date(Date.UTC(year, 0, 1));
  while (date.getUTCFullYear() === year) {
    const iso = date.toISOString().slice(0, 10);
    const info = calendar.infoForIso(iso);
    assert.equal(info.iso, iso, 'Calendário retornou data diferente da solicitada: ' + iso);
    assert.ok(['A', 'B', 'C'].includes(info.cycle), 'Ciclo ausente em ' + iso);
    assert.ok(info.season, 'Tempo litúrgico ausente em ' + iso);
    if (info.ferialCycle !== null) {
      assert.notEqual(info.weekday, 0, 'Ciclo ferial atribuído a domingo: ' + iso);
      assert.equal(info.season, 'Tempo Comum', 'Ciclo ferial fora do Tempo Comum: ' + iso);
      assert.equal(info.ferialCycle, year % 2 === 0 ? 'II' : 'I',
        'Ciclo ferial incompatível com o ano civil: ' + iso);
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }
}

// Toda referência do mapa dominical deve ter uma glosa-base correspondente.
// A glosa é material de preparação, não prova de validação humana em Libras.
const baseGloss = context.window.LCE_GLOSSA || {};
const glossKeys = new Set(Object.keys(baseGloss).map(normalize));
assert.equal(Object.keys(baseGloss).length, 555, 'Quantidade de glosas-base mudou; revisar antes de aceitar');
for (const gloss of Object.values(baseGloss)) {
  assert.ok(typeof gloss === 'string' && gloss.trim(), 'Glosa-base vazia ou inválida');
}
for (const reference of references) {
  assert.ok(glossKeys.has(reference), 'Referência sem glosa-base: ' + reference);
}

// Glosas contextuais precisam apontar para ciclo/celebração/item/referência.
// Duas entradas do Ano B ficam explicitamente pendentes: são opções compartilhadas
// com o registro A, mas o registro B ainda diz para validar a opção brasileira.
const pendingSharedOptionKeys = new Set([
  normalizeKey('B|CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO|Batismo do Senhor|primeira-leitura|Is 42,1-4.6-7'),
  normalizeKey('B|CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO|Batismo do Senhor|segunda-leitura|At 10,34-38')
]);
const contextual = [
  ['A', context.window.LCE_GLOSSA_ANO_A_REVISADA || {}],
  ['B', context.window.LCE_GLOSSA_ANO_B_REVISADA || {}],
  ['C', context.window.LCE_GLOSSA_ANO_C_REVISADA || {}]
];
const contextualCounts = {};
const observedPending = [];
for (const [cycle, dictionary] of contextual) {
  const keys = Object.keys(dictionary);
  contextualCounts[cycle] = keys.length;
  for (const key of keys) {
    const parts = key.split('|');
    assert.equal(parts.length, 5, 'Chave contextual malformada: ' + key);
    assert.equal(parts[0], cycle, 'Glosa contextual gravada no ciclo errado: ' + key);
    assert.ok(typeof dictionary[key] === 'string' && dictionary[key].trim(),
      'Glosa contextual vazia: ' + key);
    const [keyCycle, section, celebration, type, reference] = parts;
    const matches = row => normalize(row.cycle) === normalize(keyCycle) &&
      normalize(row.section) === normalize(section) &&
      normalize(row.celebration) === normalize(celebration) &&
      normalize(row.type) === normalize(type) &&
      normalize(row.reference) === normalize(reference);
    if (rows.some(matches)) continue;

    const normalizedKey = normalizeKey(key);
    assert.ok(pendingSharedOptionKeys.has(normalizedKey),
      'Glosa contextual sem vínculo no mapa mestre e sem exceção documentada: ' + key);
    assert.ok(rows.some(row => row.cycle === 'A' && matches(row)),
      'A opção compartilhada do Batismo do Senhor não tem correspondência no Ano A: ' + key);
    const bRecord = master.records.find(record => record.cycle === 'B' &&
      normalize(record.section) === normalize(section) &&
      normalize(record.celebration) === normalize(celebration));
    assert.ok(bRecord && /validar a opção vigente no Brasil antes da glosa/i.test(bRecord.sourceLine),
      'A pendência da opção do Ano B precisa continuar explícita até revisão editorial: ' + key);
    observedPending.push(normalizedKey);
  }
}
assert.equal(contextualCounts.A, 32, 'Quantidade de glosas contextuais do Ano A mudou; revisar inventário');
assert.equal(contextualCounts.B, 181, 'Quantidade de glosas contextuais do Ano B mudou; revisar inventário');
assert.equal(contextualCounts.C, 0, 'Quantidade de glosas contextuais do Ano C mudou; revisar inventário');

// O acervo de novembro deve manter todos os IDs de texto ligados a datas e tipos.
// O texto-fonte pode trazer uma referência ampla para um salmo cujo recorte diário é específico;
// essa limitação fica identificada, nunca tratada como alinhamento versicular comprovado.
const monthly = context.window.LCE_MONTH_2025_11;
const cnbb = context.window.LCE_BR_ACERVO;
assert.equal(Object.keys(monthly.readings).length, 30, 'A competência 2025-11 deve cobrir 30 datas');
const monthlyItemCount = Object.values(monthly.readings).reduce((sum, day) => sum + day.items.length, 0);
assert.equal(monthlyItemCount, 96, 'Quantidade de itens de novembro mudou');
assert.equal(cnbb.period, '2025-11');
assert.equal(Object.keys(cnbb.dates).length, 30, 'Acervo CNBB não cobre todas as datas de novembro');
assert.equal(Object.keys(cnbb.texts).length, 96, 'Quantidade de registros do acervo CNBB mudou');
const monthlyKinds = {
  'Primeira leitura': 'primeira-leitura',
  'Salmo responsorial': 'salmo',
  'Cântico responsorial': 'salmo',
  'Segunda leitura': 'segunda-leitura',
  Evangelho: 'evangelho'
};
const broadReferenceExceptions = [];
const dateMappedIds = [];
for (const [date, day] of Object.entries(monthly.readings)) {
  assert.ok(validIso(date), 'Data mensal inválida: ' + date);
  const sourceDay = cnbb.dates[date];
  assert.ok(sourceDay && sourceDay.byKind, 'Data sem mapa de leituras CNBB: ' + date);
  for (const [label, reference] of day.items) {
    const kind = monthlyKinds[label];
    assert.ok(kind, 'Rótulo mensal sem tipo de acervo: ' + label + ' em ' + date);
    const ids = sourceDay.byKind[kind] || [];
    assert.ok(ids.length, 'Leitura sem ID no acervo: ' + date + ' ' + label + ' ' + reference);
    const matching = ids.map(id => ({ id, record: cnbb.texts[id] }))
      .filter(entry => entry.record && normalize(entry.record.reference) === normalize(reference));
    if (matching.length) {
      for (const entry of matching) assert.equal(entry.record.kind, kind, 'Tipo divergente: ' + entry.id);
      continue;
    }
    const broad = ids.map(id => ({ id, record: cnbb.texts[id] }))
      .find(entry => entry.record && kind === 'salmo' &&
        normalize(reference).startsWith(normalize(entry.record.reference)));
    assert.ok(broad && date === '2025-11-06' &&
      normalize(reference) === normalize('Sl 26(27),1.4.13-14 (R. 13)') &&
      normalize(broad.record.reference) === normalize('Sl 26(27)'),
      'Referência mensal não corresponde ao acervo: ' + date + ' ' + reference);
    broadReferenceExceptions.push(date + '|' + kind + '|' + reference + '|' + broad.record.reference);
  }
  for (const [kind, ids] of Object.entries(sourceDay.byKind)) {
    for (const id of ids) {
      dateMappedIds.push(id);
      const record = cnbb.texts[id];
      assert.ok(record, 'ID de texto inexistente na data ' + date + ': ' + id);
      assert.equal(record.kind, kind, 'Tipo do ID diverge da chave por data: ' + date + ' ' + id);
      assert.ok(typeof record.text === 'string' && record.text.trim(),
        'Texto-fonte vazio no acervo: ' + id);
      assert.ok(typeof record.reference === 'string' && record.reference.trim(),
        'Referência vazia no acervo: ' + id);
    }
  }
}
assert.equal(broadReferenceExceptions.length, 1,
  'A lista de referências-fonte mais amplas mudou; revisar os pareamentos');
for (const id of Object.keys(cnbb.texts)) {
  assert.ok(dateMappedIds.includes(id), 'Registro CNBB sem vínculo a data: ' + id);
}
for (const [key, ids] of Object.entries(cnbb.associations || {})) {
  const kind = key.split('|').at(-1);
  for (const id of ids) {
    assert.ok(cnbb.texts[id], 'Associação litúrgica aponta para ID inexistente: ' + key + ' → ' + id);
    assert.equal(cnbb.texts[id].kind, kind, 'Associação usa tipo diferente do registro: ' + key + ' → ' + id);
  }
}

// CNBB e Ave-Maria são acervos distintos; o salmo responsorial permanece CNBB.
// Se o acervo AVM estiver vazio, a interface deve informar a lacuna, não usar CNBB como substituto.
const editions = context.window.LCE_EDICOES;
const avm = context.window.LCE_AVE_MARIA_ACERVO;
const avmKinds = new Set(['primeira-leitura', 'segunda-leitura', 'evangelho']);
assert.equal(avm.edition, 'AVM');
assert.equal(editions.editionFor('salmo', 'AVM'), 'CNBB');
for (const kind of avmKinds) assert.equal(editions.editionFor(kind, 'AVM'), 'AVM');
assert.equal(editions.editionFor('tipo-desconhecido', 'AVM'), 'CNBB');
assert.deepEqual(editions.aveReadings({
  data: '2025-11-05', item: 'primeira-leitura', referencia: 'Rm 13,8-10'
}, avm), [], 'Acervo Ave-Maria vazio não pode recorrer à edição CNBB');
for (const [id, record] of Object.entries(avm.texts || {})) {
  assert.equal(record.id, id, 'ID AVM diverge da chave do acervo: ' + id);
  assert.equal(record.edition, 'AVM', 'Texto de outra edição inserido no acervo AVM: ' + id);
  assert.ok(avmKinds.has(record.kind), 'Tipo proibido no acervo AVM: ' + record.kind);
  assert.ok(record.reference && typeof record.text === 'string' && record.text.trim(),
    'Registro AVM sem referência ou texto: ' + id);
  if (record.gloss) {
    assert.equal(record.gloss.textId, id, 'Glosa AVM vinculada a outro texto: ' + id);
    assert.ok(Array.isArray(record.gloss.segments) && record.gloss.segments.length,
      'Glosa AVM sem segmentos: ' + id);
    assert.ok(record.gloss.segments.every(segment => typeof segment.text === 'string' && segment.text.trim()),
      'Glosa AVM com segmento vazio: ' + id);
  }
}
for (const [date, byKind] of Object.entries(avm.dates || {})) {
  assert.ok(validIso(date), 'Data AVM inválida: ' + date);
  for (const [kind, value] of Object.entries(byKind)) {
    assert.ok(avmKinds.has(kind), 'Tipo proibido no índice de datas AVM: ' + kind);
    const ids = Array.isArray(value) ? value : [value];
    for (const id of ids) assert.ok(avm.texts[id] && avm.texts[id].kind === kind,
      'Índice de data AVM aponta para registro incompatível: ' + date + ' ' + id);
  }
}
for (const [key, value] of Object.entries(avm.byPassage || {})) {
  const split = key.indexOf('|');
  const kind = key.slice(0, split), reference = key.slice(split + 1);
  assert.ok(split > 0 && avmKinds.has(kind), 'Chave de passagem AVM inválida: ' + key);
  const ids = Array.isArray(value) ? value : [value];
  for (const id of ids) {
    assert.ok(avm.texts[id], 'Índice por passagem AVM aponta para ID inexistente: ' + key);
    assert.equal(avm.texts[id].kind, kind, 'Tipo incompatível no índice AVM: ' + key);
    assert.equal(normalize(avm.texts[id].reference), normalize(reference),
      'Referência incompatível no índice AVM: ' + key);
  }
}

console.log(
  'OK: calendário 2025–2030; 180 celebrações (60 por ciclo), 717 itens e 554 referências; ' +
  'todas as referências com glosa-base; ' + contextualCounts.A + ' glosas contextuais A, ' +
  contextualCounts.B + ' B, ' + contextualCounts.C + ' C; ' +
  observedPending.length + ' vínculo(s) do Batismo do Senhor B mantido(s) como pendência explícita; ' +
  'acervo novembro: 30 datas/96 registros; ' +
  broadReferenceExceptions.length + ' referência(s) de salmo com recorte mais amplo na fonte; ' +
  'CNBB/Ave-Maria isoladas, sem fallback entre edições.'
);
