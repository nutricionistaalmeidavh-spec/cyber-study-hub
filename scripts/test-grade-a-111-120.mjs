import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const audit=JSON.parse(fs.readFileSync('quality/reviews/a111-120-2026-10-13.json','utf8'));
const dims=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(Object.keys(audit.units).length,10);
assert.equal(audit.humanLearnerTesting,'not_performed');
for(let n=111;n<=120;n++){
 const id='AULA-'+n,doc=fs.readFileSync('public/course-library/main/'+n+'.md','utf8');
 const hash=createHash('sha256').update(doc).digest('hex');
 const r=registry.editorialReviews[id],a=audit.units[id];
 assert.equal(r.grade,'A',id);
 assert.equal(r.contentSha256,hash,id+' hash de conteúdo desatualizado');
 assert.equal(a.contentSha256,hash,id+' hash da auditoria desatualizado');
 assert.equal(r.reviewMethod,'ai_editorial_second_pass');
 assert.equal(r.humanLearnerTesting,'not_performed');
 assert.notEqual(r.author,r.reviewer);
 assert.ok(r.summary.length>=120);
 assert.equal(r.evidence.length,6);
 assert.equal(a.technicalSources.length,1);
 for(const dim of dims){assert.ok(r.scores[dim]>=80&&r.scores[dim]<=100,id+' '+dim);assert.ok(r.evidence.some(x=>x.dimension===dim&&x.method&&x.reference&&x.result),id+' evidência '+dim);}
 for(const gate of gates)assert.equal(r.gates[gate],true,id+' '+gate);
 console.log('PASS A editorial IA',id,hash.slice(0,12));
}
const count=Object.values(registry.editorialReviews).filter(r=>r.grade==='A').length;
assert.ok(count>=105,'Perda de classificações A: '+count);
console.log('PASS: 10 novas aulas A e pelo menos 95 classificações antigas preservadas; sem testes humanos.');
