import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(import.meta.dirname,'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const sha=s=>createHash('sha256').update(s).digest('hex');
const manifest=json('src/trails/ai-dev/manifest.json');
const course=json('src/trails/ai-dev/modules.json');
const grades=json('quality/trails/ai-dev/reviews.json');
const catalog=json('src/curriculum/catalog.json');
const dimensions=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','segundaPassagemCritica'];
const stepKinds=['microaula','microaula-ia','referencia','laboratorio'];
const rootLab='public/course-labs/ai-dev-meu-gestor';
assert.equal(catalog.main.length,218,'Catálogo principal alterado');
assert.equal(catalog.parallel.length,325,'Catálogo paralelo alterado');
assert.equal(manifest.modules.length,8);
assert.equal(manifest.totalSteps,32);
assert.equal(course.modules.length,5,'Só os cinco primeiros módulos são liberados nesta fase');
assert.equal(manifest.newMicroLessons,16);
assert.equal(manifest.reusedReferences,8);
assert.equal(manifest.newLabs,8);
assert.deepEqual(Object.keys(grades.modules).sort(),['01','02','03','04','05']);
assert.deepEqual(manifest.modules.filter(m=>m.status==='available').map(m=>m.id),[1,2,3,4,5]);
assert.deepEqual(manifest.modules.filter(m=>m.status==='planned').map(m=>m.id),[6,7,8]);
const ids=[];
for(const [index,module] of course.modules.entries()){
  const id=String(index+1).padStart(2,'0');
  assert.equal(module.moduleId,index+1);
  assert.equal(module.lessons.length,4);
  assert.equal(module.learningOutcomes.length,4);
  const original=manifest.modules[index];
  assert.equal(original.id,module.moduleId);
  assert.equal(original.reusedLessonCode,module.lessons[2].referenceCode);
  const referenced=catalog.parallel.find(x=>x.code===original.reusedLessonCode);
  assert.ok(referenced,'Referência não canônica: '+original.reusedLessonCode);
  assert.ok(existsSync(resolve(root,'public'+referenced.contentPath)),'Referência inacessível: '+original.reusedLessonCode);
  assert.deepEqual(module.lessons.map(s=>s.kind),stepKinds);
  assert.deepEqual(module.lessons.map(s=>s.stepId),[0,1,2,3].map(j=>index*4+j+1));
  for(const step of module.lessons)ids.push(step.stepId);
  for(const step of module.lessons.slice(0,2)){
    assert.equal(step.sections.length,3,'Microaula sem progressão suficiente: '+step.stepId);
    assert.ok(step.sections.every(s=>s.heading.length>6&&s.body.length>140&&s.example?.length>50&&s.counterexample?.length>50),'Exemplo/contraexemplo insuficiente: '+step.stepId);
  }
  assert.ok(module.lessons[0].challenge.options.length>=3);
  assert.ok(Number.isInteger(module.lessons[0].challenge.answer));
  assert.ok(module.lessons[1].prompt.length>250);
  assert.ok(module.lessons[1].reviewQuestions.length>=3);
  assert.ok(module.lessons[2].challengeText.length>100);
  assert.equal(module.lessons[2].referencePath,'#course/parallel/'+original.reusedLessonCode);
  const lab=module.lessons[3];
  assert.equal(lab.acceptance.length,5);
  assert.equal(lab.brief.length,4);
  assert.ok(lab.assessmentPrompt.length>100);
  assert.ok(existsSync(resolve(root,'public'+lab.starterSourceUrl)),'Instrução de checkpoint ausente: '+lab.starterSourceUrl);
  const exam=read('public'+module.assessmentPath);
  const key=read('public'+module.answerKeyPath);
  assert.equal((exam.match(/^\d+\. /gm)||[]).length,6,'Prova precisa de 6 questões');
  assert.equal((key.match(/^\d+\. /gm)||[]).length,6,'Gabarito precisa de 6 respostas');
  assert.ok(key.includes('**Erro eliminatório:**')&&key.includes('## Rubrica de correção'));
  assert.ok(!exam.includes('Resposta esperada:'),'Gabarito exposto na prova');
  const review=grades.modules[id];
  assert.equal(review.grade,'A');
  assert.equal(review.reviewType,'editorial_ai_only');
  assert.equal(review.humanLearnerTesting,'not_performed');
  assert.equal(review.contentSha256,sha(JSON.stringify(module)),'Conteúdo mudou após parecer A '+id);
  assert.equal(review.examSha256,sha(exam),'Prova mudou após parecer A '+id);
  assert.equal(review.answerKeySha256,sha(key),'Gabarito mudou após parecer A '+id);
  assert.ok(existsSync(resolve(root,review.labPath)),'Laboratório ausente: '+id);
  assert.equal(review.labSha256,sha(read(review.labPath)),'Laboratório mudou após parecer A '+id);
  assert.equal(review.evidence.length,6,'Requer seis evidências');
  for(const dimension of dimensions){
    const score=review.scores[dimension];
    assert.ok(typeof score==='number'&&score>=80&&score<=100,'Nota A sem fundamento: '+id+'/'+dimension);
    const e=review.evidence.find(e=>e.dimension===dimension);
    assert.ok(e&&e.method?.length>10&&e.reference?.length>10&&e.result?.length>40,'Evidência incompleta: '+id+'/'+dimension);
  }
  for(const gate of gates)assert.equal(review.gates[gate],true,'Gate editorial pendente: '+id+'/'+gate);
}
assert.deepEqual(ids,Array.from({length:20},(_,i)=>i+1));
for(const m of manifest.modules)assert.deepEqual(m.steps.map(x=>x.type),stepKinds);
const testPaths=[
  rootLab+'/tests/starter.test.mjs',
  rootLab+'/module-02/spec-rules.test.mjs',
  rootLab+'/checkpoints/v0.3/tests/domain.test.mjs'
];
for(const path of testPaths)assert.ok(existsSync(resolve(root,path)),'Teste prático ausente: '+path);
console.log('Módulos IA: 5/5 pareceres A editoriais IA com hashes, 20 etapas, 30 questões e 5 laboratórios.');
if(!process.argv.includes('--structure-only'))execFileSync(process.execPath,['--test',...testPaths],{cwd:root,stdio:'inherit'});

