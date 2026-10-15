import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const reg=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const audit=JSON.parse(fs.readFileSync('quality/reviews/a181-190-2026-10-15.json','utf8'));
const dims=["conteudoTecnico","didatica","pratica","defesa","avaliacao","especificidade"],gates=["precisaoRevisada","didaticaInicianteValidada","praticaVerificada","avaliacaoIndependenteRevisada","escopoSeguroVerificado","revisorIndependente"];
assert.equal(audit.humanLearnerTesting,'not_performed');
assert.equal(Object.keys(audit.units).length,10);
for(let n=181;n<=190;n++){
 const id='AULA-'+n,doc=fs.readFileSync('public/course-library/main/'+n+'.md','utf8');
 const hash=createHash('sha256').update(doc).digest('hex'),review=reg.editorialReviews[id],unit=audit.units[id];
 assert.equal(review?.grade,'A',id);
 assert.equal(review.contentSha256,hash,id+' hash');
 assert.equal(unit.contentSha256,hash,id+' audit hash');
 assert.equal(review.reviewMethod,'ai_editorial_second_pass');
 assert.equal(review.humanLearnerTesting,'not_performed');
 assert.notEqual(review.author,review.reviewer);
 assert.ok(review.summary.length>180);
 assert.equal(review.evidence.length,6);
 assert.equal(unit.technicalSources.length,1);
 for(const dim of dims){assert.ok(review.scores[dim]>=80&&review.scores[dim]<=100,id+' '+dim);assert.ok(review.evidence.some(e=>e.dimension===dim&&e.reference&&e.method&&e.result));}
 for(const gate of gates)assert.equal(review.gates[gate],true,id+' '+gate);
 assert.ok(doc.includes('runWorkshop('+n+')')&&doc.includes('/course-labs/a181-190/answer-keys/AULA-'+n+'.md'));
 const key=fs.readFileSync('public/course-labs/a181-190/answer-keys/AULA-'+n+'.md','utf8');
 for(let i=1;i<=6;i++)assert.ok(key.includes('\n'+i+'. '),id+' missing key answer '+i);
 console.log('PASS editorial A',id,hash.slice(0,12));
}
assert.ok(Object.values(reg.editorialReviews).filter(x=>x.grade==='A').length>=183,'173 anteriores + 10 novas');
assert.equal(reg.editorialReviews['AULA-170'].grade,'A');
assert.equal(reg.editorialReviews['AULA-166'].grade,'A');
console.log('PASS 183 notas A preservadas/validadas; sem alegação de teste humano');
