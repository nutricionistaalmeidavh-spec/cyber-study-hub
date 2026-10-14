import { useState } from 'react';
import { clients, orders } from './demo';

type View = 'resumo' | 'clientes' | 'servicos';
export default function App(){
  const [view,setView]=useState<View>('resumo');
  const completed=orders.filter(order=>order.status==='concluído').length;
  return <main>
    <header><p className="hint">MEU GESTOR · CHECKPOINT V0.2</p><h1>Meu Gestor</h1><p className="note">Prévia com dados fictícios. Não grava formulários e não salva alterações.</p></header>
    <div className="layout"><nav className="side" aria-label="Navegação do Meu Gestor">{([['resumo','Visão geral'],['clientes','Clientes'],['servicos','Serviços']] as const).map(([id,label])=><button type="button" aria-pressed={view===id} onClick={()=>setView(id)} key={id}>{label}</button>)}</nav>
    <div aria-live="polite">
      {view==='resumo'&&<section aria-labelledby="h-resumo"><h2 id="h-resumo">Visão geral</h2><div className="grid"><div className="panel metric"><span>Clientes</span><strong>{clients.length}</strong></div><div className="panel metric"><span>Ordens</span><strong>{orders.length}</strong></div><div className="panel metric"><span>Concluídos</span><strong>{completed}</strong></div></div></section>}
      {view==='clientes'&&<section className="panel" aria-labelledby="h-clientes"><h2 id="h-clientes">Clientes demonstrativos</h2>{clients.length?clients.map(c=><div className="item" key={c.id}><strong>{c.name}</strong><small>{c.id}</small></div>):<p>Nenhum cliente demonstrativo.</p>}<p className="hint">Cadastro funcional será implementado no módulo 5.</p></section>}
      {view==='servicos'&&<section className="panel" aria-labelledby="h-servicos"><h2 id="h-servicos">Ordens demonstrativas</h2>{orders.length?orders.map(o=><div className="item" key={o.id}><div><strong>{o.service}</strong><div className="hint">{clients.find(c=>c.id===o.clientId)?.name??'Cliente indisponível'} · {o.id}</div></div><span>{o.status}</span></div>):<p>Nenhuma ordem demonstrativa.</p>}<p className="hint">Ainda não é possível alterar as ordens.</p></section>}
    </div></div>
  </main>;
}
