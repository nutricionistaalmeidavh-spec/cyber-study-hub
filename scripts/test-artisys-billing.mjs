import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPlatformHandler } from '../server/platform.mjs';

const ORIGIN='http://127.0.0.1';
const SECRET='artisys-hubestudos-test-connector-secret-long-enough';
const URL='/api/integrations/artisys/fulfillment';
const email='student@academy.example';
const bodyFor=(overrides={})=>({
 event:'artisys.license.activate',orderId:randomUUID(),
 productId:'hubestudos-course-web-apis',email,
 customerName:'Aluno Exemplo',amountCents:1990,currency:'BRL',saleType:'one_time',
 idempotencyKey:randomUUID(),...overrides
});
async function start(secret=SECRET,{verify=true,deliveryConfigured=true}={}){
 const mail=[];
 const dir=mkdtempSync(join(tmpdir(),'hub-artisys-'));
 const app=createPlatformHandler({dbPath:join(dir,'study.sqlite'),origin:ORIGIN,
   bootstrapKey:'bootstrap-key-for-billing-tests-12345',openRegistration:true,
   artisysConnectorSecret:secret,
   sendVerificationEmail:deliveryConfigured?async data=>{mail.push(data);}:undefined});
 const server=createServer(app.handle);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const request=async(path,method='GET',data=null,cookie='')=>{
  const result=await fetch(base+path,{method,headers:{...(method!=='GET'?{origin:ORIGIN}:{}),
   ...(data?{'content-type':'application/json'}:{}),...(cookie?{cookie}:{})},body:data?JSON.stringify(data):undefined});
  return {status:result.status,payload:await result.json(),cookie:result.headers.get('set-cookie')?.split(';')[0]};
 };
 const admin=await request('/api/auth/bootstrap','POST',{name:'Admin',email:'admin@academy.example',password:'GoodPassword1234!',bootstrapKey:'bootstrap-key-for-billing-tests-12345'});
 assert.equal(admin.status,201);
 const learner=await request('/api/auth/register','POST',{name:'Aluno',email,password:'GoodPassword1234!'});
 assert.equal(learner.status,201);
 const verification=async()=>{
   const started=await request('/api/me/email-verification/request','POST',{},learner.cookie);
   assert.equal(started.status,202,JSON.stringify(started.payload));
   assert.equal(mail.length>0,true);
   const code=mail.at(-1).text.match(/\\b\\d{8}\\b/)?.[0];
   assert.ok(code,'Código somente no e-mail simulado');
   const confirmed=await request('/api/me/email-verification/confirm','POST',{code},learner.cookie);
   assert.equal(confirmed.status,200,JSON.stringify(confirmed.payload));
   return code;
 };
 if(verify)await verification();
 const deliver=async(data,{sign=true,timestamp=Date.now(),deliveryId=data.idempotencyKey}={})=>{
  const body=JSON.stringify(data);
  const signature=createHmac('sha256',SECRET).update(String(timestamp)+'.'+body).digest('hex');
  const result=await fetch(base+URL,{method:'POST',headers:{'content-type':'application/json',
   'x-artisys-timestamp':String(timestamp),'x-artisys-delivery-id':deliveryId,
   'x-artisys-signature':'sha256='+(sign?signature:'0'.repeat(64))},body});
  return {status:result.status,payload:await result.json()};
 };
 return {request,deliver,learner,admin,mail,verification,dbPath:join(dir,'study.sqlite'),close:async()=>{
  await new Promise(resolve=>server.close(resolve));app.close();rmSync(dir,{recursive:true,force:true});
 }};
}
test('a entrega HMAC é a única origem capaz de liberar um curso pago',async()=>{
 const s=await start();
 try{
  const before=await s.request('/api/access/me','GET',null,s.learner.cookie);
  assert.deepEqual(before.payload.courseIds,[]);
  const ev=bodyFor();
  assert.equal((await s.deliver(ev,{sign:false})).status,401);
  assert.equal((await s.deliver(ev,{timestamp:Date.now()-600000})).status,401);
  assert.equal((await s.deliver({...ev,productId:'hubestudos-course-paralela-log'})).status,400);
  assert.equal((await s.deliver({...ev,email:'nobody@example.test'})).status,409);
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds.length,0);
  assert.equal((await s.deliver(ev)).status,200);
  assert.deepEqual((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds,['web-apis']);
  assert.equal((await s.deliver(ev)).status,200);
  assert.deepEqual((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds,['web-apis']);
 }finally{await s.close();}
});
test('reembolso não apaga grant manual nem acesso de outro pedido',async()=>{
 const s=await start();
 try{
  const paid=bodyFor(),other=bodyFor();
  assert.equal((await s.deliver(paid)).status,200);
  assert.equal((await s.deliver(other)).status,200);
  assert.equal((await s.deliver({...paid,event:'artisys.license.revoke',idempotencyKey:randomUUID()})).status,200);
  assert.ok((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds.includes('web-apis'));
  assert.equal((await s.deliver({...other,event:'artisys.license.revoke',idempotencyKey:randomUUID()})).status,200);
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds.includes('web-apis'),false);
  assert.equal((await s.request('/api/admin/access/grants','POST',{userId:s.learner.payload.user.id,courseId:'web-apis'},s.admin.cookie)).status,200);
  assert.equal((await s.deliver({...other,event:'artisys.license.revoke',idempotencyKey:randomUUID()})).status,200);
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds.includes('web-apis'),true);
 }finally{await s.close();}
});
test('assinatura paga expira, renova idempotentemente e não revoga manual',async()=>{
 const s=await start();
 try{
  const original=bodyFor({productId:'hubestudos-subscription',saleType:'monthly'});
  assert.equal((await s.deliver(original)).status,200);
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.subscriptionActive,true);
  const renewal={...original,event:'artisys.license.renew',idempotencyKey:randomUUID()};
  assert.equal((await s.deliver(renewal)).status,200);
  assert.equal((await s.deliver(renewal)).status,200);
  assert.equal((await s.deliver({...original,event:'artisys.license.revoke',idempotencyKey:randomUUID()})).status,200);
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.subscriptionActive,false);
 }finally{await s.close();}
});
test('validação fecha para evento, moeda, valor, perfil e modalidade incorretos',async()=>{
 const s=await start();
 try{
  for(const b of [
   {currency:'USD'},{amountCents:0},{event:'artisys.license.other'},
   {productId:'hubestudos-course-web-apis',saleType:'monthly'},
   {productId:'hubestudos-subscription',saleType:'one_time'},
   {productId:'pdv-artisys'},{productId:'hubestudos-course-unknown'}
  ])assert.equal((await s.deliver(bodyFor(b))).status,400,JSON.stringify(b));
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.subscriptionActive,false);
 }finally{await s.close();}
});
test('sem secret o conector fica desligado por padrão',async()=>{
 const s=await start('');
 try{assert.equal((await s.deliver(bodyFor())).status,503);}
 finally{await s.close();}
});

test('compra de pessoa não verificada não ativa a conta, e código válido ativa após confirmação',async()=>{
 const s=await start(SECRET,{verify:false});
 try{
  const ev=bodyFor();
  assert.equal((await s.deliver(ev)).status,409);
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds.length,0);
  const init=await s.request('/api/me/email-verification/request','POST',{},s.learner.cookie);
  assert.equal(init.status,202);
  assert.equal(s.mail.length,1);
  const fake=await s.request('/api/me/email-verification/confirm','POST',{code:'00000000'},s.learner.cookie);
  assert.equal(fake.status,400);
  const code=s.mail.at(-1).text.match(/\\b\\d{8}\\b/)[0];
  assert.equal((await s.request('/api/me/email-verification/confirm','POST',{code},s.learner.cookie)).status,200);
  assert.equal((await s.request('/api/me/email-verification/confirm','POST',{code},s.learner.cookie)).status,409);
  assert.equal((await s.deliver(ev)).status,200);
  assert.deepEqual((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds,['web-apis']);
 }finally{await s.close();}
});
test('o código não aparece na API e não é possível solicitar outro durante cooldown',async()=>{
 const s=await start(SECRET,{verify:false});
 try{
  const first=await s.request('/api/me/email-verification/request','POST',{},s.learner.cookie);
  assert.equal(first.status,202);
  assert.equal(JSON.stringify(first.payload).includes(s.mail.at(-1).text.match(/\\b\\d{8}\\b/)[0]),false);
  assert.equal((await s.request('/api/me/email-verification/request','POST',{},s.learner.cookie)).status,429);
  for(let i=0;i<10;i++)assert.equal((await s.request('/api/me/email-verification/confirm','POST',{code:'00000000'},s.learner.cookie)).status,400);
  assert.equal((await s.request('/api/me/email-verification/confirm','POST',{code:s.mail[0].text.match(/\\b\\d{8}\\b/)[0]},s.learner.cookie)).status,429);
 }finally{await s.close();}
});
test('sem transporte de e-mail o pagamento não pode reivindicar endereço não verificado',async()=>{
 const s=await start(SECRET,{verify:false,deliveryConfigured:false});
 try{
  assert.equal((await s.request('/api/me/email-verification/request','POST',{},s.learner.cookie)).status,503);
  assert.equal((await s.deliver(bodyFor())).status,409);
 }finally{await s.close();}
});
test('renovação antes da ativação falha, revogação não pode ressuscitar compra',async()=>{
 const s=await start();
 try{
  const original=bodyFor({productId:'hubestudos-subscription',saleType:'monthly'});
  const renewal={...original,event:'artisys.license.renew',idempotencyKey:randomUUID()};
  assert.equal((await s.deliver(renewal)).status,409);
  assert.equal((await s.deliver(original)).status,200);
  assert.equal((await s.deliver({...original,event:'artisys.license.revoke',idempotencyKey:randomUUID()})).status,200);
  assert.equal((await s.deliver({...original,idempotencyKey:randomUUID()})).status,200);
  assert.equal((await s.deliver({...renewal,idempotencyKey:randomUUID()})).status,409);
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.subscriptionActive,false);
 }finally{await s.close();}
});
test('assinatura expirada não abre acesso; segundo pedido pago continua válido após estorno do primeiro',async()=>{
 const s=await start();
 try{
  const first=bodyFor({productId:'hubestudos-subscription',saleType:'monthly'});
  const next=bodyFor({productId:'hubestudos-subscription',saleType:'monthly'});
  assert.equal((await s.deliver(first)).status,200);
  const {DatabaseSync}=await import('node:sqlite');
  const db=new DatabaseSync(s.dbPath);
  try{db.prepare('UPDATE billing_entitlements SET expires_at=1 WHERE order_id=?').run(first.orderId);}
  finally{db.close();}
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.subscriptionActive,false);
  assert.equal((await s.deliver(next)).status,200);
  assert.equal((await s.deliver({...first,event:'artisys.license.revoke',idempotencyKey:randomUUID()})).status,200);
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.subscriptionActive,true);
 }finally{await s.close();}
});
