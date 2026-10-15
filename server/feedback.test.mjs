import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'node:http';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPlatformHandler } from './platform.mjs';

test('feedback P0/P1: ownership, administration, replies, attachments and idempotency', async () => {
  const dir=mkdtempSync(join(tmpdir(),'hub-feedback-'));
  const origin='http://127.0.0.1';
  const app=createPlatformHandler({dbPath:join(dir,'platform.db'),origin,bootstrapKey:'test-key'});
  const server=createServer(app.handle);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const endpoint=origin+':'+server.address().port;
  const request=async(path,{method='GET',data,cookie,originHeader=origin}={})=>{
    const r=await fetch(endpoint+path,{
      method,headers:{...(data?{'Content-Type':'application/json'}:{}),...(method!=='GET'?{Origin:originHeader}:{}),...(cookie?{Cookie:cookie}:{})},
      ...(data?{body:JSON.stringify(data)}:{})
    });
    return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]??''};
  };
  try {
    assert.equal((await request('/api/feedback')).status,401);
    const admin=await request('/api/auth/bootstrap',{method:'POST',data:{name:'Admin',email:'admin@example.test',password:'GoodPassword1234!',bootstrapKey:'test-key'}});
    assert.equal(admin.status,201);
    async function student(email){
      const inv=await request('/api/admin/invitations',{method:'POST',cookie:admin.cookie,data:{email}});
      assert.equal(inv.status,201);
      const reg=await request('/api/auth/register',{method:'POST',data:{name:'Aluno Teste',password:'GoodPassword1234!',inviteToken:inv.body.token}});
      assert.equal(reg.status,201);
      return reg.cookie;
    }
    const a=await student('a@example.test'), b=await student('b@example.test');
    const sample={clientNonce:'9b932c34-6783-49ae-a8c9-1711d7731495',category:'bug',title:'Vídeo não carrega',description:'O vídeo da aula fica em branco ao tentar iniciar.',contextPath:'#course/main/047',contextLabel:'Aula principal 047'};
    assert.equal((await request('/api/feedback',{method:'POST',cookie:a,data:{...sample,title:'a'}})).status,400);
    const created=await request('/api/feedback',{method:'POST',cookie:a,data:sample});
    assert.equal(created.status,201,JSON.stringify(created.body));
    const id=created.body.feedback.id;
    assert.ok(id);
    const again=await request('/api/feedback',{method:'POST',cookie:a,data:sample});
    assert.equal(again.status,200);
    assert.equal(again.body.feedback.id,id);
    assert.equal((await request('/api/feedback',{cookie:a})).body.total,1);
    assert.equal((await request('/api/feedback',{cookie:b})).body.total,0);
    assert.equal((await request('/api/feedback/'+id,{cookie:b})).status,404);
    assert.equal((await request('/api/feedback/'+id+'/attachment',{cookie:b})).status,404);
    assert.equal((await request('/api/admin/feedback',{cookie:a})).status,403);
    assert.equal((await request('/api/admin/feedback',{cookie:admin.cookie})).body.total,1);
    assert.equal((await request('/api/admin/feedback/'+id,{method:'PATCH',cookie:a,data:{status:'resolved'}})).status,403);
    const patched=await request('/api/admin/feedback/'+id,{method:'PATCH',cookie:admin.cookie,data:{status:'in_review',priority:'high'}});
    assert.equal(patched.status,200);
    assert.equal(patched.body.feedback.status,'in_review');
    const replied=await request('/api/feedback/'+id+'/messages',{method:'POST',cookie:admin.cookie,data:{body:'Estamos analisando e retornaremos por aqui.'}});
    assert.equal(replied.status,201);
    assert.equal((await request('/api/feedback/'+id+'/messages',{method:'POST',cookie:b,data:{body:'Tentativa indevida.'}})).status,404);
    const pending=(await request('/api/feedback',{cookie:a})).body.feedback;
    assert.equal(pending[0].hasUpdates,1);
    const detail=await request('/api/feedback/'+id,{cookie:a});
    assert.equal(detail.body.feedback.status,'in_review');
    assert.equal(detail.body.messages.length,1);
    assert.equal(detail.body.messages[0].body,'Estamos analisando e retornaremos por aqui.');
    assert.equal(detail.body.history.some(h=>h.kind==='status'&&h.value==='in_review'),true);
    assert.equal((await request('/api/feedback',{cookie:a})).body.feedback[0].hasUpdates,0);
    assert.equal((await request('/api/feedback',{method:'POST',cookie:a,originHeader:'https://evil.test',data:sample})).status,403);
    const image='data:image/png;base64,'+Buffer.from('small screenshot').toString('base64');
    const imagePost=await request('/api/feedback',{method:'POST',cookie:a,data:{...sample,clientNonce:'9b932c34-6783-49ae-a8c9-1711d7731496',attachment:image}});
    assert.equal(imagePost.status,201);
    const imageId=imagePost.body.feedback.id;
    assert.equal((await request('/api/feedback/'+imageId+'/attachment',{cookie:a})).body.dataUrl,image);
    assert.equal((await request('/api/feedback',{cookie:a})).body.feedback.some(x=>Object.hasOwn(x,'attachment')),false);
    assert.equal((await request('/api/admin/feedback/'+id,{method:'PATCH',cookie:admin.cookie,data:{status:'unknown'}})).status,400);
  } finally {
    await new Promise(resolve=>server.close(resolve));
    app.close();
    rmSync(dir,{recursive:true,force:true});
  }
});
