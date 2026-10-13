import fs from 'node:fs';
import path from 'node:path';
import {
  extractLegacyLessonIds,
  listLessonJsonFiles,
  validateLesson
} from './lib/curriculum-validator.mjs';

const cwd = process.cwd();
const contentRoot = path.join(cwd, 'src', 'content', 'main');
const legacyPath = path.join(cwd, 'src', 'data', 'lessons.ts');
const referencesPath = path.join(cwd, 'src', 'content', 'references', 'repositories.json');

const errors = [];

if (!fs.existsSync(legacyPath)) {
  errors.push('Arquivo legado src/data/lessons.ts não encontrado.');
}

const legacySource = fs.existsSync(legacyPath) ? fs.readFileSync(legacyPath, 'utf8') : '';
const legacyIds = extractLegacyLessonIds(legacySource);
const legacyDuplicates = duplicateValues(legacyIds);
if (legacyDuplicates.length) {
  errors.push(`IDs duplicados no conteúdo legado: ${legacyDuplicates.join(', ')}`);
}

let referenceCatalog = new Set();
if (fs.existsSync(referencesPath)) {
  try {
    const catalog = JSON.parse(fs.readFileSync(referencesPath, 'utf8'));
    const ids = (catalog.repositories ?? []).map(item => item.id);
    const duplicates = duplicateValues(ids);
    if (duplicates.length) errors.push(`IDs duplicados no catálogo de referências: ${duplicates.join(', ')}`);
    referenceCatalog = new Set(ids);
  } catch (error) {
    errors.push(`Catálogo de referências inválido: ${error.message}`);
  }
} else {
  errors.push('Catálogo src/content/references/repositories.json não encontrado.');
}

const files = listLessonJsonFiles(contentRoot);
if (!files.length) errors.push('Nenhuma aula v2 encontrada em src/content/main/**/lesson.json.');

const v2Ids = [];
for (const file of files) {
  try {
    const lesson = JSON.parse(fs.readFileSync(file, 'utf8'));
    v2Ids.push(lesson.id);
    errors.push(...validateLesson(lesson, referenceCatalog).map(error => `${path.relative(cwd, file)} — ${error}`));
  } catch (error) {
    errors.push(`${path.relative(cwd, file)} — JSON inválido: ${error.message}`);
  }
}

const v2Duplicates = duplicateValues(v2Ids);
if (v2Duplicates.length) errors.push(`IDs duplicados entre aulas v2: ${v2Duplicates.join(', ')}`);

for (const id of v2Ids) {
  if (!legacyIds.includes(id)) {
    errors.push(`Aula v2 ${id} ainda não existe no índice legado. Nesta fase, v2 deve funcionar como override compatível.`);
  }
}

if (errors.length) {
  console.error('Curriculum validation FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Curriculum validation OK — ${legacyIds.length} aulas legadas, ${v2Ids.length} aula(s) v2 nativa(s), ${referenceCatalog.size} referência(s) catalogada(s).`);

function duplicateValues(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}
