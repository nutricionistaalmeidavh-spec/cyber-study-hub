import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const reg=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const audit=JSON.parse(fs.readFileSync('quality/reviews/a201-210-2026-10-15.json','utf8'));
const dims=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(audit.humanLearnerTesting,'not_performed');
assert.equal(Object.keys(audit.units).length,10);
for(let n=201;n<=210;n++){
  const id='AULA-'+n,content=fs.readFileSync('public/course-library/main/'+n+'.md','utf8');
  const hash=createHash('sha256').update(content).digest('hex');
  const review=reg.editorialReviews[id],entry=audit.units[id];
  assert.equal(review?.grade,'A',id);
  assert.equal(review.contentSha256,hash,id);
  assert.equal(entry.contentSha256,hash,id);
  assert.equal(review.reviewMethod,'ai_editorial_second_pass',id);
  assert.equal(review.humanLearnerTesting,'not_performed',id);
  assert.ok(review.author&&review.reviewer&&review.author!==review.reviewer,id);
  assert.ok(review.summary.length>=160&&review.evidence.length===6,id);
  assert.ok(content.includes('/course-labs/a201-210/answer-keys/'+id+'.md'),id);
  assert.ok(content.includes('node --test public/course-labs/a201-210/lab.test.mjs'),id);
  const key=fs.readFileSync('public/course-labs/a201-210/answer-keys/'+id+'.md','utf8');
  assert.ok(key.includes('Rubrica (100 pontos)'),id);
  assert.ok(entry.technicalSources.length>0,id);
  for(const d of dims){assert.ok(review.scores[d]>=80&&review.scores[d]<=100,id+' '+d);assert.ok(review.evidence.some(e=>e.dimension===d&&e.method&&e.reference&&e.result),id+' '+d)}
  for(const g of gates)assert.equal(review.gates[g],true,id+' '+g);
}
for(let n=191;n<=200;n++)assert.equal(reg.editorialReviews['AULA-'+n]?.grade,'A','Preservar 191-200');
assert.ok(Object.values(reg.editorialReviews).filter(x=>x.grade==='A').length>=193,'Preservar >=193 A');
console.log('PASS: 201-210 A; SHA-256, gabaritos, evidências e >=183 A anteriores íntegros');
