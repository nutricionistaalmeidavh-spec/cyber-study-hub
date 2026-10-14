import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');
const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const manifest = read('src/trails/ai-dev/manifest.json');
const pilot = read('src/trails/ai-dev/pilot.json');
const catalog = read('src/curriculum/catalog.json');
const all = [...catalog.main, ...catalog.parallel];

assert.equal(catalog.main.length, 218, 'A biblioteca principal deve ser preservada');
assert.equal(catalog.parallel.length, 325, 'A biblioteca paralela deve ser preservada');
assert.equal(manifest.modules.length, 8);
assert.equal(manifest.totalSteps, 32);
assert.equal(manifest.newMicroLessons, 16);
assert.equal(manifest.reusedReferences, 8);
assert.equal(manifest.newLabs, 8);

const ids = [];
const referenced = new Set();
for (const module of manifest.modules) {
  assert.equal(module.steps.length, 4, 'Módulo ' + module.id + ' deve ter quatro etapas');
  assert.deepEqual(module.steps.map(step => step.type), ['microaula', 'microaula-ia', 'referencia', 'laboratorio']);
  for (const step of module.steps) ids.push(step.id);
  const ref = all.find(item => item.code === module.reusedLessonCode);
  assert.ok(ref && ref.kind === 'parallel', 'Referência não canônica: ' + module.reusedLessonCode);
  assert.ok(!referenced.has(ref.code), 'Aula duplicada na trilha: ' + ref.code);
  assert.ok(existsSync(resolve(root, 'public' + ref.contentPath)), 'Aula referenciada sem arquivo: ' + ref.code);
  referenced.add(ref.code);
}
assert.deepEqual(ids, Array.from({ length: 32 }, (_, i) => i + 1));
assert.equal(manifest.modules.filter(module => module.status === 'pilot').length, 1);
assert.equal(manifest.modules[0].id, pilot.moduleId);
assert.deepEqual(pilot.lessons.map(lesson => lesson.stepId), [1, 2, 3, 4]);
assert.equal(pilot.lessons[2].referenceCode, manifest.modules[0].reusedLessonCode);
assert.equal(pilot.lessons[2].referencePath, '#course/parallel/' + pilot.lessons[2].referenceCode);
assert.ok(pilot.lessons[0].challenge.options.length >= 3);
assert.ok(Number.isInteger(pilot.lessons[0].challenge.answer));
assert.ok(pilot.lessons[1].prompt.includes('Não use serviços pagos'));
assert.ok(pilot.lessons[3].acceptance.length === 4);
const starter = resolve(root, 'public/course-labs/ai-dev-meu-gestor/starter.html');
assert.ok(existsSync(starter));
const html = readFileSync(starter, 'utf8');
assert.ok(html.includes('pendente') && html.includes('em andamento') && html.includes('concluído'));
assert.ok(!/<script[^>]+src=/i.test(html), 'Starter não pode depender de script externo');
assert.ok(!/\b(fetch|XMLHttpRequest)\s*\(/.test(html), 'Starter não deve transmitir dados');
assert.ok(existsSync(resolve(root, 'public/course-labs/ai-dev-meu-gestor/README.md')));
console.log('Trilha IA validada: 8 módulos, 32 etapas, 8 referências canônicas e piloto M01.');
