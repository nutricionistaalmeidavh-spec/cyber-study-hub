import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const app = read('src/App.tsx');
const academy = read('src/components/AcademyLanding.tsx');
const css = read('src/components/hub-editorial.css');

test('Academy public desktop and mobile menus expose roadmap and improvements', () => {
  const desktop = academy.split('<nav className="academy-desktop-nav"')[1]?.split('</nav>')[0] ?? '';
  const mobile = academy.split('<nav aria-label="Navegação móvel">')[1]?.split('</nav>')[0] ?? '';
  assert.match(desktop, /href="\/roadmap"/, 'Missing public desktop navigation link to voting');
  assert.match(mobile, /href="\/roadmap"/, 'Missing public mobile navigation link to voting');
});

test('Hub mobile menu exposes feedback, voting and admin-only feedback moderation', () => {
  const mobile = app.split('<nav className="mobile-nav">')[1]?.split('</nav>')[0] ?? '';
  assert.match(mobile, /<details key=\{route\.page\} className="mobile-nav-more">/);
  assert.match(mobile, /href="#feedback"/);
  assert.match(mobile, /href="#roadmap"/);
  assert.match(mobile, /\{user\.role==='admin'\s*&&\s*<Nav href="#admin\/feedback"/);
  assert.match(mobile, /<summary[^>]+aria-label="Mais opções: materiais, revisão e comunidade"/);
});

test('Mobile bottom bar has exactly five slots; Materials and Review appear only inside Mais', () => {
  const mobile = app.split('<nav className="mobile-nav">')[1]?.split('</nav>')[0] ?? '';
  const [primary, more = ''] = mobile.split('<div className="mobile-nav-more-panel">');
  const primaryLinks = [...primary.matchAll(/<Nav href="#([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(primaryLinks, ['dashboard','courses','games','account']);
  assert.match(primary, /<details key=\{route\.page\} className="mobile-nav-more">/);
  assert.doesNotMatch(primary, /href="#(?:materials|review)"/);
  assert.match(more, /<Nav href="#materials"[^>]+label="Materiais"/);
  assert.match(more, /<Nav href="#review"[^>]+label="Revisão"/);
  for (const route of ['#feedback','#roadmap']) {
    assert.ok(more.includes('href="'+route+'"'), 'Missing Mais destination: '+route);
  }
});

test('Mobile navigation remains a single row and popup stays inside viewport', () => {
  assert.match(css, /@media\(max-width:780px\)\{[\s\S]*?\.app-shell \.mobile-nav\{grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(css, /\.mobile-nav-more-panel\{[\s\S]*?right:0;/);
  assert.match(css, /\.mobile-nav-more summary:focus-visible/);
  assert.match(css, /\.mobile-nav-more-panel \.nav-item b\{font-size:13px\}/);
});
