import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const reg=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const audit=JSON.parse(fs.readFileSync('quality/reviews/a141-150-2026-10-14.json','utf8'));
const dims=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(audit.humanLearnerTesting,'not_performed');
assert.equal(Object.keys(audit.units).length,10);
for(let n=141;n<=150;n++){
 const id='AULA-'+n,sha=createHash('sha256').update(fs.readFileSync('public/course-library/main/'+n+'.md','utf8')).digest('hex');
 const r=reg.editorialReviews[id],a=audit.units[id];
 assert.equal(r?.grade,'A',id);assert.equal(r.contentSha256,sha);
 assert.equal(a.contentSha256,sha);assert.equal(r.reviewMethod,'ai_editorial_second_pass');
 assert.equal(r.humanLearnerTesting,'not_performed');
 assert.ok(r.author&&r.reviewer&&r.author!==r.reviewer);
 assert.ok(r.summary.length>160&&r.evidence.length===6);
 assert.equal(a.technicalSources.length,1);
 for(const d of dims){assert.ok(r.scores[d]>=80&&r.scores[d]<=100);assert.ok(r.evidence.some(e=>e.dimension===d&&e.method&&e.reference&&e.result))}
 for(const g of gates)assert.equal(r.gates[g],true);
 console.log('PASS editorial A',id,sha.slice(0,12));
}
for(let n=1;n<=170;n++){if(n>=141&&n<=150)continue;const id='AULA-'+String(n).padStart(3,'0');assert.equal(reg.editorialReviews[id]?.grade,'A','Lost A '+id);}
for(const id of ['LOG-01','NET-25','PY-01'])assert.equal(reg.editorialReviews[id]?.grade,'A');
assert.equal(Object.values(reg.editorialReviews).filter(x=>x.grade==='A').length,173);
console.log('PASS 173 A preservados, hashes e pareceres íntegros.');