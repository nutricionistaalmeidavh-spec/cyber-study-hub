import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8'),catalog=JSON.parse(read('src/curriculum/catalog.json'));
const ids=Array.from({length:48},(_,i)=>171+i);
const folder=id=>id<=180?'a171-180':id<=190?'a181-190':id<=200?'a191-200':id<=208?'a201-208':'capstone-final';
test('P2: A171–A218 possuem uma oficina própria, arquivos e comando por ID',()=>{
 assert.equal(ids.length,48);
 for(const id of ids){
  const dir=folder(id),file='public/course-labs/'+dir+'/workshops/AULA-'+id+'.md';
  assert.ok(existsSync(file),'Sem oficina: '+id);
  const content=read(file);
  assert.ok(content.includes('AULA-'+id));
  assert.ok(content.includes('node public/course-labs/'+dir+'/'));
  assert.ok(content.length>1100,'Roteiro curto: '+id);
  assert.ok(!content.includes('answer-keys/'),'Não colocar gabarito no roteiro do aluno');
 }
});
test('P2: 30 LAB de ferramentas com cenário, contraprova e fonte sem ferramentas perigosas',()=>{
 const labs=JSON.parse(read('public/course-labs/lab-tools/scenarios.json')).scenarios;
 assert.equal(labs.length,30);
 for(const item of labs){
  assert.ok(existsSync('public/course-labs/lab-tools/workshops/'+item.code+'.md'));
  assert.notDeepEqual(item.positive,item.negative);
 }
});
test('P3: seis kits aparecem na tela v1.0 e são operados por domínio educacional',()=>{
 const base='public/course-labs/ai-dev-meu-gestor/checkpoints/v1.0/';
 const ui=read(base+'src/extensions/Extensions.tsx'),
  api=read(base+'server/http.mjs'),
  core=read(base+'src/extensions/core.ts'),
  main=read(base+'src/App.tsx');
 for(const name of ['RELATÓRIOS','PDF','FINANCEIRO','SERIAL','FRONTEND','QA'])assert.ok(ui.includes(name),name);
 for(const feature of ['ordersToCsv','normalizeScale','financePreview','printableOrder'])assert.ok(core.includes('function '+feature));
 assert.ok(main.includes("<Extensions clients={clients} orders={orders}/>"));
 assert.ok(api.includes('/api/extensions/quality'));
 assert.ok(api.includes('/print'));
 assert.ok(api.includes("host!=='127.0.0.1'"),'API nunca deve abrir escuta pública');
 assert.ok(existsSync(base+'tests/extensions.test.mjs'));
});
test('sem regressão de IDs, login ou progresso do Hub',()=>{
 assert.deepEqual([catalog.main.length,catalog.parallel.length,catalog.guided.length],[218,325,96]); // Catálogo canônico atual
 assert.equal(new Set([...catalog.main,...catalog.parallel,...catalog.guided].map(x=>x.code)).size,639);
 assert.ok(existsSync('src/lib/guidedIdentity.ts'));
 assert.ok(existsSync('src/lib/studyProgress.ts'));
});
