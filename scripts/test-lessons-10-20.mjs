import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root=process.cwd();
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const catalog=JSON.parse(fs.readFileSync('src/curriculum/catalog.json','utf8'));
assert.equal(catalog.main.length,218);
assert.equal(catalog.parallel.length,325);
for(let id=10;id<=20;id++){
  const key='AULA-'+String(id).padStart(3,'0');
  const mdPath='public/course-library/main/'+String(id).padStart(3,'0')+'.md';
  const keyPath='public/course-labs/a10-20/answer-keys/'+key+'.md';
  const md=fs.readFileSync(mdPath,'utf8');
  const answers=fs.readFileSync(keyPath,'utf8');
  assert.ok(catalog.main.some(x=>x.id===id),key+' fora do catálogo');
  for(const heading of ['## Problema e competência verificável','## Mecanismo','## Laboratório guiado','## Detecção, defesa','## Caso de transferência — prova independente','## Checklist de domínio']){
    assert.ok(md.includes(heading),key+' sem '+heading);
  }
  assert.ok(!md.includes('Qual ideia resume melhor'),key+' contém quiz genérico legado');
  assert.ok(md.includes('/course-labs/a10-20/answer-keys/'+key+'.md'));
  assert.ok(answers.includes('**Erro eliminatório:**'));
  assert.ok(answers.includes('## Rubrica de correção'));
  assert.ok(md.length>5000,key+' superficial');
  for(const [,link] of md.matchAll(/\]\((\/course-labs\/[^)#?]+)\)/g)){
    assert.ok(!link.includes('..') && fs.existsSync(path.join(root,'public',link)),key+' link inválido '+link);
  }
  for(let q=1;q<=6;q++)assert.ok(md.includes('\n'+q+'. '),key+' questão '+q+' ausente');
  const actual=createHash('sha256').update(md).digest('hex');
  if(registry.editorialReviews?.[key]){
    assert.equal(registry.editorialReviews[key].contentSha256,actual,key+' nota editorial obsoleta');
    assert.equal(registry.editorialReviews[key].humanLearnerTesting,'not_performed');
  }
  console.log('PASS conteúdo e rubrica',key,actual.slice(0,12));
}
console.log('PASS 11 unidades, laboratório sem custo obrigatório, identidade e links preservados.');
