import {runWorkshop} from './models.mjs';
const n=Number(process.argv[2]);
if(!Number.isInteger(n)||n<131||n>140){
 console.error('Uso: node public/course-labs/a131-140/run.mjs 131..140');
 process.exitCode=2;
}else{
 console.log('Oficina defensiva '+n+' — dados sintéticos, offline, sem execução de malware.');
 console.log(JSON.stringify(runWorkshop(n),null,2));
}
