export type Status = 'pendente' | 'em andamento' | 'concluído';
export type Client = { id: string; name: string };
export type Order = { id: string; clientId: string; service: string; status: Status };
export type State = { clients: Client[]; orders: Order[] };

export function seed(): State {return {clients:[{id:'C-001',name:'Cliente Exemplo A'},{id:'C-002',name:'Cliente Exemplo B'}],orders:[{id:'OS-001',clientId:'C-001',service:'Instalação de equipamento',status:'em andamento'},{id:'OS-002',clientId:'C-002',service:'Manutenção preventiva',status:'pendente'},{id:'OS-003',clientId:'C-001',service:'Visita técnica',status:'concluído'}]};}
const cleaned = (value: unknown, label: string): string => {if(typeof value !== 'string'||!value.trim())throw new Error(label+' obrigatório');return value.trim();};
const nextId=(ids:string[],prefix:string)=>prefix+String(1+Math.max(0,...ids.map(x=>Number(x.slice(prefix.length))).filter(Number.isInteger))).padStart(3,'0');
function exists(state: State,id:string){if(!state.clients.some(c=>c.id===id))throw new Error('Cliente inexistente');}
export function addClient(state:State,name:string):State{const text=cleaned(name,'Nome');const id=nextId(state.clients.map(c=>c.id),'C-');return {...state,clients:[...state.clients,{id,name:text}]};}
export function editClient(state:State,id:string,name:string):State{const text=cleaned(name,'Nome');if(!state.clients.some(c=>c.id===id))throw new Error('Cliente inexistente');return {...state,clients:state.clients.map(c=>c.id===id?{...c,name:text}:c)};}
export function removeClient(state:State,id:string):State{if(!state.clients.some(c=>c.id===id))throw new Error('Cliente inexistente');if(state.orders.some(o=>o.clientId===id))throw new Error('Cliente possui ordens e não pode ser excluído');return {...state,clients:state.clients.filter(c=>c.id!==id)};}
export function addOrder(state:State,clientId:string,service:string):State{exists(state,clientId);const text=cleaned(service,'Serviço');const id=nextId(state.orders.map(o=>o.id),'OS-');return {...state,orders:[...state.orders,{id,clientId,service:text,status:'pendente'}]};}
export function editOrder(state:State,id:string,service:string):State{const text=cleaned(service,'Serviço');if(!state.orders.some(o=>o.id===id))throw new Error('Ordem inexistente');return {...state,orders:state.orders.map(o=>o.id===id?{...o,service:text}:o)};}
export function removeOrder(state:State,id:string):State{if(!state.orders.some(o=>o.id===id))throw new Error('Ordem inexistente');return {...state,orders:state.orders.filter(o=>o.id!==id)};}
export function advanceOrder(state:State,id:string):State{const order=state.orders.find(o=>o.id===id);if(!order)throw new Error('Ordem inexistente');if(order.status==='concluído')return state;const next:Status=order.status==='pendente'?'em andamento':'concluído';return {...state,orders:state.orders.map(o=>o.id===id?{...o,status:next}:o)};}
export function findOrders(state:State,query:string,status:Status|'todas'='todas'):Order[]{const q=query.toLocaleLowerCase('pt-BR').trim();return state.orders.filter(o=>(status==='todas'||o.status===status)&&(!q||o.service.toLocaleLowerCase('pt-BR').includes(q)||state.clients.find(c=>c.id===o.clientId)?.name.toLocaleLowerCase('pt-BR').includes(q)||o.id.toLocaleLowerCase('pt-BR').includes(q)));}
export function doneCount(state:State){return state.orders.filter(o=>o.status==='concluído').length;}
