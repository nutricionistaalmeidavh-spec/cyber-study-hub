export type Status = 'pendente' | 'em andamento' | 'concluído';
export type Client = { id: string; name: string };
export type Order = { id: string; clientId: string; service: string; status: Status };
export const clients: Client[] = [{id:'C-001',name:'Cliente Exemplo A'},{id:'C-002',name:'Cliente Exemplo B'}];
export const orders: Order[] = [{id:'OS-001',clientId:'C-001',service:'Instalação de equipamento',status:'em andamento'},{id:'OS-002',clientId:'C-002',service:'Manutenção preventiva',status:'pendente'},{id:'OS-003',clientId:'C-001',service:'Visita técnica',status:'concluído'}];
