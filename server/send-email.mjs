import {spawn} from 'node:child_process';

// Free self-hosted transport. Use a local, correctly configured open-source MTA
// (Postfix/OpenSMTPD/etc.) providing sendmail-compatible stdin. No SMTP password in source.
export async function sendWithLocalMta({from,to,subject,text},path='/usr/sbin/sendmail'){
  if(!/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(from)||
     !/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(to))
    throw Error('Remetente ou destinatário inválido.');
  if(typeof path!=='string'||!path.startsWith('/'))throw Error('Caminho do MTA inválido.');
  const safeSubject='=?UTF-8?B?'+Buffer.from(subject).toString('base64')+'?=';
  const message='From: '+from+'\r\nTo: '+to+'\r\nSubject: '+safeSubject+
    '\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8'+
    '\r\nContent-Transfer-Encoding: 8bit\r\n\r\n'+text.replace(/\r?\n/g,'\r\n');
  await new Promise((resolve,reject)=>{
    const child=spawn(path,['-t','-i'],{stdio:['pipe','ignore','pipe']});
    let error='';
    child.stderr.on('data',part=>{error+=String(part).slice(0,1000);});
    child.on('error',reject);
    child.stdin.on('error',reject);
    child.on('close',code=>code===0?resolve():reject(Error('MTA retornou '+code+': '+error.slice(0,500))));
    child.stdin.end(message);
  });
}
