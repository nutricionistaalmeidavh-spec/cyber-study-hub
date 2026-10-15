/**
 * Adaptador FFmpeg REAL para o contrato ArtiSys Video Engine.
 * Não faz upload, não usa APIs e não executa shell: spawn com lista de argumentos.
 * Execução: node ffmpeg-adapter.mjs --input in.mp4 --output out.mp4 --start 0 --end 3
 */
import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {compileVideoPlan,executeVideoJob} from './vendor/artisys-video-engine/index.mjs';
const ensure=(v,m)=>{if(!v)throw Error(m)};
export function createFFmpegAdapter({bin='ffmpeg',dryRun=false}={}){
  return {async execute(job){
    const p=compileVideoPlan(job);
    ensure(p.output.format==='mp4','Este adaptador demonstra saída mp4 apenas');
    ensure(p.operations.length===1&&p.operations[0].type==='trim','Este adaptador implementa apenas corte. Concat e filtros exigem novos adapters');
    const op=p.operations[0],duration=op.end-op.start;
    ensure(Number.isFinite(duration)&&duration>0,'Duração inválida');
    ensure(resolve(p.input)!==resolve(p.output.path),'Entrada e saída devem ser diferentes');
    const args=['-hide_banner','-loglevel','error','-y','-ss',String(op.start),
      '-i',p.input,'-t',String(duration),'-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac',p.output.path];
    if(dryRun)return {dryRun:true,args,path:p.output.path,plan:p};
    await new Promise((ok,fail)=>{
      const child=spawn(bin,args,{shell:false,stdio:['ignore','ignore','pipe']});
      let error='';child.stderr.on('data',data=>{if(error.length<4000)error+=String(data)});
      child.on('error',fail);child.on('close',code=>code===0?ok():fail(Error('FFmpeg falhou: '+error)));
    });
    return {dryRun:false,path:p.output.path,plan:p};
  }};
}
const direct=process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct){
  const get=(flag)=>{const p=process.argv.indexOf(flag);return p<0?null:process.argv[p+1]};
  const input=get('--input'),output=get('--output'),start=Number(get('--start')??0),end=Number(get('--end'));
  if(!input||!output||!Number.isFinite(end)){process.stderr.write('Uso: node ffmpeg-adapter.mjs --input in.mp4 --output out.mp4 --start 0 --end 3\n');process.exitCode=2;}
  else executeVideoJob(createFFmpegAdapter(),{input,output:{path:output,format:'mp4'},
      operations:[{type:'trim',start,end}],engine:'ffmpeg'})
    .then(result=>process.stdout.write('Corte gerado em '+result.path+'\n'))
    .catch(e=>{process.stderr.write('Erro: '+e.message+'\n');process.exitCode=1});
}
