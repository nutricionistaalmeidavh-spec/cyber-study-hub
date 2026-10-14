import { runLesson } from './models.mjs';
const id=Number(process.argv[2]);
if (!Number.isInteger(id) || id<81 || id>90) {
 console.error('Use: node public/course-labs/a81-90/run.mjs <81..90>');
 process.exitCode=2;
} else console.log(JSON.stringify({lesson:id,...runLesson(id)},null,2));
