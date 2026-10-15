// Adaptador educacional de estado para tabela. Não depende de UI nem banco.
export function ordersToRows(orders,clients){
 if(!Array.isArray(orders)||!Array.isArray(clients))throw new TypeError('Coleções inválidas');
 const index=new Map(clients.map(x=>[x.id,x.name]));
 return orders.map(o=>{
  if(!o||!index.has(o.clientId)||typeof o.id!=='string'||typeof o.service!=='string')throw new TypeError('OS com vínculo ou campo inválido');
  // Evita interpretação de fórmulas ao abrir como planilha (CSV injection).
  const plain=(value)=>{const s=String(value).replace(/[\r\n\t]/g,' ').trim();return /^[=+@-]/.test(s)?"'"+s:s};
  return {id:plain(o.id),cliente:plain(index.get(o.clientId)),servico:plain(o.service),status:plain(o.status)};
 });
}
