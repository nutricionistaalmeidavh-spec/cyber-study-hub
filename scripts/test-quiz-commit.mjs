import assert from 'node:assert/strict';
import { quizActionLabel, canRevealQuizFeedback } from '../src/components/lesson-v2/quizCommit.ts';
assert.equal(canRevealQuizFeedback(false), false, 'seleção não pode revelar acerto');
assert.equal(canRevealQuizFeedback(true), true, 'feedback após confirmação');
assert.equal(quizActionLabel(false, false), 'Conferir resposta');
assert.equal(quizActionLabel(false, true), 'Conferir resposta');
assert.equal(quizActionLabel(true, false), 'Próxima questão');
assert.equal(quizActionLabel(true, true), 'Finalizar');
console.log('PASS quiz: não revela gabarito nem permite avançar sem confirmar');
