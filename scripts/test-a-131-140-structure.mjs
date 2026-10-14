import assert from 'node:assert/strict';
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
for(let n=131;n<=140;n++){
 const id='AULA-'+n,path='public/course-library/main/'+n+'.md';
 const entry=catalog.main.find(x=>x.id===n);
 assert.equal(entry?.contentPath,'/course-library/main/'+n+'.md',id+' catálogo canônico');
 const content=fs.readFileSync(path,'utf8'),key=fs.readFileSync('public/course-labs/a131-140/answer-keys/'+id+'.md','utf8');
 for(const section of ['## Oficina A — hipótese, evidência e fronteiras','### Exemplo resolvido, entradas e resultados','### Laboratório reproduzível e controles negativos','### Defesas, reteste e limites','## Prova de transferência independente','## Critérios de conclusão'])
   assert.ok(content.includes(section),id+' falta '+section);
 assert.ok(content.includes('/course-labs/a131-140/answer-keys/'+id+'.md'));
 assert.ok(!/Qual é o foco principal desta aula/.test(content),id+' quiz genérico');
 assert.ok(!/Defina .* em uma frase sem usar/.test(content),id+' miniavaliação genérica');
 const exam=content.slice(content.indexOf('## Prova de transferência independente'));
 assert.equal((exam.match(/^[1-6]\. /gm)||[]).length,6,id+' seis itens');
 assert.ok(content.length>=9300,id+' aprofundamento');
 assert.ok(key.includes('## Rubrica de correção')&&key.includes('**Erro eliminatório:**'));
 if(n===135)assert.ok(content.includes('/course-labs/phase16-memory/README.md'),'135 capstone mantido');
 console.log('PASS conteúdo e rubrica',id);
}
