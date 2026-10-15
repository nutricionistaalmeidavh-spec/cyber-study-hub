import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'node:http';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPlatformHandler } from './platform.mjs';

test('P2 roadmap is public only after moderation; votes are authenticated, reversible and unique; release notes are curated', async () => {
  const dir=mkdtempSync(join(tmpdir(),'hub-roadmap-'));
  const origin='http://127.0.0.1';
  const app=createPlatformHandler({dbPath:join(dir,'platform.db'),origin,bootstrapKey:'test-key'});
  const server=createServer(app.handle);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const endpoint=origin+':'+server.address().port;
  const request=async(path,{method='GET',data,cookie,originHeader=origin}={})=>{
    const r=await fetch(endpoint+path,{
      method,headers:{...(data!==undefined?{'Content-Type':'application/json'}:{}),...(method!=='GET'?{Origin:originHeader}:{}),...(cookie?{Cookie:cookie}:{})},
      ...(data!==undefined?{body:JSON.stringify(data)}:{})
    });
    return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]??''};
  };
  try{
    const anonymous=await request('/api/roadmap');
    assert.equal(anonymous.status,200);
    assert.deepEqual(anonymous.body.ideas,[]);
    assert.deepEqual(anonymous.body.releases,[]);
    const admin=await request('/api/auth/bootstrap',{method:'POST',data:{name:'Admin',email:'admin@example.test',password:'GoodPassword1234!',bootstrapKey:'test-key'}});
    assert.equal(admin.status,201);
    const invited=await request('/api/admin/invitations',{method:'POST',cookie:admin.cookie,data:{email:'aluno@example.test'}});
    const student=await request('/api/auth/register',{method:'POST',data:{name:'Aluno',password:'GoodPassword1234!',inviteToken:invited.body.token}});
    assert.equal(student.status,201);
    const privateIdea=await request('/api/feedback',{method:'POST',cookie:student.cookie,data:{
      clientNonce:'e467e4b4-e854-463d-8759-041bd1c13b72',category:'idea',title:'Quero baixar exercícios',
      description:'O aluno privado descreve uma sugestão com dados pessoais não publicáveis.',
      contextPath:'#course/main/047',contextLabel:'Aula principal 047'
    }});
    const privateId=privateIdea.body.feedback.id;
    assert.ok(privateId);
    const bug=await request('/api/feedback',{method:'POST',cookie:student.cookie,data:{
      clientNonce:'d3927daa-994b-4d82-a742-8b675c1515a4',category:'bug',
      title:'Falha privada',description:'Tela sensível com dados privados anexados.',
      contextPath:'#dashboard',contextLabel:'Início'
    }});
    assert.equal((await request('/api/admin/feedback/'+bug.body.feedback.id+'/publish',{method:'POST',cookie:admin.cookie,data:{title:'Título visível',summary:'Texto público seguro.'}})).status,400);
    assert.equal((await request('/api/admin/feedback/'+privateId+'/publish',{method:'POST',cookie:student.cookie,data:{title:'Melhorar exercícios',summary:'Desejo baixar exercícios.'}})).status,403);
    assert.deepEqual((await request('/api/roadmap')).body.ideas,[]);
    const published=await request('/api/admin/feedback/'+privateId+'/publish',{method:'POST',cookie:admin.cookie,data:{
      title:'Baixar exercícios para praticar',summary:'Adicionar download de exercícios para uso offline.',stage:'under_review'
    }});
    assert.equal(published.status,201,JSON.stringify(published.body));
    const ideaId=published.body.idea.id;
    assert.ok(ideaId);
    const publicList=await request('/api/roadmap');
    assert.equal(publicList.status,200);
    assert.equal(publicList.body.ideas.length,1);
    assert.equal(publicList.body.ideas[0].title,'Baixar exercícios para praticar');
    assert.equal(publicList.body.ideas[0].votes,0);
    assert.equal(publicList.body.ideas[0].voted,false);
    assert.equal(JSON.stringify(publicList.body).includes('aluno@example.test'),false);
    assert.equal(JSON.stringify(publicList.body).includes('dados pessoais'),false);
    assert.equal(JSON.stringify(publicList.body).includes(privateId),false);
    assert.equal((await request('/api/roadmap/ideas/'+ideaId+'/vote',{method:'POST'})).status,401);
    assert.equal((await request('/api/roadmap/ideas/'+ideaId+'/vote',{method:'POST',cookie:student.cookie,originHeader:'https://attacker.test'})).status,403);
    const vote=await request('/api/roadmap/ideas/'+ideaId+'/vote',{method:'POST',cookie:student.cookie});
    assert.equal(vote.status,200);
    assert.equal(vote.body.votes,1);
    assert.equal(vote.body.voted,true);
    const duplicate=await request('/api/roadmap/ideas/'+ideaId+'/vote',{method:'POST',cookie:student.cookie});
    assert.equal(duplicate.body.votes,1);
    assert.equal((await request('/api/roadmap',{cookie:student.cookie})).body.ideas[0].voted,true);
    assert.equal((await request('/api/roadmap',{cookie:admin.cookie})).body.ideas[0].voted,false);
    const unvote=await request('/api/roadmap/ideas/'+ideaId+'/vote',{method:'DELETE',cookie:student.cookie});
    assert.equal(unvote.body.votes,0);
    assert.equal(unvote.body.voted,false);
    assert.equal((await request('/api/admin/roadmap/ideas/'+ideaId,{method:'PATCH',cookie:student.cookie,data:{stage:'planned'}})).status,403);
    assert.equal((await request('/api/admin/roadmap/ideas/'+ideaId,{method:'PATCH',cookie:admin.cookie,data:{stage:'nonsense'}})).status,400);
    const progress=await request('/api/admin/roadmap/ideas/'+ideaId,{method:'PATCH',cookie:admin.cookie,data:{stage:'in_progress'}});
    assert.equal(progress.status,200);
    assert.equal((await request('/api/roadmap')).body.ideas[0].stage,'in_progress');
    const release=await request('/api/admin/roadmap/releases',{method:'POST',cookie:admin.cookie,data:{
      feedbackId:privateId,title:'Exercícios disponíveis offline',summary:'As aulas agora oferecem material para baixar e praticar sem conexão.'
    }});
    assert.equal(release.status,201);
    const releases=(await request('/api/roadmap')).body.releases;
    assert.equal(releases.length,1);
    assert.equal(releases[0].title,'Exercícios disponíveis offline');
    assert.equal(releases[0].sourceTitle,'Baixar exercícios para praticar');
    assert.equal(JSON.stringify(releases).includes('aluno@example.test'),false);
    assert.equal((await request('/api/admin/roadmap/releases',{method:'POST',cookie:student.cookie,data:{feedbackId:privateId,title:'Nota clandestina',summary:'Não autorizado.'}})).status,403);
    assert.equal((await request('/api/admin/roadmap/ideas/'+ideaId,{method:'DELETE',cookie:admin.cookie})).status,200);
    assert.deepEqual((await request('/api/roadmap')).body.ideas,[]);
    assert.equal((await request('/api/roadmap/ideas/'+ideaId+'/vote',{method:'POST',cookie:student.cookie})).status,404);
    assert.equal((await request('/api/roadmap')).body.releases.length,1);
  } finally{
    await new Promise(resolve=>server.close(resolve));
    app.close();
    rmSync(dir,{recursive:true,force:true});
  }
});
