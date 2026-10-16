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
  assert.match(source, /assinaturas em preparação/i);
  assert.doesNotMatch(source, /\/api\/(checkout|payment|subscribe)|stripe\.com|mercadopago/i);
  assert.match(source, /sem API paga obrigatória/i);
});
