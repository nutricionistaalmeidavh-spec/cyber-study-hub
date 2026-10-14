import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const audit=JSON.parse(fs.readFileSync('quality/reviews/a131-140-2026-10-14.json','utf8'));
const dimensions=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(Object.keys(audit.units).length,10);
assert.equal(audit.humanLearnerTesting,'not_performed');
for(let n=131;n<=140;n++){
 const id='AULA-'+n,sha=createHash('sha256').update(fs.readFileSync('public/course-library/main/'+n+'.md','utf8')).digest('hex');
 const r=registry.editorialReviews[id],a=audit.units[id];
 assert.equal(r.grade,'A',id);assert.equal(r.contentSha256,sha,id+' registry SHA');assert.equal(a.contentSha256,sha,id+' audit SHA');
 assert.equal(r.reviewMethod,'ai_editorial_second_pass');assert.equal(r.humanLearnerTesting,'not_performed');
 assert.ok(r.author&&r.reviewer&&r.author!==r.reviewer);
 assert.ok(r.summary.length>160&&r.evidence.length===6);
 for(const d of dimensions){assert.ok(r.scores[d]>=80&&r.scores[d]<=100,id+' score '+d);
  assert.ok(r.evidence.some(e=>e.dimension===d&&e.method&&e.reference&&e.result),id+' evidence '+d);}
 for(const g of gates)assert.equal(r.gates[g],true,id+' gate '+g);
 assert.equal(a.technicalSources.length,1);
 console.log('PASS A editorial IA',id,sha.slice(0,12));
}
for(let n=1;n<=130;n++)assert.equal(registry.editorialReviews['AULA-'+String(n).padStart(3,'0')]?.grade,'A','Lost A '+n);
for(const id of ['AULA-160','AULA-166','LOG-01','NET-25','PY-01'])assert.equal(registry.editorialReviews[id]?.grade,'A');
assert.ok(Object.values(registry.editorialReviews).filter(x=>x.grade==='A').length>=145);
console.log('PASS 145+ A editoriais, hash íntegro, 135 anteriores preservadas.');
