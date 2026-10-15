import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
const json=path=>JSON.parse(read(path));
const fnv1a32=value=>{
 let h=0x811c9dc5;
 for(let i=0;i<value.length;i++)h=Math.imul(h^value.charCodeAt(i),0x01000193)>>>0;
 return h.toString(16).padStart(8,'0');
};
const course=json('src/trails/reverse-ai/modules.json');
const manifest=json('src/trails/reverse-ai/manifest.json');
const catalog=json('src/curriculum/catalog.json');
const grades=json('quality/trails/reverse-ai/reviews.json');
const offering=json('src/curriculum/courses.json').courses.find(c=>c.id==='engenharia-reversa-com-ia');
const dimensions=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','segundaPassagemCritica'];
assert.equal(manifest.modules.length,8);
assert.equal(manifest.totalSteps,32);
assert.equal(course.modules.length,8);
assert.equal(offering?.status,'draft','Liberar apenas depois de revisão de publicação e autorização comercial');
assert.equal(offering.modules.length,8);
assert.equal(grades.reviewType,'editorial_ai_only');
assert.equal(grades.humanLearnerTesting,'not_performed');
assert.equal(grades.externalHumanReview,'not_performed');
assert.equal(grades.liveReaExecution,'not_performed');
assert.equal(grades.liveGhidraExecution,'not_performed');
assert.equal(grades.checksumAlgorithm,'fnv1a32_utf16');
assert.deepEqual(Object.keys(grades.modules).sort(),['01','02','03','04','05','06','07','08']);
assert.equal(catalog.guided.filter(x=>x.source==='reverse-ai').length,32);
assert.equal(catalog.main.length,218);assert.equal(catalog.parallel.length,325);
const codes=[...catalog.main,...catalog.parallel,...catalog.guided].map(x=>x.code);
assert.equal(codes.length,639);assert.equal(new Set(codes).size,639);
assert.equal(read('src/trails/reverse-ai/modules.json'),read('public/course-labs/reverse-ai/modules.json'),'O currículo publicado precisa ser o mesmo da fonte');
const fileSet=new Set();
for(let i=0;i<8;i++){
 const module=course.modules[i],id=String(i+1).padStart(2,'0'),review=grades.modules[id],lab=module.lessons[3];
 const base='public/course-labs/reverse-ai/',guide=base+'module-'+id+'.md',
  exam=base+'assessments/module-'+id+'.md',key=base+'answer-keys/module-'+id+'.md';
 assert.equal(module.moduleId,i+1);assert.equal(module.lessons.length,4);
 assert.ok(review&&review.moduleId===i+1&&review.grade==='A','Módulo sem revisão A: '+id);
 assert.equal(review.reviewType,'editorial_ai_only');assert.equal(review.humanLearnerTesting,'not_performed');
 assert.equal(review.moduleFnv32,fnv1a32(JSON.stringify(module)),'Módulo mudou após parecer A: '+id);
 assert.equal(review.guideFnv32,fnv1a32(read(guide)),'Guia mudou após parecer A: '+id);
 assert.equal(review.examFnv32,fnv1a32(read(exam)),'Prova mudou após parecer A: '+id);
 assert.equal(review.keyFnv32,fnv1a32(read(key)),'Gabarito mudou após parecer A: '+id);
 assert.ok(review.scores&&review.gates&&review.evidence?.length===6);
 for(const gate of gates)assert.equal(review.gates[gate],true,'Gate insuficiente: '+id+'/'+gate);
 for(const dim of dimensions){
  assert.ok(Number.isInteger(review.scores[dim])&&review.scores[dim]>=85&&review.scores[dim]<=100,'Nota sem evidência: '+id+'/'+dim);
  const found=review.evidence.find(e=>e.dimension===dim);
  assert.ok(found?.method?.length>15&&found?.reference?.length>10&&found?.result?.length>75,'Dimensão sem evidência: '+id+'/'+dim);
 }
 assert.equal((read(exam).match(/^\d+\. /gm)||[]).length,6,'6 questões exigidas: '+id);
 assert.equal((read(key).match(/^\d+\. /gm)||[]).length,6,'6 respostas exigidas: '+id);
 assert.ok(read(key).includes('**Erro eliminatório:**')&&read(key).includes('## Rubrica de correção'));
 assert.match(lab.labCommand,/engine\.mjs --module/);
 assert.ok(existsSync('public'+lab.starterSourceUrl));
 const output=lab.expectedArtifact.match(/Arquivo (\S+)/)?.[1];assert.ok(output&&output.endsWith('.json'));
 assert.ok(!fileSet.has(output),'Laboratórios repetidos sem artefato específico: '+output);fileSet.add(output);
 const steps=offering.modules[i].lessonCodes;
 for(let k=0;k<4;k++){const id='REV-IA-'+String(i*4+k+1).padStart(3,'0');assert.equal(steps[k],id);}
}
assert.equal(fileSet.size,8);
assert.match(read('public/course-labs/reverse-ai/engine.mjs'),/runModule/);
assert.match(read('public/course-labs/reverse-ai/engine.test.mjs'),/test\('M07/);
console.log('REV-IA: 8 módulos editoriais A com 6 evidências cada, 32 IDs estáveis, artefatos específicos e integridade verificada. Testes executáveis em test:reverse-ai.');
