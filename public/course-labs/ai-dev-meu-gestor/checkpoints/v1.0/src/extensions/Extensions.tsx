import {useState} from 'react';
import {ordersToCsv,normalizeScale,financePreview,type Client,type Order} from './core.ts';
type Quality={ok:boolean;integrity:{valid:boolean;foreignKeyIssues:number;integrityCheck:string[]};counts:{clients:number;orders:number};mode:string};
function downloadCsv(value:string){
 const url=URL.createObjectURL(new Blob([value],{type:'text/csv;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='meu-gestor-ordens-ficticias.csv';document.body.append(link);link.click();link.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function Extensions({clients,orders}:{clients:Client[];orders:Order[]}){
 const [error,setError]=useState(''),[message,setMessage]=useState('');
 const [scaleInput,setScaleInput]=useState('1,250 kg'),[scaleOutput,setScaleOutput]=useState('');
 const [selected,setSelected]=useState(orders[0]?.id||''),[financeAmount,setFinanceAmount]=useState('150,00');
 const [financeCategory,setFinanceCategory]=useState('servico'),[financeResult,setFinanceResult]=useState('');
 const [quality,setQuality]=useState<Quality|null>(null),[qualityLoading,setQualityLoading]=useState(false);
 const chosen=orders.find(o=>o.id===selected)||orders[0];
 const action=(fn:()=>void,success:string)=>{setError('');setMessage('');try{fn();setMessage(success)}catch(e){setError(e instanceof Error?e.message:'Erro na extensão')}};
 const exportCsv=()=>action(()=>downloadCsv(ordersToCsv(orders,clients)),'CSV gerado com '+orders.length+' ordens fictícias.');
 const simulateScale=()=>action(()=>{const value=normalizeScale(scaleInput);setScaleOutput(value.kg.toLocaleString('pt-BR',{maximumFractionDigits:3})+' kg · origem: simulador');},'Leitura simulada e validada.');
 const simulateFinance=()=>action(()=>{
  if(!chosen)throw Error('Cadastre uma OS fictícia primeiro');
  const raw=financeAmount.trim();
  if(!/^\d{1,6}(?:,\d{1,2})?$/.test(raw))throw Error('Informe um valor fictício em reais: 150,00');
  const [whole,decimal='']=raw.split(',');
  const cents=Number(whole)*100+Number(decimal.padEnd(2,'0'));
  const outcome=financePreview({id:'PREVIA-'+chosen.id,amountCents:cents,category:financeCategory});
  setFinanceResult('OS '+chosen.id+' · '+(cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})+
  ' · '+outcome.category+' · '+outcome.status);
 },'Prévia validada; nenhum lançamento financeiro gravado.');
 const inspect=async()=>{
  setQualityLoading(true);setError('');setMessage('');
  try{const res=await fetch('/api/extensions/quality',{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);
   const payload=await res.json() as Quality;setQuality(payload);setMessage('Integridade consultada diretamente do SQLite local.');}
  catch(e){setError(e instanceof Error?e.message:'Diagnóstico indisponível')}finally{setQualityLoading(false)}
 };
 return <section aria-labelledby="extensoes-title">
  <h2 id="extensoes-title">Extensões funcionais do Meu Gestor</h2>
  <p className="note">Todos os exemplos são locais e usam dados fictícios. Não há login, nem autorização para uso real. Scanner, hardware físico e bibliotecas externas são opcionais.</p>
  {error&&<p role="alert" className="error">{error}</p>}
  {message&&<p role="status" className="success">{message}</p>}
  <div className="extensions-grid">
   <article className="panel extension-card"><p className="hint">KIT RELATÓRIOS · CSV</p><h3>Exportar ordens</h3>
    <p>Gera CSV das OS e clientes reais da base fictícia local, neutralizando fórmulas de planilha.</p>
    <button type="button" onClick={exportCsv}>Exportar {orders.length} ordens</button></article>
   <article className="panel extension-card"><p className="hint">KIT PDF · DOCUMENTO PARA IMPRESSÃO</p><h3>Ordem de serviço</h3>
    <p>Documento formatado com dados da OS selecionada. Na nova aba, escolha Imprimir → Salvar como PDF.</p>
    <label htmlFor="pdf-order">Escolha a ordem</label><select id="pdf-order" value={chosen?.id||''} onChange={e=>setSelected(e.target.value)}>
     {orders.map(o=><option key={o.id} value={o.id}>{o.id} — {o.service}</option>)}</select>
    {chosen?<a className="extension-action" target="_blank" rel="noopener noreferrer" href={'/api/extensions/orders/'+encodeURIComponent(chosen.id)+'/print'}>Abrir documento para PDF ↗</a>:
    <p>Cadastre uma OS fictícia para criar o documento.</p>}</article>
   <article className="panel extension-card"><p className="hint">KIT FINANCEIRO · PRÉVIA</p><h3>Classificar lançamento</h3>
    <p>Adaptação educacional do domínio financeiro; não registra pagamento nem altera saldos.</p>
    <label htmlFor="finance-value">Valor fictício (R$)</label><input id="finance-value" value={financeAmount} onChange={e=>setFinanceAmount(e.target.value)} />
    <label htmlFor="finance-category">Categoria</label><select id="finance-category" value={financeCategory} onChange={e=>setFinanceCategory(e.target.value)}><option value="servico">Serviço</option><option value="produto">Produto</option><option value="outros">Outros</option></select>
    <button type="button" onClick={simulateFinance}>Validar prévia</button>
    {financeResult&&<p role="status" className="extension-output">{financeResult}</p>}</article>
   <article className="panel extension-card"><p className="hint">KIT SERIAL · SEM HARDWARE</p><h3>Simulador de balança</h3>
    <p>Valida leitura de peso e unidade. Não acessa portas USB/COM nem controla equipamento.</p>
    <label htmlFor="weight-demo">Leitura fictícia</label><input id="weight-demo" value={scaleInput} onChange={e=>setScaleInput(e.target.value)}/>
    <button type="button" onClick={simulateScale}>Simular leitura</button>{scaleOutput&&<p role="status" className="extension-output">{scaleOutput}</p>}</article>
   <article className="panel extension-card"><p className="hint">KIT FRONTEND · COMPONENTES</p><h3>Interface reaproveitável</h3>
    <div className="extension-metrics"><div><small>Clientes</small><strong>{clients.length}</strong></div><div><small>OS pendentes</small><strong>{orders.filter(o=>o.status==='pendente').length}</strong></div><div><small>Concluídas</small><strong>{orders.filter(o=>o.status==='concluído').length}</strong></div></div>
    <p>Indicadores derivados da mesma fonte de dados, sem contador duplicado.</p></article>
   <article className="panel extension-card"><p className="hint">KIT QA + ARTISYS SCAN</p><h3>Integridade do banco</h3>
    <p>Executa <code>PRAGMA integrity_check</code> e valida vínculos no SQLite local; não realiza varredura de segurança automática.</p>
    <button type="button" disabled={qualityLoading} onClick={()=>void inspect()}>{qualityLoading?'Verificando…':'Executar diagnóstico'}</button>
    {quality&&<p role="status" className="extension-output">{quality.integrity.valid?'Integridade OK':'Integridade inválida'} · {quality.counts.clients} clientes · {quality.counts.orders} ordens · vínculos: {quality.integrity.foreignKeyIssues}</p>}
    <p>Para análise estática e SCA, execute o ArtiSys Scan separadamente em projeto autorizado.</p></article>
  </div>
  <p className="small">Versões técnicas e integrações profissionais: <a href="https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/tree/main/public/course-labs/ai-dev-meu-gestor/kits" target="_blank" rel="noopener noreferrer">biblioteca de kits e exemplos</a>.</p>
 </section>;
}
