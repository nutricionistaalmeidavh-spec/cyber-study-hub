import {startServer} from './http.mjs';
import {resolve} from 'node:path';
const port=Number(process.env.PORT||4173);
const file=resolve(process.env.DB_FILE||'./data/meu-gestor.sqlite');
const app=await startServer({port,dbFile:file,staticDir:resolve('./dist')});
console.log('Meu Gestor: '+app.url+' (SQLite: '+file+')');
console.log('Servidor apenas local; não disponibilize na internet.');
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{void app.close().then(()=>process.exit(0));});
