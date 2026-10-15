import {runToolLab} from './model.mjs';
const code=String(process.argv[2]??'').toUpperCase();
if(!/^LAB-(0[1-9]|[12][0-9]|30)$/.test(code)){console.error('Uso: node public/course-labs/lab-tools/run.mjs LAB-01 ... LAB-30');process.exitCode=2;}
else console.log(JSON.stringify(runToolLab(code),null,2));
