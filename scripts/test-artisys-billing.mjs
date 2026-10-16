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
 productId:'hubestudos-course-trilha-aplicacoes-cloud-ia',email,
 customerName:'Aluno Exemplo',amountCents:1990,currency:'BRL',saleType:'one_time',
 idempotencyKey:randomUUID(),...overrides
});
async function start(secret=SECRET){
 const dir=mkdtempSync(join(tmpdir(),'hub-artisys-'));
 const app=createPlatformHandler({dbPath:join(dir,'study.sqlite'),origin:ORIGIN,
   bootstrapKey:'bootstrap-key-for-billing-tests-12345',openRegistration:true,
   artisysConnectorSecret:secret});
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
 const issued=new Map();
 const deliver=async(data,{sign=true,timestamp=Date.now(),deliveryId=data.idempotencyKey}={})=>{
  let signed=issued.get(data.orderId);
  if(!signed){
   const productId=(data.productId==='hubestudos-subscription'||data.productId?.startsWith('hubestudos-course-trilha-'))?data.productId:'hubestudos-course-trilha-aplicacoes-cloud-ia';
   const saleType=['monthly','yearly'].includes(data.saleType)&&productId==='hubestudos-subscription'?data.saleType:'one_time';
   const init=await request('/api/billing/purchase-intent','POST',{productId,saleType},learner.cookie);
   signed={buyerBinding:init.payload.buyerBinding,orderCreatedAt:new Date().toISOString()};
   issued.set(data.orderId,signed);
  }
  const body=JSON.stringify({...data,...signed,
    ...(data.buyerBinding!==undefined?{buyerBinding:data.buyerBinding}:{}),
    ...(data.orderCreatedAt!==undefined?{orderCreatedAt:data.orderCreatedAt}:{})});
  const signature=createHmac('sha256',SECRET).update(String(timestamp)+'.'+body).digest('hex');
  const result=await fetch(base+URL,{method:'POST',headers:{'content-type':'application/json',
   'x-artisys-timestamp':String(timestamp),'x-artisys-delivery-id':deliveryId,
   'x-artisys-signature':'sha256='+(sign?signature:'0'.repeat(64))},body});
  return {status:result.status,payload:await result.json()};
 };
 return {request,deliver,learner,admin,dbPath:join(dir,'study.sqlite'),close:async()=>{
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
  assert.deepEqual((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds,['trilha-aplicacoes-cloud-ia']);
  assert.equal((await s.deliver(ev)).status,200);
  assert.deepEqual((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds,['trilha-aplicacoes-cloud-ia']);
 }finally{await s.close();}
});
test('reembolso não apaga grant manual nem acesso de outro pedido',async()=>{
 const s=await start();
 try{
  const paid=bodyFor(),other=bodyFor();
  assert.equal((await s.deliver(paid)).status,200);
  assert.equal((await s.deliver(other)).status,200);
  assert.equal((await s.deliver({...paid,event:'artisys.license.revoke',idempotencyKey:randomUUID()})).status,200);
  assert.ok((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds.includes('trilha-aplicacoes-cloud-ia'));
  assert.equal((await s.deliver({...other,event:'artisys.license.revoke',idempotencyKey:randomUUID()})).status,200);
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds.includes('trilha-aplicacoes-cloud-ia'),false);
  assert.equal((await s.request('/api/admin/access/grants','POST',{userId:s.learner.payload.user.id,courseId:'trilha-aplicacoes-cloud-ia'},s.admin.cookie)).status,200);
  assert.equal((await s.deliver({...other,event:'artisys.license.revoke',idempotencyKey:randomUUID()})).status,200);
  assert.equal((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds.includes('trilha-aplicacoes-cloud-ia'),true);
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
   {productId:'hubestudos-course-trilha-aplicacoes-cloud-ia',saleType:'monthly'},
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

test('renovação antecipada falha e estorno impede reativação por replay',async()=>{
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

test('assinatura expirada bloqueia, sem afetar outra assinatura paga',async()=>{
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

test('pedido assinado libera somente a conta correspondente, não outra sessão',async()=>{
 const s=await start();
 try{
  const other=await s.request('/api/auth/register','POST',{name:'Outro aluno',email:'other@academy.example',password:'GoodPassword1234!'});
  assert.equal(other.status,201);
  const purchase=bodyFor();
  assert.equal((await s.deliver(purchase)).status,200);
  assert.deepEqual((await s.request('/api/access/me','GET',null,other.cookie)).payload.courseIds,[]);
  assert.deepEqual((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds,['trilha-aplicacoes-cloud-ia']);
  assert.equal((await s.deliver({...purchase,email:'other@academy.example',idempotencyKey:randomUUID()})).status,409);
  assert.deepEqual((await s.request('/api/access/me','GET',null,other.cookie)).payload.courseIds,[]);
 }finally{await s.close();}
});

test('reenvio da ativação não soma grants e curso draft segue bloqueado',async()=>{
 const s=await start();
 try{
  const paid=bodyFor();
  assert.equal((await s.deliver(paid)).status,200);
  assert.equal((await s.deliver({...paid,idempotencyKey:randomUUID()})).status,200);
  assert.equal((await s.deliver({...paid,productId:'hubestudos-course-paralela-py'})).status,400);
  assert.equal((await s.deliver({...paid,orderId:randomUUID()})).status,409);
  assert.deepEqual((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds,['trilha-aplicacoes-cloud-ia']);
 }finally{await s.close();}
});

test('sem intenção autenticada, uma compra com e-mail conhecido não libera curso',async()=>{
 const s=await start();
 try{
  const target=bodyFor({buyerBinding:'falso'});
  assert.equal((await s.deliver(target)).status,409);
  assert.deepEqual((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds,[]);
 }finally{await s.close();}
});
test('intenção de compra exige sessão logada; perfil do aluno estável',async()=>{
 const s=await start();
 try{
  const denied=await s.request('/api/billing/purchase-intent','POST',{productId:'hubestudos-course-trilha-aplicacoes-cloud-ia',saleType:'one_time'});
  assert.equal(denied.status,401);
  const created=await s.request('/api/billing/purchase-intent','POST',{productId:'hubestudos-course-trilha-aplicacoes-cloud-ia',saleType:'one_time'},s.learner.cookie);
  assert.equal(created.status,200);
  assert.match(created.payload.buyerBinding,/^[A-Za-z0-9_-]+\.[0-9a-f]{64}$/);
  assert.equal((await s.request('/api/billing/purchase-intent','POST',{productId:'hubestudos-course-paralela-log',saleType:'one_time'},s.learner.cookie)).status,400);
 }finally{await s.close();}
});

test('cada uma das cinco trilhas é um produto isolado e exige confirmação assinada',async()=>{
 const trackIds=[
  'trilha-pentest-ethical-hacking',
  'trilha-seguranca-ofensiva-defensiva',
  'trilha-engenharia-reversa-malware',
  'trilha-pesquisa-vulnerabilidades',
  'trilha-aplicacoes-cloud-ia'
 ];
 const s=await start();
 try{
  const adminAccess=await s.request('/api/access/me','GET',null,s.admin.cookie);
  assert.equal(adminAccess.payload.staff,true);
  assert.ok(trackIds.every(id=>adminAccess.payload.courseIds.includes(id)));
  assert.deepEqual((await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds,[]);
  for(const id of trackIds){
   const purchase=bodyFor({productId:'hubestudos-course-'+id});
   assert.equal((await s.deliver(purchase)).status,200,id);
   const grants=(await s.request('/api/access/me','GET',null,s.learner.cookie)).payload.courseIds;
   assert.ok(grants.includes(id),'grant não liberado: '+id);
   assert.equal(grants.length,trackIds.indexOf(id)+1,'liberação indesejada: '+id);
  }
  assert.equal((await s.request('/api/billing/purchase-intent','POST',{
   productId:'hubestudos-course-web-apis',saleType:'one_time'
  },s.learner.cookie)).status,400,'antigo produto não deve ser vendido');
 }finally{await s.close();}
});
