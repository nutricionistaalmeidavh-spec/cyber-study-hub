import {safeCopySqlite} from './backup.mjs';
if(process.argv.length!==4){console.error('Uso: node ops/restore.mjs BACKUP.sqlite BANCO-NOVO.sqlite');process.exitCode=2;}
else safeCopySqlite(process.argv[2],process.argv[3]).then(result=>console.log('Restauração validada:',JSON.stringify(result))).catch(e=>{console.error(e.message);process.exitCode=1;});
