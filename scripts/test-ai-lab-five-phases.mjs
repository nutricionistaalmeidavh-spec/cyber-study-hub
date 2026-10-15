import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const catalog=JSON.parse(read('src/curriculum/catalog.json'));
const modules=JSON.parse(read('src/trails/ai-dev/modules.json')).modules;
const contracts=JSON.parse(read('src/trails/ai-dev/labContracts.json'));
const data=read('src/trails/ai-dev/labJourneyData.ts');
const view=read('src/trails/ai-dev/AiLabLearningPath.tsx');
const route=read('src/trails/ai-dev/AiDevelopmentTrail.tsx');
const css=read('src/trails/ai-dev/ai-lab-path.css');
const base='public/course-labs/ai-dev-meu-gestor/';
test('Os oito roteiros reutilizam IDs canônicos existentes e contratos individuais',()=>{
 assert.equal(modules.length,8);
 assert.equal(contracts.length,8);
 assert.equal(catalog.main.length+catalog.parallel.length+catalog.guided.length,639);
 assert.equal(catalog.guided.filter(x=>x.source==='ai-dev').length,32);
 assert.equal(catalog.guided.filter(x=>x.source==='reverse-ai').length,32);
 for(const m of modules){
  const l=m.lessons.find(x=>x.kind==='laboratorio');
  assert.equal(l.stepId,m.moduleId*4);
  assert.ok(catalog.guided.some(x=>x.code==='DEV-IA-'+String(l.stepId).padStart(3,'0')));
  assert.ok(contracts.some(x=>x.moduleId===m.moduleId));
 }
 assert.match(route,/<AiLabLearningPath/);
 assert.match(route,/syncCanonicalGuidedProgress/);
});
test('O site apresenta as cinco etapas em ordem e distingue computador e navegador',()=>{
 const headings=['Explicação — o que você vai construir','Arquivos prontos — comece pelo projeto correto',
  'Tutorial — preparar e executar','Laboratório — faça a integração ou alteração','Validação — comprove que funcionou'];
 let previous=-1;
 for(const h of headings){const offset=view.indexOf(h);assert.ok(offset>previous,h);previous=offset;}
 for(const token of ['path.fileUrl','path.projectUrl','path.setup.map','path.run.join','lesson.brief?.map',
 'contract.deliverable','contract.verify','contract.evidence','repoZipUrl','Não é necessário digitar comandos no site'])
  assert.ok(view.includes(token),token);
 assert.match(view,/repositório completo/);
});
test('Seis kits têm código ou guia real e integração v1.0 como destino',()=>{
 for(const ver of ['v0.1','v0.2','v0.3','v0.4','v0.5','v1.0']){
  assert.ok(existsSync(base+'checkpoints/'+ver+'/README.md'),ver);
  assert.ok(existsSync(base+'checkpoints/'+ver+'/package.json'),ver);
 }
 for(const name of ['starter.html','module-02/spec-template.md','kits/pdf/generate-pdf.mjs',
 'kits/serial/scale-simulator.cjs','kits/finance/classify-demo.mjs','kits/reporting/export-orders.mjs',
 'kits/ui/StatusCard.tsx','kits/scan/README.md','checkpoints/v1.0/src/extensions/Extensions.tsx']){
  assert.ok(existsSync(base+name),name);
 }
 const kits=JSON.parse(read(base+'kits/catalog.json')).kits;
 assert.equal(kits.length,6);
 for(const kit of kits)assert.ok(data.includes("id:'"+kit.id+"'"),kit.id);
 assert.match(view,/kitPaths.map/);
 assert.match(view,/<details className="ai-kit-item"/);
 assert.match(view,/kitPublicFile\(kit\)/);
 assert.match(view,/127\.0\.0\.1:4173/);
});
test('Navegação é responsiva sem esconder arquivos nem validação',()=>{
 assert.match(css,/@media\(max-width:680px\)/);
 assert.match(css,/min-height:44px/);
 assert.match(css,/grid-template-columns:1fr/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/overflow-wrap:anywhere/);
 assert.match(view,/aria-label/);
 assert.match(view,/href=\{'#criterios-'\+code\}/);
});
