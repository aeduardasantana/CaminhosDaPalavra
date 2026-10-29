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

try {
  const checkOutput = run(['--check']);
  assert.match(checkOutput, /Pacote público validado/);

  const buildOutput = run(['--output', output]);
  assert.match(buildOutput, /Pacote público criado/);

  const files = listFiles(output);
  const fileSet = new Set(files);

  for (const required of [
    'index.html',
    'app.js',
    'styles.css',
    'dados/heresias-controversias.json',
    'liturgia-paralelo.js'
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

  console.log('Pacote público seguro validado:', files.length, 'arquivos; nenhum arquivo interno de auditoria foi incluído.');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
