import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const read = p => fs.readFileSync(p, 'utf8');
const audit = JSON.parse(read('quality/reviews/a171-180-2026-10-15.json'));
const reg = JSON.parse(read('quality/registry.json'));
const cat = JSON.parse(read('src/curriculum/catalog.json'));
const dims = ['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates = ['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(cat.main.length, 218);
assert.equal(cat.parallel.length, 325);
assert.equal(audit.humanLearnerTesting, 'not_performed');
assert.equal(audit.externalHumanReview, 'not_performed');
assert.equal(Object.keys(audit.units).length,10);
assert.ok(Object.keys(reg.editorialReviews).length>=213,'preserve main A through 210 and add cohort 171–180');
for(let n=171;n<=180;n++){
 const id='AULA-'+n;
 const file='public/course-library/main/'+n+'.md';
 const doc=read(file);
 const key=read('public/course-labs/a171-180/answer-keys/'+id+'.md');
 const review=reg.editorialReviews[id],evidence=audit.units[id];
 const hash=createHash('sha256').update(doc).digest('hex');
 assert.equal(cat.main.find(x=>x.id===n)?.code,id);
 assert.equal(review.grade,'A',id);
 assert.equal(review.contentSha256,hash,id+' registry hash');
 assert.equal(evidence.contentSha256,hash,id+' audit hash');
 assert.equal(review.humanLearnerTesting,'not_performed');
 assert.equal(review.reviewMethod,'ai_editorial_second_pass');
 assert.notEqual(review.author,review.reviewer);
 assert.ok(doc.includes('## Complemento A editorial'),id+' case-specific workshop');
 assert.ok(doc.includes('node --test public/course-labs/a171-180/lab.test.mjs'));
 assert.equal((key.match(/### Questão \d+/g)||[]).length,6,id+' 6 separate answers');
 const section=doc.slice(doc.lastIndexOf('### 4.'),doc.lastIndexOf('### 5.'));
 assert.equal((section.match(/^\d+\./gm)||[]).length,6,id+' 6 transfer questions');
 assert.ok(key.includes('## Rubrica')&&key.includes('Erro eliminatório'),id+' rubric');
 assert.equal(review.evidence.length,6);
 for(const dim of dims){
  assert.ok(review.scores[dim]>=80&&review.scores[dim]<=100,id+' '+dim);
  assert.ok(review.evidence.some(e=>e.dimension===dim&&e.reference&&e.method&&e.result),id+' evidence '+dim);
 }
 for(const gate of gates)assert.equal(review.gates[gate],true,id+' gate '+gate);
 console.log('PASS',id,hash.slice(0,12));
}
for(let n=1;n<=170;n++)assert.equal(reg.editorialReviews['AULA-'+String(n).padStart(3,'0')]?.grade,'A','previous A '+n);
for(const id of ['LOG-01','PY-01','NET-25'])assert.equal(reg.editorialReviews[id]?.grade,'A');
for(let n=181;n<=210;n++)assert.equal(reg.editorialReviews['AULA-'+n]?.grade,'A','main grade preserved '+n);
console.log('PASS: at least 213 A records, previous main cohorts preserved and inventory intact.');
