import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const reg=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const audit=JSON.parse(fs.readFileSync('quality/reviews/a071-080-2026-10-13.json','utf8'));
const dims=["conteudoTecnico","didatica","pratica","defesa","avaliacao","especificidade"],gates=["precisaoRevisada","didaticaInicianteValidada","praticaVerificada","avaliacaoIndependenteRevisada","escopoSeguroVerificado","revisorIndependente"];
assert.equal(Object.keys(audit.units).length,10);
assert.equal(audit.humanLearnerTesting,'not_performed');
for(let id=71;id<=80;id++){
 const n=String(id).padStart(3,'0'),code='AULA-'+n;
 const actual=createHash('sha256').update(fs.readFileSync('public/course-library/main/'+n+'.md','utf8')).digest('hex');
 const r=reg.editorialReviews[code],a=audit.units[code];
 assert.equal(r.grade,'A');assert.equal(r.contentSha256,actual,code+' hash');assert.equal(a.contentSha256,actual,code+' audit hash');
 assert.equal(r.reviewMethod,'ai_editorial_second_pass');assert.equal(r.humanLearnerTesting,'not_performed');
 assert.ok(r.author&&r.reviewer&&r.author!==r.reviewer&&r.summary.length>120);
 assert.equal(r.evidence.length,6);
 for(const d of dims){assert.ok(r.scores[d]>=80&&r.scores[d]<=100,code+' score '+d);assert.ok(r.evidence.some(e=>e.dimension===d&&e.method&&e.reference&&e.result),code+' evidence '+d);}
 for(const g of gates)assert.equal(r.gates[g],true,code+' gate '+g);
 assert.ok(a.technicalSources.length>0);console.log('PASS A editorial IA '+code+' '+actual.slice(0,12));
}
assert.ok(Object.values(reg.editorialReviews).filter(x=>x.grade==='A').length>=75, 'preservar 75 A e permitir novos lotes');
for(const code of ['AULA-001','AULA-047','AULA-050'])assert.equal(reg.editorialReviews[code].grade,'A');
console.log('PASS lote 071–080 e >=75 registros A, sem teste humano alegado.');
