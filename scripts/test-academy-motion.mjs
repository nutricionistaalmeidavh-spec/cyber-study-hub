import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('motion remains isolated to the public Academy page', () => {
  const page = read('src/components/AcademyLanding.tsx');
  const app = read('src/App.tsx');
  assert.match(page, /useAcademyMotion\(/);
  assert.match(page, /academy-page/);
  assert.match(app, /isAcademyPath\(window\.location\.pathname\)/);
  assert.doesNotMatch(read('src/components/PlatformGate.tsx'), /useAcademyMotion/);
});

test('real scroll animation with proper cleanup and no permanent hide', () => {
  const motion = read('src/components/useAcademyMotion.ts');
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /requestAnimationFrame/);
  assert.match(motion, /cancelAnimationFrame/);
  assert.match(motion, /removeEventListener/);
  assert.match(motion, /disconnect\(/);
  assert.match(motion, /prefers-reduced-motion:\s*reduce/);
  assert.match(motion, /dataset\.motion/);
  assert.match(motion, /scrollHeight/);
  assert.doesNotMatch(motion, /window\.onscroll\s*=/);
});

test('motion choreography includes headings, cards, CTA and restrained stacking', () => {
  const page = read('src/components/AcademyLanding.tsx');
  const styles = read('src/components/academy-motion.css');
  assert.match(page, /academy-kinetic/);
  assert.match(page, /academy-scroll-progress/);
  assert.match(page, /data-reveal/);
  assert.match(styles, /academy-method-grid article\s*\{/);
  assert.match(styles, /position:\s*sticky/);
  assert.match(styles, /academy-module-card/);
  assert.match(styles, /academy-button/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /pointer:\s*fine/);
  assert.match(styles, /max-width:\s*720px/);
});

test('motion core uses only self-hosted browser primitives and no paid dependency', () => {
  const packageJson = JSON.parse(read('package.json'));
  assert.equal(packageJson.dependencies?.gsap, undefined);
  assert.equal(packageJson.dependencies?.['@gsap/react'], undefined);
  const motion = read('src/components/useAcademyMotion.ts');
  assert.doesNotMatch(motion, /https?:\/\/|fetch\(|import\(.*https?:/);
});
