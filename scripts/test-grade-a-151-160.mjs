import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const audit=JSON.parse(fs.readFileSync('quality/reviews/a151-159-2026-10-14.json','utf8'));
const dimensions=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(Object.keys(audit.units).length,9,'160 já tinha A e permanece intocada');
assert.equal(audit.humanLearnerTesting,'not_performed');
for(let n=151;n<=159;n++){
 const id='AULA-'+n;
 const doc=fs.readFileSync('public/course-library/main/'+n+'.md','utf8');
 const sha=createHash('sha256').update(doc).digest('hex');
 const r=registry.editorialReviews[id],a=audit.units[id];
 assert.equal(r?.grade,'A',id);
 assert.equal(r.contentSha256,sha,id+' registro SHA');
 assert.equal(a.contentSha256,sha,id+' auditoria SHA');
 assert.equal(r.reviewMethod,'ai_editorial_second_pass');
 assert.equal(r.humanLearnerTesting,'not_performed');
 assert.notEqual(r.author,r.reviewer);
 assert.ok(r.summary.length>130);
 assert.equal(r.evidence.length,6);
 assert.ok(doc.length>12000,id+' conteúdo curto');
 assert.ok(doc.includes('## 18. Oficina A editorial'),id+' oficina');
 assert.ok(doc.includes('## Prova final independente'),id+' prova');
 assert.ok(!doc.includes('Qual é o foco principal desta aula?'),id+' quiz genérico');
 assert.ok(doc.includes('/course-labs/a151-159/answer-keys/'+id+'.md'),id+' referência do gabarito');
 const exam=doc.split('## Prova final independente')[1]?.split('### Fonte')[0]??'';
 assert.equal((exam.match(/^\d+\. \*\*/gm)??[]).length,6,id+' seis questões');
 const key=fs.readFileSync('public/course-labs/a151-159/answer-keys/'+id+'.md','utf8');
 assert.match(key,/rubrica/i);
 assert.match(key,/erro eliminat[oó]rio/i);
 assert.equal(a.technicalSources.length,1);
 for(const d of dimensions){
  assert.ok(r.scores[d]>=80&&r.scores[d]<=100,id+' nota '+d);
  assert.ok(r.evidence.some(e=>e.dimension===d&&e.method?.length>20&&e.reference?.length>20&&e.result?.length>35),id+' evidência '+d);
 }
 for(const gate of gates)assert.equal(r.gates[gate],true,id+' '+gate);
 console.log('PASS '+id+' '+sha.slice(0,12));
}
const id160='AULA-160',sha160=createHash('sha256').update(fs.readFileSync('public/course-library/main/160.md','utf8')).digest('hex');
assert.equal(registry.editorialReviews[id160].grade,'A');
assert.equal(registry.editorialReviews[id160].contentSha256,sha160,'160 preservada com seu próprio SHA original');
const expected=[...Array.from({length:130},(_,i)=>'AULA-'+String(i+1).padStart(3,'0')),...Array.from({length:10},(_,i)=>'AULA-'+(i+151)),'AULA-166','LOG-01','NET-25','PY-01'];
for(const id of expected)assert.equal(registry.editorialReviews[id]?.grade,'A','Nota A desapareceu: '+id);
assert.ok(Object.values(registry.editorialReviews).filter(x=>x.grade==='A').length>=144,'Continuidade mínima de 144 A');
console.log('PASS: nove promoções A, aula 160 preservada, 144 A; certificação humana não alegada.');
