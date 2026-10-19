// Interface do EscolaLab: requisições HTTP reais, exclusivamente ao processo local.
// Somente a API do próprio servidor é acessada; não há bibliotecas, contas ou CDN.
const steps=[
  {actor:'alice',mode:'vulnerable',status:200,title:'Estabeleça um acesso legítimo',
   instruction:'Alice é a dona de F001. No modo vulnerável, confirme que consegue ler a própria fatura.'},
  {actor:'bob',mode:'vulnerable',status:200,title:'Investigue uma falha de autorização',
   instruction:'Troque para Bob, mantenha a versão vulnerável e observe se ele consegue abrir F001, que pertence a Alice.'},
  {actor:'bob',mode:'corrected',status:403,title:'Verifique a correção',
   instruction:'Mantenha Bob, escolha a versão corrigida e confira se a API bloqueia a requisição.'},
  {actor:'alice',mode:'corrected',status:200,title:'Evite uma regressão',
   instruction:'Agora confirme que Alice continua acessando F001 depois da correção.'}
];
const $=id=>document.getElementById(id);
const state={index:0,evidence:[],completed:[]};
const actor=()=>document.querySelector('input[name="actor"]:checked')?.value;
const mode=()=>document.querySelector('input[name="mode"]:checked')?.value;
function select(name,value){
  const field=document.querySelector('input[name="'+name+'"][value="'+value+'"]');
  if(field)field.checked=true;
}
function prepare(){
  const step=steps[state.index];
  if(!step)return;
  select('actor',step.actor);select('mode',step.mode);
  $('status').textContent='Aguardando';
  $('result').textContent='Configurações preparadas. Execute a requisição para observar a resposta.';
}
function render(){
  $('step-count').textContent=state.completed.length+'/'+steps.length;
  $('meter').setAttribute('aria-valuenow',String(state.completed.length));
  $('meter-fill').style.width=state.completed.length/steps.length*100+'%';
  const step=steps[state.index];
  $('step-label').textContent=step?'ETAPA '+String(state.index+1).padStart(2,'0'):'INVESTIGAÇÃO COMPLETA';
  $('step-title').textContent=step?.title||'Você concluiu a missão.';
  $('step-text').textContent=step?.instruction||'Quatro respostas HTTP foram observadas. Exporte as evidências para guardar seu registro.';
  $('prepare').disabled=!step;
  $('checklist').replaceChildren(...steps.map((item,index)=>{
    const li=document.createElement('li');
    const marker=document.createElement('span');
    marker.className='check';
    marker.textContent=state.completed.includes(index)?'✓':'○';
    const info=document.createElement('span');
    info.textContent=(item.actor==='alice'?'Alice':'Bob')+' / '+(item.mode==='vulnerable'?'Vulnerável':'Corrigida');
    const status=document.createElement('strong');
    status.textContent=state.completed.includes(index)?'HTTP '+item.status:'Pendente';
    li.append(marker,info,status);
    return li;
  }));
  $('export').disabled=state.evidence.length===0;
  $('export-hint').textContent=state.evidence.length
    ?state.evidence.length+' requisição(ões) registrada(s) nesta sessão.'
    :'Execute ao menos um teste para habilitar o relatório.';
}
async function request(){
  const a=actor(),m=mode();
  $('execute').disabled=true;
  $('status').textContent='Executando…';
  try{
    const response=await fetch('/lab/api/invoices/F001?as='+encodeURIComponent(a)+'&mode='+encodeURIComponent(m),{
      method:'GET',cache:'no-store',headers:{Accept:'application/json'}
    });
    const data=await response.json();
    $('status').textContent='HTTP '+response.status;
    $('result').textContent=JSON.stringify(data,null,2);
    const proof={at:new Date().toISOString(),actor:a,mode:m,status:response.status,
      path:'/lab/api/invoices/F001',detection:data.detection??null};
    state.evidence.push(proof);
    const expected=steps[state.index];
    if(expected&&a===expected.actor&&m===expected.mode&&response.status===expected.status){
      state.completed.push(state.index);state.index++;
      $('feedback').className='outcome good';
      $('feedback').textContent=proof.actor==='bob'&&proof.mode==='vulnerable'
        ?'Falha observada: Bob recebeu HTTP 200 para a fatura de Alice. Isso é IDOR/BOLA neste cenário fictício.'
        :response.status===403
          ?'Proteção confirmada: o servidor retornou HTTP 403 para Bob.'
          :'Acesso legítimo observado: a API retornou HTTP 200 para Alice.';
    }else{
      $('feedback').className='outcome caution';
      $('feedback').textContent='Resultado registrado. Compare com a missão atual e ajuste usuário ou versão para avançar.';
    }
    render();
  }catch{
    $('status').textContent='Sem conexão';
    $('result').textContent='Servidor indisponível. Inicie o EscolaLab pelo atalho da pasta e recarregue esta página.';
    $('feedback').className='outcome caution';
    $('feedback').textContent='Não foi possível acessar o servidor local.';
  }finally{$('execute').disabled=false;}
}
function exportEvidence(){
  if(!state.evidence.length)return;
  const data={lab:'EscolaLab',version:'1.0.0',origin:'http://127.0.0.1',simulatedIdentities:true,
    realLocalHttp:true,completedSteps:state.completed.length,
    warning:'Somente ambiente didático. Identidades fictícias; não comprova segurança de produção.',
    entries:state.evidence};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;link.download='EscolaLab-evidencias.json';
  document.body.append(link);link.click();link.remove();
  URL.revokeObjectURL(url);
}
function reset(){
  state.index=0;state.evidence=[];state.completed=[];
  select('actor','alice');select('mode','vulnerable');
  $('status').textContent='Aguardando';
  $('result').textContent='Missão reiniciada. Execute o primeiro teste.';
  $('feedback').className='outcome';
  $('feedback').textContent='Os registros da sessão foram limpos. O arquivo já exportado permanece no seu computador.';
  render();
}
async function checkHealth(){
  try{
    const response=await fetch('/health',{cache:'no-store'});
    if(!response.ok)throw Error('HTTP '+response.status);
    $('health').textContent='ATIVO';$('health').classList.add('online');
  }catch{$('health').textContent='SEM CONEXÃO';}
}
$('prepare').addEventListener('click',prepare);
$('execute').addEventListener('click',request);
$('export').addEventListener('click',exportEvidence);
$('reset').addEventListener('click',reset);
render();checkHealth();
