import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => readFileSync(file, 'utf8');
const css = read('src/components/lesson-editorial.css');
const reader = read('src/components/curriculum/CourseDocumentViewer.tsx');
const main = read('src/main.tsx');

test('ArtiSys editorial identity is scoped to lesson views and imported last', () => {
  assert.match(main, /import '\.\/styles\.css';\s*import '\.\/components\/lesson-editorial\.css';/);
  for (const root of ['lesson-v2-page', 'lesson-view', 'course-document-page', 'ai-track']) {
    assert.ok(css.includes(root), root + ' must share editorial identity');
  }
  for (const color of ['#0a0716', '#7037ad', '#8745f7', '#faf8fd']) {
    assert.ok(css.includes(color), 'Missing ArtiSys token ' + color);
  }
  assert.doesNotMatch(css, /@import|url\(https?:|font-face/i, 'No external UI/font dependency');
});

test('semantic dark chapters and light reading protect learning structure', () => {
  assert.match(css, /#v2-problema,#v2-mecanismo,#v2-lab,#v2-revisao/);
  assert.match(css, /\.editorial-chapter--dark/);
  assert.match(css, /\.ai-reading/);
  assert.match(css, /\.ai-exercise/);
  assert.match(css, /\.lesson-view > \.lab-panel/);
  assert.match(reader, /groupEditorialChapters\(blocks\)/);
  assert.match(reader, /node\.type === 'h1' \|\| node\.type === 'h2'/);
  assert.match(reader, /problema\|escopo\|pratica\|laboratorio/);
  assert.doesNotMatch(reader, /index\s*%\s*2/, 'No automatic odd/even chapter switch');
});

test('accessible learning controls remain, mobile reading stays responsive', () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /max-width: 700px/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(reader, /<MarkdownDocument markdown=\{markdown\}/);
  assert.match(reader, /className="markdown-table-scroll"/);
  assert.match(reader, /<input type="checkbox"/);
  assert.match(reader, /moduleBackLink/);
  assert.match(reader, /item\.contentPath/);
});
