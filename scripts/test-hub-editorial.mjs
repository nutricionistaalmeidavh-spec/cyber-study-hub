import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const css = read('src/components/hub-editorial.css');
const main = read('src/main.tsx');
const home = read('src/components/Dashboard.tsx');
const browser = read('src/components/curriculum/CurriculumBrowser.tsx');
const games = read('src/components/Games.tsx');
const materials = read('src/components/Materials.tsx');
const wrangler = read('wrangler.toml');
const pkg = JSON.parse(read('package.json'));

test('same ArtiSys palette across four areas with no external font or paid service', () => {
  for (const name of ['hub-home','curriculum-page','games-page','materials-page'])
    assert.match(css, new RegExp(name));
  for (const color of ['#0a0716','#faf8fd','#7037ad','#8745f7','#c89dff'])
    assert.ok(css.includes(color), color + ' missing');
  assert.match(main, /import '\.\/components\/lesson-editorial\.css';\s*import '\.\/components\/hub-editorial\.css';/);
  assert.doesNotMatch(css, /@import|@font-face|url\(https?:/i);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
});

test('home keeps the canonical recommendation and prioritizes modules before metrics', () => {
  assert.ok(home.indexOf('className="hub-home-journeys"') < home.indexOf('className="hub-home-stats"'));
  assert.match(home, /recommendedId = unfinished\?\.id \?\? nextInteractive\?\.id \?\? catalog\.main\[0\]\?\.id/);
  assert.match(home, /hrefForLesson\(recommended\.id\)/);
  assert.match(home, /#lessons\?mode=main/);
  assert.match(home, /#lessons\?mode=parallel/);
  assert.match(home, /#ai-dev/);
});

test('curriculum retains module-first navigation and labels only real interactive routes', () => {
  assert.match(browser, /groupBy\(catalog\.main, item => item\.block\)/);
  assert.match(browser, /groupBy\(catalog\.parallel, item => item\.track\)/);
  assert.match(browser, /'Sumário deste módulo'/);
  assert.match(browser, /slice\(0, visibleCount\)/);
  assert.match(browser, /interactive \? '#lesson\/' \+ item\.id : '#course\/main\/' \+ item\.id/);
  assert.match(browser, /'Leitura'/);
  assert.match(css, /\.curriculum-page \.curriculum-row/);
});

test('games choose one of four real game types with non-destructive filters and progress', () => {
  for (const mode of ['crossword','matching','ordering','scenario'])
    assert.match(games,new RegExp("type: '"+mode+"'"));
  assert.match(games, /aria-pressed=\{mode===item\.type\}/);
  assert.match(games, /setMode\(current=>current===item\.type\?null:item\.type\)/);
  assert.match(games, /available=mode\?\[mode\]:types/);
  assert.match(games, /getGameProgress\(\)/);
  assert.match(games, /#game\/.*pack\.id/);
  assert.match(css, /\.games-mode-grid/);
});

test('materials counts correspond to actual catalog; retains original file routes', () => {
  assert.match(materials, /materials\.filter\(m=>m\.category===c\)\.length/);
  assert.match(materials, /filtered\.map\(\(m,index\)=>/);
  assert.match(materials, /href=\{'#material\/'\+m\.id\}/);
  assert.match(materials, /driveFolderUrl/);
  assert.match(materials, /aria-pressed=\{category===c\}/);
  assert.match(css, /\.materials-page \.material-card/);
});

test('Cloudflare deployment and authenticated mobile navigation remain untouched', () => {
  assert.match(wrangler, /main = "src\/worker\/index\.mjs"/);
  assert.match(wrangler, /binding = "ASSETS"/);
  assert.match(pkg.scripts.deploy, /wrangler deploy/);
  const app = read('src/App.tsx');
  for (const route of ['#dashboard','#lessons','#games','#materials','#review','#account'])
    assert.ok(app.includes(route), 'Missing route '+route);
  assert.match(css, /\.app-shell \.mobile-nav/);
});
