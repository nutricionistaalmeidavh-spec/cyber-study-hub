import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const read = path => JSON.parse(readFileSync(path,'utf8'));
const modules=read('src/trails/ai-dev/modules.json').modules;
const contracts=read('src/trails/ai-dev/labContracts.json');
const catalog=read('public/course-labs/ai-dev-meu-gestor/kits/catalog.json');
assert.equal(modules.length,8);
assert.equal(contracts.length,8);
assert.equal(catalog.kits.length,6);
const ids=new Set(catalog.kits.map(k=>k.id));
for(const module of modules){
 const lab=module.lessons.find(l=>l.kind==='laboratorio');
 const contract=contracts.find(c=>c.moduleId===module.moduleId);
 assert.ok(lab&&contract, 'Módulo '+module.moduleId+' sem contrato');
 for(const key of ['deliverable','kind','entrypoint','instructions','verify','preflight','evidence','verifiedExecution'])assert.ok(contract[key],key+' ausente em '+module.moduleId);
 assert.ok(existsSync('public'+contract.entrypoint),'Arquivo do laboratório ausente '+contract.entrypoint);
 assert.ok(existsSync('public'+contract.instructions),'Roteiro ausente');
 assert.ok(contract.optionalKits.every(k=>ids.has(k)),'Kit desconhecido');
 assert.equal(lab.acceptance.length,5);assert.equal(lab.brief.length,4);
}
for(let id=47;id<=60;id++){
 const lab=read('src/content/main/'+String(id).padStart(3,'0')+'/lesson.json').lab;
 assert.ok(lab.resources?.length>=2,'Aula V2 '+id+' sem pacote identificado');
 for(const file of lab.resources.filter(r=>r.href.startsWith('/course-labs/'))){
  assert.ok(existsSync('public'+file.href),'Recurso quebrado na aula '+id+': '+file.href);
 }
}
const docs=['public/course-labs/a171-180/README.md','public/course-labs/a181-190/README.md','public/course-labs/a201-208/README.md','public/course-labs/capstone-final/README.md','public/course-labs/ai-dev-meu-gestor/LABORATORIOS-A.md','public/course-labs/ai-dev-meu-gestor/kits/README.md'];
for(const doc of docs)assert.ok(readFileSync(doc,'utf8').length>1000);
for(const file of ['public/course-labs/a201-208/models.mjs','public/course-labs/a201-208/lab.test.mjs','public/course-labs/capstone-final/model.mjs','public/course-labs/capstone-final/lab.test.mjs','public/course-labs/capstone-final/server.mjs'])assert.ok(existsSync(file),file+' ausente');

const toolCatalog=read('public/course-labs/lab-tools/scenarios.json').scenarios;
assert.equal(toolCatalog.length,30,'A trilha de ferramentas precisa de 30 casos reais com contraprova');
const toolCodes=new Set();
for(const item of toolCatalog){
 assert.ok(!toolCodes.has(item.code),'LAB duplicado: '+item.code);toolCodes.add(item.code);
 assert.ok(item.objective&&item.title&&item.limitation);
 assert.ok(Object.hasOwn(item.positive,item.field)&&Object.hasOwn(item.negative,item.field));
 assert.equal(typeof item.positive[item.field],typeof item.negative[item.field]);
 assert.notEqual(item.positive[item.field],item.negative[item.field],'Caso negativo deve alterar decisão: '+item.code);
 const guide='public/course-labs/lab-tools/workshops/'+item.code+'.md';
 assert.ok(existsSync(guide),'Roteiro inexistente: '+guide);
 const text=readFileSync(guide,'utf8');
 for(const phrase of ['## O problema específico da aula','## O que o aluno precisa fazer','## Critérios de aprovação A','Limitação crucial']){
  assert.ok(text.includes(phrase),'Seção didática ausente: '+item.code+' -> '+phrase);
 }
}
for(let id=171;id<=180;id++){
 const guide='public/course-labs/a171-180/workshops/AULA-'+id+'.md';
 assert.ok(existsSync(guide),'Aula de pesquisa sem laboratório próprio: '+id);
 assert.ok(readFileSync(guide,'utf8').includes('node public/course-labs/a171-180/run.mjs '+id));
}
for(const path of ['public/course-labs/a171-180/models.mjs','public/course-labs/a171-180/research-models.mjs','public/course-labs/a171-180/run.mjs','public/course-labs/a171-180/lab.test.mjs','public/course-labs/a171-180/research.test.mjs','public/course-labs/lab-tools/model.mjs','public/course-labs/lab-tools/run.mjs','public/course-labs/lab-tools/lab.test.mjs','src/lib/labCourseResources.ts'])assert.ok(existsSync(path),path+' ausente');
const app=readFileSync('src/components/curriculum/CourseDocumentViewer.tsx','utf8');
assert.ok(app.includes('getParallelLabGuide')&&app.includes('getMainLabGuide')&&app.includes('labGuide.guide'),'Aula não mostra o roteiro específico');
const mainDoc=readFileSync('src/components/curriculum/CourseDocumentViewer.tsx','utf8');
const matches=mainDoc.split('\n').filter(line=>line.includes("'/course-labs/") && line.trim().startsWith('[')).map(line=>{
 const left=line.indexOf('['),comma1=line.indexOf(',',left),comma2=line.indexOf(',',comma1+1);
 const from=Number(line.slice(left+1,comma1)),to=Number(line.slice(comma1+1,comma2));
 const start=line.indexOf("'/course-labs/"),end=line.indexOf("'",start+1);
 return {from,to,file:line.slice(start+1,end)};
}).filter(item=>Number.isInteger(item.from)&&Number.isInteger(item.to)&&item.file.startsWith('/course-labs/'));
assert.ok(matches.length>=25,'Mapa central sem faixas suficientes');
for(let id=1;id<=218;id++)assert.equal(matches.filter(item=>id>=item.from&&id<=item.to).length,1,'Aula '+id+' com pacote ausente ou ambíguo');
for(const item of matches)assert.ok(existsSync('public'+item.file),'Link central quebrado: '+item.file);
console.log('PASS: 218 aulas mapeadas em pacotes existentes');
console.log('PASS: 8 contratos Meu Gestor, 6 kits, 14 aulas V2, 10 aulas de pesquisa e 30 oficinas específicas de ferramentas');
