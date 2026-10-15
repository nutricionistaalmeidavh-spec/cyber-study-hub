import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,stat,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {
  paths,runLab,validateBrief,briefDemo,validatePauta,pautasDemo,segmentNarration,approveNarration,
  storyboard,thumbnailSvg,ppmScene,renderCommands,captions,srtTime,
  queueJob,approveJob,publicationPackage,metricsDemo
} from './engine.mjs';

async function withLab(module,check){
  const root=await mkdtemp(join(tmpdir(),'hub-canal-'));
  try {await runLab(module,root);await check(root);} finally{await rm(root,{recursive:true,force:true});}
}
const json=async(root,path)=>JSON.parse(await readFile(join(root,path),'utf8'));

test('M01 — brief exige público, identidade e decisão humana',async()=>{
  assert.equal(briefDemo().valid,true);
  assert.throws(()=>validateBrief({...briefDemo(),humanApproval:false}),/revisão humana/);
  assert.throws(()=>validateBrief({...briefDemo(),themes:['tema']}),/três temas/);
  await withLab(1,async root=>{
    const b=await json(root,paths.brief);
    assert.equal(b.humanApproval,true);
    assert.equal(b.demo,true);
    assert.match(await readFile(join(root,'01-estrategia/licencas.csv'),'utf8'),/pendente/);
  });
});
test('M02 — pauta e fonte nunca são verificadas por automação',async()=>{
  const example=pautasDemo()[0];
  assert.equal(example.sourceStatus,'a_verificar');
  assert.throws(()=>validatePauta({...example,sourceStatus:'verificada'}),/revisão humana/);
  assert.throws(()=>validatePauta({...example,source:'url-falso'}),/HTTPS/);
  await withLab(2,async root=>{
    assert.match(await readFile(join(root,paths.queue),'utf8'),/a_verificar/);
    assert.match(await readFile(join(root,paths.script),'utf8'),/NÃO revisada/);
  });
});
test('M03 — narração segmentada; voz só é aprovada com consentimento, teste e licença',async()=>{
  const pieces=segmentNarration('Primeira frase. Segunda frase.');
  assert.equal(pieces.length,2);
  assert.ok(pieces.every(x=>x.language==='pt-BR'));
  assert.throws(()=>segmentNarration(''),/divida o roteiro/);
  assert.throws(()=>approveNarration({voicePortugueseTested:true,consent:true,licenseReviewed:true}),/escuta humana/);
  assert.equal(approveNarration({voicePortugueseTested:true,consent:true,licenseReviewed:true,listenedByHuman:true}),true);
  await withLab(3,async root=>{
    const doc=await json(root,paths.audio);
    assert.equal(doc.reviewedByHuman,false);
    assert.ok(doc.segments.length>=2);
  });
});
test('M04 — storyboard exige duração, propósito e direitos; SVG é escapado',async()=>{
  assert.throws(()=>storyboard([{purpose:'curto',seconds:0,license:'propria'}]),/duas cenas/);
  assert.throws(()=>storyboard([{purpose:'Cena válida muito completa',seconds:5,license:'incerta'},
    {purpose:'Outra cena com informação',seconds:3,license:'propria'}]),/licença/);
  assert.doesNotMatch(thumbnailSvg('ABC <script>'),/<script>/);
  await withLab(4,async root=>{
    const doc=await json(root,paths.scenes);
    assert.equal(doc.scenes.length,2);
    assert.ok(doc.scenes.every(s=>s.license==='propria'&&s.disclosureReview==='pendente'));
    assert.match(await readFile(join(root,paths.thumbnail),'utf8'),/ILUSTRAÇÃO DIDÁTICA/);
  });
});
test('M05 — cenas PPM verdadeiras e render reprodutível sem API externa',async()=>{
  const frame=ppmScene(8,5,false);
  assert.ok(frame.subarray(0,11).toString('ascii').startsWith('P6\n8 5\n255'));
  assert.throws(()=>ppmScene(2000,2000,false),/dimensão/);
  assert.match(renderCommands(),/ffmpeg/);
  await withLab(5,async root=>{
    assert.ok((await stat(join(root,'05-video/scene-01.ppm'))).size>600000);
    assert.match(await readFile(join(root,paths.render),'utf8'),/episodio-demo-sem-audio/);
    const hasFfmpeg=(()=>{try{execFileSync('ffmpeg',['-version'],{stdio:'ignore'});return true;}catch{return false;}})();
    if(hasFfmpeg){
      execFileSync('sh',['render.sh'],{cwd:join(root,'05-video'),timeout:60000});
      assert.ok((await stat(join(root,'05-video/episodio-demo-sem-audio.mp4'))).size>1000);
    }else{
      assert.ok(existsSync(join(root,paths.render)),'Comandos preparados para equipamento sem FFmpeg');
    }
  });
});
test('M06 — timestamp e legendas SRT legíveis; Short não é upload',async()=>{
  assert.equal(srtTime(1.25),'00:00:01,250');
  assert.throws(()=>srtTime(-1),/tempo negativo/);
  assert.match(captions(segmentNarration('Cena um. Cena dois.')),/ --> /);
  await withLab(6,async root=>{
    const srt=await readFile(join(root,paths.captions),'utf8');
    assert.match(srt,/00:00:00,000 --> /);
    assert.match(await readFile(join(root,'06-shorts/exportar-vertical.sh'),'utf8'),/pad=720:1280/);
  });
});
test('M07 — fila idempotente, bloqueios e aprovação explícita',async()=>{
  const start={jobs:{},events:[]};
  const first=queueJob(start,'episodio-001');
  assert.equal(first.created,true);
  const repeat=queueJob(first.state,'episodio-001');
  assert.equal(repeat.created,false);
  assert.equal(repeat.state.events.length,1);
  assert.throws(()=>approveJob(first.state,'episodio-001',{human:true,facts:true,licenses:true}),/revisões/);
  const valid={human:true,facts:true,licenses:true,originality:true};
  const approved=approveJob(first.state,'episodio-001',valid);
  assert.equal(approved.state.jobs['episodio-001'].status,'aprovado');
  assert.equal(approveJob(approved.state,'episodio-001',valid).changed,false);
  assert.equal(approved.state.events.length,2);
  await withLab(7,async root=>{
    const state=await json(root,paths.queueState);
    assert.equal(state.jobs['episodio-piloto-001'].approved,false);
  });
});
test('M08 — pacote impede publicação cega; analytics sempre simulados',async()=>{
  const data=publicationPackage({title:'Uma explicação visual para iniciantes',sources:['https://example.org'],
    originalContribution:'Pesquisa contextualizada e ilustração didática original',syntheticDisclosure:'avaliar'});
  assert.equal(data.automatedUpload,false);
  assert.equal(data.checklist.aprovacao,false);
  assert.throws(()=>publicationPackage({...data,syntheticDisclosure:'ignorar'}),/sintética/);
  assert.throws(()=>metricsDemo({impressions:5,views:9,finished:1}),/inconsistentes/);
  assert.deepEqual(metricsDemo({impressions:1000,views:80,finished:31}),
    {kind:'DEMONSTRACAO_NAO_REAL',impressions:1000,views:80,finished:31,ctrPercent:8,completionPercent:38.8});
  await withLab(8,async root=>{
    const result=await json(root,paths.package),metrics=await json(root,'08-publicacao/analytics-ficticio.json');
    assert.equal(result.status,'aguarda_revisao_humana');
    assert.equal(metrics.kind,'DEMONSTRACAO_NAO_REAL');
    assert.equal(metrics.ctrPercent,8);
  });
});
