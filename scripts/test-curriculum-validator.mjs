import fs from 'node:fs';
import assert from 'node:assert/strict';
import { validateLesson } from './lib/curriculum-validator.mjs';

const lesson = JSON.parse(
  fs.readFileSync(new URL('../src/content/main/047/lesson.json', import.meta.url), 'utf8')
);
const references = JSON.parse(
  fs.readFileSync(new URL('../src/content/references/repositories.json', import.meta.url), 'utf8')
);
const catalog = new Set(references.repositories.map(item => item.id));

const validErrors = validateLesson(lesson, catalog);
assert.deepEqual(validErrors, [], `Aula 47 deveria ser válida: ${validErrors.join(' | ')}`);

const invalid = structuredClone(lesson);
invalid.title = '';
invalid.recommendedPrerequisites[0].blocking = true;
invalid.lab.steps[0].expected = '';
invalid.review.quiz[0].answer = 99;
invalid.review.quiz[1].options[1] = invalid.review.quiz[1].options[0];
invalid.externalReferences[0].catalogId = 'repo-inexistente';
invalid.review.quiz[2].q = 'Qual afirmação melhor resume a aula?';
invalid.review.flashcards[1].front = invalid.review.flashcards[0].front;

const invalidErrors = validateLesson(invalid, catalog);
assert.ok(invalidErrors.some(error => error.includes('title obrigatório')));
assert.ok(invalidErrors.some(error => error.includes('não pode ser bloqueador')));
assert.ok(invalidErrors.some(error => error.includes('sem expected')));
assert.ok(invalidErrors.some(error => error.includes('answer fora do intervalo')));
assert.ok(invalidErrors.some(error => error.includes('opções duplicadas')));
assert.ok(invalidErrors.some(error => error.includes('catalogId inexistente')));
assert.ok(invalidErrors.some(error => error.includes('enunciado genérico')));
assert.ok(invalidErrors.some(error => error.includes('frentes duplicadas')));

console.log(`Curriculum validator tests OK — ${invalidErrors.length} falhas intencionais detectadas.`);
