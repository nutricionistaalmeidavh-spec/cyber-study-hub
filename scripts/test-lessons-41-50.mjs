import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const catalog = JSON.parse(fs.readFileSync('src/curriculum/catalog.json', 'utf8'));
const prefix = 'public/course-labs/a41-50/answer-keys/AULA-';
for (let id = 41; id <= 50; id++) {
  const code = 'AULA-' + String(id).padStart(3, '0');
  const lesson = fs.readFileSync('public/course-library/main/' + String(id).padStart(3, '0') + '.md', 'utf8');
  const key = fs.readFileSync(prefix + String(id).padStart(3, '0') + '.md', 'utf8');
  assert.ok(catalog.main.some(item => item.id === id), code + ' ausente do catálogo');
  for (const heading of ['## Problema e competência verificável', '### Mecanismo e exemplo resolvido', '### Laboratório guiado', '### Detecção, defesa, limites e fontes', '## Caso de transferência — prova independente', '## Checklist de domínio'])
    assert.ok(lesson.includes(heading), code + ' sem seção ' + heading);
  assert.ok(!lesson.includes('Qual ideia resume melhor'), code + ' quiz genérico ainda presente');
  assert.ok(!lesson.includes('Qual afirmação melhor resume'), code + ' quiz genérico ainda presente');
  assert.ok(lesson.includes('/course-labs/a41-50/answer-keys/' + code + '.md'));
  assert.ok(key.includes('**Erro eliminatório:**'));
  assert.ok(key.includes('## Rubrica de correção'));
  for (let q = 1; q <= 6; q++) assert.ok(lesson.includes('\n' + q + '. '), code + ': ausência da questão ' + q);
  for (const [, asset] of lesson.matchAll(/\]\((\/course-labs\/[^)#?]+)\)/g))
    assert.ok(!asset.includes('..') && fs.existsSync(path.join('public', asset)), code + ': link local inválido ' + asset);
  assert.ok(lesson.length > 9000, code + ' conteúdo superficial');
  console.log('OK', code, 'oficina/6 questões/gabarito/link');
}
