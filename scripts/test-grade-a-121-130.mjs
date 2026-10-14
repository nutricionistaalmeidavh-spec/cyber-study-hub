import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const audit=JSON.parse(fs.readFileSync('quality/reviews/a121-130-2026-10-13.json','utf8'));
const dims=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(Object.keys(audit.units).length,10);
assert.equal(audit.humanLearnerTesting,'not_performed');
for(let n=121;n<=130;n++){
 const id='AULA-'+n,sha=createHash('sha256').update(fs.readFileSync('public/course-library/main/'+n+'.md','utf8')).digest('hex');
 const review=registry.editorialReviews[id],unit=audit.units[id];
 assert.equal(review.grade,'A',id);
 assert.equal(review.contentSha256,sha,id+' SHA registry');
 assert.equal(unit.contentSha256,sha,id+' SHA audit');
 assert.notEqual(review.author,review.reviewer);
 assert.equal(review.reviewMethod,'ai_editorial_second_pass');
 assert.equal(review.humanLearnerTesting,'not_performed');
 assert.ok(review.summary.length>130&&review.evidence.length===6);
 for(const dim of dims){assert.ok(review.scores[dim]>=80&&review.scores[dim]<=100,id+' score '+dim);
  assert.ok(review.evidence.some(e=>e.dimension===dim&&e.reference&&e.method&&e.result),id+' evidence '+dim);}
 for(const gate of gates)assert.equal(review.gates[gate],true,id+' gate '+gate);
 assert.equal(unit.technicalSources.length,1);
 console.log('PASS A editorial IA',id,sha.slice(0,12));
}
for(let n=1;n<=90;n++)assert.equal(registry.editorialReviews['AULA-'+String(n).padStart(3,'0')]?.grade,'A','historical A regression '+n);
for(const id of ['AULA-160','AULA-166','LOG-01','NET-25','PY-01'])assert.equal(registry.editorialReviews[id]?.grade,'A');
assert.ok(Object.values(registry.editorialReviews).filter(x=>x.grade==='A').length>=105);
console.log('PASS >=105 A editorial, canonical SHA, no human testing claim.');
