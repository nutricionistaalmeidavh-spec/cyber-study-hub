import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import net from 'node:net';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {createStudentZip,FILES,OUTPUT_NAME,packageEscolaLab} from './package-escolalab.mjs';
import {LAB_MISSIONS,LAB_MISSION_CODES,getLabMission} from '../public/course-labs/capstone-final/student-ui/missions.js';

function extractStored(zip,root){
  let at=0,entries=0;
  while(at+4<zip.length&&zip.readUInt32LE(at)===0x04034b50){
    const method=zip.readUInt16LE(at+8);
    assert.equal(method,0,'ZIP must work with standard extractors');
    const n=zip.readUInt16LE(at+26),extra=zip.readUInt16LE(at+28),len=zip.readUInt32LE(at+18);
    const name=zip.subarray(at+30,at+30+n).toString('utf8');
    assert.match(name,/^EscolaLab\/[a-zA-Z0-9_.\-/]+$/);
    assert.ok(!name.includes('../'),'no path traversal');
    const dest=path.resolve(root,name);
    assert.ok(dest.startsWith(root+path.sep),'destination inside temp folder');
    mkdirSync(path.dirname(dest),{recursive:true});
    writeFileSync(dest,zip.subarray(at+30+n+extra,at+30+n+extra+len));
    at+=30+n+extra+len;
    entries++;
  }
  assert.equal(entries,FILES.length);
  assert.equal(zip.readUInt32LE(at),0x02014b50,'central directory exists');
}
async function freePort(){
  const server=net.createServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port=server.address().port;
  await new Promise(resolve=>server.close(resolve));
  return port;
}
async function pollReady(url,proc){
  for(let i=0;i<80;i++){
    if(proc.exitCode!==null)throw Error('Lab terminated early with '+proc.exitCode);
    try{const res=await fetch(url+'/health');if(res.ok)return;}catch{}
    await delay(80);
  }
  throw Error('Standalone EscolaLab did not start');
}
test('generate ZIP of independent kit with guide, model, browser assets and three platform launchers',()=>{
  const zip=createStudentZip();
  assert.ok(zip.length>15000);
  const tmp=mkdtempSync(path.join(tmpdir(),'escolalab-zip-'));
  try{
    extractStored(zip,tmp);
    const dir=path.join(tmp,'EscolaLab');
    for(const file of ['server.mjs','model.mjs','lab.test.mjs','student-ui/index.html','student-ui/app.js','student-ui/missions.js',
      'student-ui/style.css','COMECE-AQUI.html','iniciar-windows.bat','iniciar-linux-mac.sh','iniciar-macos.command'])
      assert.ok(readFileSync(path.join(dir,file)).length>30,file);
    const guide=readFileSync(path.join(dir,'COMECE-AQUI.html'),'utf8');
    assert.match(guide,/127\.0\.0\.1:4191/);
    assert.match(guide,/Node\.js 22/);
    assert.doesNotMatch(guide,/raiz do repositório/);
    assert.match(OUTPUT_NAME,/\.zip$/);
  }finally{rmSync(tmp,{recursive:true,force:true});}
});

test('extracted kit runs outside repository and serves real HTTP, not mock fetch',async t=>{
  const temp=mkdtempSync(path.join(tmpdir(),'escolalab-e2e-'));
  extractStored(createStudentZip(),temp);
  const cwd=path.join(temp,'EscolaLab');
  const port=await freePort();
  const proc=spawn(process.execPath,['server.mjs'],{cwd,env:{...process.env,LAB_PORT:String(port),LAB_MODE:'corrected'},stdio:['ignore','pipe','pipe']});
  const logs=[];
  proc.stdout.on('data',data=>logs.push(String(data)));
  proc.stderr.on('data',data=>logs.push(String(data)));
  t.after(async()=>{
    if(proc.exitCode===null)proc.kill('SIGTERM');
    await Promise.race([new Promise(resolve=>proc.once('exit',resolve)),delay(2000)]);
    rmSync(temp,{recursive:true,force:true});
  });
  const base='http://127.0.0.1:'+port;
  await pollReady(base,proc);
  for(const [route,contentType] of [['/','text/html'],['/app.js','text/javascript'],['/missions.js','text/javascript'],['/style.css','text/css']]){
    const r=await fetch(base+route);assert.equal(r.status,200);
    assert.ok(r.headers.get('content-type').startsWith(contentType));
    assert.match(r.headers.get('content-security-policy'),/default-src 'none'/);
    assert.equal(r.headers.get('access-control-allow-origin'),null);
  }
  const checks=[
    ['alice','vulnerable',200],['bob','vulnerable',200],
    ['bob','corrected',403],['alice','corrected',200]
  ];
  for(const [actor,mode,status] of checks){
    const r=await fetch(base+'/lab/api/invoices/F001?as='+actor+'&mode='+mode);
    assert.equal(r.status,status);
    const json=await r.json();
    assert.equal(json.request.actor,actor);assert.equal(json.audit.status,status);
    assert.equal(json.fictional,true);
    if(actor==='bob'&&mode==='vulnerable')assert.equal(json.detection,'UNAUTHORIZED_READ_DEMO');
  }
  // Todas as missões vêm de UM único ZIP extraído, mas exigem provas HTTP diferentes.
  const checksByMission={};
  for(const code of LAB_MISSION_CODES){
    const mission=getLabMission(code);
    const proofs=[];
    for(const step of mission.steps){
      const url=step.route==='/health'
        ?base+'/health'
        :base+'/lab/api/invoices/F001?as='+step.actor+'&mode='+step.mode;
      const response=await fetch(url);
      assert.equal(response.status,step.status,'AULA-'+code+' / '+step.id);
      const body=await response.json();
      const signal=body.detection??null;
      if(Object.hasOwn(step,'detection'))assert.equal(signal,step.detection,'sinal '+code+' / '+step.id);
      proofs.push({stepId:step.id,route:step.route,status:response.status,signal});
    }
    checksByMission[code]=proofs;
  }
  assert.notDeepEqual(checksByMission['034'].map(p=>p.stepId),checksByMission['040'].map(p=>p.stepId));
  assert.equal(checksByMission['213'][0].route,'/health');
  assert.equal(checksByMission['218'][0].signal,'UNAUTHORIZED_READ_DEMO');
  assert.equal(checksByMission['218'][1].signal,null);
  const legacy=await fetch(base+'/invoices/F001?as=bob');
  assert.equal(legacy.status,403,'original endpoint must remain backward compatible');
  assert.equal((await fetch(base+'/lab/api/invoices/F001?as=bob&mode=production')).status,400);
  assert.equal((await fetch(base+'/unknown')).status,404);
  assert.equal((await fetch(base+'/health',{headers:{Origin:'http://some-other-site.invalid'}})).status,403);
  const hostSpoofStatus=await new Promise((resolve,reject)=>{
    const req=http.get({hostname:'127.0.0.1',port,path:'/health',headers:{Host:'evil.example'}},res=>{
      res.resume();res.on('end',()=>resolve(res.statusCode));
    });
    req.on('error',reject);
  });
  assert.equal(hostSpoofStatus,403);
  assert.equal((await fetch(base+'/health',{method:'POST'})).status,405);
  assert.ok(logs.join('').includes('EscolaLab'));
});

test('packaging is deterministic and creates requested public download path',()=>{
  const a=createStudentZip(),b=createStudentZip();
  assert.deepEqual(a,b);
  const temp=mkdtempSync(path.join(tmpdir(),'escolalab-artifact-'));
  try{
    const dest=path.join(temp,OUTPUT_NAME);
    const result=packageEscolaLab(dest);
    assert.equal(result.entries,FILES.length);
    assert.equal(result.bytes,a.length);
    assert.deepEqual(readFileSync(dest),a);
  }finally{rmSync(temp,{recursive:true,force:true});}
});


test('one shared ZIP has four distinct canonical missions and one Academy download URL',()=>{
  assert.deepEqual(LAB_MISSION_CODES,['034','040','213','218']);
  assert.equal(FILES.filter(x=>x[1]==='student-ui/missions.js').length,1);
  assert.match(OUTPUT_NAME,/EscolaLab-v1\.1\.0\.zip/);
  for(const code of LAB_MISSION_CODES){
    const mission=LAB_MISSIONS[code];
    assert.equal(mission.steps.length,4);
    assert.ok(mission.title.length>10);
    assert.ok(mission.focus.length>20);
    assert.equal(new Set(mission.steps.map(x=>x.id)).size,4);
    for(const step of mission.steps){
      assert.ok(['/health','/invoices/F001'].includes(step.route));
      assert.ok([200,403].includes(step.status));
      assert.ok(['alice','bob'].includes(step.actor));
    }
  }
  const academy=readFileSync('src/components/pentest/EscolaLabLocalPackage.tsx','utf8');
  const aula34=readFileSync('src/components/pentest/EscolaLabIntroLab.tsx','utf8');
  const checkpoint=readFileSync('src/components/pentest/PentestCheckpointLab.tsx','utf8');
  assert.match(academy,/EscolaLab-v1\.1\.0\.zip/);
  assert.match(academy,/Não baixe novamente/);
  assert.match(academy,/lessonId:EscolaLabLocalLesson/);
  assert.match(aula34,/<EscolaLabLocalPackage lessonId=\{34\}/);
  assert.match(checkpoint,/<EscolaLabLocalPackage lessonId=\{lessonId as EscolaLabLocalLesson\}/);
  assert.doesNotMatch(aula34,/EscolaLab-v1\.0\.0\.zip/);
  assert.doesNotMatch(checkpoint,/EscolaLab-v1\.0\.0\.zip/);
  const student=readFileSync('public/course-labs/capstone-final/student-ui/app.js','utf8');
  assert.match(student,/getLabMission/);
  assert.match(student,/state\.missions\[state\.mission\]/);
  assert.match(student,/EscolaLab-AULA-/);
  assert.match(student,/localStorage\.setItem/);
  const guide=readFileSync('public/course-labs/capstone-final/student-kit/COMECE-AQUI.html','utf8');
  assert.match(guide,/Baixe o ZIP apenas uma vez/);
});
