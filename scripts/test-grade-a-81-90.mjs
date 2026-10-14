import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const reg=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const audit=JSON.parse(fs.readFileSync('quality/reviews/a81-90-2026-10-13.json','utf8'));
const dims=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(Object.keys(audit.units).length,10);
assert.equal(audit.humanLearnerTesting,'not_performed');
for(let n=81;n<=90;n++){
 const code=String(n).padStart(3,'0'),id='AULA-'+code,review=reg.editorialReviews[id],evidence=audit.units[id];
 const doc=fs.readFileSync('public/course-library/main/'+code+'.md','utf8');
 const hash=createHash('sha256').update(doc).digest('hex');
 assert.equal(review.grade,'A',id);assert.equal(review.contentSha256,hash,id+' registro defasado');
 assert.equal(evidence.contentSha256,hash,id+' auditoria defasada');
 assert.notEqual(review.author,review.reviewer);
 assert.equal(review.reviewMethod,'ai_editorial_second_pass');
 assert.equal(review.humanLearnerTesting,'not_performed');
 assert.ok(review.summary.length>110);
 assert.equal(review.evidence.length,6);
 for(const dim of dims){assert.ok(review.scores[dim]>=80&&review.scores[dim]<=100,id+' score '+dim);
   assert.ok(review.evidence.some(e=>e.dimension===dim&&e.method&&e.reference&&e.result),id+' evidência '+dim);}
 for(const gate of gates)assert.equal(review.gates[gate],true,id+' gate '+gate);
 assert.equal(evidence.technicalSources.length,1);
 console.log('PASS A editorial IA',id,hash.slice(0,12));
}
assert.ok(Object.values(reg.editorialReviews).filter(x=>x.grade==='A').length>=85);
console.log('Aulas 081–090: 10 registros A, hashes, 6 dimensões; testes humanos: não realizados.');
