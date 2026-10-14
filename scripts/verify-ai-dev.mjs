import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
const get=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
const exists=path=>existsSync(resolve(root,path));
const manifest=get('src/trails/ai-dev/manifest.json'),learning=get('src/trails/ai-dev/modules.json'),reviews=get('src/trails/ai-dev/quality-reviews.json'),catalog=get('src/curriculum/catalog.json');
const source=[...catalog.main,...catalog.parallel],dims=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(catalog.main.length,218);assert.equal(catalog.parallel.length,325);assert.equal(source.length,543);
assert.equal(manifest.modules.length,8);assert.equal(manifest.totalSteps,32);
assert.equal(manifest.newMicroLessons,16);assert.equal(manifest.reusedReferences,8);assert.equal(manifest.newLabs,8);
assert.equal(learning.modules.length,5);assert.equal(reviews.moduleReviews.length,5);
assert.equal(reviews.humanLearnerTesting,'not_performed');assert.equal(reviews.externalHumanReview,'not_performed');
const expected=['microaula','microaula-ia','referencia','laboratorio'],codes=new Set(),ids=[];
for(const m of manifest.modules){
 assert.equal(m.steps.length,4);assert.deepEqual(m.steps.map(s=>s.type),expected);ids.push(...m.steps.map(s=>s.id));
 const ref=source.find(x=>x.code===m.reusedLessonCode);assert.equal(ref?.kind,'parallel','Aula ausente: '+m.reusedLessonCode);
 assert.ok(exists('public'+ref.contentPath));assert.ok(!codes.has(ref.code));codes.add(ref.code);
 assert.equal(m.status,m.id<=5?'available':'planned');
}
assert.deepEqual(ids,Array.from({length:32},(_,i)=>i+1));
for(let i=0;i<5;i++){
 const m=learning.modules[i],meta=manifest.modules[i],rv=reviews.moduleReviews[i];assert.equal(m.moduleId,i+1);
 assert.equal(m.title,meta.title);assert.equal(m.lessons.length,4);
 assert.ok(m.learningOutcomes.length>=4);assert.deepEqual(m.lessons.map(s=>s.kind),expected);
 assert.deepEqual(m.lessons.map(s=>s.stepId),meta.steps.map(s=>s.id));
 const [concept,coach,reference,lab]=m.lessons;
 assert.ok(concept.sections.length>=3&&concept.sections.every(s=>s.heading&&s.body&&s.example&&s.counterexample));
 assert.ok(concept.challenge.options.length===3&&Number.isInteger(concept.challenge.answer));
 assert.ok(coach.sections.length>=3&&coach.reviewQuestions.length===3&&coach.prompt.length>=180);
 assert.equal(reference.referenceCode,meta.reusedLessonCode);
 assert.equal(reference.referencePath,'#course/parallel/'+meta.reusedLessonCode);
 assert.ok(lab.acceptance.length===5&&lab.brief.length>=4&&lab.assessmentPrompt.length>=100);
 assert.ok(exists('public'+lab.starterUrl),'Sem artefato M'+m.moduleId);
 assert.ok(exists('public'+lab.starterSourceUrl),'Sem roteiro M'+m.moduleId);
 assert.ok(exists('public'+m.assessmentPath)&&exists('public'+m.answerKeyPath));
 const exam=readFileSync(resolve(root,'public'+m.assessmentPath),'utf8');
 const key=readFileSync(resolve(root,'public'+m.answerKeyPath),'utf8');
 assert.ok((exam.match(/^\d+\.\s/gm)||[]).length>=6,'Sem seis perguntas M'+m.moduleId);
 assert.ok(key.includes('Rubrica')&&key.toLowerCase().includes('eliminatório'),'Gabarito incompleto M'+m.moduleId);
 assert.ok(!exam.includes('Resposta esperada:'),'Respostas no enunciado M'+m.moduleId);
 assert.equal(rv.id,'DEV-IA-M'+String(i+1).padStart(2,'0'));assert.equal(rv.grade,'A');
 assert.equal(rv.reviewMethod,'ai_editorial_second_pass');assert.equal(rv.humanLearnerTesting,'not_performed');
 assert.equal(rv.contentSha256,createHash('sha256').update(JSON.stringify(m)).digest('hex'),'Hash de conteúdo inválido M'+m.moduleId);
 assert.ok(rv.author&&rv.reviewer&&rv.author!==rv.reviewer);
 for(const dim of dims){assert.ok(rv.scores[dim]>=80&&rv.scores[dim]<=100);assert.ok(rv.evidence.some(x=>x.dimension===dim&&x.method&&x.reference&&x.result),'Sem evidência '+dim);}
 for(const gate of gates)assert.equal(rv.gates[gate],true);
}
assert.ok(exists('public/course-labs/ai-dev-meu-gestor/tests/starter.test.mjs'));
assert.ok(exists('public/course-labs/ai-dev-meu-gestor/module-02/spec-rules.test.mjs'));
assert.ok(exists('public/course-labs/ai-dev-meu-gestor/checkpoints/v0.3/tests/domain.test.mjs'));
const starter=readFileSync(resolve(root,'public/course-labs/ai-dev-meu-gestor/starter.html'),'utf8');
assert.ok(starter.includes('pendente')&&starter.includes('concluído'));
assert.ok(!/fetch\s*\(|<script[^>]+src=/i.test(starter));
console.log('VALIDADO: 543 unidades, 8 referências, 5 módulos A editorial IA, 20 etapas, provas independentes e laboratórios.');
