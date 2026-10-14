import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const audit=JSON.parse(fs.readFileSync('quality/reviews/a031-040-2026-10-13.json','utf8'));
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const dims=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(Object.keys(audit.units).length,10);
assert.equal(audit.humanLearnerTesting,'not_performed');
for(let i=31;i<=40;i++){
 const code='AULA-'+String(i).padStart(3,'0');
 const md=fs.readFileSync('public/course-library/main/'+String(i).padStart(3,'0')+'.md','utf8');
 const hash=createHash('sha256').update(md).digest('hex');
 const r=registry.editorialReviews[code],a=audit.units[code];
 assert.equal(r.grade,'A');
 assert.equal(r.reviewMethod,'ai_editorial_second_pass');
 assert.equal(r.humanLearnerTesting,'not_performed');
 assert.equal(r.contentSha256,hash,'hash inválido '+code);
 assert.equal(a.contentSha256,hash,'auditoria expirada '+code);
 assert.equal(r.evidence.length,6);
 assert.ok(a.technicalSources.length>=1);
 for(const d of dims){assert.ok(r.scores[d]>=80&&r.scores[d]<=100,code+' nota '+d);assert.ok(r.evidence.some(e=>e.dimension===d&&e.method&&e.reference&&e.result));}
 for(const g of gates)assert.equal(r.gates[g],true,code+' gate '+g);
 console.log('PASS A editorial IA',code);
}
assert.ok(Object.values(registry.editorialReviews).filter(x=>x.grade==='A').length>=46);
console.log('PASS: 36 classificações A editoriais IA; nenhuma conclusão de teste humano.');
