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
console.log('PASS: 8 contratos de laboratório Meu Gestor, 6 kits, 14 aulas V2 com recursos existentes');
