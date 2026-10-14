import {runWorkshop} from './models.mjs';
const n=Number(process.argv[2]);
if(!Number.isInteger(n)||n<121||n>130){
 console.error('Uso: node public/course-labs/a121-130/run.mjs 121..130');process.exitCode=2;
}else{
 console.log('Oficina sintética '+n+' — offline; não executa binários externos.');
 console.log(JSON.stringify(runWorkshop(n),null,2));
}
