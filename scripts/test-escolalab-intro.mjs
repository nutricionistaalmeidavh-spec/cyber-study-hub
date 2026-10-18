import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LAB_LESSON_ID, LAB_STEPS, simulateInvoiceAccess, isExpectedLabStep} from '../src/lib/escolaLabAccess.mjs';
import {presentPentestLesson, isIntroPentestLesson} from '../src/lib/pentestLessonFlow.mjs';

const read = path => readFileSync(path, 'utf8');

test('lab 01 belongs only to canonical AULA-034; AULA-035 remains intact', () => {
  assert.equal(LAB_LESSON_ID, 34);
  assert.equal(LAB_STEPS.length, 4);
  const catalog = JSON.parse(read('src/curriculum/catalog.json'));
  const offering = JSON.parse(read('src/curriculum/courses.json')).courses
    .find(c => c.id === 'trilha-pentest-ethical-hacking');
  assert.ok(offering);
  assert.equal(offering.modules[0].lessonCodes[3], 'AULA-034');
  assert.equal(offering.modules[0].lessonCodes[4], 'AULA-035');
  assert.equal(catalog.main.find(x => x.id === 35).title, 'Relatório Profissional e Reteste');
});

test('simulate real access-control decisions without external requests', () => {
  const aliceBefore = simulateInvoiceAccess('alice', 'vulnerable');
  const bobBefore = simulateInvoiceAccess('bob', 'vulnerable');
  const bobAfter = simulateInvoiceAccess('bob', 'corrected');
  const aliceAfter = simulateInvoiceAccess('alice', 'corrected');
  assert.equal(aliceBefore.status, 200);
  assert.equal(bobBefore.status, 200);
  assert.equal(bobBefore.unauthorizedExposure, true);
  assert.equal(bobAfter.status, 403);
  assert.equal(bobAfter.unauthorizedExposure, false);
  assert.equal(aliceAfter.status, 200);
  assert.throws(() => simulateInvoiceAccess('mallory', 'vulnerable'), /invalid/i);
  assert.throws(() => simulateInvoiceAccess('alice', 'production'), /invalid/i);
});

test('only the expected sequence advances progress; duplicate proofs cannot be counted', () => {
  assert.deepEqual(LAB_STEPS.map(x => x.id), [
    'alice-before', 'bob-before', 'bob-after', 'alice-after'
  ]);
  for (const step of LAB_STEPS) {
    const result = simulateInvoiceAccess(step.actor, step.mode);
    assert.equal(isExpectedLabStep(step, step.actor, step.mode, result), true);
    assert.equal(isExpectedLabStep(step, step.actor === 'alice' ? 'bob' : 'alice', step.mode, result), false);
  }
});

test('remove standalone practice and assessment from the rendered INTRO lessons, not from canonical sources', () => {
  for (const id of [31, 32, 33, 34]) {
    assert.equal(isIntroPentestLesson(id), true);
    const markdown = read('public/course-library/main/' + String(id).padStart(3, '0') + '.md');
    assert.match(markdown, /## Laboratório reproduzível/);
    const displayed = presentPentestLesson(id, markdown);
    assert.doesNotMatch(displayed, /## Laboratório reproduzível/);
    assert.doesNotMatch(displayed, /## Prova final independente/);
    assert.doesNotMatch(displayed, /Flashcards para responder/);
    assert.match(displayed, /## Problema e objetivo mensurável/);
    assert.match(displayed, /## Revisão ativa e fontes/);
  }
  const later = read('public/course-library/main/035.md');
  assert.equal(isIntroPentestLesson(35), false);
  assert.match(presentPentestLesson(35, later), /## Problema e objetivo mensurável/);
  assert.doesNotMatch(presentPentestLesson(35, later), /## Laboratório reproduzível/);
});

test('lab renders at the END of AULA-034, uses existing account-owned lesson progress and no new course route', () => {
  const viewer = read('src/components/curriculum/CourseDocumentViewer.tsx');
  const lab = read('src/components/pentest/EscolaLabIntroLab.tsx');
  assert.match(viewer, /presentPentestLesson/);
  assert.match(viewer, /item\.id === LAB_LESSON_ID/);
  assert.ok(viewer.indexOf('<EscolaLabIntroLab') > viewer.indexOf('<MarkdownDocument'));
  assert.match(lab, /markLabStepProgress\(LAB_LESSON_ID/);
  assert.match(lab, /getLessonLearningProgress\(LAB_LESSON_ID\)/);
  assert.match(lab, /recordQuizAttempt\(LAB_LESSON_ID/);
  assert.match(lab, /simulação/i);
  assert.doesNotMatch(lab, /fetch\(|XMLHttpRequest|window\.location/);
});
