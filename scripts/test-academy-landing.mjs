import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('academy is a public route, evaluated before account gate', () => {
  const app = read('src/App.tsx');
  const route = app.indexOf('isAcademyPath(window.location.pathname)');
  const gate = app.indexOf('<PlatformGate>');
  assert.ok(route > -1, 'academy route should exist');
  assert.ok(gate > route, 'public academy should not require a logged-in account');
  assert.match(app, /AcademyLanding/);
});

test('academy page includes real curriculum and working navigation targets', () => {
  const source = read('src/components/AcademyLanding.tsx');
  const css = read('src/components/academy.css');
  for (const anchor of ['trilhas', 'metodo', 'assinaturas', 'perguntas']) {
    assert.match(source, new RegExp('id="' + anchor + '"'));
    assert.match(source, new RegExp('href="#' + anchor + '"'));
  }
  assert.match(source, /waitlistCatalogCourses\.map/);
  assert.match(source, /course\.modules\.map/);
  assert.doesNotMatch(source, /academy-catalog-panel|academy-available-modules|academy-module-grid/);
  assert.match(source, /href="\/"/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
});

test('academy is transparent about subscriptions without claiming enabled billing', () => {
  const source = read('src/components/AcademyLanding.tsx');
  assert.match(source, /assinaturas em preparação/i);
  assert.doesNotMatch(source, /\/api\/(checkout|payment|subscribe)|stripe\.com|mercadopago/i);
  assert.match(source, /sem API paga obrigatória/i);
});

test('vitrine pública expande os módulos reais de cada curso sem duplicar catálogo', async () => {
  const {createRequire} = await import('node:module');
  const {createElement} = await import('react');
  const {renderToStaticMarkup} = await import('react-dom/server');
  const ts = await import('typescript');
  const vm = await import('node:vm');
  const require = createRequire(import.meta.url);
  const allCourses = JSON.parse(read('src/curriculum/courses.json')).courses;
  const courses = allCourses.filter(c => c.status === 'published');
  const visibleCourses = allCourses.filter(c => c.status === 'published'||c.id==='engenharia-reversa-com-ia');
  const exported = {};
  const mocks = {
    '../curriculum/courseOfferings': {publishedCourses:courses,waitlistCatalogCourses:visibleCourses},
    '../lib/studyInventory': {studyInventory:{totalSteps:639,canonical:639,legacyCanonical:543,guided:96}},
    './useAcademyMotion': {useAcademyMotion:()=>undefined},
    './AcademyBrand': {default:()=>createElement('span',null,'Academy')},
    './AcademyWaitlist': {default:()=>createElement('div',{id:'lista-de-espera'})},
    './academy.css': {}, './academy-motion.css': {}
  };
  const output = ts.transpileModule(read('src/components/AcademyLanding.tsx'), {
    compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}
  }).outputText;
  vm.runInNewContext(output,{exports:exported,require:name=>name in mocks?mocks[name]:require(name)});
  const html = renderToStaticMarkup(createElement(exported.default));
  assert.equal((html.match(/<details class="academy-course-card"/g)||[]).length,visibleCourses.length);
  assert.equal((html.match(/class="academy-course-module"/g)||[]).length,
    visibleCourses.reduce((total,c)=>total+c.modules.length,0));
  const escaped = value=>value.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
  for(const course of visibleCourses){
    assert.ok(html.includes(escaped(course.title)),course.id+' should be visible');
    for(const module of course.modules)
      assert.ok(html.includes(escaped(module.title)),course.id+' should list '+module.id);
    assert.ok(html.includes('/academy?curso='+encodeURIComponent(course.id)+'#lista-de-espera'),
      course.id+' should lead to selected waitlist');
  }
  assert.doesNotMatch(html,/Explore também os módulos publicados|17 módulos no catálogo/);
  assert.match(html,/Curso individual/);
  assert.match(html,/Lista de espera/);
  assert.match(html,/Entrar na lista de espera/);
});

test('clicking a course waits for the selected canonical offering, not general Academy',()=>{
  const landing=read('src/components/AcademyLanding.tsx');
  const waitlist=read('src/components/AcademyWaitlist.tsx');
  assert.match(landing,/chooseWaitlistCourse\(event, course\.id\)/);
  assert.match(landing,/selectedCourseId=\{waitlistCourseId\}/);
  assert.match(landing,/replaceState\(null, '', '\/academy\?curso='/);
  assert.match(waitlist,/setCourseId\(selectedCourseId\)/);
  assert.match(waitlist,/waitlistCatalogCourses\.some\(c=>c\.id===selectedCourseId\)/);
  assert.match(landing,/>Lista de espera<\/span>/);
});

test('preview de Engenharia Reversa com IA preserva status draft e módulos canônicos',()=>{
  const offers=JSON.parse(read('src/curriculum/courses.json')).courses;
  const reverse=offers.find(c=>c.id==='engenharia-reversa-com-ia');
  const available=read('src/curriculum/courseOfferings.ts');
  const waitlist=read('src/components/AcademyWaitlist.tsx');
  const access=read('src/worker/course-access.mjs');
  assert.equal(reverse.status,'draft');
  assert.equal(reverse.modules.length,8);
  assert.equal(reverse.modules.reduce((sum,module)=>sum+module.lessonCodes.length,0),32);
  assert.match(available,/waitlistCatalogCourses/);
  assert.match(waitlist,/waitlistCatalogCourses\.map/);
  assert.match(access,/offers\.courses\.filter\(c => c\.status === 'published'\)/);
});
test('preço mensal editável apenas na API de administração, sem cobrança automática no site',()=>{
  const landing=read('src/components/AcademyLanding.tsx');
  const editor=read('src/components/SubscriptionOfferAdmin.tsx');
  assert.match(landing,/\/api\/subscription\/offer/);
  assert.match(landing,/monthlyPrice\/100/);
  assert.match(editor,/\/api\/admin\/subscription\/offer/);
  assert.match(read('server/platform.mjs'),/subscriptionOfferRoute/);
  assert.match(read('src/worker/index.mjs'),/subscriptionOfferRoute/);
  assert.doesNotMatch(landing,/\/api\/(?:billing\/purchase-intent|checkout)/);
});
