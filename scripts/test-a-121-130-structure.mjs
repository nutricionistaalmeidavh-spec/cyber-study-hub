import assert from 'node:assert/strict';
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
for(let n=121;n<=130;n++){
 const id='AULA-'+n,p='public/course-library/main/'+n+'.md';
 const lesson=fs.readFileSync(p,'utf8');
 const key=fs.readFileSync('public/course-labs/a121-130/answer-keys/'+id+'.md','utf8');
 const entry=catalog.main.find(x=>x.id===n);
 assert.equal(entry?.contentPath,'/course-library/main/'+n+'.md',id+' identidade canônica');
 for(const heading of ['## Oficina A — cenário profissional e hipótese','### Exemplo técnico com resultado previsto','### Prática reproduzível, positivo e negativo','### Diagnóstico, hardening e limites','## Avaliação independente — transferência de competência','## Checklist de saída A'])
  assert.ok(lesson.includes(heading),id+' sem '+heading);
 assert.ok(lesson.includes('/course-labs/a121-130/answer-keys/'+id+'.md'));
 assert.ok(!/Qual é o foco principal desta aula/.test(lesson),id+' quiz genérico');
 assert.ok(!/Defina .* em uma frase sem usar/.test(lesson),id+' miniavaliação genérica');
 const quiz=lesson.slice(lesson.indexOf('## Avaliação independente — transferência de competência'));
 assert.equal((quiz.match(/^[1-6]\. /gm)||[]).length,6,id+' seis perguntas');
 assert.ok(lesson.length>9200,id+' profundidade insuficiente');
 assert.ok(key.includes('## Rubrica objetiva')&&key.includes('**Erro eliminatório:**'));
 console.log('PASS estrutura',id);
}
