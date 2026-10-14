import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const catalog=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
for(let id=71;id<=80;id++){
  const n=String(id).padStart(3,'0'),code='AULA-'+n;
  const md=fs.readFileSync('public/course-library/main/'+n+'.md','utf8');
  const key=fs.readFileSync('public/course-labs/a071-080/answer-keys/'+code+'.md','utf8');
  assert.ok(catalog.main.some(item=>item.id===id&&item.contentPath==='/course-library/main/'+n+'.md'),code+' identidade canônica');
  for(const heading of ['## Oficina aplicada — cenário e competência','### Modelo mental e exemplo resolvido','### Laboratório reprodutível sem infraestrutura AD','### Diagnóstico, correção e limites','## Prova de transferência — avaliação independente','## Checklist de domínio aplicado'])
    assert.ok(md.includes(heading),code+' sem '+heading);
  assert.ok(md.includes('/course-labs/a071-080/answer-keys/'+code+'.md'));
  assert.ok(!/Qual afirmação melhor resume o foco desta aula/.test(md),code+' quiz genérico');
  assert.ok(!/Qual prática de investigação é mais correta/.test(md),code+' quiz genérico');
  assert.ok(md.length>10400,code+' conteúdo insuficiente');
  assert.ok(key.includes('## Rubrica de correção')&&key.includes('**Erro eliminatório:**'));
  const exam=md.slice(md.indexOf('## Prova de transferência — avaliação independente'));
  assert.equal((exam.match(/^\d+\. /gm)||[]).length,6,code+' prova deve ter 6 questões inéditas');
  for(const [,link] of md.matchAll(/\]\((\/course-labs\/[^)#?]+)\)/g))
    assert.ok(!link.includes('..')&&fs.existsSync(path.join('public',link)),code+' link inexistente: '+link);
  console.log('PASS material',code);
}
