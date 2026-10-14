import {runWorkshop} from './models.mjs';
const n=Number(process.argv[2]);
if(!Number.isInteger(n)||n<141||n>150){
 console.error('Uso: node public/course-labs/a141-150/run.mjs <141..150>');
 process.exitCode=1;
}else console.log(JSON.stringify({aula:n,modo:'fixture-inerte-offline',...runWorkshop(n)},null,2));
