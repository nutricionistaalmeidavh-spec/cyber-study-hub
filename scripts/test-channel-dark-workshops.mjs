import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdtemp, rm, stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {runWorkshop, validateAnalytics, createApprovalDemonstration} from '../public/course-labs/channel-dark/oficinas/workshop.mjs';
import {createFFmpegAdapter} from '../public/course-labs/channel-dark/oficinas/ffmpeg-adapter.mjs';
import workshopManifest from '../src/trails/channel-dark/oficinas.json' with {type:'json'};
const base='public/course-labs/channel-dark/oficinas/';
const read=async(folder,file)=>readFile(join(folder,file),'utf8');
const json=async(folder,file)=>JSON.parse(await read(folder,file));
async function temp(fn){
  const dir=await mkdtemp(join(tmpdir(),'hub-oficina-'));
  try{return await fn(dir)}finally{await rm(dir,{recursive:true,force:true})}
}
test('oficinas ligam oito módulos a código real e licenças auditadas',async()=>{
  assert.equal(workshopManifest.length,8);
  assert.deepEqual(workshopManifest.map(x=>x.moduleId),[1,2,3,4,5,6,7,8]);
  for(const w of workshopManifest){
    assert.match(w.guide,/^\/course-labs\/channel-dark\/oficinas\/module-\d\d\.md$/);
    assert.ok((await readFile('public'+w.guide,'utf8')).includes('Integração pronta'));
    assert.ok(w.sources.some(s=>s.repo==='utilidades'&&s.path.startsWith('modules/')));
    assert.ok(w.sources.every(s=>/^https:\/\/github\.com\//.test(s.url)));
    assert.ok(w.command.includes('--module '+w.moduleId+' '));
    assert.ok(w.whatWorks.length>=40);
    for(const s of w.sources){
      assert.ok(s.why.length>=35 && s.mode);
      if(s.repo==='frontEnds')assert.equal(s.access,'private');
      if(s.repo==='utilidades')assert.equal(s.access,'public');
    }
  }
  assert.equal((await stat(base+'vendor/artisys-video-engine/LICENSE')).isFile(),true);
  assert.equal((await stat(base+'vendor/artisys-approvals/LICENSE')).isFile(),true);
});
test('M01: planejamento de canal usa validação real do ArtiSys Planning',()=>temp(async dir=>{
  await runWorkshop(1,dir);
  const plan=await json(dir,'module-01/plano-editorial.json');
  const calendar=await json(dir,'module-01/agenda-calendar.json');
  assert.equal(plan.tasks.length,3);
  assert.equal(calendar.length,3);
  assert.ok(calendar.every(x=>x.allDay===true));
  assert.equal(plan.type,'DEMO');
}));
test('M02: suite de prompts gera formato aceito pela interface do ArtiSys AI Quality',()=>temp(async dir=>{
  await runWorkshop(2,dir);
  const suite=await json(dir,'module-02/avaliacao-promptfoo.json');
  assert.ok(suite.tests.length>=3);
  assert.ok(suite.tests.every(x=>x.vars.prompt));
  assert.match(await read(dir,'module-02/LEIA-ME.txt'),/configuraç[aã]o|configura/i);
}));
test('M03: pipeline real de normalização exige gravação e FFmpeg',()=>temp(async dir=>{
  await runWorkshop(3,dir);
  const job=await json(dir,'module-03/audio-job.json');
  assert.equal(job.output.format,'wav');
  assert.equal(job.input,'narracao.wav');
  assert.match(await read(dir,'module-03/normalizar-audio.sh'),/ffmpeg/);
  assert.match(await read(dir,'module-03/normalizar-audio.sh'),/loudnorm/);
  assert.match(await read(dir,'module-03/piper-tts.sh'),/PIPER_MODEL/);
}));
test('M04: storyboard produz manifesto Motion Canvas e SVG utilizável',()=>temp(async dir=>{
  await runWorkshop(4,dir);
  const motion=await json(dir,'module-04/motion-canvas.json');
  assert.equal(motion.width,1280);
  assert.ok(motion.scenes.length>=2);
  assert.match(await read(dir,'module-04/thumbnail.svg'),/<svg/);
}));
test('M05: contrato real + adapter FFmpeg, não apenas JSON descritivo',()=>temp(async dir=>{
  await runWorkshop(5,dir);
  const plan=await json(dir,'module-05/video-job.json');
  assert.equal(plan.output.format,'mp4');
  const adapter=createFFmpegAdapter({dryRun:true});
  const output=await adapter.execute(plan);
  assert.equal(output.dryRun,true);
  assert.ok(output.args.includes('-i'));
  assert.ok(output.args.includes('-t'));
  const ffmpeg=(()=>{try{execFileSync('ffmpeg',['-version'],{stdio:'ignore'});return true}catch{return false}})();
  if(ffmpeg){
    execFileSync('sh',['render.sh'],{cwd:join(dir,'05-video'),timeout:65000});
    const input=join(dir,'05-video/episodio-demo-sem-audio.mp4');
    const result=await createFFmpegAdapter().execute({...plan,input,output:{path:join(dir,'module-05/corte-final.mp4'),format:'mp4'}});
    assert.ok((await stat(result.path)).size>1000);
  }
}));
test('M06: media pipeline converte 16:9 em 9:16 sem serviço externo',()=>temp(async dir=>{
  await runWorkshop(6,dir);
  const plan=await json(dir,'module-06/vertical-media.json');
  assert.equal(plan.resize.height,1280);
  assert.equal(plan.resize.width,720);
  assert.match(await read(dir,'module-06/gerar-short.sh'),/ffmpeg/);
  assert.match(await read(dir,'06-shorts/legendas.srt'),/ --> /);
}));
test('M07: fluxo real mantém aprovação humana, não autoconclui',()=>temp(async dir=>{
  await runWorkshop(7,dir);
  const flow=await json(dir,'module-07/fluxo.json');
  const approval=await json(dir,'module-07/aprovacao.json');
  assert.equal(flow.state,'pendente_revisao');
  assert.equal(approval.status,'pending');
  const nodered=await json(dir,'module-07/node-red-flow.json');
  const n8n=await json(dir,'module-07/n8n-workflow.json');
  assert.ok(nodered.some(n=>n.type==='function' && n.func?.includes('flow.get')));
  assert.ok(n8n.nodes.some(n=>n.type==='n8n-nodes-base.code'));
  assert.equal(n8n.active,false);
  assert.throws(()=>createApprovalDemonstration({human:false,facts:true,rights:true,originality:true}),/revisão humana/);
  const approved=createApprovalDemonstration({human:true,facts:true,rights:true,originality:true});
  assert.equal(approved.status,'approved');
}));
test('M08: relatório exportado e não induz execução de fórmula CSV',()=>temp(async dir=>{
  await runWorkshop(8,dir);
  const stats=await json(dir,'module-08/resumo.json');
  assert.equal(stats.kind,'EXEMPLO_FICTICIO');
  assert.equal(stats.episodes,2);
  assert.match(await read(dir,'module-08/relatorio.csv'),/titulo/);
  const html=await read(dir,'module-08/painel.html');
  assert.match(html,/type="file"/);
  assert.match(html,/textContent/);
  assert.doesNotMatch(html,/innerHTML/);
  assert.throws(()=>validateAnalytics([{id:'ep-1',title:'Vídeo de demonstração',impressions:10,views:11,completed:1}]),/inconsistentes/);
  assert.throws(()=>validateAnalytics([{id:'ep-1',impressions:10,views:5,completed:2,title:'=2+2+2+2'}]),/fórmula|CSV/);
}));
