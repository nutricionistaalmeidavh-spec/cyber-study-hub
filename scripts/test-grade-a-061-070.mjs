import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const audit=JSON.parse(fs.readFileSync('quality/reviews/a061-070-2026-10-13.json','utf8'));
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const dimensions=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(Object.keys(audit.units).length,10);
assert.equal(audit.humanLearnerTesting,'not_performed');
for(let n=61;n<=70;n++){
 const num=String(n).padStart(3,'0'),code='AULA-'+num,lesson=fs.readFileSync('public/course-library/main/'+num+'.md','utf8');
 const hash=createHash('sha256').update(lesson).digest('hex'),review=registry.editorialReviews[code],record=audit.units[code];
 assert.equal(review.grade,'A',code);
 assert.equal(review.reviewMethod,'ai_editorial_second_pass',code);
 assert.equal(review.humanLearnerTesting,'not_performed',code);
 assert.notEqual(review.author,review.reviewer);
 assert.equal(review.contentSha256,hash,code+' stale grade');
 assert.equal(record.contentSha256,hash,code+' stale evidence');
 assert.equal(review.evidence.length,6);
 assert.ok(record.technicalSources.length>=1);
 for(const dim of dimensions){
  assert.ok(review.scores[dim]>=80&&review.scores[dim]<=100,code+' '+dim);
  assert.ok(review.evidence.some(x=>x.dimension===dim&&x.reference&&x.method&&x.result),code+' '+dim+' evidence');
 }
 for(const gate of gates)assert.equal(review.gates[gate],true,code+' '+gate);
 console.log('PASS A editorial IA',code,hash.slice(0,14));
}
assert.ok(Object.values(registry.editorialReviews).filter(x=>x.grade==='A').length>=65,'preservar 55 A anteriores');
console.log('PASS: 10 novas notas A e >=65 atuais sem alegar teste humano.');
