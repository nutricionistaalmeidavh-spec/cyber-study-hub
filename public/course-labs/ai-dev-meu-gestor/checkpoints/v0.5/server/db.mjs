import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
export class DomainError extends Error {
 constructor(status,code,message){super(message);this.status=status;this.code=code;}
}
const fail=(status,code,message)=>{throw new DomainError(status,code,message);};
const check=(v,label,max=160)=>{if(typeof v!=='string'||!v.trim()||v.trim().length>max)fail(422,'INVALID_FIELD',label+' exige texto de 1 a '+max+' caracteres');return v.trim();};
const identifier=(v,prefix)=>{if(typeof v!=='string'||!new RegExp('^'+prefix+'-[0-9]{3,}$').test(v))fail(422,'INVALID_ID','Identificador inválido');return v;};
export function openStore(file=':memory:',options={}){
 const isNew=file===':memory:'||!existsSync(resolve(file));
 if(file!==':memory:')mkdirSync(dirname(resolve(file)),{recursive:true});
 const db=new DatabaseSync(file);
 db.exec('PRAGMA foreign_keys=ON');
 if(file!==':memory:')db.exec('PRAGMA journal_mode=WAL');
 db.exec([
 'CREATE TABLE IF NOT EXISTS clients(id TEXT PRIMARY KEY,name TEXT NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 100));',
 "CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,service TEXT NOT NULL CHECK(length(trim(service)) BETWEEN 1 AND 160),status TEXT NOT NULL DEFAULT 'pendente' CHECK(status IN ('pendente','em andamento','concluído')));",
 'CREATE INDEX IF NOT EXISTS orders_client_idx ON orders(client_id);'
 ].join('\n'));
 if(options.seed!==false && isNew){
  db.exec('BEGIN IMMEDIATE');
  try{
   db.prepare('INSERT INTO clients(id,name) VALUES (?,?)').run('C-001','Cliente Exemplo A');
   db.prepare('INSERT INTO clients(id,name) VALUES (?,?)').run('C-002','Cliente Exemplo B');
   const insert=db.prepare('INSERT INTO orders(id,client_id,service,status) VALUES (?,?,?,?)');
   insert.run('OS-001','C-001','Instalação fictícia','em andamento');
   insert.run('OS-002','C-002','Manutenção de exemplo','pendente');
   insert.run('OS-003','C-001','Visita técnica fictícia','concluído');
   db.exec('COMMIT');
  }catch(e){db.exec('ROLLBACK');db.close();throw e;}
 }
 const newId=(table,prefix)=>{
  const x=db.prepare('SELECT COALESCE(MAX(CAST(SUBSTR(id,?) AS INTEGER)),0) AS n FROM '+table).get(prefix.length+2).n;
  return prefix+'-'+String(Number(x)+1).padStart(3,'0');
 };
 const getClient=id=>db.prepare('SELECT id,name FROM clients WHERE id=?').get(id);
 const getOrder=id=>db.prepare('SELECT id,client_id AS clientId,service,status FROM orders WHERE id=?').get(id);
 const clients=()=>db.prepare('SELECT id,name FROM clients ORDER BY id').all();
 const orders=()=>db.prepare('SELECT id,client_id AS clientId,service,status FROM orders ORDER BY id').all();
 return {
  db,close:()=>db.close(),clients,orders,
  createClient(payload){const name=check(payload?.name,'Nome',100),id=newId('clients','C');db.prepare('INSERT INTO clients VALUES (?,?)').run(id,name);return getClient(id);},
  renameClient(id,payload){identifier(id,'C');const name=check(payload?.name,'Nome',100);if(!getClient(id))fail(404,'NOT_FOUND','Cliente não encontrado');db.prepare('UPDATE clients SET name=? WHERE id=?').run(name,id);return getClient(id);},
  removeClient(id){identifier(id,'C');if(!getClient(id))fail(404,'NOT_FOUND','Cliente não encontrado');if(db.prepare('SELECT 1 FROM orders WHERE client_id=?').get(id))fail(409,'CLIENT_HAS_ORDERS','Cliente possui ordens vinculadas');db.prepare('DELETE FROM clients WHERE id=?').run(id);return {removed:true};},
  createOrder(payload){const clientId=identifier(payload?.clientId,'C'),service=check(payload?.service,'Serviço');if(!getClient(clientId))fail(422,'UNKNOWN_CLIENT','Cliente inexistente');const id=newId('orders','OS');db.prepare("INSERT INTO orders(id,client_id,service,status) VALUES (?,?,?,'pendente')").run(id,clientId,service);return getOrder(id);},
  renameOrder(id,payload){identifier(id,'OS');const service=check(payload?.service,'Serviço');if(!getOrder(id))fail(404,'NOT_FOUND','Ordem não encontrada');db.prepare('UPDATE orders SET service=? WHERE id=?').run(service,id);return getOrder(id);},
  advanceOrder(id){identifier(id,'OS');const current=getOrder(id);if(!current)fail(404,'NOT_FOUND','Ordem não encontrada');const next=current.status==='pendente'?'em andamento':current.status==='em andamento'?'concluído':null;if(next)db.prepare('UPDATE orders SET status=? WHERE id=? AND status=?').run(next,id,current.status);return getOrder(id);},
  removeOrder(id){identifier(id,'OS');if(!getOrder(id))fail(404,'NOT_FOUND','Ordem não encontrada');db.prepare('DELETE FROM orders WHERE id=?').run(id);return {removed:true};},
  integrity(){const fk=db.prepare('PRAGMA foreign_key_check').all(),check=db.prepare('PRAGMA integrity_check').all();return {valid:fk.length===0&&check.every(v=>Object.values(v)[0]==='ok'),foreignKeyIssues:fk.length,integrityCheck:check.map(v=>Object.values(v)[0])};}
 };
}
