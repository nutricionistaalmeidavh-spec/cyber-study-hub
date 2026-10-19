// EscolaLab: um pacote, quatro missões com evidências HTTP reais apenas em localhost.
import {LAB_MISSION_CODES,getLabMission} from './missions.js';
const $=id=>document.getElementById(id);
const STORAGE_KEY='escolalab-local-missions-v1.1';
const actor=()=>document.querySelector('input[name="actor"]:checked')?.value;
const mode=()=>document.querySelector('input[name="mode"]:checked')?.value;
function select(name,value){
  const field=document.querySelector('input[name="'+name+'"][value="'+value+'"]');
  if(field)field.checked=true;
}
function blankState(){return {completed:[],evidence:[]};}
function readSaved(){
  try{
    const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    const result={};
    for(const code of LAB_MISSION_CODES){
      const source=data?.[code],mission=getLabMission(code);
      if(!source||!Array.isArray(source.completed)||!Array.isArray(source.evidence)){
        result[code]=blankState();continue;
      }
      const count=mission.steps.length;
      const ids=source.completed.filter((id,index)=>typeof id==='string'&&id===mission.steps[index]?.id);
      result[code]={completed:ids.slice(0,count),evidence:source.evidence.filter(e=>e&&typeof e==='object'&&
        typeof e.status==='number'&&typeof e.route==='string').slice(-80)};
    }
    return result;
  }catch{return Object.fromEntries(LAB_MISSION_CODES.map(code=>[code,blankState()]));}
}
const state={mission:'034',missions:readSaved()};
for(const code of LAB_MISSION_CODES)state.missions[code]??=blankState();
const currentMission=()=>getLabMission(state.mission);
const currentProgress=()=>state.missions[state.mission];
const currentStep=()=>currentMission()?.steps[currentProgress().completed.length];
function save(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state.missions));}
  catch{/* A navegação permanece funcional com armazenamento bloqueado. */}
}
function prepare(){
  const step=currentStep();
  if(!step)return;
  $('route').value=step.route;
  select('actor',step.actor);
  select('mode',step.mode);
  $('status').textContent='Aguardando';
  $('result').textContent='Teste preparado. Execute a requisição para observar o resultado real.';
}
function render(){
  const mission=currentMission(),progress=currentProgress(),index=progress.completed.length;
  const step=mission.steps[index];
  $('mission-select').value=state.mission;
  $('mission-label').textContent='ESCOLALAB / MISSÃO DA AULA-'+state.mission;
  $('title').textContent=mission.title;
  $('mission-description').textContent=mission.description+' Você está usando um servidor HTTP real somente neste computador.';
  $('mission-focus').textContent='Objetivo: '+mission.focus;
  $('step-count').textContent=index+'/'+mission.steps.length;
  $('meter').setAttribute('aria-valuenow',String(index));
  $('meter-fill').style.width=(index/mission.steps.length*100)+'%';
  $('step-label').textContent=step?'ETAPA '+String(index+1).padStart(2,'0'):'MISSÃO CONCLUÍDA';
  $('step-title').textContent=step?.title||'AULA-'+state.mission+' concluída';
  $('step-text').textContent=step?.instruction||mission.outcome;
  $('prepare').disabled=!step;
  $('checklist').replaceChildren(...mission.steps.map(item=>{
    const li=document.createElement('li'),marker=document.createElement('span');
    marker.className='check';marker.textContent=progress.completed.includes(item.id)?'✓':'○';
    const label=document.createElement('span');label.textContent=item.title;
    const status=document.createElement('strong');
    status.textContent=progress.completed.includes(item.id)?'HTTP '+item.status:'Pendente';
    li.append(marker,label,status);return li;
  }));
  $('export').disabled=progress.evidence.length===0;
  $('export-hint').textContent=progress.evidence.length
    ?progress.evidence.length+' evidência(s) da AULA-'+state.mission+'. O relatório será identificado com esta missão.'
    :'Execute ao menos um teste desta missão para habilitar o relatório.';
}
function switchMission(code){
  if(!getLabMission(code))return;
  state.mission=code;
  $('result').textContent='AULA-'+code+': escolha as configurações e execute.';
  $('status').textContent='Aguardando';
  $('feedback').className='outcome';
  $('feedback').textContent='Missão da AULA-'+code+' selecionada. Os registros das outras aulas continuam salvos neste mesmo EscolaLab.';
  render();prepare();
}
async function request(){
  const a=actor(),m=mode(),route=$('route').value;
  const url=route==='/health'
    ?'/health'
    :'/lab/api/invoices/F001?as='+encodeURIComponent(a)+'&mode='+encodeURIComponent(m);
  $('execute').disabled=true;
  $('status').textContent='Executando…';
  try{
    const response=await fetch(url,{method:'GET',cache:'no-store',headers:{Accept:'application/json'}});
    const data=await response.json();
    $('status').textContent='HTTP '+response.status;
    $('result').textContent=JSON.stringify(data,null,2);
    const signal=data?.detection??null;
    const record={at:new Date().toISOString(),lessonCode:'AULA-'+state.mission,
      missionStep:currentStep()?.id||'free-test',actor:a,mode:m,route,status:response.status,
      detection:signal,audit:data?.audit||null,localHttp:true};
    const progress=currentProgress();
    progress.evidence.push(record);
    if(progress.evidence.length>80)progress.evidence.shift();
    const expected=currentStep();
    const detectionMatches=expected&&(!Object.prototype.hasOwnProperty.call(expected,'detection')||
      signal===expected.detection);
    const matches=expected&&route===expected.route&&a===expected.actor&&m===expected.mode&&
      response.status===expected.status&&detectionMatches;
    if(matches){
      progress.completed.push(expected.id);
      $('feedback').className='outcome good';
      $('feedback').textContent='Resultado confirmado na missão '+state.mission+': '+expected.title+'. '
        +(signal?'Detecção: '+signal+'. ':response.status===403?'Acesso negado pela API. ':'')
        +(progress.completed.length===currentMission().steps.length?currentMission().outcome:'Continue para a próxima verificação.');
    }else{
      $('feedback').className='outcome caution';
      $('feedback').textContent='Requisição registrada. Para concluir esta etapa, compare rota, usuário, versão, código HTTP e sinal de detecção com o roteiro.';
    }
    save();render();
  }catch{
    $('status').textContent='Sem conexão';
    $('result').textContent='Servidor local indisponível. Inicie o EscolaLab pelo atalho da pasta.';
    $('feedback').className='outcome caution';
    $('feedback').textContent='Não foi possível acessar o servidor local.';
  }finally{$('execute').disabled=false;}
}
function exportEvidence(){
  const mission=currentMission(),progress=currentProgress();
  if(!progress.evidence.length)return;
  const data={lab:'EscolaLab',version:'1.1.0',lessonCode:'AULA-'+state.mission,
    mission:mission.title,goal:mission.focus,origin:'http://127.0.0.1',simulatedIdentities:true,
    realLocalHttp:true,completedSteps:progress.completed.length,totalSteps:mission.steps.length,
    conclusion:progress.completed.length===mission.steps.length?mission.outcome:'Missão parcialmente executada',
    warning:'Exclusivamente dados fictícios. Não comprova segurança em produção.',
    entries:progress.evidence};
  if(state.mission==='040')data.releaseRecommendation=progress.completed.length===mission.steps.length
    ?'Cenário didático: falha corrigida e regressão legítima aprovada.'
    :'Não concluir a liberação antes de confirmar os quatro casos de teste.';
  if(state.mission==='218')data.detectionSummary=progress.completed.length===mission.steps.length
    ?'Sinal positivo observado e casos benigno/bloqueado verificados.':'Linha do tempo ainda incompleta.';
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;link.download='EscolaLab-AULA-'+state.mission+'-evidencias.json';
  document.body.append(link);link.click();link.remove();
  // Wait for browser to begin saving before revoking blob URL.
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function reset(){
  state.missions[state.mission]=blankState();save();
  $('status').textContent='Aguardando';
  $('result').textContent='Missão reiniciada.';
  $('feedback').className='outcome';
  $('feedback').textContent='Somente a AULA-'+state.mission+' foi reiniciada. As outras missões e seus relatórios permanecem disponíveis.';
  render();prepare();
}
async function checkHealth(){
  try{
    const response=await fetch('/health',{cache:'no-store'});
    if(!response.ok)throw Error('HTTP '+response.status);
    $('health').textContent='ATIVO';$('health').classList.add('online');
  }catch{$('health').textContent='SEM CONEXÃO';}
}
$('mission-select').addEventListener('change',event=>switchMission(event.target.value));
$('prepare').addEventListener('click',prepare);
$('execute').addEventListener('click',request);
$('export').addEventListener('click',exportEvidence);
$('reset').addEventListener('click',reset);
for(const key of ['route','actor','mode']) {
  const el=key==='route'?$('route'):null;
  if(el)el.addEventListener('change',()=>{$('status').textContent='Configuração alterada';});
}
render();prepare();checkHealth();
