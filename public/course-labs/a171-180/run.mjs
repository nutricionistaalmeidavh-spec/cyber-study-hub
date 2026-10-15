import {runResearch} from './models.mjs';
const id=Number(process.argv[2]);
if(!Number.isInteger(id)||id<171||id>180){console.error('Uso: node public/course-labs/a171-180/run.mjs <171..180>');process.exitCode=2;}
else console.log(JSON.stringify(runResearch(id),null,2));
