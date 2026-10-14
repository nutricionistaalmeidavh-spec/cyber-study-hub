import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const catalog=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
assert.equal(catalog.main.length,218,'identidades main alteradas');
assert.equal(catalog.parallel.length,325,'identidades paralelas alteradas');
const seen=new Set();
for(let n=61;n<=70;n++){
 const k=String(n).padStart(3,'0'),id='AULA-'+k;
 const u=catalog.main.find(x=>x.id===n);
 assert.equal(u?.contentPath,`/course-library/main/${k}.md`);
 assert.ok(!seen.has(u?.id));seen.add(u.id);
 const doc=fs.readFileSync(`public/course-library/main/${k}.md`,'utf8');
 const key=fs.readFileSync(`public/course-labs/a061-070/answer-keys/${id}.md`,'utf8');
 const heading=doc.includes('## 6. Prova final independente')?'## 6. Prova final independente':null;
 assert.ok(heading,`${id}: prova independente não encontrada`);
 const exam=doc.split(heading)[1].split('## 7. Revisão ativa')[0].split('## 7. Recuperação ativa')[0];
 assert.equal((exam.match(/^\d+\. /gm)||[]).length,6,`${id}: 6 perguntas esperadas`);
 assert.equal((key.match(/^### Questão \d+/gm)||[]).length,6,`${id}: 6 respostas esperadas`);
 assert.ok(key.includes('## Rubrica'),`${id}: sem rubrica`);
 assert.ok(key.includes('**Erro eliminatório:**'),`${id}: sem erro eliminatório`);
 for(const term of ['## 1. Problema real','## 3.','## 4. Laboratório','## 5.','## 6. Prova final independente'])
   assert.ok(doc.includes(term),`${id}: sem seção ${term}`);
 assert.ok(doc.length>=6400,`${id}: conteúdo técnico insuficiente`);
 assert.doesNotMatch(doc,/Qual afirmação melhor resume o foco desta aula|const input="lab"\s*;/,`${id}: exercício genérico`);
 const local=[...doc.matchAll(/\]\((\/course-labs\/[A-Za-z0-9_./-]+)\)/g)].map(x=>x[1]);
 assert.ok(local.length>=3,`${id}: sem modelo, teste e gabarito`);
 for(const f of local){
  assert.ok(!f.includes('..'),`${id}: path inseguro`);
  assert.ok(fs.existsSync('public'+f),`${id}: caminho não publicado ${f}`);
 }
 const current=registry.editorialReviews[id];
 if(current){assert.equal(current.grade,'A');assert.equal(current.contentSha256,createHash('sha256').update(doc).digest('hex'));}
 console.log('PASS conteúdo 061–070:',id,doc.length);
}
console.log('PASS: 10 documentos completos, 60 questões independentes, gabaritos e links reais, 543 IDs intactos.');
