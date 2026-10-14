import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = process.cwd();
const reviewPath = path.join(root, 'quality/reviews/pilot-a-2026-10-13.json');
const gradeRegistry = JSON.parse(fs.readFileSync(path.join(root, 'quality/registry.json'), 'utf8'));
const reviews = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/curriculum/catalog.json'), 'utf8'));
const units = [...catalog.main, ...catalog.parallel];
const codes = units.map(x => x.kind === 'main' ? `AULA-${String(x.id).padStart(3, '0')}` : x.code);
const pilot = ['AULA-001','AULA-009','AULA-047','AULA-160','AULA-166','LOG-01','PY-01','NET-25'];
const dim = ['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates = ['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(codes.length, 543);
assert.deepEqual(Object.keys(reviews.units).sort(), [...pilot].sort());
for (const code of pilot) {
  const unit = units.find(x => codes[units.indexOf(x)] === code);
  assert.ok(unit, `Sem identidade: ${code}`);
  const lessonPath = path.join(root, 'public',unit.contentPath.slice(1));
  const content = fs.readFileSync(lessonPath, 'utf8');
  const answerPath = path.join(root, 'public/course-labs/pilot-a/answer-keys', code+'.md');
  assert.ok(fs.existsSync(answerPath), `Gabarito independente ausente: ${code}`);
  const answers = fs.readFileSync(answerPath, 'utf8');
  assert.ok(content.includes('## Prova final independente — competência aplicada'), `Prova ausente: ${code}`);
  assert.ok(content.includes(`/course-labs/pilot-a/answer-keys/${code}.md`), `Gabarito não acessível: ${code}`);
  assert.equal((content.match(/\n[1-6]\. /g) ?? []).filter(Boolean).length >= 6, true, `Perguntas insuficientes: ${code}`);
  assert.ok(answers.includes('**Erro eliminatório:**'), `Sem critério negativo: ${code}`);
  assert.ok(answers.includes('## Rubrica de correção'), `Sem rubrica: ${code}`);
  const expectedSha = createHash('sha256').update(content).digest('hex');
  const grade = gradeRegistry.editorialReviews[code];
  const audit = reviews.units[code];
  assert.equal(grade.grade, 'A');
  assert.equal(expectedSha, grade.contentSha256, `Parecer obsoleto após mudança: ${code}`);
  assert.equal(audit.contentSha256, expectedSha, `Hash de auditoria divergente: ${code}`);
  assert.equal(grade.humanLearnerTesting, 'not_performed', 'Nunca inventar estudo humano');
  assert.equal(grade.reviewMethod, 'ai_editorial_second_pass', 'Distinguir tipo de auditoria');
  assert.ok(grade.author.trim() !== grade.reviewer.trim(), 'Independência nominal de autoria/revisão');
  assert.deepEqual(Object.keys(grade.scores).sort(), [...dim].sort());
  for (const k of dim) {
    assert.ok(grade.scores[k] >= 80 && grade.scores[k] <= 100, `${code} ${k}: abaixo do mínimo`);
    assert.ok(grade.evidence.find(x => x.dimension === k && x.method && x.result && x.reference), `${code} sem evidência ${k}`);
  }
  for (const k of gates) assert.equal(grade.gates[k], true, `${code}: gate ${k} não aprovado`);
  assert.ok(grade.summary.length > 80, `${code}: resumo pouco específico`);
  assert.ok(audit.technicalSources.length >= 1, `${code}: nenhuma fonte para conferir conceito`);
  console.log(`PASS A editorial assistido por IA: ${code} — sha256=${expectedSha.slice(0,12)}`);
}
assert.ok(Object.values(gradeRegistry.editorialReviews).filter(x=>x.grade==='A').length>=pilot.length);
console.log('PASS: 8/8 A editoriais auditados, 543 IDs preservados, sem alegar teste com alunos humanos.');
