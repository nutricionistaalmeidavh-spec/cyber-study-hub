import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const audit=JSON.parse(fs.readFileSync('quality/reviews/a51-60-2026-10-13.json','utf8'));
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const catalog=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
const dimensions=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(catalog.main.length,218);
assert.equal(catalog.parallel.length,325);
assert.equal(audit.reviewType,'ai_editorial_second_pass');
assert.equal(audit.humanLearnerTesting,'not_performed');
assert.equal(Object.keys(audit.units).length,10);
for(let i=51;i<=60;i++){
  const n=String(i).padStart(3,'0'),id='AULA-'+n;
  const text=fs.readFileSync(`public/course-library/main/${n}.md`,'utf8');
  const hash=createHash('sha256').update(text).digest('hex');
  const actual=registry.editorialReviews[id],doc=audit.units[id];
  assert.ok(actual&&doc,`${id}: missing review`);
  assert.equal(actual.grade,'A',id);
  assert.equal(doc.contentSha256,hash,`${id} stale audit`);
  assert.equal(actual.contentSha256,hash,`${id} stale grade`);
  assert.equal(actual.reviewMethod,'ai_editorial_second_pass');
  assert.equal(actual.humanLearnerTesting,'not_performed');
  assert.notEqual(actual.author,actual.reviewer);
  assert.ok(actual.summary.length>90,`${id} incomplete summary`);
  assert.equal(actual.evidence.length,6);
  assert.ok(text.includes('## 18. Oficina A'),`${id} missing guided practice`);
  assert.ok(text.includes('## Prova final independente — competência aplicada'),`${id} missing independent exam`);
  assert.ok(text.includes(`/course-labs/a051-060/answer-keys/${id}.md`),`${id} missing answer key link`);
  assert.ok(doc.technicalSources.every(x=>x.startsWith('https://')),`${id} missing sources`);
  if(i!==52)assert.ok(!text.includes('Qual afirmação melhor resume o foco desta aula?'),`${id} generic quiz remains`);
  const key=fs.readFileSync(`public/course-labs/a051-060/answer-keys/${id}.md`,'utf8');
  assert.ok(key.includes('## Rubrica de correção')&&key.includes('Erro eliminatório'),id);
  const section=text.split('## Prova final independente — competência aplicada')[1]?.split('### Fontes para conferência técnica')[0]??'';
  const nQuestions=(section.match(/^\d\. \*\*/gm)??[]).length;
  assert.equal(nQuestions,6,`${id}: expected exactly six independent questions`);
  for(const dimension of dimensions){
    assert.ok(Number.isFinite(actual.scores[dimension])&&actual.scores[dimension]>=80&&actual.scores[dimension]<=100,`${id}: ${dimension}`);
    assert.ok(actual.evidence.some(x=>x.dimension===dimension&&x.method?.length>20&&x.reference?.length>20&&x.result?.length>30),`${id}: evidence ${dimension}`);
  }
  for(const gate of gates)assert.equal(actual.gates[gate],true,`${id}: gate ${gate}`);
  console.log(`A editorial IA ${id}: ${hash.slice(0,12)}; 6 transfer questions, six verified dimensions`);
}
const grades=Object.values(registry.editorialReviews).filter(x=>x.grade==='A');
assert.ok(grades.length>=85,`Expected 75 previous A + ten new, got ${grades.length}`);
for(const id of ['AULA-001','AULA-009','AULA-021','AULA-031','AULA-041','AULA-050','LOG-01','PY-01','NET-25']){
 assert.equal(registry.editorialReviews[id]?.grade,'A',`Existing A lost: ${id}`);
}
console.log('A-051–060: 10/10 editorial IA, all 543 IDs retained, previous grades preserved');
