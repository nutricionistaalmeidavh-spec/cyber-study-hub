import {useEffect,useState,type FormEvent} from 'react';
import {Extensions} from './extensions/Extensions.tsx';
type Client={id:string;name:string};
type Order={id:string;clientId:string;service:string;status:'pendente'|'em andamento'|'concluído'};
type View='resumo'|'clientes'|'servicos'|'extensoes';
async function api<T>(path:string,method='GET',data?:object):Promise<T>{
 const r=await fetch('/api'+path,{method,headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});
 const payload=await r.json() as {message?:string};
 if(!r.ok)throw Error(payload.message||'Erro HTTP '+r.status);
 return payload as T;
}
export default function App(){
 const [clients,setClients]=useState<Client[]>([]),[orders,setOrders]=useState<Order[]>([]);
 const [error,setError]=useState(''),[notice,setNotice]=useState(''),[loading,setLoading]=useState(true),[view,setView]=useState<View>('resumo');
 const [name,setName]=useState(''),[service,setService]=useState(''),[clientId,setClientId]=useState(''),[query,setQuery]=useState(''),[filter,setFilter]=useState('todas');
 const refresh=async()=>{const [c,o]=await Promise.all([api<{items:Client[]}>('/clients'),api<{items:Order[]}>('/orders')]);setClients(c.items);setOrders(o.items);setClientId(v=>c.items.some(x=>x.id===v)?v:c.items[0]?.id||'');};
 useEffect(()=>{void refresh().catch(e=>setError(String(e))).finally(()=>setLoading(false));},[]);
 const run=async(action:()=>Promise<unknown>,message:string)=>{
  setError('');setNotice('');
  try{await action();await refresh();setNotice(message);return true;}catch(e){setError(e instanceof Error?e.message:'Falha inesperada');return false;}
 };
 const saveClient=async(e:FormEvent)=>{e.preventDefault();if(await run(()=>api('/clients','POST',{name}),'Cliente salvo no SQLite.'))setName('');};
 const saveOrder=async(e:FormEvent)=>{e.preventDefault();if(await run(()=>api('/orders','POST',{clientId,service}),'Ordem salva no SQLite.'))setService('');};
 const filtered=orders.filter(o=>(filter==='todas'||o.status===filter)&&(!query.trim()||[o.id,o.service,clients.find(c=>c.id===o.clientId)?.name||''].some(s=>s.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR').trim()))));
 return <main><header><p className="hint">MEU GESTOR · SQLITE LOCAL</p><h1>Meu Gestor</h1><p className="note">Projeto didático com dados fictícios. API em 127.0.0.1:4173; não exponha à internet nem use dados reais.</p></header>
 <div className="layout"><nav className="side" aria-label="Navegação">{([['resumo','Visão geral'],['clientes','Clientes'],['servicos','Serviços'],['extensoes','Extensões (kits)']] as const).map(([id,label])=><button key={id} type="button" aria-pressed={view===id} onClick={()=>setView(id)}>{label}</button>)}</nav>
 <div aria-busy={loading}>{loading&&<p role="status">Carregando registros locais…</p>}{error&&<p role="alert" className="error">{error}</p>}{notice&&<p role="status" className="success">{notice}</p>}
 {view==='resumo'&&<section aria-labelledby="resumo"><h2 id="resumo">Visão geral</h2><div className="grid"><div className="panel metric"><span>Clientes</span><strong>{clients.length}</strong></div><div className="panel metric"><span>Ordens</span><strong>{orders.length}</strong></div><div className="panel metric"><span>Concluídas</span><strong>{orders.filter(o=>o.status==='concluído').length}</strong></div></div><button type="button" onClick={()=>void run(refresh,'Atualizado.')}>Atualizar da API</button></section>}
 {view==='extensoes'&&<Extensions clients={clients} orders={orders}/>}
 {view==='clientes'&&<section className="panel" aria-labelledby="clientes"><h2 id="clientes">Clientes fictícios</h2><form className="form" onSubmit={e=>void saveClient(e)}><label htmlFor="client-name">Nome fictício</label><input id="client-name" value={name} onChange={e=>setName(e.target.value)} maxLength={100}/><button type="submit">Cadastrar</button></form>{clients.length===0&&<p>Nenhum cliente.</p>}{clients.map(c=><div className="item" key={c.id}><div><strong>{c.name}</strong><small> · {c.id}</small></div><div className="actions"><button type="button" onClick={()=>{const v=window.prompt('Novo nome fictício',c.name);if(v!==null)void run(()=>api('/clients/'+c.id,'PATCH',{name:v}),'Cliente alterado.');}}>Editar</button><button type="button" onClick={()=>void run(()=>api('/clients/'+c.id,'DELETE'),'Cliente removido.')}>Excluir</button></div></div>)}</section>}
 {view==='servicos'&&<section className="panel" aria-labelledby="servicos"><h2 id="servicos">Ordens de serviço</h2><form className="form" onSubmit={e=>void saveOrder(e)}><label htmlFor="client">Cliente</label><select id="client" value={clientId} onChange={e=>setClientId(e.target.value)}>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><label htmlFor="service">Serviço fictício</label><input id="service" value={service} onChange={e=>setService(e.target.value)} maxLength={160}/><button type="submit" disabled={!clients.length}>Criar ordem</button></form><h3>Consultar e filtrar</h3><div className="toolbar"><label htmlFor="search">Pesquisa</label><input id="search" value={query} onChange={e=>setQuery(e.target.value)}/><label htmlFor="status">Estado</label><select id="status" value={filter} onChange={e=>setFilter(e.target.value)}><option value="todas">Todas</option><option value="pendente">Pendente</option><option value="em andamento">Em andamento</option><option value="concluído">Concluído</option></select></div><p>{filtered.length} de {orders.length} ordens exibidas.</p>{filtered.length===0&&<p>Nenhuma ordem para este filtro.</p>}{filtered.map(o=><div className="item" key={o.id}><div><strong>{o.service}</strong><p className="hint">{o.id} · {clients.find(c=>c.id===o.clientId)?.name||'Cliente indisponível'} · {o.status}</p></div><div className="actions"><button type="button" onClick={()=>{const v=window.prompt('Novo serviço fictício',o.service);if(v!==null)void run(()=>api('/orders/'+o.id,'PATCH',{service:v}),'Ordem editada.');}}>Editar</button><button type="button" disabled={o.status==='concluído'} onClick={()=>void run(()=>api('/orders/'+o.id+'/advance','PATCH'),'Estado persistido.')}>Avançar</button><button type="button" onClick={()=>void run(()=>api('/orders/'+o.id,'DELETE'),'Ordem removida.')}>Excluir</button></div></div>)}</section>}
 </div></div></main>;
}
