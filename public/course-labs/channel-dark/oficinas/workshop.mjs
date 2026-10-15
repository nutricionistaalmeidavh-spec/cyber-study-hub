/**
 * Oficinas reais do Canal Piloto. Fonte dos adaptadores: utilidades (ArtiSys).
 * Node.js 24+; dados de demonstração; zero serviços externos; publicação desativada.
 *
 * node public/course-labs/channel-dark/oficinas/workshop.mjs --module 1 --out ./meu-canal
 */
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runLab,thumbnailSvg} from '../engine.mjs';
import {validatePlan,toFullCalendarEvents} from './vendor/artisys-planning/index.mjs';
import {buildPromptfooConfig} from './vendor/artisys-ai-quality/index.mjs';
import {normalizeMediaJob,createMotionCanvasManifest} from './vendor/artisys-media/index.mjs';
import {compileVideoPlan} from './vendor/artisys-video-engine/index.mjs';
import {createWorkflowDefinition,createWorkflowInstance,transitionWorkflow} from './vendor/artisys-workflow-engine/index.mjs';
import {createApprovalRequest,decideApproval} from './vendor/artisys-approvals/index.mjs';
import {aggregate} from './vendor/artisys-reporting/index.mjs';
import {exportRows} from './vendor/artisys-exporter/index.mjs';

const fixedTime='2026-10-15T12:00:00.000Z';
const JSONText=x=>JSON.stringify(x,null,2)+'\n';
const assert=(ok,message)=>{if(!ok)throw Error(message)};
const save=async(out,name,text)=>{const path=join(out,name);await mkdir(dirname(path),{recursive:true});await writeFile(path,text)};
const REF='DEMONSTRAÇÃO: acrescente dados, voz, mídia e fontes originais antes de qualquer publicação.';
const forbiddenCsv=s=>/^[\s]*[=+\-@\t\r]/.test(s)||/[\u0000-\u001f]/.test(s);

export function validateAnalytics(episodes){
  assert(Array.isArray(episodes)&&episodes.length>0,'Relatório exige episódios');
  const ids=new Set();
  return episodes.map((e,index)=>{
    assert(e&&typeof e==='object','Episódio inválido');
    assert(typeof e.id==='string'&&/^[a-z0-9-]{3,60}$/.test(e.id),'ID de episódio inválido');
    assert(!ids.has(e.id),'ID de episódio duplicado');ids.add(e.id);
    assert(typeof e.title==='string'&&e.title.length>=8,'Título incompleto');
    assert(!forbiddenCsv(e.title),'Título contém fórmula ou caracteres perigosos para CSV');
    assert(['impressions','views','completed'].every(k=>Number.isSafeInteger(e[k])&&e[k]>=0),'Contagens inválidas');
    assert(e.views<=e.impressions&&e.completed<=e.views,'Métricas inconsistentes');
    return {id:e.id,title:e.title,impressions:e.impressions,views:e.views,completed:e.completed};
  });
}
function makeWorkflow(){
  const def=createWorkflowDefinition({id:'canal-piloto',initialState:'rascunho',
    states:['rascunho','pendente_revisao','aprovado'],
    transitions:[
      {from:'rascunho',to:'pendente_revisao',event:'submit'},
      {from:'pendente_revisao',to:'aprovado',event:'approve',guard:({context})=>
        context.human===true&&context.facts===true&&context.rights===true&&context.originality===true}
    ]});
  const initial=createWorkflowInstance({id:'episodio-001',workflowId:def.id,state:'rascunho'});
  return {def,instance:transitionWorkflow(def,initial,'pendente_revisao',
    {event:'submit',actorId:'autor',at:fixedTime})};
}
const makeApproval=()=>createApprovalRequest({
  id:'aprovacao-episodio-001',subjectRef:{kind:'episode',id:'episodio-001'},
  requestedBy:'autor',steps:[{id:'revisao-editorial',approverIds:['editor-humano'],minApprovals:1}],createdAt:fixedTime
});
export function createApprovalDemonstration(review){
  assert(review?.human===true,'revisão humana obrigatória');
  assert(review?.facts===true,'checagem factual obrigatória');
  assert(review?.rights===true,'direitos de mídia obrigatórios');
  assert(review?.originality===true,'originalidade obrigatória');
  const {def,instance}=makeWorkflow();
  const approved=decideApproval(makeApproval(),
    {actorId:'editor-humano',decision:'approved',at:fixedTime,comment:'Exemplo didático explicitamente acionado'});
  // Esta função ensina a transição, sem gravação na fila oficial e sem upload.
  const next=transitionWorkflow(def,instance,'aprovado',
    {event:'approve',context:review,actorId:'editor-humano',at:fixedTime});
  assert(next.state==='aprovado'&&approved.status==='approved','Transição de aprovação falhou');
  return approved;
}
export async function runWorkshop(module,outDir,{analyticsFile=null}={}){
  assert(Number.isInteger(module)&&module>=1&&module<=8,'Escolha módulo 1..8');
  const out=resolve(outDir);
  await runLab(module,out);
  const prefix='module-'+String(module).padStart(2,'0')+'/';
  if(module===1){
    const tasks=validatePlan([
      {id:'ideia',title:'Escolher pauta e conferir direitos',start:'2026-11-01',end:'2026-11-02',dependencies:[],progress:0},
      {id:'roteiro',title:'Produzir roteiro original e revisar fontes',start:'2026-11-03',end:'2026-11-04',dependencies:['ideia'],progress:0},
      {id:'video',title:'Montar primeiro vídeo e revisar licença',start:'2026-11-05',end:'2026-11-06',dependencies:['roteiro'],progress:0}
    ]);
    await save(out,prefix+'plano-editorial.json',JSONText({type:'DEMO',tasks,note:REF}));
    await save(out,prefix+'agenda-calendar.json',JSONText(toFullCalendarEvents(tasks)));
  }
  if(module===2){
    const suite={
      name:'Revisão de roteiros — teste manual ou Ollama opcional',
      providers:['ollama:chat:llama3.2'],
      cases:[
        {id:'gancho-concreto',prompt:'Escreva uma abertura autoral de três frases que explique o que é HTTP sem exageros.',expected:'HTTP'},
        {id:'citacoes-transparentes',prompt:'Marque como não verificada toda afirmação que não possua fonte primária consultada.',expected:'não verificada'},
        {id:'linguagem-clara',prompt:'Explique o papel de um pedido web a uma pessoa iniciante em quatro frases.',expected:'pedido'}
      ],threshold:0.8
    };
    const config=buildPromptfooConfig(suite);
    await save(out,prefix+'avaliacao-promptfoo.json',JSONText(config));
    await save(out,prefix+'LEIA-ME.txt','Este arquivo é uma configuração para avaliação de prompts; NÃO executa um modelo automaticamente.\nOllama/Promptfoo são opcionais; para R$ 0, corrija manualmente a matriz de critérios e registre as fontes.\n'+REF+'\n');
  }
  if(module===3){
    const plan=normalizeMediaJob({input:'narracao.wav',output:{format:'wav'},
      audio:{mute:false,volume:1}});
    await save(out,prefix+'audio-job.json',JSONText(plan));
    await save(out,prefix+'normalizar-audio.sh',
      '#!/usr/bin/env sh\nset -eu\ncd "$(dirname "$0")"\n'+
      'command -v ffmpeg >/dev/null 2>&1 || { echo "Instale FFmpeg"; exit 2; }\n'+
      'test -f narracao.wav || { echo "Grave a sua voz ou gere uma voz pt-BR licenciada e salve narracao.wav nesta pasta"; exit 2; }\n'+
      'ffmpeg -hide_banner -loglevel error -y -i narracao.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 -c:a pcm_s16le narracao-normalizada.wav\n'+
      'echo "Ouça a versão normalizada e revise pronúncia e direitos antes de usar"\n');
  }
  if(module===4){
    const job=normalizeMediaJob({input:'storyboard.svg',output:{format:'mp4'},
      trim:{start:0,end:10},resize:{width:1280,height:720}});
    const manifest=createMotionCanvasManifest(job,['cena-01-original','cena-02-original']);
    await save(out,prefix+'motion-canvas.json',JSONText({...manifest,note:'Manifesto de cenas, não um renderizador instalado'}));
    await save(out,prefix+'thumbnail.svg',thumbnailSvg('Como um pedido HTTP funciona?'));
  }
  if(module===5){
    const plan=compileVideoPlan({
      input:join(out,'05-video/episodio-demo-sem-audio.mp4'),
      output:{path:join(out,prefix+'corte-final.mp4'),format:'mp4'},
      operations:[{type:'trim',start:0,end:3}],engine:'ffmpeg'
    });
    await save(out,prefix+'video-job.json',JSONText(plan));
    await save(out,prefix+'LEIA-ME.txt',
      '1. Renderize as duas imagens locais: cd 05-video && sh render.sh\n'+
      '2. Execute o adapter: node public/course-labs/channel-dark/oficinas/ffmpeg-adapter.mjs --input ./meu-canal/05-video/episodio-demo-sem-audio.mp4 --output ./meu-canal/module-05/corte-final.mp4 --start 0 --end 3\n'+
      '3. O MP4 continua sem narração. Edite e revise antes de publicar.\n');
  }
  if(module===6){
    const plan=normalizeMediaJob({
      input:'../05-video/episodio-demo-sem-audio.mp4',output:{format:'mp4'},
      resize:{width:720,height:1280,fit:'contain'},trim:{start:0,end:10}
    });
    await save(out,prefix+'vertical-media.json',JSONText(plan));
    await save(out,prefix+'gerar-short.sh',
      '#!/usr/bin/env sh\nset -eu\ncd "$(dirname "$0")"\n'+
      'test -f ../05-video/episodio-demo-sem-audio.mp4 || { echo "Renderize antes o módulo 5"; exit 2; }\n'+
      'command -v ffmpeg >/dev/null 2>&1 || { echo "Instale FFmpeg"; exit 2; }\n'+
      'ffmpeg -hide_banner -loglevel error -y -i ../05-video/episodio-demo-sem-audio.mp4 -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -pix_fmt yuv420p short-sem-narracao.mp4\n'+
      'echo "Short demonstrativo SEM NARRAÇÃO; ajuste legendas SRT com áudio real"\n');
  }
  if(module===7){
    const workflow=makeWorkflow();
    await save(out,prefix+'fluxo.json',JSONText({id:workflow.instance.id,state:workflow.instance.state,
      workflowId:workflow.instance.workflowId,history:workflow.instance.history,
      nextStep:'Revisão humana de fatos, direitos e originalidade; não publicar automaticamente'}));
    await save(out,prefix+'aprovacao.json',JSONText(makeApproval()));
    await save(out,prefix+'LEIA-ME.txt',
      'Aprovação inicia PENDENTE. Use o exemplo createApprovalDemonstration somente para aprender a transição; em sistemas reais, autentique o revisor e registre a decisão com persistência. A fila idempotente está em 07-automacao/fila.json.\n'+REF+'\n');
  }
  if(module===8){
    const fixture=[{id:'ep-001',title:'Como funciona o HTTP',impressions:1000,views:80,completed:31},
      {id:'ep-002',title:'Licenças para imagens digitais',impressions:700,views:54,completed:20}];
    const items=validateAnalytics(analyticsFile?JSON.parse(await readFile(analyticsFile,'utf8')):fixture);
    const totals={episodes:items.length,impressions:aggregate(items,'impressions'),
      views:aggregate(items,'views'),completed:aggregate(items,'completed')};
    await save(out,prefix+'resumo.json',JSONText({...totals,
      kind:analyticsFile?'USUARIO_IMPORTOU_DADOS':'EXEMPLO_FICTICIO',
      note:'Importação de arquivo local; não acessa YouTube e não atesta a origem dos dados'}));
    await save(out,prefix+'relatorio.csv',exportRows(items,{format:'csv',columns:['id','title','impressions','views','completed'].map(k=>({key:k,label:k==='title'?'titulo':k})),bom:true}));
  }
  await save(out,prefix+'LEIA-ME-OFICINA.txt',
    'Oficina '+module+' integrada a código MIT do ArtiSys Utilidades. Consulte o guia module-'+
    String(module).padStart(2,'0')+'.md no repositório antes de reaproveitar.\n'+REF+'\n');
  return out;
}
const direct=process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct){
  const args=process.argv;
  const mod=args.indexOf('--module'),dir=args.indexOf('--out'),source=args.indexOf('--analytics');
  if(mod<0||dir<0||!args[mod+1]||!args[dir+1]){
    process.stderr.write('Uso: node workshop.mjs --module 1..8 --out ./meu-canal [--analytics metricas.json]\n');
    process.exitCode=2;
  }else{
    runWorkshop(Number(args[mod+1]),args[dir+1],
      {analyticsFile:source<0?null:args[source+1]})
      .then(folder=>process.stdout.write('Oficina executada em '+folder+'\n'))
      .catch(error=>{process.stderr.write('Erro na oficina: '+error.message+'\n');process.exitCode=1;});
  }
}
