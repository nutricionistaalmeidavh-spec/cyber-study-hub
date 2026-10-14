import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const report=JSON.parse(fs.readFileSync('quality/reviews/a101-110-2026-10-13.json','utf8'));
const dim=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(Object.keys(report.units).length,10);
assert.equal(report.humanLearnerTesting,'not_performed');
for(let i=101;i<=110;i++){
 const id='AULA-'+String(i).padStart(3,'0');
 const content=fs.readFileSync(`public/course-library/main/${i}.md`,'utf8');
 const sha=createHash('sha256').update(content).digest('hex');
 const rubric=fs.readFileSync(`public/course-labs/a101-110/answer-keys/${id}.md`,'utf8');
 const record=registry.editorialReviews[id],review=report.units[id];
 assert.ok(record&&review,'Missing review '+id);
 assert.equal(record.grade,'A',id);
 assert.equal(sha,record.contentSha256,id+' registry SHA');
 assert.equal(sha,review.contentSha256,id+' audit SHA');
 assert.ok(content.includes('## Prova final independente — competência aplicada'));
 const assessment=content.split('## Prova final independente — competência aplicada').at(-1);
 assert.equal((assessment.match(/\n[1-6]\. /g)||[]).length,6,id+' six questions');
 assert.ok(assessment.includes(`/course-labs/a101-110/answer-keys/${id}.md`));
 assert.ok(rubric.includes('**Erro eliminatório:**')&&rubric.includes('## Rubrica de correção'));
 assert.equal(record.reviewMethod,'ai_editorial_second_pass');
 assert.equal(record.humanLearnerTesting,'not_performed');
 assert.ok(record.author&&record.reviewer&&record.author!==record.reviewer);
 for(const k of dim){assert.ok(record.scores[k]>=80&&record.scores[k]<=100,id+' '+k);assert.ok(record.evidence.find(x=>x.dimension===k&&x.method&&x.reference&&x.result),id+' evidence '+k);}
 for(const k of gates)assert.equal(record.gates[k],true,id+' gate '+k);
 assert.ok(review.technicalSources.length>=1,id+' source');
 console.log('PASS A editorial IA',id,sha.slice(0,12));
}
const A=Object.entries(registry.editorialReviews).filter(([,v])=>v.grade==='A').length;
assert.ok(A>=125,'Expected 115 previous A + 10 new, got '+A);
console.log('PASS: 10 new A with valid audit and at least 115 previously accepted A. No human learning tests claimed.');
