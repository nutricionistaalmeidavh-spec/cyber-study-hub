import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const catalog=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
assert.equal(catalog.main.length,218);
assert.equal(catalog.parallel.length,325);
for(let n=111;n<=120;n++){
 const code='AULA-'+n;
 const item=catalog.main.find(v=>v.id===n);
 assert.equal(item?.code,code);
 assert.equal(item?.contentPath,'/course-library/main/'+n+'.md');
 const lesson=fs.readFileSync('public/course-library/main/'+n+'.md','utf8');
 const key=fs.readFileSync('public/course-labs/a111-120/answer-keys/'+code+'.md','utf8');
 assert.ok(lesson.length>5000,code+' conteúdo insuficiente');
 for(const heading of ['## 1.','## 2.','## 3.','## 4.','## 5.','## 6.','## 7.'])assert.ok(lesson.includes(heading),code+' seção '+heading);
 const exam=lesson.split('## 6.')[1].split('## 7.')[0];
 assert.equal((exam.match(/^\d+\. /gm)||[]).length,6,code+' perguntas de transferência');
 assert.equal((key.match(/^### Questão \d+/gm)||[]).length,6,code+' respostas independentes');
 assert.ok(key.includes('## Rubrica'),code+' rubrica');
 assert.ok(key.includes('**Erro eliminatório:**'),code+' erro eliminatório');
 assert.ok(!/Qual é o foco principal desta aula\?|Qual evidência é mais forte\?/.test(exam),code+' perguntas genéricas');
 const links=[...lesson.matchAll(/\]\((\/course-labs\/[\w./-]+)\)/g)].map(x=>x[1]);
 assert.ok(links.length>=3,code+' referências locais');
 for(const link of links){
  assert.ok(!link.includes('..'));
  assert.ok(fs.existsSync('public'+link),code+' link quebrado '+link);
 }
 if(registry.editorialReviews[code]){
  assert.equal(registry.editorialReviews[code].contentSha256,createHash('sha256').update(lesson).digest('hex'));
 }
 console.log('PASS conteúdo e avaliação',code,lesson.length);
}
console.log('PASS: 10 aulas de engenharia reversa, 60 questões originais, 543 IDs intactos.');
