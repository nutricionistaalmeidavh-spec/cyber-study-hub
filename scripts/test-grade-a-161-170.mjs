import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const audit=JSON.parse(fs.readFileSync('quality/reviews/a161-170-2026-10-14.json','utf8'));
const reg=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const dims=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
const items=[161,162,163,164,165,167,168,169,170];
assert.equal(Object.keys(audit.units).length,9);
assert.equal(audit.humanLearnerTesting,'not_performed');
for(const n of items){
 const id='AULA-'+n;
 const content=fs.readFileSync('public/course-library/main/'+n+'.md','utf8');
 const hash=createHash('sha256').update(content).digest('hex');
 const r=reg.editorialReviews[id],a=audit.units[id];
 assert.equal(r.grade,'A',id);
 assert.equal(r.contentSha256,hash,id+' hash');
 assert.equal(a.contentSha256,hash,id+' audit hash');
 assert.equal(r.reviewMethod,'ai_editorial_second_pass');
 assert.equal(r.humanLearnerTesting,'not_performed');
 assert.notEqual(r.author,r.reviewer);
 assert.ok(r.summary.length>=120);
 assert.equal(r.evidence.length,6);
 assert.equal(a.technicalSources.length,1);
 for(const dim of dims){assert.ok(r.scores[dim]>=80&&r.scores[dim]<=100,id+' score '+dim);assert.ok(r.evidence.some(e=>e.dimension===dim&&e.reference&&e.method&&e.result),id+' evidence '+dim);}
 for(const gate of gates)assert.equal(r.gates[gate],true,id+' gate '+gate);
 console.log('PASS A editorial IA',id,hash.slice(0,12));
}
assert.equal(reg.editorialReviews['AULA-166'].grade,'A','nota pré-existente ASLR');
assert.ok(Object.values(reg.editorialReviews).filter(x=>x.grade==='A').length>=153,'144 A prévias + 9 novas');
console.log('PASS: 9 novas notas A + AULA-166 preservada + demais classificações.');
