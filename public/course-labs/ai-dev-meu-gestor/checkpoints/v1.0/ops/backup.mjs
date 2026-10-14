import {DatabaseSync,backup} from 'node:sqlite';
import {existsSync,mkdirSync,rmSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
function inspect(db){
 const integrity=db.prepare('PRAGMA integrity_check').all();
 const fk=db.prepare('PRAGMA foreign_key_check').all();
 if(fk.length||!integrity.every(x=>Object.values(x)[0]==='ok'))throw Error('Integridade SQLite ou relações inválidas');
 const t=db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('clients','orders')").all();
 if(t.length!==2)throw Error('Tabelas obrigatórias ausentes');
 return {clients:Number(db.prepare('SELECT COUNT(*) AS n FROM clients').get().n),orders:Number(db.prepare('SELECT COUNT(*) AS n FROM orders').get().n)};
}
export async function safeCopySqlite(source,target){
 const from=resolve(source),to=resolve(target);
 if(from===to)throw Error('Origem e destino coincidem');
 if(!existsSync(from))throw Error('Origem não existe');
 if(existsSync(to))throw Error('Destino já existe; nunca sobrescrever arquivo existente');
 mkdirSync(dirname(to),{recursive:true});
 const db=new DatabaseSync(from);let before;
 try{db.exec('PRAGMA foreign_keys=ON');before=inspect(db);await backup(db,to);}
 catch(error){rmSync(to,{force:true});throw error;}
 finally{db.close();}
 const restored=new DatabaseSync(to);let after;
 try{restored.exec('PRAGMA foreign_keys=ON');after=inspect(restored);}
 finally{restored.close();}
 if(after.orders!==before.orders||after.clients!==before.clients){rmSync(to,{force:true});throw Error('Contagens divergentes no arquivo novo');}
 return {path:to,...after,integrity:true};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 if(process.argv.length!==4){console.error('Uso: node ops/backup.mjs ORIGEM.sqlite DESTINO-NOVO.sqlite');process.exitCode=2;}
 else safeCopySqlite(process.argv[2],process.argv[3]).then(result=>console.log(JSON.stringify(result,null,2))).catch(e=>{console.error(e.message);process.exitCode=1;});
}
