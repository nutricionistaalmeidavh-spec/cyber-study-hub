import { readFileSync } from 'node:fs';

// Server-only reader: source files are JSON literals wrapped in TypeScript exports.
// No eval and no TypeScript runtime dependency are needed on a self-hosted install.
const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');
function readExport(path,name){
  const source=read(path);
  const start=source.match(new RegExp('export const '+name+'(?::[^=]*)?=\\s*'));
  if(!start)throw Error('Missing private export '+name);
  const data=source.slice(start.index+start[0].length);
  // JSON data is terminated by a semicolon after its closing array/object.
  const end=data.search(/\n[\]}];\s]*(?:\n|$)/);
  // Parse until the top-level JSON closing delimiter; no dynamic code execution.
  const first=data[0],close=first==='['?']':'}';
  let inString=false,escaped=false,depth=0,finish=-1;
  for(let i=0;i<data.length;i++){
    const c=data[i];
    if(inString){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')inString=false;continue;}
    if(c==='"'){inString=true;continue;}
    if(c==='['||c==='{')depth++;
    if(c===']'||c==='}')if(--depth===0){finish=i+1;break;}
  }
  if(finish<0||data[finish-1]!==close)throw Error('Malformed private JSON '+name);
  return JSON.parse(data.slice(0,finish));
}
const lessons=readExport('src/data/lessons.ts','lessons');
const details=readExport('src/data/lessonDetails.ts','lessonDetails');
const scenarios=readExport('src/data/games.ts','scenarios');
const reviewPacks=readExport('src/data/games.ts','reviewPacks');
const ai=JSON.parse(read('src/trails/ai-dev/modules.json'));
const aiLabs=JSON.parse(read('src/trails/ai-dev/labContracts.json'));
const dark=JSON.parse(read('src/trails/channel-dark/modules.json'));
const darkWorkshops=JSON.parse(read('src/trails/channel-dark/oficinas.json'));
const native=new Map(Array.from({length:14},(_,i)=>{
  const id=i+47;
  return [id,JSON.parse(read('src/content/main/'+String(id).padStart(3,'0')+'/lesson.json'))];
}));

export const privateCourseSource={
  getLesson(id){
    const data=native.get(id);
    if(data)return {kind:'native',lesson:data};
    const lesson=lessons.find(l=>l.id===id);
    return lesson?{kind:'legacy',lesson,detail:details[id]??null}:null;
  },
  getTrail(id){
    if(id==='ai-dev')return {modules:ai.modules,labContracts:aiLabs};
    if(id==='channel-dark')return {modules:dark.modules,oficinas:darkWorkshops};
    return null;
  },
  getGames(){return {reviewPacks,scenarios};}
};