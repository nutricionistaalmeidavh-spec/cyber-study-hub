// Empacotador ZIP sem dependências npm, com entradas determinísticas e seguras.
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

export const FILES=Object.freeze([
  ['public/course-labs/capstone-final/model.mjs','model.mjs'],
  ['public/course-labs/capstone-final/server.mjs','server.mjs'],
  ['public/course-labs/capstone-final/lab.test.mjs','lab.test.mjs'],
  ['public/course-labs/capstone-final/student-ui/index.html','student-ui/index.html'],
  ['public/course-labs/capstone-final/student-ui/app.js','student-ui/app.js'],
  ['public/course-labs/capstone-final/student-ui/missions.js','student-ui/missions.js'],
  ['public/course-labs/capstone-final/student-ui/style.css','student-ui/style.css'],
  ['public/course-labs/capstone-final/student-kit/COMECE-AQUI.html','COMECE-AQUI.html'],
  ['public/course-labs/capstone-final/student-kit/LEIA-ME.txt','LEIA-ME.txt'],
  ['public/course-labs/capstone-final/student-kit/iniciar-windows.bat','iniciar-windows.bat'],
  ['public/course-labs/capstone-final/student-kit/iniciar-linux-mac.sh','iniciar-linux-mac.sh'],
  ['public/course-labs/capstone-final/student-kit/iniciar-macos.command','iniciar-macos.command']
]);
export const OUTPUT_NAME='EscolaLab-v1.1.0.zip';
const repoRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const crcTable=Array.from({length:256},(_,i)=>{
  let c=i;
  for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;
  return c>>>0;
});
function crc32(bytes){
  let c=0xffffffff;
  for(const b of bytes)c=crcTable[(c^b)&0xff]^(c>>>8);
  return (c^0xffffffff)>>>0;
}
export function createStudentZip(){
  const bodies=[],central=[];
  let offset=0;
  for(const [source,dest] of FILES){
    if(dest.includes('..')||dest.startsWith('/')||dest.includes('\\'))throw Error('Caminho ZIP inválido');
    const name=Buffer.from('EscolaLab/'+dest,'utf8');
    const data=readFileSync(path.join(repoRoot,source));
    const crc=crc32(data);
    // ZIP store; portable even with built-in extraction tools on Windows.
    const head=Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50,0);
    head.writeUInt16LE(20,4);head.writeUInt16LE(0x0800,6);
    head.writeUInt16LE(0,8);head.writeUInt16LE(0,10);
    head.writeUInt16LE(0x5c21,12); // 2026-01-01
    head.writeUInt32LE(crc,14);head.writeUInt32LE(data.length,18);head.writeUInt32LE(data.length,22);
    head.writeUInt16LE(name.length,26);
    bodies.push(head,name,data);
    const dir=Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50,0);
    dir.writeUInt16LE(0x031e,4);dir.writeUInt16LE(20,6);
    dir.writeUInt16LE(0x0800,8);dir.writeUInt16LE(0,10);
    dir.writeUInt16LE(0,12);dir.writeUInt16LE(0x5c21,14);
    dir.writeUInt32LE(crc,16);dir.writeUInt32LE(data.length,20);dir.writeUInt32LE(data.length,24);
    dir.writeUInt16LE(name.length,28);
    const executable=dest.endsWith('.sh')||dest.endsWith('.command');
    dir.writeUInt32LE(((executable?0o100755:0o100644)<<16)>>>0,38);
    dir.writeUInt32LE(offset,42);
    central.push(dir,name);
    offset+=head.length+name.length+data.length;
  }
  const centralLength=central.reduce((n,b)=>n+b.length,0);
  const end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50,0);
  end.writeUInt16LE(FILES.length,8);end.writeUInt16LE(FILES.length,10);
  end.writeUInt32LE(centralLength,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...bodies,...central,end]);
}
export function packageEscolaLab(output=path.join(repoRoot,'public','downloads',OUTPUT_NAME)){
  mkdirSync(path.dirname(output),{recursive:true});
  const bytes=createStudentZip();
  writeFileSync(output,bytes);
  return {path:output,bytes:bytes.length,entries:FILES.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const out=packageEscolaLab();
  console.log('Pacote gerado:',out.path,'('+out.bytes+' bytes, '+out.entries+' arquivos)');
}
