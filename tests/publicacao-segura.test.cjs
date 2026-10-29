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
  const cleanupPaths = new Set(cleanupPlan.paths);
  for (const internal of [
    'README.md',
    'scripts/preparar-publicacao.mjs',
    'tests/publicacao-segura.test.cjs',
    'data/mapa/publication-manifest.json'
  ]) {
    assert.ok(cleanupPaths.has(internal), 'Artefato interno não consta na limpeza seletiva: ' + internal);
  }
  for (const publicFile of [
    'index.html',
    'app.js',
    'styles.css',
    'dados/heresias-controversias.json'
  ]) {
    assert.ok(!cleanupPaths.has(publicFile), 'Arquivo público foi marcado para remoção: ' + publicFile);
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
    'publication-control.js'
  ]) {
    assert.ok(fileSet.has(required), 'Arquivo público esperado ausente: ' + required);
  }

  for (const forbidden of [
    'README.md',
    'CNAME',
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

  for (const [chapterKey, record] of Object.entries(publicTheology.chapters)) {
    const state = publicControl.chapters[record.cpId];
    assert.ok(state, 'Estado público ausente para ' + chapterKey);
    if (!state.publicAuthorized) {
      assert.ok(Object.keys(record).every(key =>
        ['cpId', 'bookId', 'chapter', 'reference', 'bibleUrl', 'matrixVersion'].includes(key)
      ), 'Conteúdo não autorizado foi incluído no pacote: ' + chapterKey);
      assert.equal(state.reviewStatus, 'Não autorizado para exibição pública');
    } else {
      assert.deepEqual(Object.keys(state), ['publicAuthorized']);
    }
  }

  const serializedControl = fs.readFileSync(path.join(output, 'publication-control.js'), 'utf8');
  assert.ok(!serializedControl.includes('sourceSpreadsheetId'), 'ID da planilha de controle foi publicado.');
  assert.ok(!serializedControl.includes('reviewer'), 'Metadados internos de revisão foram publicados.');
  assert.ok(!serializedControl.includes('Não enviado'), 'Status interno de revisão foi publicado.');

  console.log('Pacote público seguro validado:', files.length, 'arquivos; dados de capítulos não autorizados foram reduzidos a metadados.');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
