import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const audit=JSON.parse(fs.readFileSync('quality/reviews/a10-20-2026-10-13.json','utf8'));
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const dims=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
assert.equal(Object.keys(audit.units).length,11);
assert.equal(audit.humanLearnerTesting,'not_performed');
assert.ok(audit.qaEvidence.some(s=>s.includes('38488529578')));
for(let n=10;n<=20;n++){
 const code='AULA-'+String(n).padStart(3,'0');
 const document=fs.readFileSync('public/course-library/main/'+String(n).padStart(3,'0')+'.md','utf8');
 const sha=createHash('sha256').update(document).digest('hex');
 const r=registry.editorialReviews[code],a=audit.units[code];
 assert.equal(r.grade,'A',code);
 assert.equal(r.reviewMethod,'ai_editorial_second_pass');
 assert.equal(r.humanLearnerTesting,'not_performed');
 assert.equal(sha,r.contentSha256,code+' hash revogado');
 assert.equal(sha,a.contentSha256,code+' auditoria não corresponde ao conteúdo');
 assert.ok(r.summary.length>100);
 assert.equal(r.evidence.length,6);
 for(const dim of dims){
   assert.ok(r.scores[dim]>=80 && r.scores[dim]<=100,code+' '+dim);
   assert.ok(r.evidence.some(x=>x.dimension===dim&&x.method&&x.reference&&x.result));
 }
 for(const g of ['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'])assert.equal(r.gates[g],true);
 assert.ok(a.technicalSources.length>0);
 console.log('PASS A editorial assistido por IA:',code,sha.slice(0,12));
}
assert.ok(Object.values(registry.editorialReviews).filter(r=>r.grade==='A').length>=36);
console.log('PASS 11 aulas 010-020 + 7 aulas 002-008 + 8 piloto + 10 aulas 031-040 = pelo menos 36 A, sem teste humano alegado.');
