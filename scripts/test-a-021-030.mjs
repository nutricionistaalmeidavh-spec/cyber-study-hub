import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root=process.cwd();
const ids=Array.from({length:10},(_,i)=>`AULA-${String(i+21).padStart(3,'0')}`);
const dimensions=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const audit=JSON.parse(fs.readFileSync('quality/reviews/a-021-030-2026-10-13.json','utf8'));
const catalog=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
assert.deepEqual(Object.keys(audit.units).sort(),ids);
assert.equal(catalog.main.length,218);
assert.equal(catalog.parallel.length,325);
const unrelated=Object.entries(registry.editorialReviews).filter(([id])=>!ids.includes(id));
assert.ok(unrelated.length>=15,'Never erase earlier 15 approved editorial reviews');
for(const id of ids){
 const num=Number(id.slice(5));
 const canonical=catalog.main.find(u=>u.id===num);
 assert.ok(canonical,`${id} missing from canonical catalog`);
 assert.equal(canonical.contentPath,`/course-library/main/${String(num).padStart(3,'0')}.md`);
 const file=path.join(root,'public',canonical.contentPath.slice(1));
 const markdown=fs.readFileSync(file,'utf8');
 const sha=createHash('sha256').update(markdown).digest('hex');
 const keyFile=path.join(root,'public/course-labs/a-021-030/answer-keys',`${id}.md`);
 const answers=fs.readFileSync(keyFile,'utf8');
 const review=registry.editorialReviews[id];
 const auditUnit=audit.units[id];
 assert.equal(review.grade,'A',`${id}: editorial A must be recorded`);
 assert.equal(review.contentSha256,sha,`${id}: stale editorial hash`);
 assert.equal(auditUnit.contentSha256,sha,`${id}: stale audit hash`);
 assert.equal(review.reviewMethod,'ai_editorial_second_pass');
 assert.equal(review.humanLearnerTesting,'not_performed','never claim human user tests');
 assert.match(review.reviewer,/IA|GPT/i);
 assert.ok(review.reviewer!==review.author);
 assert.deepEqual(Object.keys(review.scores).sort(),[...dimensions].sort());
 for(const dim of dimensions){
   assert.ok(review.scores[dim]>=80 && review.scores[dim]<=100,`${id} ${dim} below A`);
   assert.ok(review.evidence.find(e=>e.dimension===dim && e.method && e.reference && e.result),`${id} without evidence ${dim}`);
 }
 for(const gate of gates)assert.equal(review.gates[gate],true,`${id}: ${gate} gate not proven`);
 for(const heading of ['## Problema real','## Fundamentos','## Mecanismo técnico','## Exemplo resolvido','## Contraexemplo','## Laboratório reproduzível','## Defesa, detecção e reteste','## Transferência:','## Prova final independente'])assert.ok(markdown.includes(heading),`${id} missing ${heading}`);
 assert.ok(markdown.includes(`/course-labs/a-021-030/answer-keys/${id}.md`));
 const section=markdown.split('## Prova final independente')[1].split('## Checklist')[0];
 assert.equal((section.match(/^\d+\.\s+/gm)||[]).length,6,`${id}: expected 6 independent questions`);
 assert.equal((answers.match(/^\d+\.\s+/gm)||[]).length,6,`${id}: expected 6 reviewed answers`);
 assert.match(answers,/Erro eliminatório/i);
 assert.ok(markdown.length>3500,`${id}: too short for theory and practice`);
 assert.doesNotMatch(markdown,/Qual ideia resume melhor|const input="lab"|Defina escopo\n2\. Gere um evento benigno/i);
 for(const src of auditUnit.technicalSources)assert.match(src,/^https:\/\//);
 console.log(`${id} A editorial IA OK — ${sha.slice(0,12)}`);
}
console.log(`Aulas 021–030: 10 provas independentes, 60 perguntas, evidências por dimensão, 543 IDs intactos; aprovação editorial IA não implica teste humano.`);
