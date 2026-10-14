import {runLesson} from './models.mjs';
const n=Number(process.argv[2]);
if(!Number.isInteger(n)||n<71||n>80){
  console.error('Uso: node public/course-labs/a071-080/run.mjs 71..80');
  process.exitCode=2;
}else{
  console.log('Oficina local AULA-'+String(n).padStart(3,'0')+' (somente dados sintéticos)');
  console.log(JSON.stringify(runLesson(n),null,2));
}
