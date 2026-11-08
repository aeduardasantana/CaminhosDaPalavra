const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const script = path.join(root, 'scripts', 'preparar-publicacao.mjs');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'caminhos-publicacao-'));
const output = path.join(tempRoot, 'dist');

function run(args) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

function listFiles(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const relative = path.posix.join(prefix, entry.name);
    const absolute = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(absolute, relative) : [relative];
  });
}

function parseAssignedJson(source, globalName) {
  const match = source.match(new RegExp('window\\.' + globalName + '\\s*=\\s*([\\s\\S]*);\\s*$'));
  assert.ok(match, globalName + ' não encontrado no pacote');
  return JSON.parse(match[1]);
}

try {
  const cleanupPlanResult = spawnSync('python3', [
    path.join(root, 'scripts', 'limpar-artefatos-ftp.py'),
    '--dry-run'
  ], { cwd: root, encoding: 'utf8' });
  assert.equal(cleanupPlanResult.status, 0, cleanupPlanResult.stderr || cleanupPlanResult.stdout);
  const cleanupPlan = JSON.parse(cleanupPlanResult.stdout);
  assert.deepEqual(
    cleanupPlan.paths,
    ['bibliaAveMaria.json', 'bibliaAveMariaRAW.json'],
    'A limpeza do P1 deve restringir-se aos dois JSONs da raiz FTP'
  );
  const cleanupPaths = new Set(cleanupPlan.paths);
  for (const forbidden of [
    'README.md',
    'scripts/preparar-publicacao.mjs',
    'tests/publicacao-segura.test.cjs',
    'data/mapa/publication-manifest.json'
  ]) {
    assert.ok(!cleanupPaths.has(forbidden),
      'A limpeza do P1 não pode remover arquivos adicionais: ' + forbidden);
  }
  for (const publicFile of [
    'index.html',
    'app.js',
    'styles.css',
    'dados/heresias-controversias.json'
  ]) {
    assert.ok(!cleanupPaths.has(publicFile), 'Arquivo público foi marcado para remoção: ' + publicFile);
  }

  for (const file of ['bibliaAveMaria.json', 'bibliaAveMariaRAW.json']) {
    assert.ok(fs.existsSync(path.join(root, file)), 'Arquivo original ausente: ' + file);
    assert.ok(fs.existsSync(path.join(root, 'data', 'biblia-ave-maria', file)),
      'Cópia interna ausente: ' + file);
  }

  const checkOutput = run(['--check']);
  assert.match(checkOutput, /Pacote público validado/);
  assert.match(checkOutput, /mantidos bloqueados com metadados mínimos/);

  const buildOutput = run(['--output', output]);
  assert.match(buildOutput, /Pacote público criado/);

  const files = listFiles(output);
  const fileSet = new Set(files);

  for (const required of [
    'index.html',
    'app.js',
    'styles.css',
    'dados/heresias-controversias.json',
    'liturgia-paralelo.js',
    'theology-data.js',
    'publication-control.js',
    'verse-index.js'
  ]) {
    assert.ok(fileSet.has(required), 'Arquivo público esperado ausente: ' + required);
  }

  for (const forbidden of [
    'README.md',
    'CNAME',
    'bibliaAveMaria.json',
    'bibliaAveMariaRAW.json',
    'AUDITORIA-GLOSAS-ANO-A-241.csv',
    'scripts/validate-publication-control.mjs',
    'tests/publicacao-segura.test.cjs',
    'docs/PROTOCOLO-HERESIAS-E-CONDENACOES.md',
    'RELATORIOS/IMPORTACAO-LOCAL-2025-11.json',
    'data/mapa/publication-manifest.json'
  ]) {
    assert.ok(!fileSet.has(forbidden), 'Arquivo interno entrou no pacote: ' + forbidden);
  }

  assert.ok(!files.some(file => /(^|\/)(\.github|scripts|tests|docs|RELATORIOS|data)(\/|$)/.test(file)),
    'O pacote contém um diretório interno.');
  assert.ok(files.every(file => /\.(html|css|js|json|svg|png|jpe?g|webp|gif|ico|avif|woff2?|ttf|otf|webmanifest|xml)$/i.test(file)),
    'O pacote contém uma extensão não permitida.');

  const publicTheology = parseAssignedJson(
    fs.readFileSync(path.join(output, 'theology-data.js'), 'utf8'),
    'CDP_THEOLOGY'
  );
  const publicControl = parseAssignedJson(
    fs.readFileSync(path.join(output, 'publication-control.js'), 'utf8'),
    'CDP_PUBLICATION_CONTROL'
  );
  assert.equal(Object.keys(publicTheology.chapters).length, 1334);
  assert.equal(Object.keys(publicControl.chapters).length, 1334);
  assert.equal(publicControl.failClosed, true);
  assert.equal(Object.values(publicControl.chapters).filter(s=>s.publicAuthorized).length,1334,
    'Autorização da titular não foi aplicada ao snapshot aprovado.');
  assert.equal(publicTheology.chapters['GEN:1'].mainTheme,'Criação');
  assert.match(publicTheology.chapters['GEN:13'].confidence,/Pendente/,
    'O estado da pesquisa parcial deve permanecer visível e não ser transformado em revisão concluída.');
  const originalControl=parseAssignedJson(
    fs.readFileSync(path.join(root,'publication-control.js'),'utf8'),'CDP_PUBLICATION_CONTROL');
  assert.equal(originalControl.counts.authorizedByOwner,1334);
  assert.equal(originalControl.counts.approvedByEcclesialReview,0);
  assert.equal(originalControl.chapters['CP-0001'].reviewStatus,'Não enviado');
  assert.equal(originalControl.chapters['CP-0001'].internalDecision,'');
  assert.equal(originalControl.ownerAuthorization.licensedBibleTextAuthorized,false);

  for (const [chapterKey, record] of Object.entries(publicTheology.chapters)) {
    const state = publicControl.chapters[record.cpId];
    assert.ok(state, 'Estado público ausente para ' + chapterKey);
    if (!state.publicAuthorized) {
      assert.ok(Object.keys(record).every(key =>
        ['cpId', 'bookId', 'chapter', 'reference', 'bibleUrl', 'matrixVersion'].includes(key)
      ), 'Conteúdo não autorizado foi incluído no pacote: ' + chapterKey);
      assert.equal(state.reviewStatus, 'Não autorizado para exibição pública');
    } else {
      assert.deepEqual(Object.keys(state), ['publicAuthorized','authorizationBasis']);
      assert.equal(state.authorizationBasis,'titular');
    }
  }

  const verseIndex = parseAssignedJson(
    fs.readFileSync(path.join(output, 'verse-index.js'), 'utf8'), 'CDP_VERSE_INDEX'
  );
  assert.equal(verseIndex.counts.books,73);
  assert.equal(verseIndex.counts.chapters,1334);
  assert.equal(verseIndex.counts.verses,35450);
  assert.equal(verseIndex.books.GEN[0],31);
  const distributedBible=files.filter(file=>/^dados\/biblia-ave-maria\/[A-Z0-9]{3}\.json$/.test(file));
  assert.equal(distributedBible.length,73,'Os 73 livros precisam constar no pacote público.');
  let distributedVerses=0,distributedChapters=0;
  for(const [bookId,counts] of Object.entries(verseIndex.books)){
    const file='dados/biblia-ave-maria/'+bookId+'.json';
    assert.ok(fileSet.has(file),'Livro bíblico ausente: '+bookId);
    const payload=JSON.parse(fs.readFileSync(path.join(output,file),'utf8'));
    assert.equal(payload.schemaVersion,1);
    assert.equal(payload.editionId,'AVM-ESTUDOS-2');
    assert.equal(payload.bookId,bookId);
    assert.equal(payload.chapters.length,counts.length);
    for(let ch=0;ch<counts.length;ch++){
      const chapter=payload.chapters[ch];
      assert.equal(chapter.chapter,ch+1);
      assert.equal(chapter.verses.length,counts[ch]);
      for(let v=0;v<counts[ch];v++){
        assert.equal(chapter.verses[v].verse,v+1);
        assert.ok(typeof chapter.verses[v].text==='string'&&chapter.verses[v].text.trim());
        distributedVerses++;
      }
      distributedChapters++;
    }
  }
  assert.equal(distributedChapters,1334);
  assert.equal(distributedVerses,35450);
  const serializedIndex=fs.readFileSync(path.join(output,'verse-index.js'),'utf8');
  assert.ok(!serializedIndex.includes('"texto"'),'Redação bíblica foi publicada no índice.');
  assert.ok(!serializedIndex.includes('"text"'),'Índice contém texto bíblico.');
  const serializedControl = fs.readFileSync(path.join(output, 'publication-control.js'), 'utf8');
  assert.ok(!serializedControl.includes('sourceSpreadsheetId'), 'ID da planilha de controle foi publicado.');
  assert.ok(!serializedControl.includes('reviewer'), 'Metadados internos de revisão foram publicados.');
  assert.ok(!serializedControl.includes('Não enviado'), 'Status interno de revisão foi publicado.');

  console.log('Pacote público completo validado:', files.length, 'arquivos; 73 livros, 1334 capítulos, 35450 versículos Ave-Maria publicados e Mapa Teológico preservado.');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
