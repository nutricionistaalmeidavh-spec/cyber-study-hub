/**
 * Laboratório de Canais Dark: motor local demonstrativo, sem rede ou API paga.
 * node public/course-labs/channel-dark/engine.mjs --module 1 --out ./meu-canal
 * TODO conteúdo criado é DEMONSTRATIVO. Nunca publica automaticamente.
 */
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const source='https://www.rfc-editor.org/rfc/rfc9110';
const warning='DEMONSTRAÇÃO FICTÍCIA — REQUER AUTORIA E VERIFICAÇÃO HUMANA';
const ensure=(ok,message)=>{if(!ok)throw Error(message);};
const trim=x=>String(x??'').trim();
const stringify=x=>JSON.stringify(x,null,2)+'\n';
const csv=(headers,rows)=>[headers,...rows].map(r=>r.map(c=>'"'+String(c??'').replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
const save=async(root,path,data)=>{const file=join(root,path);await mkdir(dirname(file),{recursive:true});await writeFile(file,data);};
export const paths={brief:'01-estrategia/brief.json',queue:'02-roteiros/pautas.csv',
  script:'02-roteiros/roteiro.md',audio:'03-audio/narracao.json',scenes:'04-visuais/storyboard.json',
  thumbnail:'04-visuais/thumbnail.svg',render:'05-video/render.sh',
  captions:'06-shorts/legendas.srt',queueState:'07-automacao/fila.json',
  package:'08-publicacao/pacote.json'};
export function validateBrief(b){
  ensure(trim(b.name).length>=5,'nome curto');
  ensure(trim(b.audience).length>=15,'defina público');
  ensure(trim(b.promise).length>=15,'defina promessa verificável');
  ensure(Array.isArray(b.themes)&&b.themes.length>=3&&b.themes.every(t=>trim(t).length>=8),'três temas concretos obrigatórios');
  ensure(b.humanApproval===true,'revisão humana obrigatória');
  return {...b,valid:true};
}
export function briefDemo(){return validateBrief({
  name:'Canal Piloto de Tecnologia',audience:'Pessoas iniciantes interessadas em tecnologia e exemplos visuais',
  promise:'Explicar um conceito por episódio usando fontes conferidas e ilustrações originais',
  themes:['Como um pedido HTTP funciona','Por que conferir a origem das imagens','Como proteger a autoria de um vídeo'],
  humanApproval:true,demo:true,warning
});}
export function validatePauta(p){
  ensure(/^[a-z0-9-]{3,64}$/.test(trim(p.id)),'identificador inválido');
  ensure(trim(p.question).length>=20,'pergunta incompleta');
  ensure(/^https:\/\//.test(trim(p.source)),'fonte HTTPS ausente');
  ensure(['a_verificar','verificada'].includes(p.sourceStatus),'status da fonte inválido');
  ensure(p.sourceStatus!=='verificada'||p.reviewedByHuman===true,'a automação não pode fingir checagem factual');
  return p;
}
export function pautasDemo(){return [
  {id:'pauta-001',question:'O que é um pedido HTTP e por que seu contexto importa?',source,sourceStatus:'a_verificar',reviewedByHuman:false,stage:'ideia'},
  {id:'pauta-002',question:'Por que a explicação visual precisa representar dados reais?',source,sourceStatus:'a_verificar',reviewedByHuman:false,stage:'ideia'}
].map(validatePauta);}
export function segmentNarration(text){
  const parts=trim(text).replace(/\s+/g,' ').split(/(?<=[.!?])\s+/u).filter(Boolean);
  ensure(parts.length>0&&parts.every(t=>t.length<380),'divida o roteiro em frases com menos de 380 caracteres');
  return parts.map((text,i)=>({id:i+1,text,voice:'pt_BR_a_selecionar',language:'pt-BR',
    durationSecondsEstimate:Math.max(2,Math.ceil(text.split(/\s+/).length/2.25)),
    recordingStatus:'pendente',voiceLicenseReviewed:false}));
}
export function approveNarration(review){
  ensure(review?.voicePortugueseTested===true,'teste pt-BR pendente');
  ensure(review?.consent===true,'consentimento de voz ausente');
  ensure(review?.licenseReviewed===true,'licença comercial da voz pendente');
  ensure(review?.listenedByHuman===true,'escuta humana pendente');
  return true;
}
export function storyboard(scenes){
  ensure(Array.isArray(scenes)&&scenes.length>=2,'duas cenas necessárias');
  ensure(scenes.every(s=>s.seconds>0&&trim(s.purpose).length>=12),'cena sem objetivo ou duração');
  ensure(scenes.every(s=>['propria','pendente'].includes(s.license)),'licença ausente');
  return scenes.map((s,i)=>({id:i+1,...s,realFootage:false,disclosureReview:'pendente'}));
}
const esc=x=>trim(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function thumbnailSvg(title){
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">'+
    '<rect width="1280" height="720" fill="#211d38"/><rect x="65" y="72" width="1150" height="575" rx="45" fill="#463066"/>'+
    '<text x="120" y="260" fill="#ffffff" font-size="68" font-family="sans-serif">'+esc(title).slice(0,45)+'</text>'+
    '<text x="120" y="390" fill="#dbc8f3" font-size="32" font-family="sans-serif">ILUSTRAÇÃO DIDÁTICA AUTORAL</text></svg>\n';
}
export function ppmScene(w,h,variant){
  ensure(w>0&&h>0&&w*h<=1000000,'dimensão inválida');
  const header=Buffer.from('P6\n'+w+' '+h+'\n255\n','ascii'),data=Buffer.alloc(w*h*3);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=(y*w+x)*3,bar=x>w*(variant?.57:.19)&&x<w*(variant?.83:.36)&&y>h*.23&&y<h*.8;
    data[i]=bar?185:22+Math.round(x/w*50);data[i+1]=bar?143:24+Math.round(y/h*20);data[i+2]=bar?235:65;
  }
  return Buffer.concat([header,data]);
}
export function renderCommands(){
  return '#!/usr/bin/env sh\nset -eu\ncd "$(dirname "$0")"\n'+
  'command -v ffmpeg >/dev/null 2>&1 || { echo "Instale FFmpeg gratuitamente para renderizar"; exit 2; }\n'+
  'ffmpeg -hide_banner -loglevel error -y -loop 1 -framerate 24 -t 5 -i scene-01.ppm -c:v libx264 -pix_fmt yuv420p -vf scale=640:360 -r 24 -t 5 clip-01.mp4\n'+
  'ffmpeg -hide_banner -loglevel error -y -loop 1 -framerate 24 -t 5 -i scene-02.ppm -c:v libx264 -pix_fmt yuv420p -vf scale=640:360 -r 24 -t 5 clip-02.mp4\n'+
  'printf "file \x27clip-01.mp4\x27\\nfile \x27clip-02.mp4\x27\\n" > clips.txt\n'+
  'ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i clips.txt -c copy episodio-demo-sem-audio.mp4\n'+
  'echo "Prévia DEMONSTRATIVA SEM NARRAÇÃO: não publicar sem revisar fontes, direitos e voz"\n';
}
export function srtTime(sec){
  ensure(Number.isFinite(sec)&&sec>=0,'tempo negativo');
  const ms=Math.round(sec*1000);
  return String(Math.floor(ms/3600000)).padStart(2,'0')+':'+
    String(Math.floor(ms/60000)%60).padStart(2,'0')+':'+
    String(Math.floor(ms/1000)%60).padStart(2,'0')+','+String(ms%1000).padStart(3,'0');
}
export function captions(segments){
  let start=0;
  return segments.map((s,i)=>{
    ensure(trim(s.text).length>0,'legenda vazia');
    const seconds=Math.max(2,s.durationSecondsEstimate||2);
    const line=String(i+1)+'\n'+srtTime(start)+' --> '+srtTime(start+seconds)+'\n'+trim(s.text);
    start+=seconds;return line;
  }).join('\n\n')+'\n';
}
export function queueJob(state,id){
  ensure(/^[a-z0-9-]{3,64}$/.test(trim(id)),'id inválido');
  const next=structuredClone(state);next.jobs ||= {};next.events ||= [];
  if(next.jobs[id])return {state:next,created:false};
  next.jobs[id]={id,status:'pendente_revisao',approved:false,version:1};
  next.events.push({id,event:'created'});
  return {state:next,created:true};
}
export function approveJob(state,id,review){
  const next=structuredClone(state);ensure(next.jobs?.[id],'job ausente');
  ensure(review?.human===true&&review?.facts===true&&review?.licenses===true&&review?.originality===true,
    'revisões factual, jurídica, de originalidade e humana obrigatórias');
  if(next.jobs[id].status==='aprovado')return {state:next,changed:false};
  ensure(next.jobs[id].status==='pendente_revisao','transição não permitida');
  next.jobs[id]={...next.jobs[id],status:'aprovado',approved:true};
  next.events.push({id,event:'approved'});
  return {state:next,changed:true};
}
export function publicationPackage(p){
  ensure(trim(p.title).length>=15,'título incompleto');
  ensure(p.sources?.length>=1,'fontes ausentes');
  ensure(trim(p.originalContribution).length>=20,'contribuição original ausente');
  ensure(['sim','nao','avaliar'].includes(p.syntheticDisclosure),'avaliação de mídia sintética ausente');
  return {...p,automatedUpload:false,status:'aguarda_revisao_humana',
    checklist:{fatos:false,direitos:false,thumbnail:false,legendas:false,conteudoSintetico:false,aprovacao:false},warning};
}
export function metricsDemo({impressions,views,finished}){
  ensure([impressions,views,finished].every(x=>Number.isInteger(x)&&x>=0),'contagem inválida');
  ensure(views<=impressions&&finished<=views,'dados fictícios inconsistentes');
  return {kind:'DEMONSTRACAO_NAO_REAL',impressions,views,finished,
    ctrPercent:impressions?+(views*100/impressions).toFixed(1):0,
    completionPercent:views?+(finished*100/views).toFixed(1):0};
}
export async function runLab(module,folder){
  ensure(Number.isInteger(module)&&module>=1&&module<=8,'módulo 1 a 8');
  const out=resolve(folder);await mkdir(out,{recursive:true});
  await save(out,paths.brief,stringify(briefDemo()));
  await save(out,'01-estrategia/licencas.csv',csv(['ativo','origem','licenca','uso_comercial'],
    [['thumbnail.svg','kit gerador próprio','autoral','sim'],['narracao.wav','a gravar','pendente','nao']]));
  if(module===1)return out;
  const pautas=pautasDemo();
  await save(out,paths.queue,csv(['id','pergunta','fonte','status','etapa'],
    pautas.map(p=>[p.id,p.question,p.source,p.sourceStatus,p.stage])));
  await save(out,paths.script,'# '+warning+'\n\n## Questão\n'+pautas[0].question+
    '\n\n## Narração exemplo\nA internet usa regras para transportar informações. Um pedido HTTP carrega contexto. Verifique a fonte oficial antes de publicar.'+
    '\n\n## Fonte ainda NÃO revisada\n'+source+'\n');
  if(module===2)return out;
  const segments=segmentNarration('A internet usa regras para transportar informações. Um pedido HTTP carrega contexto. Verifique a fonte oficial antes de publicar.');
  await save(out,paths.audio,stringify({status:'aguarda_gravacao_ou_piper_ptbr',segments,reviewedByHuman:false,
    instructions:'Gere voz pt_BR com Piper verificando licença ou grave sua própria voz no Audacity. Ouça e revise antes de qualquer uso.'}));
  if(module===3)return out;
  await save(out,paths.scenes,stringify({scenes:storyboard([
    {purpose:'Diagrama visual para ilustrar a primeira definição do roteiro',seconds:5,asset:'scene-01.ppm',license:'propria'},
    {purpose:'Diagrama visual que contrasta a segunda ideia apresentada',seconds:5,asset:'scene-02.ppm',license:'propria'}]),reviewedByHuman:false}));
  await save(out,paths.thumbnail,thumbnailSvg('Como funciona a web?'));
  if(module===4)return out;
  await save(out,'05-video/scene-01.ppm',ppmScene(640,360,false));
  await save(out,'05-video/scene-02.ppm',ppmScene(640,360,true));
  await save(out,paths.render,renderCommands());
  if(module===5)return out;
  await save(out,paths.captions,captions(segments));
  await save(out,'06-shorts/exportar-vertical.sh',
    '#!/usr/bin/env sh\nset -eu\ncd "$(dirname "$0")"\n'+
    'test -f ../05-video/episodio-demo-sem-audio.mp4 || { echo "Renderize o vídeo do módulo 5 primeiro"; exit 2; }\n'+
    'ffmpeg -y -i ../05-video/episodio-demo-sem-audio.mp4 -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -pix_fmt yuv420p short-demo-sem-audio.mp4\n'+
    'echo "Prévia sem áudio. Antes de publicar, adicione voz e revise as legendas e safe area"\n');
  if(module===6)return out;
  await save(out,paths.queueState,stringify(queueJob({jobs:{},events:[]},'episodio-piloto-001').state));
  await save(out,'07-automacao/LEIA-ME.md','A fila local usa ID e aprovação explícita. Reenvios idempotentes não criam jobs duplicados.\n');
  if(module===7)return out;
  await save(out,paths.package,stringify(publicationPackage({
    title:'Como funciona a web: explicação visual para iniciantes',
    sources:[source],originalContribution:'Diagrama original e explicação contextualizada passo a passo',
    syntheticDisclosure:'avaliar',demo:true})));
  await save(out,'08-publicacao/analytics-ficticio.json',stringify(metricsDemo({impressions:1000,views:80,finished:31})));
  await save(out,'08-publicacao/LEIA-ME.md','Demonstração bloqueada para publicação. Fonte ainda não verificada, aprovação pendente, métricas SIMULADAS.\n');
  return out;
}
const direct=process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct){
  const m=process.argv.indexOf('--module'),o=process.argv.indexOf('--out');
  if(m<0||o<0||!process.argv[m+1]||!process.argv[o+1]){
    process.stderr.write('Uso: node engine.mjs --module 1..8 --out ./meu-canal\n');process.exitCode=2;
  }else{
    runLab(Number(process.argv[m+1]),process.argv[o+1])
      .then(dir=>process.stdout.write('Exemplo gerado em '+dir+'\n'))
      .catch(e=>{process.stderr.write('ERRO: '+e.message+'\n');process.exitCode=1;});
  }
}
