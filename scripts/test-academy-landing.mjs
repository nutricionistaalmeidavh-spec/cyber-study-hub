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
  assert.match(source, /AcademyCourseCards/);
  assert.match(source, /waitlistCatalogCourses/);
  assert.doesNotMatch(source, /academy-catalog-panel|academy-module-grid/);
  assert.match(source, /href="\/"/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
});

test('academy is transparent about subscriptions without claiming enabled billing', () => {
  const source = read('src/components/AcademyLanding.tsx');
  assert.match(source, /Inscrições em lista de espera/i);
  assert.doesNotMatch(source, /\/api\/(checkout|payment|subscribe)|stripe\.com|mercadopago/i);
  assert.match(source, /sem API paga obrigatória/i);
});

test('Engenharia Reversa com IA aparece apenas na vitrine e na lista de espera, não nos direitos de leitura',()=>{
  const catalog=JSON.parse(read('src/curriculum/courses.json')).courses;
  const reverse=catalog.find(c=>c.id==='engenharia-reversa-com-ia');
  const frontend=read('src/curriculum/courseOfferings.ts');
  const cards=read('src/components/AcademyCourseCards.tsx');
  const waitlist=read('src/components/AcademyWaitlist.tsx');
  const access=read('src/worker/course-access.mjs');
  assert.equal(reverse.status,'draft');
  assert.equal(reverse.modules.length,8);
  assert.equal(reverse.modules.reduce((n,m)=>n+m.lessonCodes.length,0),32);
  assert.match(frontend,/waitlistCatalogCourses/);
  assert.match(cards,/waitlistCatalogCourses\.map/);
  assert.match(cards,/course\.modules\.map/);
  assert.match(cards,/course\.status==='draft'/);
  assert.match(waitlist,/waitlistCatalogCourses\.map/);
  assert.match(access,/course\.status === 'published'/);
});

test('assinatura tem preço editável por admin, sem checkout automático na landing',()=>{
  const landing=read('src/components/AcademyLanding.tsx');
  const admin=read('src/components/SubscriptionOfferAdmin.tsx');
  const node=read('server/platform.mjs');
  const cloud=read('src/worker/index.mjs');
  assert.match(landing,/\/api\/subscription\/offer/);
  assert.match(landing,/monthlyPrice\/100/);
  assert.match(admin,/\/api\/admin\/subscription\/offer/);
  assert.match(node,/subscriptionOfferRoute/);
  assert.match(cloud,/subscriptionOfferRoute/);
  assert.doesNotMatch(landing,/\/api\/(?:billing\/purchase-intent|checkout)/);
});
