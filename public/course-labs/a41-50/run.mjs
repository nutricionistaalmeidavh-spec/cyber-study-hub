import { runLesson } from './models.mjs';
const id = Number(process.argv[2]);
if (!Number.isInteger(id) || id < 41 || id > 50) {
  console.error('Uso: node public/course-labs/a41-50/run.mjs 41..50');
  process.exitCode = 2;
} else {
  console.log('AULA-' + String(id).padStart(3, '0') + ' — laboratório local determinístico');
  console.log(JSON.stringify(runLesson(id), null, 2));
}
