import {billingProduct} from './artisys.mjs';
const encoder=new TextEncoder();
const fail=message=>{throw Error(message);};
const validUuid=s=>typeof s==='string'&&/^[a-f0-9-]{36}$/i.test(s);
const validMail=s=>typeof s==='string'&&s.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)&&s===s.trim().toLowerCase();
const validSecret=secret=>typeof secret==='string'&&secret.length>=32;
const encoded=x=>btoa(String.fromCharCode(...encoder.encode(JSON.stringify(x)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const decoded=x=>JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(x.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(x.length/4)*4,'=')),c=>c.charCodeAt(0))));
async function key(secret,usage){
 return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,[usage]);
}
const macBytes=x=>Uint8Array.from(x.match(/../g),v=>parseInt(v,16));
const hex=buf=>Array.from(new Uint8Array(buf),x=>x.toString(16).padStart(2,'0')).join('');
const context=b64=>'hubestudos.buy.v1.'+b64;
export async function issueBuyerIntent({user,productId,saleType,secret,now=Date.now()}){
 if(!validSecret(secret))fail('Conector financeiro não configurado.');
 if(!validUuid(user?.id)||!validMail(user?.email)||user?.status!=='active'||!billingProduct(productId,saleType))
  fail('Compra não autorizada para esta conta ou curso.');
 const claims={v:1,u:user.id,e:user.email,p:productId,s:saleType,i:now,x:now+1200000,n:crypto.randomUUID()};
 const part=encoded(claims);
 const signature=hex(await crypto.subtle.sign('HMAC',await key(secret,'sign'),encoder.encode(context(part))));
 return part+'.'+signature;
}
export async function verifyBuyerIntent({ticket,productId,saleType,email,orderCreatedAt,secret,now=Date.now()}){
 if(!validSecret(secret))fail('Conector financeiro não configurado.');
 if(typeof ticket!=='string'||!(/^[A-Za-z0-9_-]{40,1200}\.[a-f0-9]{64}$/.test(ticket)))fail('Vínculo do comprador ausente ou inválido.');
 const [part,signature]=ticket.split('.');
 const ok=await crypto.subtle.verify('HMAC',await key(secret,'verify'),macBytes(signature),encoder.encode(context(part)));
 if(!ok)fail('Assinatura do vínculo do comprador inválida.');
 let data;try{data=decoded(part);}catch{fail('Vínculo inválido.');}
 const created=Date.parse(orderCreatedAt);
 if(!data||data.v!==1||!validUuid(data.u)||!validMail(data.e)||data.e!==email||
   data.p!==productId||data.s!==saleType||!billingProduct(productId,saleType)||
   !Number.isSafeInteger(data.i)||!Number.isSafeInteger(data.x)||data.x-data.i!==1200000||
   !validUuid(data.n)||!Number.isFinite(created)||created<data.i-60000||created>data.x||
   created>now+300000)
  fail('Conta ou pedido incompatível com o vínculo de compra.');
 return {userId:data.u,email:data.e};
}
