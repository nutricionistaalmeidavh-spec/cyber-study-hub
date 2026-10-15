// É necessário instalar @artisys/reporting localmente, conforme README.
import {writeFile} from 'node:fs/promises';
import {toCsv} from '@artisys/reporting';
import {ordersToRows} from './rows.mjs';
const rows=ordersToRows([{id:'OS-1',clientId:'C-1',service:'Revisão preventiva',status:'concluído'}].map(o=>({...o,service:o.service})),[{id:'C-1',name:'Cliente Exemplo'}]);
const csv=toCsv(rows,['id','cliente','servico','status']);
await writeFile(process.argv[2]||'ordens.csv','\\uFEFF'+csv,{flag:'wx'});
console.log('CSV didático: '+rows.length+' OS');
