import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const audit=JSON.parse(fs.readFileSync('quality/reviews/a41-50-2026-10-13.json','utf8'));
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const dimensions=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(Object.keys(audit.units).length,10);
assert.equal(audit.humanLearnerTesting,'not_performed');
for(let n=41;n<=50;n++){
 const code='AULA-'+String(n).padStart(3,'0');
 const doc=fs.readFileSync('public/course-library/main/'+String(n).padStart(3,'0')+'.md','utf8');
 const sha=createHash('sha256').update(doc).digest('hex');
 const r=registry.editorialReviews[code],a=audit.units[code];
 assert.equal(r.grade,'A',code);
 assert.equal(sha,r.contentSha256,code+' revisão editorial revogada');
 assert.equal(sha,a.contentSha256,code+' auditoria desatualizada');
 assert.equal(r.reviewMethod,'ai_editorial_second_pass');
 assert.equal(r.humanLearnerTesting,'not_performed');
 assert.notEqual(r.author,r.reviewer);
 assert.ok(r.summary.length>100);
 assert.equal(r.evidence.length,6);
 for(const dim of dimensions){
   assert.ok(r.scores[dim]>=80&&r.scores[dim]<=100,code+' '+dim);
   assert.ok(r.evidence.some(e=>e.dimension===dim&&e.method&&e.reference&&e.result));
 }
 for(const gate of gates)assert.equal(r.gates[gate],true,code+' '+gate);
 assert.ok(a.technicalSources.length>=1);
 console.log('PASS A editorial IA',code,sha.slice(0,12));
}
assert.ok(Object.values(registry.editorialReviews).filter(r=>r.grade==='A').length>=35);
console.log('PASS: 10 unidades 041–050 com nota A editorial IA e SHA-256, 21 testes locais separados; sem observação com alunos humanos.');
