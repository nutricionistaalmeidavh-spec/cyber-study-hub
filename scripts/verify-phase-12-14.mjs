import fs from 'node:fs';
import path from 'node:path';

const errors = [];

const checks = [
  ['src/components/curriculum/CurriculumBrowser.tsx', ['groupBy(catalog.main', 'groupBy(catalog.parallel', 'moduleHref', 'getActiveParallelTracks', 'listNativeV2LessonIds']],
  ['src/components/curriculum/CourseDocumentViewer.tsx', ['MarkdownDocument', 'ReferencePanel', 'fetch(academyPublicHref(item.contentPath', 'contentPath']],
  ['src/content/references/integrations.json', ['web-appsec', 'api-security', 'blue-purple', 'malware-detection']],
  ['src/components/references/ReferencePanel.tsx', ['safeUse', 'license', 'resolveCurriculumReferences']],
  ['src/content/registry.ts', ['lesson48Data', 'lesson60Data', '60: lesson60Data as LessonV2']],
  ['src/App.tsx', ["course-main", "course-parallel", 'CourseDocumentViewer']],
  ['src/components/Lessons.tsx', ['CurriculumBrowser', 'LegacyLessonList']]
];

for (const [file, needles] of checks) {
  if (!fs.existsSync(file)) {
    errors.push(`${file}: ausente`);
    continue;
  }
  const source = fs.readFileSync(file, 'utf8');
  for (const needle of needles) {
    if (!source.includes(needle)) errors.push(`${file}: não contém "${needle}"`);
  }
}

validateCatalog();
validateIntegrations();
validateNativeBatch();
validateLab47();

if (errors.length) {
  console.error('Phase 12–14 verification FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Phase 12–14 verification OK — catálogo 543 consistente, conteúdo lazy presente, referências válidas e lote V2 47–60 completo.');

function validateCatalog() {
  const file = 'src/curriculum/catalog.json';
  if (!fs.existsSync(file)) {
    errors.push(`${file}: ausente`);
    return;
  }

  let catalog;
  try {
    catalog = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`${file}: JSON inválido: ${error.message}`);
    return;
  }

  if (catalog.main?.length !== 218) errors.push(`catalog.main: esperado 218, encontrado ${catalog.main?.length ?? 0}`);
  if (catalog.parallel?.length !== 325) errors.push(`catalog.parallel: esperado 325, encontrado ${catalog.parallel?.length ?? 0}`);

  const mainIds = (catalog.main ?? []).map(item => item.id);
  const parallelCodes = (catalog.parallel ?? []).map(item => item.code);
  if (new Set(mainIds).size !== mainIds.length) errors.push('catalog.main contém IDs duplicados.');
  if (new Set(parallelCodes).size !== parallelCodes.length) errors.push('catalog.parallel contém códigos duplicados.');
  if (mainIds[0] !== 1 || mainIds.at(-1) !== 218) errors.push('catalog.main não cobre 1–218 em ordem.');

  for (const item of [...(catalog.main ?? []), ...(catalog.parallel ?? [])]) {
    const relative = String(item.contentPath || '').replace(/^\//, '');
    const filePath = path.join('public', relative.replace(/^course-library\//, 'course-library/'));
    if (!relative.startsWith('course-library/')) {
      errors.push(`${item.code ?? item.id}: contentPath fora de /course-library/.`);
      continue;
    }
    if (!fs.existsSync(filePath)) errors.push(`${item.code ?? item.id}: conteúdo lazy ausente em ${filePath}.`);
  }
}

function validateIntegrations() {
  const repoFile = 'src/content/references/repositories.json';
  const integrationFile = 'src/content/references/integrations.json';
  if (!fs.existsSync(repoFile) || !fs.existsSync(integrationFile)) return;

  try {
    const repos = JSON.parse(fs.readFileSync(repoFile, 'utf8'));
    const integrations = JSON.parse(fs.readFileSync(integrationFile, 'utf8'));
    const repoIds = new Set((repos.repositories ?? []).map(item => item.id));
    const usedIds = [
      ...(integrations.mainRules ?? []).flatMap(rule => rule.repositoryIds ?? []),
      ...(integrations.parallelRules ?? []).flatMap(rule => rule.repositoryIds ?? [])
    ];
    for (const id of usedIds) {
      if (!repoIds.has(id)) errors.push(`integração referencia repositório inexistente: ${id}`);
    }
  } catch (error) {
    errors.push(`catálogo de integrações inválido: ${error.message}`);
  }
}

function validateNativeBatch() {
  for (let id = 47; id <= 60; id += 1) {
    const file = `src/content/main/${String(id).padStart(3, '0')}/lesson.json`;
    if (!fs.existsSync(file)) {
      errors.push(`${file}: aula V2 migrada ausente`);
      continue;
    }
    try {
      const lesson = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (lesson.id !== id || lesson.schemaVersion !== 2) errors.push(`${file}: id/schema inconsistente.`);
      if ((lesson.review?.quiz?.length ?? 0) < 5) errors.push(`${file}: menos de 5 questões.`);
      if ((lesson.review?.flashcards?.length ?? 0) < 6) errors.push(`${file}: menos de 6 flashcards.`);
    } catch (error) {
      errors.push(`${file}: JSON inválido: ${error.message}`);
    }
  }
}

function validateLab47() {
  const files = ['README.md', 'origin.mjs', 'proxy-vulneravel.mjs', 'proxy-corrigido.mjs', 'package.json'];
  for (const file of files) {
    const target = path.join('public', 'course-labs', 'aula-047', file);
    if (!fs.existsSync(target)) errors.push(`Lab 47: arquivo ausente ${target}`);
  }
}
