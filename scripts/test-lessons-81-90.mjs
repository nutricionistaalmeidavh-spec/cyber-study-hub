import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const catalog=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
for(let n=81;n<=90;n++){
 const code=String(n).padStart(3,'0'),id='AULA-'+code;
 const lesson=fs.readFileSync('public/course-library/main/'+code+'.md','utf8');
 const key=fs.readFileSync('public/course-labs/a81-90/answer-keys/'+id+'.md','utf8');
 assert.ok(catalog.main.some(x=>x.id===n),id+' ausente');
 for(const heading of ['### Problema e competência verificável','### Mecanismo e exemplo resolvido',
  '### Laboratório guiado','### Detecção, defesa, limites e fontes','## Caso de transferência','## Checklist de domínio'])
  assert.ok(lesson.includes(heading),id+' falta '+heading);
 assert.ok(lesson.length>9500,id+' conteúdo insuficiente');
 assert.ok(lesson.includes('run.mjs '+n),id+' comando inválido');
 assert.ok(lesson.includes('/course-labs/a81-90/answer-keys/'+id+'.md'),id+' gabarito sem vínculo');
 for(let q=1;q<=6;q++){assert.ok(lesson.includes('\n'+q+'. '),id+' questão '+q);}
 assert.ok(key.includes('**Erro eliminatório:**')&&key.includes('## Rubrica de correção'));
 assert.ok(!lesson.includes('Qual afirmação melhor resume'),id+' quiz genérico');
 for(const match of lesson.matchAll(/\]\((\/course-labs\/[^)#?]+)\)/g))
   assert.ok(fs.existsSync('public'+match[1]),id+' link inválido '+match[1]);
 console.log('A estrutura editorial',id,createHash('sha256').update(lesson).digest('hex').slice(0,12));
}
