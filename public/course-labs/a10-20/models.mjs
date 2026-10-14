// Cenários INERTES de AppSec: todos os dados são fictícios, sem destinos externos.
import http from 'node:http';
import { createHmac, timingSafeEqual } from 'node:crypto';

export async function requestEcho() {
  let count = 0;
  const server = http.createServer((req,res) => {
    count++;
    res.writeHead(200, {'content-type':'application/json; charset=utf-8'});
    res.end(JSON.stringify({echo:req.headers['x-lab-marker'],method:req.method,path:req.url}));
  });
  await new Promise((resolve,reject) => { server.once('error',reject);server.listen(0,'127.0.0.1',resolve); });
  try {
    const origin='http://127.0.0.1:'+server.address().port;
    const call=async mark=>{
      const response=await fetch(origin+'/catalogo', {headers:{'x-lab-marker':mark}});
      return {status:response.status,...await response.json()};
    };
    const baseline=await call('original');
    const modified=await call('teste-local');
    return {baseline,modified,count};
  } finally { await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve())); }
}
export function patchProfile(original,input,secure=true) {
  if (!secure) return {...original,...input};
  // Apenas campos editáveis do próprio perfil; role é controlado fora da requisição.
  return {...original,...('name' in input ? {name:String(input.name)} : {})};
}
export function readInvoice(currentCompany,invoice,secure=true) {
  if (secure && currentCompany!==invoice.companyId) return {status:404,body:null};
  return {status:200,body:{id:invoice.id,totalCents:invoice.totalCents}};
}
export function validateUpload({name,mime,data}) {
  // Apenas fixture didática. Em produção, validar parser real e isolar armazenamento.
  const okExt=/\.pdf$/i.test(name) && !name.includes('/') && !name.includes('\\');
  const valid=Buffer.isBuffer(data) && data.length>=5 && data.length<=1024*1024 &&
    data.subarray(0,5).toString('ascii')==='%PDF-' &&
    mime==='application/pdf' && okExt;
  return {accepted:!!valid,reason:valid?'FICHA_DE_TESTE':'REJEITADO'};
}
export function corsHeaders(origin) {
  const allowed=new Set(['https://painel.exemplo.test']);
  if (!allowed.has(origin)) return {vary:'Origin'};
  return {vary:'Origin','access-control-allow-origin':origin,'access-control-allow-credentials':'true'};
}
export function checkout({qty,stock}) {
  const catalogPriceCents=7000;
  if(!Number.isSafeInteger(qty) || qty<1) throw Error('QUANTIDADE_INVALIDA');
  if(qty>stock) throw Error('ESTOQUE_INSUFICIENTE');
  return {totalCents:qty*catalogPriceCents,remainingStock:stock-qty};
}
export async function reserveConcurrently() {
  let unsafeStock=1, unsafeApproved=0;
  async function unsafe() {
    const observed=unsafeStock;
    await Promise.resolve(); // Janela determinística entre leitura e escrita
    if(observed>0){unsafeStock=observed-1;unsafeApproved++;return true;}
    return false;
  }
  await Promise.all([unsafe(),unsafe()]);
  let safeStock=1;
  function safe() { if(safeStock<1)return false;safeStock--;return true; }
  const safeApproved=[safe(),safe()].filter(Boolean).length;
  return {unsafeApproved,safeApproved,safeStock};
}
export function updateSelfProfile(user,input) {
  return {...user,...('name' in input?{name:String(input.name)}:{})};
}
export function authorizeAdmin(role) { return role==='admin'; }

const header={typ:'JWT',alg:'HS256'};
const LAB_KEY='fixture-key-local-not-for-production';
const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
const mac=value=>createHmac('sha256',LAB_KEY).update(value).digest('base64url');
export function makeJwt(claims) {
  const signed=encode(header)+'.'+encode(claims);
  return signed+'.'+mac(signed);
}
export function decodeJwt(token) {
  const chunks=String(token).split('.');
  if(chunks.length!==3) throw Error('FORMATO_INVALIDO');
  return JSON.parse(Buffer.from(chunks[1],'base64url').toString('utf8'));
}
export function verifyJwt(token,now=Math.floor(Date.now()/1000)) {
  const parts=String(token).split('.');
  if(parts.length!==3)throw Error('FORMATO_INVALIDO');
  let h;
  try { h=JSON.parse(Buffer.from(parts[0],'base64url').toString()); }
  catch { throw Error('HEADER_INVALIDO'); }
  if(h.alg!=='HS256'||h.typ!=='JWT')throw Error('ALGORITMO_INVALIDO');
  const actual=Buffer.from(parts[2],'base64url');
  const expected=Buffer.from(mac(parts[0]+'.'+parts[1]),'base64url');
  if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw Error('ASSINATURA_INVALIDA');
  const data=decodeJwt(token);
  if(!Number.isFinite(data.exp)||now>=data.exp)throw Error('EXPIRADO');
  if(data.iss!=='lab.local'||data.aud!=='api.local'||!data.sub)throw Error('CLAIMS_INVALIDAS');
  return data;
}
