import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import {stripAcademyPath, prefixBrowserPaths, academyPublicHref} from '../src/lib/academyRouting.mjs';

test('public route strips only the exact Academy mount',()=>{
  for (const [publicPath, internal] of [
    ['/academy','/'], ['/academy/','/'], ['/academy/study','/study'],
    ['/academy/api/waitlist','/api/waitlist'],
    ['/academy/course-labs/reverse-ai/README.md','/course-labs/reverse-ai/README.md'],
    ['/academy/assets/bundle.js','/assets/bundle.js'],
    ['/api/bootstrap','/api/bootstrap'], ['/academyx/api','/academyx/api'],
  ]) assert.equal(stripAcademyPath(publicPath),internal,publicPath);
});
test('browser URLs scope only first-party course paths; never mutate domain, hash or paid third parties',()=>{
  const source="fetch('/api/waitlist');fetch('/course-labs/a1/test.js');fetch('/materials/file.pdf');fetch('/course-library/main/001.md');const x='/academy/api/me';const ext='https://artisys.dev/api';";
  const result=prefixBrowserPaths(source);
  for(const url of ['/academy/api/waitlist','/academy/course-labs/a1/test.js','/academy/materials/file.pdf','/academy/course-library/main/001.md'])assert.ok(result.includes(url));
  assert.ok(result.includes("'/academy/api/me'"));
  assert.ok(result.includes("'https://artisys.dev/api'"));
  assert.equal(prefixBrowserPaths(result),result);
});
test('safe course material hrefs use Academy scope but preserve external URLs and hashes',()=>{
  assert.equal(academyPublicHref('/materials/book.pdf'),'/academy/materials/book.pdf');
  assert.equal(academyPublicHref('/course-library/main/001.md'),'/academy/course-library/main/001.md');
  assert.equal(academyPublicHref('https://example.com/doc'),'https://example.com/doc');
  assert.equal(academyPublicHref('#lesson/1'),'#lesson/1');
  assert.equal(academyPublicHref('/academy/api/me'),'/academy/api/me');
});

test('Cloudflare route isolates the Academy without DNS or main app rewrites',()=>{
  const fs = requireFile('../wrangler.toml');
  assert.match(fs,/artisys\\.dev\\/academy"/);
  assert.match(fs,/artisys\\.dev\\/academy\\/\\*"/);
  assert.match(fs,/workers_dev = true/);
  assert.doesNotMatch(fs,/artisys\\.dev\\/\\*"/);
  const worker=requireFile('../src/worker/index.mjs');
  assert.match(worker,/stripAcademyPath/);
  assert.match(worker,/HUB_AUTH/);
  const vite=requireFile('../vite.config.ts');
  assert.match(vite,/base: '\\/academy\\/'/);
  assert.match(vite,/prefixBrowserPaths/);
});

function requireFile(path) { return readFileSync(new URL(path,import.meta.url),'utf8'); }
