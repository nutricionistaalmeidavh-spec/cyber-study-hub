import { publishedCourseIds } from '../worker/course-access.mjs';
import { verifyBuyerIntent } from './buyer-intent.mjs';

// Shared by Node/SQLite and Cloudflare Durable Objects. Payments are OPTIONAL.
// This endpoint receives fulfilment events, NEVER raw gateway webhooks or browser claims.
export const ARTISYS_FULFILLMENT_PATH='/api/integrations/artisys/fulfillment';
export const BILLING_SCHEMA=[
 "CREATE TABLE IF NOT EXISTS billing_entitlements (order_id TEXT PRIMARY KEY,user_id TEXT NOT NULL,product_id TEXT NOT NULL,course_id TEXT,period_days INTEGER,granted_at INTEGER NOT NULL,expires_at INTEGER,revoked_at INTEGER)",
 "CREATE INDEX IF NOT EXISTS idx_billing_user ON billing_entitlements(user_id,revoked_at,expires_at)",
 "CREATE TABLE IF NOT EXISTS billing_events (delivery_id TEXT PRIMARY KEY,order_id TEXT NOT NULL,event TEXT NOT NULL,received_at INTEGER NOT NULL)"
];
const DAY=86400000;
const encoder=new TextEncoder();
const idOk=x=>typeof x==='string'&&/^[0-9a-f-]{36}$/i.test(x);
const emailOk=x=>typeof x==='string'&&x.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
const digits=x=>typeof x==='string'&&/^\d{13}$/.test(x);
const hexBytes=hex=>Uint8Array.from(hex.match(/../g),b=>parseInt(b,16));
export class ArtisysDeliveryError extends Error {
 constructor(status,message){super(message);this.status=status;}
}
const reject=(status,message)=>{throw new ArtisysDeliveryError(status,message);};
export function billingProduct(productId,saleType){
 if(productId==='hubestudos-subscription'&&saleType==='monthly')return {kind:'subscription',courseId:null,periodDays:30};
 if(productId==='hubestudos-subscription'&&saleType==='yearly')return {kind:'subscription',courseId:null,periodDays:365};
 if(saleType!=='one_time'||typeof productId!=='string'||!productId.startsWith('hubestudos-course-'))return null;
 const courseId=productId.slice('hubestudos-course-'.length);
 return publishedCourseIds.has(courseId)?{kind:'course',courseId,periodDays:null}:null;
}
const header=(headers,name)=>typeof headers.get==='function'?headers.get(name):headers[name];
export async function verifyArtisysDelivery({headers,body,secret,now=Date.now()}){
 if(typeof secret!=='string'||secret.length<32)reject(503,'Conector financeiro não configurado.');
 if(typeof body!=='string'||encoder.encode(body).byteLength>16384||!/^application\/json(?:;|$)/i.test(header(headers,'content-type')||''))reject(415,'Payload JSON inválido.');
 const stamp=header(headers,'x-artisys-timestamp'),sig=header(headers,'x-artisys-signature');
 const deliveryId=header(headers,'x-artisys-delivery-id');
 if(!digits(stamp)||Math.abs(now-Number(stamp))>300000||!/^sha256=[0-9a-f]{64}$/.test(sig||'')||!idOk(deliveryId))
  reject(401,'Assinatura da entrega inválida.');
 const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
 const valid=await crypto.subtle.verify('HMAC',key,hexBytes(sig.slice(7)),encoder.encode(stamp+'.'+body));
 if(!valid)reject(401,'Assinatura da entrega inválida.');
 let data;
 try{data=JSON.parse(body);}catch{reject(400,'JSON inválido.');}
 if(!data||typeof data!=='object'||Array.isArray(data)||!['artisys.license.activate','artisys.license.renew','artisys.license.revoke'].includes(data.event)||
    !idOk(data.orderId)||data.idempotencyKey!==deliveryId||!emailOk(data.email)||data.email!==data.email.trim().toLowerCase()||
    data.currency!=='BRL'||!Number.isSafeInteger(data.amountCents)||data.amountCents<1)
  reject(400,'Evento financeiro inválido.');
 const product=billingProduct(data.productId,data.saleType);
 if(!product||(data.event==='artisys.license.renew'&&product.kind!=='subscription'))
  reject(400,'Produto ou modalidade não autorizados para o HubEstudos.');
 let buyer;
 try{buyer=await verifyBuyerIntent({ticket:data.buyerBinding,productId:data.productId,saleType:data.saleType,email:data.email,orderCreatedAt:data.orderCreatedAt,secret,now});}
 catch{reject(409,'Pedido sem vínculo seguro com a conta que iniciou a compra.');}
 return {deliveryId,orderId:data.orderId,event:data.event,productId:data.productId,email:data.email,
   saleType:data.saleType,userId:buyer.userId,...product};
}
// Execute inside a single SQLite transaction (Node BEGIN IMMEDIATE / DO transactionSync).
// The only source of truth for paid access is this separate ledger, not manual grants.
export function applyArtisysDelivery(event,{one,run,now=Date.now()}){
 const old=one('SELECT order_id,event FROM billing_events WHERE delivery_id=?',event.deliveryId);
 if(old){
  if(old.order_id!==event.orderId||old.event!==event.event)reject(409,'ID de entrega conflitante.');
  return {accepted:true,duplicate:true};
 }
 const user=one('SELECT id,email,status FROM users WHERE id=?',event.userId);
 if(!user||user.status!=='active'||user.email!==event.email)
  reject(409,'Conta da compra indisponível ou diferente da sessão vinculada.');
 const purchase=one('SELECT order_id,user_id,product_id,course_id,period_days,expires_at,revoked_at FROM billing_entitlements WHERE order_id=?',event.orderId);
 if(purchase&&(purchase.user_id!==user.id||purchase.product_id!==event.productId||purchase.course_id!==event.courseId||purchase.period_days!==event.periodDays))
  reject(409,'Identidade da compra conflitante.');
 if(event.event==='artisys.license.activate'){
  if(!purchase){
   run('INSERT INTO billing_entitlements(order_id,user_id,product_id,course_id,period_days,granted_at,expires_at,revoked_at) VALUES(?,?,?,?,?,?,?,NULL)',
     event.orderId,user.id,event.productId,event.courseId,event.periodDays,now,
     event.periodDays?now+event.periodDays*DAY:null);
  } // Activations never re-enable a refunded order or extend a recurring period.
 }else if(event.event==='artisys.license.renew'){
  if(!purchase||purchase.revoked_at!==null)reject(409,'Assinatura anterior não encontrada ou revogada.');
  run('UPDATE billing_entitlements SET expires_at=? WHERE order_id=?',
    Math.max(now,purchase.expires_at||now)+event.periodDays*DAY,event.orderId);
 }else{
  if(!purchase)reject(409,'Compra anterior não encontrada para revogação.');
  run('UPDATE billing_entitlements SET revoked_at=COALESCE(revoked_at,?) WHERE order_id=?',now,event.orderId);
 }
 run('INSERT INTO billing_events(delivery_id,order_id,event,received_at) VALUES(?,?,?,?)',
   event.deliveryId,event.orderId,event.event,now);
 return {accepted:true,duplicate:false};
}
