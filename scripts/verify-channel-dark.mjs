import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(import.meta.dirname,'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const sum=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h.toString(16).padStart(8,'0')};
const q=json('quality/trails/channel-dark/reviews.json');
const course=json('src/trails/channel-dark/modules.json');
const manifest=json('src/trails/channel-dark/manifest.json');
const dim=['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates=['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','segundaPassagemCritica'];
assert.equal(q.trackId,'CANAL-DARK-IA');
assert.equal(q.reviewMethod,'ai_editorial_second_pass_with_local_lab_tests');
assert.equal(q.humanLearnerTesting,'not_performed');
assert.equal(q.externalHumanReview,'not_performed');
assert.equal(manifest.modules.length,8);
assert.equal(course.modules.length,8);
assert.equal(manifest.totalSteps,32);
assert.deepEqual(Object.keys(q.modules).sort(),['01','02','03','04','05','06','07','08']);
assert.equal(json('src/curriculum/catalog.json').main.length,218,'Não alterar catálogo principal');
assert.equal(json('src/curriculum/catalog.json').parallel.length,325,'Não alterar catálogo paralelo');
let steps=0;
for(const [i,m] of course.modules.entries()){
  const id=String(i+1).padStart(2,'0'),review=q.modules[id],lab=m.lessons[3];
  assert.equal(m.moduleId,i+1);
  assert.equal(manifest.modules[i].id,i+1);
  assert.equal(m.lessons.length,4);
  assert.deepEqual(m.lessons.map(s=>s.stepId),[1,2,3,4].map(n=>i*4+n));
  assert.deepEqual(m.lessons.map(s=>s.kind),['microaula','microaula-ia','referencia','laboratorio']);
  assert.equal(m.learningOutcomes.length,4);
  for(const lesson of m.lessons.slice(0,2)){
    assert.equal(lesson.sections.length,3,'Explicação em três partes ausente no módulo '+id);
    for(const s of lesson.sections){
      assert.ok(s.body.length>=140 && s.example.length>=50 && s.counterexample.length>=50,
        'Exemplo ou contraexemplo fraco no módulo '+id);
    }
  }
  assert.ok(m.lessons[0].challenge.options.length>=3);
  assert.ok(m.lessons[1].prompt.length>200);
  assert.equal(m.lessons[1].reviewQuestions.length,3);
  assert.ok(m.lessons[2].referencePath.startsWith('https://'));
  assert.ok(lab.labCommand.includes('--module '+m.moduleId+' --out ./meu-canal'));
  assert.ok(lab.expectedArtifact.length>30);
  assert.equal(lab.troubleshooting.length,3);
  assert.ok(lab.checkpointAssertion.length>40);
  assert.equal(lab.acceptance.length,5);
  assert.equal(lab.brief.length,4);
  assert.ok(m.tools.some(t=>t.tier==='core'),'Módulo sem núcleo gratuito: '+id);
  assert.ok(m.tools.every(t=>/^https:\/\//.test(t.url)));
  assert.ok(m.tools.filter(t=>['Steve AI','Pika','Google Flow','Modal'].includes(t.name)).every(t=>t.tier==='optional'));
  assert.equal(review.moduleId,i+1);
  assert.equal(review.title,m.title);
  assert.equal(review.grade,'A');
  assert.equal(review.reviewType,'editorial_ai_only');
  assert.equal(review.humanLearnerTesting,'not_performed');
  assert.equal(review.liveServiceTesting,'not_performed');
  assert.equal(review.contentChecksum,sum(JSON.stringify(m)),'Parecer A expirado para módulo '+id);
  assert.deepEqual(Object.keys(review.scores).sort(),[...dim].sort());
  assert.ok(dim.every(d=>review.scores[d]>=85&&review.scores[d]<=100),'Notas A injustificadas '+id);
  assert.ok(gates.every(g=>review.gates[g]===true),'Gate editorial pendente '+id);
  assert.equal(review.evidence.length,6);
  for(const d of dim){
    const e=review.evidence.find(e=>e.dimension===d);
    assert.ok(e && e.reference?.length>18 && e.method?.length>20 && e.result?.length>55,'Falta evidência '+id+'/'+d);
  }
  assert.ok(review.limitations?.length>=3);
  assert.equal(review.paths.guide,'public'+lab.starterSourceUrl);
  assert.equal(review.paths.exam,'public'+m.assessmentPath);
  assert.equal(review.paths.key,'public'+m.answerKeyPath);
  for(const path of Object.values(review.paths))assert.ok(existsSync(resolve(root,path)),'Evidência ausente: '+path);
  const guide=read(review.paths.guide), exam=read(review.paths.exam),key=read(review.paths.key);
  assert.ok(guide.includes(lab.labCommand),'Guia não ensina executar '+id);
  assert.ok(guide.includes(lab.expectedArtifact),'Artefato esperado não explicado '+id);
  assert.ok(guide.includes('recuperação')||guide.includes('recuperação'),'Sem diagnóstico '+id);
  assert.equal((exam.match(/^\d+\. /gm)||[]).length,6,'Prova precisa seis questões '+id);
  assert.equal((key.match(/^\d+\. /gm)||[]).length,6,'Gabarito precisa seis respostas '+id);
  assert.ok(!exam.includes('## Rubrica de correção'),'Gabarito misturado com prova '+id);
  assert.ok(key.includes('## Rubrica de correção'),'Rubrica ausente '+id);
  steps+=m.lessons.length;
}
assert.equal(steps,32);
console.log('Trilha Canal Dark: 8/8 pareceres A EDITORIAIS com evidências, 32 etapas, 8 kits e 48 questões. Sem validação humana.');
if(!process.argv.includes('--structure-only')){
  execFileSync(process.execPath,['--test','public/course-labs/channel-dark/engine.test.mjs','scripts/test-channel-dark.mjs'],{cwd:root,stdio:'inherit'});
}
