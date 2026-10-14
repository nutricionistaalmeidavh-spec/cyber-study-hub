import assert from 'node:assert/strict';
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
for(let n=141;n<=150;n++){
 const id='AULA-'+n, p='public/course-library/main/'+n+'.md';
 const entry=catalog.main.find(x=>x.id===n);
 assert.equal(entry?.contentPath,'/course-library/main/'+n+'.md',id+' catálogo');
 const txt=fs.readFileSync(p,'utf8');
 const key=fs.readFileSync('public/course-labs/a141-150/answer-keys/'+id+'.md','utf8');
 for(const section of ['## Oficina A — hipótese, evidência e fronteiras','### Exemplo resolvido, entradas e resultados','### Laboratório reproduzível e controles negativos','### Defesas, reteste e limites','## Prova de transferência independente','## Critérios de conclusão'])
  assert.ok(txt.includes(section),id+' falta '+section);
 assert.ok(txt.includes('/course-labs/a141-150/answer-keys/'+id+'.md'));
 assert.ok(!txt.includes('Qual é o foco principal desta aula?'),id+' quiz genérico');
 assert.ok(!txt.includes('Defina '+entry.title+' em uma frase'),id+' avaliação genérica');
 const exam=txt.slice(txt.indexOf('## Prova de transferência independente'));
 assert.equal((exam.match(/^[1-6]\. /gm)||[]).length,6,id+' perguntas');
 assert.ok(txt.length>=10900,id+' precisa de aprofundamento');
 assert.ok(key.includes('## Rubrica de correção')&&key.includes('**Erro eliminatório:**'));
 console.log('PASS estrutura',id);
}