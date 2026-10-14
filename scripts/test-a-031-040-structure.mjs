import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const catalog=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
assert.equal(catalog.main.length,218);
assert.equal(catalog.parallel.length,325);
for(let i=31;i<=40;i++){
 const num=String(i).padStart(3,'0'),code='AULA-'+num;
 const item=catalog.main.find(x=>x.id===i);
 assert.equal(item?.contentPath,'/course-library/main/'+num+'.md');
 const doc=fs.readFileSync('public/course-library/main/'+num+'.md','utf8');
 const answer=fs.readFileSync('public/course-labs/a031-040/answer-keys/'+code+'.md','utf8');
 const section=doc.slice(doc.lastIndexOf('## Prova final independente — competência aplicada'));
 const questions=section.split('## Revisão ativa e fontes')[0];
 assert.equal((questions.match(/^\d+\. /gm)||[]).length,6,code+' perguntas independentes');
 assert.equal((answer.match(/^## Questão \d+/gm)||[]).length,6,code+' gabaritos');
 assert.equal((answer.match(/\*\*Erro eliminatório:\*\*/gm)||[]).length,1);
 for(const heading of ['## Problema e objetivo mensurável','## Fundamentos e pré-requisitos recomendados','## Mecanismo técnico: entrada, fronteira, controle e resultado','## Laboratório reproduzível','## Detecção, prevenção e reteste','## Prova final independente — competência aplicada']){
  assert.ok(doc.includes(heading),code+' missing '+heading);
 }
 assert.ok(!questions.includes('Qual ideia resume melhor'),code+' quiz genérico');
 assert.ok(!questions.includes('const input="lab"'),code+' código de preenchimento');
 assert.ok(doc.length>7000,code+' conteúdo superficial');
 for(const m of doc.matchAll(/\]\((\/course-labs\/[\w./-]+)\)/g)){
   assert.ok(!m[1].includes('..')&&fs.existsSync('public'+m[1]),code+' arquivo ausente: '+m[1]);
 }
 const hash=createHash('sha256').update(doc).digest('hex');
 const grade=registry.editorialReviews[code];
 if(grade){
  assert.equal(grade.contentSha256,hash,code+' hash inválido');
  assert.equal(grade.humanLearnerTesting,'not_performed');
 }
 console.log('PASS conteúdo',code,hash.slice(0,12));
}
console.log('PASS: 10 aulas e 10 avaliações independentes, 543 IDs preservados.');
