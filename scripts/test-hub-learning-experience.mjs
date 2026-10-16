import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(path, 'utf8');
const catalog = JSON.parse(read('src/curriculum/catalog.json'));

test('canonical curriculum and real beginner entry', () => {
  assert.equal(catalog.main.length, 218);
  assert.equal(catalog.parallel.length, 325);
  assert.equal(catalog.main[0].id, 1);
  const home = read('src/components/Dashboard.tsx');
  assert.match(home, /catalog\.main\[0\]/);
  assert.match(home, /getLearningProgress\(\)/);
  assert.match(home, /getReviewStats\(\)/);
  assert.match(home, /getActiveParallelTracks\(\)/);
  assert.match(home, /interactiveLessons\.length/);
  assert.match(home, /mainModuleCount/);
  assert.match(home, /parallelModuleCount/);
  assert.match(home, /Módulos de estudo/);
  assert.doesNotMatch(home, /Aulas 43[–-]100|Continuar na aula 43/);
});

test('deep links, incremental search and empty-state recovery', () => {
  const app = read('src/App.tsx');
  const browser = read('src/components/curriculum/CurriculumBrowser.tsx');
  assert.match(app, /params\.get\('mode'\)/);
  assert.match(app, /initialMode=\{route\.mode\}/);
  assert.match(app, /initialModule=\{route\.module\}/);
  assert.match(browser, /initialMode = 'main'/);
  assert.match(browser, /selectedMain/);
  assert.match(browser, /selectedParallel/);
  assert.match(browser, /slice\(0, visibleCount\)/);
  assert.match(browser, /count => count \+ 24/);
  assert.match(browser, /Limpar busca e filtros/);
  assert.match(browser, /'Escolha o que estudar'/);
  assert.match(browser, /AULAS DO MÓDULO/);
  assert.match(browser, /Voltar aos módulos/);
  assert.match(browser, /Mostrando /);
});

test('mobile navigation retains all routes and accessible active state', () => {
  const app = read('src/App.tsx');
  const css = read('src/styles.css');
  for (const route of ['#dashboard', '#lessons', '#games', '#materials', '#review', '#account'])
    assert.ok(app.includes(route), 'Missing route ' + route);
  assert.match(app, /aria-current=\{active\?'page':undefined\}/);
  assert.match(css, /env\(safe-area-inset-bottom/);
});

test('module cards show only a short title, estimated time and real state', () => {
  const browser = read('src/components/curriculum/CurriculumBrowser.tsx');
  const home = read('src/components/Dashboard.tsx');
  const academy = read('src/components/AcademyLanding.tsx');
  const presentation = read('src/lib/modulePresentation.ts');
  const css = read('src/components/hub-editorial.css');

  assert.match(browser, /moduleDisplayTitle\(name\)/);
  assert.match(browser, /duration=\{mainStudyTime/);
  assert.match(browser, /duration=\{parallelStudyTime/);
  assert.doesNotMatch(browser, /count=\{group\.items\.length\} unit=/);
  assert.doesNotMatch(browser, /Comece por: /);
  assert.doesNotMatch(home, /\{catalog\.main\.length\} aulas/);
  assert.doesNotMatch(home, /32 etapas com laboratórios/);
  assert.match(academy, /course\\.modules\\.map/);
  assert.match(academy, /academy-course-module/);
  assert.match(presentation, /unitCount \* 25/);
  assert.match(presentation, /unitCount \* 40/);
  assert.match(css, /\.hub-home \.hub-journey:nth-child\(3\),/);
  assert.match(css, /rgba\(241,233,251,\.94\)/);
});
