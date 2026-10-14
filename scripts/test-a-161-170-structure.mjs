import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const cat=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
const reg=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
assert.equal(cat.main.length,218,'218 main IDs precisam ser preservados');
assert.equal(cat.parallel.length,325,'325 trilhas paralelas precisam ser preservadas');
const targets=[161,162,163,164,165,167,168,169,170];
for(const n of targets){
 const id='AULA-'+n;
 const unit=cat.main.find(x=>x.id===n);
 assert.equal(unit?.code,id);
 assert.equal(unit?.contentPath,'/course-library/main/'+n+'.md');
 const path='public/course-library/main/'+n+'.md',doc=fs.readFileSync(path,'utf8');
 const answer='public/course-labs/a161-170/answer-keys/'+id+'.md',key=fs.readFileSync(answer,'utf8');
 assert.ok(doc.length>=9000,id+' conteúdo específico insuficiente');
 assert.ok(doc.includes('## Complemento A editorial'),id+' complemento não encontrado');
 assert.ok(doc.includes('### 2. Raciocínio mecanístico')||doc.includes('### 2. Mecanismo específico'),id+' mecanismo ausente');
 assert.ok(doc.includes('### 3. Laboratório verificável')||doc.includes('### 3. Experimento de mesa'),id+' laboratório ausente');
 const exam=doc.split(/### 4\. Prova independente|### 4\. Avaliação externa/)[1]?.split('### 5.')[0];
 assert.ok(exam,id+' prova de transferência ausente');
 assert.equal((exam.match(/^\d+\. /gm)||[]).length,6,id+' perguntas de cenário');
 assert.equal((key.match(/^### Questão \d+/gm)||[]).length,6,id+' respostas');
 assert.ok(key.includes('## Rubrica'),id+' rubrica');
 assert.ok(key.includes('**Erro eliminatório:**'),id+' erro eliminatório');
 for(const [whole,href] of doc.matchAll(/\]\((\/course-labs\/[\w./-]+)\)/g)){
  assert.ok(!href.includes('..'),id+' link traversal');
  assert.ok(fs.existsSync('public'+href),id+' link quebrado: '+href);
 }
 assert.ok(doc.includes('phase16-memory')||n>=167,id+' laboratório nativo anterior não foi preservado');
 if(reg.editorialReviews[id])assert.equal(reg.editorialReviews[id].contentSha256,createHash('sha256').update(doc).digest('hex'));
 console.log('PASS material',id,'questões 6, gabarito 6, links, hash');
}
const preserved=fs.readFileSync('public/course-library/main/166.md','utf8');
assert.equal(reg.editorialReviews['AULA-166'].grade,'A');
assert.equal(createHash('sha256').update(preserved).digest('hex'),reg.editorialReviews['AULA-166'].contentSha256,'166 foi modificada ou perdeu hash');
assert.ok(fs.existsSync('public/course-labs/pilot-a/answer-keys/AULA-166.md'));
console.log('PASS: 9 conteúdos novos e AULA-166 preservada; 543 IDs intactos.');
