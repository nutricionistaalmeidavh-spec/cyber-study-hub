export const statuses=Object.freeze(['pendente','em andamento','concluído']);
export function createPlanOrder(state,clientId,service){
 if(!state.clients.some(c=>c.id===clientId))return {ok:false,error:'CLIENTE_INEXISTENTE',state};
 if(typeof service!=='string'||!service.trim())return {ok:false,error:'SERVICO_VAZIO',state};
 const order={id:'OS-'+String(state.orders.length+1).padStart(3,'0'),clientId,service:service.trim(),status:'pendente'};
 return {ok:true,state:{...state,orders:[...state.orders,order]}};
}
export function removePlanClient(state,id){
 if(state.orders.some(o=>o.clientId===id))return {ok:false,error:'CLIENTE_COM_ORDENS',state};
 return {ok:true,state:{...state,clients:state.clients.filter(c=>c.id!==id)}};
}
