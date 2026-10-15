import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const reg=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const audit=JSON.parse(fs.readFileSync('quality/reviews/a191-200-2026-10-15.json','utf8'));
const dims=["conteudoTecnico","didatica","pratica","defesa","avaliacao","especificidade"];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(audit.humanLearnerTesting,'not_performed');
assert.equal(Object.keys(audit.units).length,10);
for(let n=191;n<=200;n++){
  const id='AULA-'+n, path='public/course-library/main/'+n+'.md';
  const content=fs.readFileSync(path,'utf8'),digest=createHash('sha256').update(content).digest('hex');
  const x=reg.editorialReviews[id], a=audit.units[id], key='public/course-labs/a191-200/answer-keys/'+id+'.md';
  assert.equal(x.grade,'A',id);assert.equal(x.contentSha256,digest,id);
  assert.equal(a.contentSha256,digest,id);assert.equal(x.reviewMethod,'ai_editorial_second_pass');
  assert.equal(x.humanLearnerTesting,'not_performed');
  assert.notEqual(x.author,x.reviewer);assert.ok(x.summary.length>=160);
  assert.ok(content.includes('/course-labs/a191-200/lab.test.mjs'));
  assert.ok(content.includes('/course-labs/a191-200/answer-keys/'+id+'.md'));
  assert.ok(fs.readFileSync(key,'utf8').includes('Rubrica'));
  assert.ok(a.technicalSources.length>0);
  for(const d of dims){assert.ok(x.scores[d]>=80 && x.scores[d]<=100,id+' '+d);assert.ok(x.evidence.some(e=>e.dimension===d&&e.method&&e.reference&&e.result));}
  for(const g of gates)assert.equal(x.gates[g],true,id+' '+g);
  console.log('PASS A editorial',id,digest.slice(0,12));
}
assert.ok(Object.values(reg.editorialReviews).filter(x=>x.grade==='A').length>=183,'Manter todas as 183 notas A anteriores');
console.log('PASS: 10 novas A (total 183), SHA e gabaritos separados.');
