import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require = createRequire(import.meta.url);
function load(file, dependencies = {}, globals = {}, suffix = '') {
  const exports = {};
  const code = ts.transpileModule(readFileSync(file, 'utf8') + suffix, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText;
  vm.runInNewContext(code, { exports, URLSearchParams, console, Event, setTimeout, ...globals,
    require: name => name in dependencies ? dependencies[name] : require(name) }, { filename: file });
  return exports;
}
function store(initial = {}) {
  const data = new Map(Object.entries(initial));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
}
const KEY = 'cyber-study-learning-v2';

test('section links retain lesson, parallel unit and module filters', () => {
  const nav = load('src/lib/studyNavigation.ts');
  const lesson = nav.studySectionHref('v2-lab', '#lesson/47');
  assert.equal(lesson, '#lesson/47?section=v2-lab');
  assert.equal(nav.studyRouteHash(lesson), 'lesson/47');
  assert.equal(nav.studySectionId(lesson), 'v2-lab');
  assert.equal(nav.studyRouteHash(nav.studySectionHref('doc-7', '#course/parallel/LOG-01')), 'course/parallel/LOG-01');
  assert.equal(nav.studyRouteHash(nav.studySectionHref('doc-4', '#lessons?mode=main&module=Web')), 'lessons?mode=main&module=Web');
});

test('actual app router accepts chapter deep links without falling back to dashboard', () => {
  const nav = load('src/lib/studyNavigation.ts');
  const browser = { location: { hash: '' } };
  const appDependencies = { './lib/studyNavigation': nav };
  const code = readFileSync('src/App.tsx', 'utf8');
  for (const match of code.matchAll(/from '([^']+)'/g)) {
    if (match[1].startsWith('.') && !(match[1] in appDependencies)) appDependencies[match[1]] = {};
  }
  const app = load('src/App.tsx', appDependencies, { window: browser }, '\nexport { parseHash };');
  for (const [hash, page, id] of [
    ['#lesson/47?section=v2-lab', 'lesson', 47],
    ['#lesson/43?section=laboratorio', 'lesson', 43],
    ['#course/main/1?section=doc-6', 'course-main', 1]
  ]) {
    browser.location.hash = hash;
    assert.equal(app.parseHash().page, page);
    assert.equal(app.parseHash().id, id);
  }
  browser.location.hash = '#course/parallel/LOG-01?section=doc-8';
  assert.equal(app.parseHash().code, 'LOG-01');
  browser.location.hash = '#ai-dev?module=3&step=2';
  assert.equal(app.parseHash().page, 'ai-dev');
});

test('section navigation scrolls and transfers keyboard focus to the requested section', () => {
  const calls = [];
  const element = { scrollIntoView: () => calls.push('scroll'), setAttribute: (name, value) => calls.push(name + '=' + value), focus: () => calls.push('focus') };
  const nav = load('src/lib/studyNavigation.ts', {}, { document: { getElementById: id => id === 'v2-lab' ? element : null } });
  assert.equal(nav.scrollStudySection('v2-lab'), true);
  assert.deepEqual(calls, ['scroll', 'tabindex=-1', 'focus']);
  assert.equal(nav.scrollStudySection('missing'), false);
});

test('resume updates preserve quiz results, completion and other units', () => {
  const storage = store({ [KEY]: JSON.stringify({ 47: { completed: true, quizHistory: [{ score: 90 }], visitedSectionIds: ['v2-problema'] }, 48: { completed: false } }) });
  const progress = load('src/lib/studyProgress.ts', { './accountStorage': { accountStorage: storage } });
  progress.saveStudyVisit('47', { title: 'Cache', href: '#lesson/47', kind: 'interactive', sectionId: 'v2-lab' });
  const saved = JSON.parse(storage.getItem(KEY));
  assert.equal(saved[47].completed, true);
  assert.equal(saved[47].quizHistory[0].score, 90);
  assert.deepEqual(saved[47].visitedSectionIds, ['v2-problema', 'v2-lab']);
  assert.equal(saved[48].completed, false);
  assert.equal(progress.getStudyVisit('47').sectionId, 'v2-lab');
});

test('reading can be recorded and undone without pretending it completed an interactive assessment', () => {
  const storage = store();
  const progress = load('src/lib/studyProgress.ts', { './accountStorage': { accountStorage: storage } });
  const visit = { title: 'Fundamentos', href: '#course/main/1', kind: 'reading', sectionId: 'doc-6' };
  progress.saveStudyVisit('1', visit);
  progress.saveStudyVisit('1', { ...visit, read: true });
  assert.equal(progress.getStudyVisit('1').read, true);
  assert.equal(JSON.parse(storage.getItem(KEY))[1].completed, false);
  progress.saveStudyVisit('1', { ...visit, read: false });
  assert.equal(progress.getStudyVisit('1').read, false);
});

test('parallel and AI drafts survive updates from the existing learning subsystem', () => {
  const storage = store();
  const dependencies = { './accountStorage': { accountStorage: storage } };
  const progress = load('src/lib/studyProgress.ts', dependencies);
  const learning = load('src/lib/learningProgress.ts', dependencies);
  progress.saveStudyVisit('parallel:LOG-01', { title: 'Lógica', href: '#course/parallel/LOG-01', kind: 'reading', sectionId: 'doc-12' });
  progress.saveStudyVisit('ai-dev', { title: 'Projeto', href: '#ai-dev?module=3&step=2', kind: 'ai' }, { moduleId: 3, stepIndex: 2, notes: { 12: 'Rascunho preservado' } });
  learning.markSectionVisited(47, 'v2-revisao');
  assert.equal(progress.getStudyVisit('parallel:LOG-01').sectionId, 'doc-12');
  assert.equal(progress.getStudyDraft('ai-dev').notes[12], 'Rascunho preservado');
  assert.equal(progress.getStudyDraft('ai-dev').stepIndex, 2);
  assert.equal(progress.getStudyVisits().length, 2);
});

test('offline changes remain account-scoped and retry sends the actual saved state', async () => {
  const local = store();
  const remote = new Map();
  let account = 'alice';
  let offline = false;
  const api = async (_path, options = {}) => {
    if (offline) throw Error('offline');
    if (options.method === 'PUT') {
      const { key, value } = JSON.parse(options.body);
      remote.set(account + ':' + key, value);
      return { ok: true, json: async () => ({ ok: true }) };
    }
    return { ok: true, json: async () => ({ state: Object.fromEntries([...remote].filter(([key]) => key.startsWith(account + ':')).map(([key, value]) => [key.slice(account.length + 1), value])) }) };
  };
  const accounts = load('src/lib/accountStorage.ts', {}, { localStorage: local, fetch: api, window: { addEventListener() {}, dispatchEvent() {} } });
  await accounts.activateUserStorage('alice');
  offline = true;
  accounts.accountStorage.setItem(KEY, '{"1":{"study":{"sectionId":"doc-6"}}}');
  assert.equal(await accounts.retryProgressSync(), false);
  assert.equal(accounts.getProgressSyncState().pending, 1);
  assert.ok(accounts.getProgressSyncState().error);
  offline = false;
  assert.equal(await accounts.retryProgressSync(), true);
  assert.equal(remote.get('alice:' + KEY), accounts.accountStorage.getItem(KEY));
  account = 'bob';
  await accounts.activateUserStorage('bob');
  assert.equal(accounts.accountStorage.getItem(KEY), null);
  account = 'alice';
  await accounts.activateUserStorage('alice');
  assert.equal(JSON.parse(accounts.accountStorage.getItem(KEY))[1].study.sectionId, 'doc-6');
});


test('AI migration retains legacy notes while the account version wins conflicts', () => {
  const local = store({ 'hub-ai-dev-learning-v2:alice': JSON.stringify({ completed: [1], notes: { 4: 'local draft', 8: 'older' }, checked: { 4: [0] } }) });
  const remote = { completed: [2], notes: { 8: 'account draft' }, checked: { 8: [1] }, moduleId: 3, stepIndex: 2 };
  const ai = load('src/trails/ai-dev/AiDevelopmentTrail.tsx', {
    './manifest.json': JSON.parse(readFileSync('src/trails/ai-dev/manifest.json')),
    './modules.json': JSON.parse(readFileSync('src/trails/ai-dev/modules.json')),
    './ai-dev.css': {}, '../../components/ProgressSyncStatus': {},
    '../../lib/studyProgress': { getStudyDraft: () => remote }
  }, { localStorage: local, window: { location: { hash: '#ai-dev' } } }, '\nexport { initial, initialPosition };');
  const merged = ai.initial('alice');
  assert.equal(merged.notes[4], 'local draft');
  assert.equal(merged.notes[8], 'account draft');
  assert.deepEqual(Array.from(merged.completed).sort(), [1, 2]);
  assert.equal(ai.initialPosition(merged).moduleId, 3);
  assert.equal(ai.initialPosition(merged).stepIndex, 2);
  assert.ok(local.getItem('hub-ai-dev-learning-v2:alice'), 'legacy backup must remain intact');
});


test('the mobile outline renders route-preserving links too', () => {
  const browser = { location: { hash: '#lesson/47' } };
  const nav = load('src/lib/studyNavigation.ts', {}, { window: browser });
  const deps = { '../../lib/studyNavigation': nav };
  const source = readFileSync('src/components/lesson-v2/LessonViewerV2.tsx', 'utf8');
  for (const match of source.matchAll(/(?:from |import )'([^']+)'/g)) {
    if (match[1].startsWith('.') && !(match[1] in deps)) deps[match[1]] = {};
  }
  const { MobileOutline } = load('src/components/lesson-v2/LessonViewerV2.tsx', deps, {}, '\nexport { MobileOutline };');
  const html = renderToStaticMarkup(createElement(MobileOutline, { sections: [{ id: 'v2-lab', label: 'Laboratório' }], activeSection: 'v2-lab', visitedSections: new Set() }));
  assert.ok(html.includes('href="#lesson/47?section=v2-lab"'));
  assert.ok(!html.includes('href="#v2-lab"'));
});


test('a completed interactive lesson is not presented as the module continuation', () => {
  const catalog = JSON.parse(readFileSync('src/curriculum/catalog.json'));
  const source = readFileSync('src/components/curriculum/CurriculumBrowser.tsx', 'utf8');
  const deps = {};
  for (const match of source.matchAll(/(?:from |import )'([^']+)'/g)) {
    if (match[1].startsWith('.')) deps[match[1]] = {};
  }
  Object.assign(deps, {
    '../../curriculum/catalog.json': catalog,
    '../../data/lessons': { lessons: [] },
    '../../content/registry': { listNativeV2LessonIds: () => [47] },
    '../../lib/curriculumState': { getActiveParallelTracks: () => [] },
    '../../lib/learningProgress': { getLearningProgress: () => ({ 47: { completed: true } }) },
    '../../lib/storage': { getLessonState: () => ({}) },
    '../../lib/courseStudyMetadata': { lessonDurationLabel: () => '60 min', moduleObjectives: {} },
    '../../lib/studyProgress': { getStudyVisits: () => [{ key: '47', href: '#lesson/47', title: 'Cache', kind: 'interactive' }] }
  });
  const { CurriculumBrowser } = load('src/components/curriculum/CurriculumBrowser.tsx', deps);
  const html = renderToStaticMarkup(createElement(CurriculumBrowser, { initialMode: 'main', initialModule: 'Web e AppSec avançado' }));
  assert.ok(html.includes('Concluída'));
  assert.ok(!html.includes('class="study-module-continue"'));
});
