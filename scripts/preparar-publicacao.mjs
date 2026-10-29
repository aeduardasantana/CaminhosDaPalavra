import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const publicExtensions = new Set([
  '.html', '.css', '.js', '.json', '.svg', '.png', '.jpg', '.jpeg',
  '.webp', '.gif', '.ico', '.avif', '.woff', '.woff2', '.ttf', '.otf',
  '.webmanifest', '.xml'
]);
const excludedPrefixes = [
  '.github/',
  'scripts/',
  'tests/',
  'docs/',
  'RELATORIOS/',
  'data/',
  'dist/'
];
const excludedFiles = new Set(['CNAME']);

function isPublicWebFile(file) {
  if (!file || file.startsWith('/') || file.split('/').includes('..')) return false;
  if (excludedPrefixes.some(prefix => file.startsWith(prefix))) return false;
  if (file.split('/').some(segment => segment.startsWith('.'))) return false;
  if (excludedFiles.has(file)) return false;
  return publicExtensions.has(path.posix.extname(file).toLowerCase());
}

function trackedFiles() {
  return execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean)
    .sort();
}

function parseAssignedJson(file, globalName) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const match = source.match(new RegExp('window\\.' + globalName + '\\s*=\\s*([\\s\\S]*);\\s*$'));
  if (!match) throw new Error(globalName + ' não encontrado em ' + file);
  return JSON.parse(match[1]);
}

function createPublicEditorialPayloads() {
  const theology = parseAssignedJson('theology-data.js', 'CDP_THEOLOGY');
  const control = parseAssignedJson('publication-control.js', 'CDP_PUBLICATION_CONTROL');
  if (control.failClosed !== true) throw new Error('O controle editorial precisa permanecer fail-closed.');

  const allowedReview = new Set(control.rule?.reviewStatusesAllowed || []);
  const allowedDecision = new Set(control.rule?.internalDecisionsAllowed || []);
  const publicChapters = {};
  const publicControlChapters = {};
  let authorizedCount = 0;

  for (const [chapterKey, record] of Object.entries(theology.chapters || {})) {
    const state = control.chapters?.[record.cpId];
    const authorized = state?.publicAuthorized === true
      && allowedReview.has(state.reviewStatus)
      && allowedDecision.has(state.internalDecision)
      && (!state.adjustmentRequired || state.adjustmentExecuted);

    if (authorized) {
      publicChapters[chapterKey] = record;
      publicControlChapters[record.cpId] = { publicAuthorized: true };
      authorizedCount++;
      continue;
    }

    const metadata = {
      cpId: record.cpId,
      bookId: record.bookId,
      chapter: record.chapter,
      reference: record.reference,
      bibleUrl: record.bibleUrl,
      matrixVersion: record.matrixVersion
    };
    publicChapters[chapterKey] = Object.fromEntries(
      Object.entries(metadata).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );
    publicControlChapters[record.cpId] = {
      publicAuthorized: false,
      reviewStatus: 'Não autorizado para exibição pública'
    };
  }

  const total = Object.keys(theology.chapters || {}).length;
  if (total !== 1334) throw new Error('Quantidade inesperada de capítulos no pacote editorial: ' + total);
  if (Object.keys(publicControlChapters).length !== total) {
    throw new Error('Nem todos os capítulos receberam um estado público fail-closed.');
  }
  if (authorizedCount !== (control.counts?.authorized ?? authorizedCount)) {
    throw new Error('Contagem de capítulos autorizados inconsistente com o controle editorial.');
  }

  return {
    theology: {
      schemaVersion: theology.schemaVersion,
      datasetVersion: theology.datasetVersion,
      methodologyVersion: theology.methodologyVersion,
      chapters: publicChapters
    },
    control: {
      failClosed: true,
      chapters: publicControlChapters
    },
    total,
    authorizedCount,
    blockedCount: total - authorizedCount
  };
}

const allFiles = trackedFiles();
const publicFiles = allFiles.filter(isPublicWebFile);
const requiredFiles = ['index.html', 'app.js', 'styles.css', 'dados/heresias-controversias.json'];
const missingRequired = requiredFiles.filter(file => !publicFiles.includes(file));

if (missingRequired.length) {
  throw new Error('Arquivos públicos essenciais ausentes do pacote: ' + missingRequired.join(', '));
}

const invalidIncluded = publicFiles.filter(file =>
  excludedPrefixes.some(prefix => file.startsWith(prefix)) ||
  excludedFiles.has(file) ||
  !publicExtensions.has(path.posix.extname(file).toLowerCase())
);
if (invalidIncluded.length) {
  throw new Error('Arquivos internos ou não públicos selecionados: ' + invalidIncluded.join(', '));
}

const editorialPayloads = createPublicEditorialPayloads();

if (process.argv.includes('--check')) {
  console.log(
    'Pacote público validado:', publicFiles.length, 'arquivos;',
    editorialPayloads.authorizedCount, 'capítulos autorizados;',
    editorialPayloads.blockedCount, 'mantidos bloqueados com metadados mínimos.'
  );
  process.exit(0);
}

const outputArgIndex = process.argv.indexOf('--output');
const outputArg = outputArgIndex >= 0 ? process.argv[outputArgIndex + 1] : 'dist';
if (!outputArg || outputArg.startsWith('--')) {
  throw new Error('Use --output seguido de um diretório de destino.');
}
const outputDir = path.resolve(root, outputArg);
const rootPrefix = root.endsWith(path.sep) ? root : root + path.sep;
if (outputDir === root || root.startsWith(outputDir + path.sep)) {
  throw new Error('O destino de publicação não pode ser a raiz do repositório nem um diretório-pai dela.');
}
if (fs.existsSync(outputDir)) {
  throw new Error('O diretório de destino já existe; ele não será apagado nem sobrescrito: ' + outputDir);
}

fs.mkdirSync(outputDir, { recursive: true });
try {
  for (const file of publicFiles) {
    const destination = path.join(outputDir, ...file.split('/'));
    fs.mkdirSync(path.dirname(destination), { recursive: true });

    if (file === 'theology-data.js') {
      fs.writeFileSync(
        destination,
        'window.CDP_THEOLOGY = ' + JSON.stringify(editorialPayloads.theology, null, 2) + ';\n',
        'utf8'
      );
      continue;
    }
    if (file === 'publication-control.js') {
      fs.writeFileSync(
        destination,
        'window.CDP_PUBLICATION_CONTROL = ' + JSON.stringify(editorialPayloads.control, null, 2) + ';\n',
        'utf8'
      );
      continue;
    }

    const source = path.resolve(root, file);
    if (!source.startsWith(rootPrefix)) {
      throw new Error('Caminho fora do repositório: ' + file);
    }
    const stat = fs.lstatSync(source);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      throw new Error('Somente arquivos regulares podem ser publicados: ' + file);
    }
    fs.copyFileSync(source, destination);
  }
} catch (error) {
  fs.rmSync(outputDir, { recursive: true, force: true });
  throw error;
}

console.log(
  'Pacote público criado:', publicFiles.length, 'arquivos em', outputDir + ';',
  editorialPayloads.authorizedCount, 'capítulos autorizados;',
  editorialPayloads.blockedCount, 'capítulos com conteúdo restrito.'
);
