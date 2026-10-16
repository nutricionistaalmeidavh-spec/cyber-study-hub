import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => readFileSync(file, 'utf8');
const css = read('src/components/hub-editorial.css');
const main = read('src/main.tsx');
const home = read('src/components/Dashboard.tsx');
const curriculum = read('src/components/curriculum/CurriculumBrowser.tsx');
const games = read('src/components/Games.tsx');
const materials = read('src/components/Materials.tsx');
const app = read('src/App.tsx');

test('ArtiSys editorial stylesheet is imported after base and lesson styles', () => {
  assert.match(main, /import '\.\/styles\.css';\s*import '\.\/components\/lesson-editorial\.css';\s*import '\.\/components\/hub-editorial\.css';/);
  for (const selector of ['.hub-home', '.curriculum-page', '.games-page', '.materials-page', '.mobile-nav']) {
    assert.ok(css.includes(selector), 'Missing themed surface: ' + selector);
  }
  for (const color of ['#0a0716','#faf8fd','#8745f7','#7037ad']) {
    assert.ok(css.includes(color), 'Missing canonical ArtiSys color: ' + color);
  }
  assert.doesNotMatch(css, /@import|url\(https?:|@font-face/i);
});

test('home remains learner-first: real progress, modules, links and recommendation', () => {
  assert.match(home, /catalog\.main\[0\]/);
  assert.match(home, /getLearningProgress\(\)/);
  assert.match(home, /getReviewStats\(\)/);
  assert.match(home, /getActiveParallelTracks\(\)/);
  assert.match(home, /mainModuleCount/);
  assert.match(home, /parallelModuleCount/);
  assert.ok(home.indexOf('hub-home-journeys') < home.indexOf('hub-home-stats'));
  for (const destination of ['#lessons?mode=main','#lessons?mode=parallel','#review','#games','#ai-dev']) {
    assert.ok(home.includes(destination), 'Missing home link: ' + destination);
  }
});

test('curriculum keeps module-first deep links and compact learning index', () => {
  assert.match(curriculum, /curriculum-module-card/);
  assert.match(curriculum, /curriculum-module-detail/);
  assert.match(curriculum, /Sumário deste módulo/);
  assert.match(curriculum, /#lesson\//);
  assert.match(curriculum, /#course\/main\//);
  assert.match(curriculum, /#course\/parallel\//);
  assert.match(curriculum, /slice\(0, visibleCount\)/);
  assert.match(curriculum, /toggleParallelCode/);
});

test('games present all four selectable practice modes without changing game mechanics', () => {
  for (const game of ['crossword','matching','ordering','scenario']) {
    assert.ok(games.includes("type: '"+game+"'"), 'Missing mode ' + game);
  }
  assert.match(games, /aria-pressed=\{mode===item\.type\}/);
  assert.match(games, /setMode\(current=>current===item\.type\?null:item\.type\)/);
  assert.match(games, /getGameProgress\(\)/);
  assert.match(games, /saveGameProgress\(/);
  assert.match(games, /#game\//);
  assert.match(games, /aria-pressed=\{track===t\}/);
});

test('materials preserve original file links and use real categories and counts', () => {
  assert.match(materials, /category==='Todos'\?materials:materials\.filter/);
  assert.match(materials, /materials\.filter\(m=>m\.category===c\)\.length/);
  assert.match(materials, /filtered\.map\(/);
  assert.match(materials, /'#material\/'\+m\.id/);
  assert.ok(materials.includes('href={academyPublicHref(material.href)}'));
  assert.match(materials, /driveFolderUrl/);
  assert.match(materials, /rel="noopener noreferrer"/);
});

test('mobile navigation and browser routes remain unchanged; reduced motion respected', () => {
  for (const destination of ['#dashboard','#lessons','#games','#materials','#review','#account']) {
    assert.ok(app.includes(destination), 'Missing route: ' + destination);
  }
  assert.match(app, /aria-current=\{active\?'page':undefined\}/);
  assert.match(css, /max-width:780px/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  const config = read('wrangler.toml');
  assert.match(config, /main\s*=\s*"src\/worker\/index\.mjs"/);
  assert.match(config, /run_worker_first\s*=\s*true/);
});
