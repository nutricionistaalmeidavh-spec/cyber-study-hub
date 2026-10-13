import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const units = [
  ['main/001.md', ['Oficina de domínio','Prática independente e transferência','Avaliação de transferência']],
  ['main/009.md', ['Segundo cenário','Exercício de transferência','Falhas e recuperação']],
  ['main/047.md', ['Oficina de transferência','Teste corrigido completo','Rubrica da entrega']],
  ['main/160.md', ['Capstone completo','hipóteses concorrentes','Template de relatório','Rubrica de correção']],
  ['main/166.md', ['Conceitos fundamentais','Laboratório reproduzível','Prática independente','Quiz de transferência']],
  ['parallel/LOG-01.md', ['Segunda oficina','Prática','Rubrica da competência']],
  ['parallel/PY-01.md', ['Oficina completa','Exercício independente','Teste independente de comportamento']],
  ['parallel/NET-25.md', ['Oficina de diagnóstico TLS','Prática independente','Avaliação de transferência']]
];
const requiredLabs = [
  'public/course-labs/pilot-a/aslr_observe.c',
  'public/course-labs/pilot-a/check_aslr.py',
  'public/course-labs/pilot-a/stock_rules.py',
  'public/course-labs/pilot-a/PY-01.py',
  'public/course-labs/pilot-a/test_py_intro.py'
];
for (const lab of requiredLabs) assert.ok(existsSync(path.join(root,lab)), `Laboratório ausente: ${lab}`);
for (const [relative, cues] of units) {
  const file = path.join(root, 'public/course-library',relative);
  const md = readFileSync(file, 'utf8');
  for (const cue of cues) assert.ok(md.includes(cue), `${relative}: seção de competência ausente: ${cue}`);
  for (const [, linked] of md.matchAll(/\]\((\/course-labs\/[^)#?]+)\)/g)) {
    assert.ok(!linked.includes('..'), `${relative}: caminho inseguro ${linked}`);
    assert.ok(existsSync(path.join(root, 'public',linked)), `${relative}: artefato inacessível: ${linked}`);
  }
  assert.ok(md.length > 3800, `${relative}: material incompleto`);
  console.log(`PASS conteúdo e artefatos: ${relative}`);
}
const lesson47 = JSON.parse(readFileSync(path.join(root,'src/content/main/047/lesson.json'),'utf8'));
assert.ok(lesson47.independentExercises.some(x => x.id === 'wcd-independent-02'));
assert.ok(lesson47.review.quiz.some(x => x.concept === 'cache-invalidation'));
assert.ok(lesson47.review.quiz.some(x => x.concept === 'cache-regression'));
console.log('PASS: 8 documentos, links locais e aula 047 V2 com transferência');
