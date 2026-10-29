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

if (process.argv.includes('--check')) {
  console.log('Pacote público validado:', publicFiles.length, 'arquivos; diretórios internos e documentos de auditoria excluídos.');
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
    const source = path.resolve(root, file);
    if (!source.startsWith(rootPrefix)) {
      throw new Error('Caminho fora do repositório: ' + file);
    }
    const stat = fs.lstatSync(source);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      throw new Error('Somente arquivos regulares podem ser publicados: ' + file);
    }
    const destination = path.join(outputDir, ...file.split('/'));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
} catch (error) {
  fs.rmSync(outputDir, { recursive: true, force: true });
  throw error;
}

console.log('Pacote público criado:', publicFiles.length, 'arquivos em', outputDir);
