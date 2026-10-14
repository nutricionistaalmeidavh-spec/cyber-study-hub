// Laboratório didático: entradas sintéticas e decisões puras; NÃO é biblioteca de produção.
import crypto from 'node:crypto';
const fail = (code) => { throw new Error(code); };

export function plannedProcess(action) {
  // A API não aceita caminho, argumento ou comando livre.
  if (action !== 'health') fail('AÇÃO_NÃO_PERMITIDA');
  return {executable:'node', args:['--version'], shell:false};
}

export function acceptsDocument({name,mime,bytes}) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 8 || bytes.length > 1024) fail('TAMANHO_INVÁLIDO');
  if (typeof name !== 'string' || !/^[a-z0-9-]+\.gif$/i.test(name)) fail('EXTENSÃO_NÃO_PERMITIDA');
  if (mime !== 'image/gif') fail('MIME_INVÁLIDO');
  if (!['GIF87a','GIF89a'].includes(bytes.subarray(0,6).toString('ascii'))) fail('ASSINATURA_INVÁLIDA');
  // Assinatura superficial não prova que o arquivo é seguro. Nunca servir como HTML nem executar.
  return {storageId:crypto.randomUUID(),contentType:'image/gif',storageArea:'quarantine'};
}

const encode = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');
const mac = (data,key) => crypto.createHmac('sha256',key).update(data).digest('base64url');
export function makeJwt(payload,key) {
  const data=`${encode({alg:'HS256',typ:'JWT'})}.${encode(payload)}`;
  return `${data}.${mac(data,key)}`;
}
export function verifyJwt(jwt,key,{iss,aud,now}) {
  if (typeof jwt!=='string'||jwt.split('.').length!==3) fail('TOKEN_MALFORMADO');
  const [h,p,s]=jwt.split('.'); let header,payload;
  try {header=JSON.parse(Buffer.from(h,'base64url'));payload=JSON.parse(Buffer.from(p,'base64url'));}catch{fail('TOKEN_MALFORMADO')}
  if (header.alg!=='HS256'||header.typ!=='JWT') fail('ALGORITMO_INVÁLIDO');
  const expected=Buffer.from(mac(`${h}.${p}`,key),'base64url');
  const received=Buffer.from(s,'base64url');
  if(received.length!==expected.length||!crypto.timingSafeEqual(received,expected)) fail('ASSINATURA_INVÁLIDA');
  if(payload.iss!==iss) fail('ISSUER_INVÁLIDO');
  if(payload.aud!==aud) fail('AUDIENCE_INVÁLIDA');
  if(typeof payload.exp!=='number'||payload.exp<=now) fail('TOKEN_EXPIRADO');
  if(typeof payload.sub!=='string'||!payload.sub) fail('SUB_INVÁLIDO');
  return payload;
}

export function pkcePair(randomBytes=crypto.randomBytes(32)) {
  if (!Buffer.isBuffer(randomBytes)||randomBytes.length!==32) fail('ENTROPIA_INVÁLIDA');
  const verifier=randomBytes.toString('base64url');
  return {verifier,challenge:crypto.createHash('sha256').update(verifier).digest('base64url'),method:'S256'};
}
export function verifyAuthorizationResponse(pending,response) {
  if(pending.used) fail('REPLAY');
  if(pending.state!==response.state) fail('STATE_INVÁLIDO');
  if(pending.issuer!==response.issuer) fail('ISSUER_INVÁLIDO');
  if(!response.code) fail('CODE_AUSENTE');
  return {...pending,used:true};
}

export function updateCase({actor,role,object,operation='edit',patch}) {
  if(operation!=='edit'||role==='guest') fail('BFLA');
  if(object.owner!==actor) fail('BOLA');
  if(!patch||Object.keys(patch).some(k=>k!=='description')) fail('MASS_ASSIGNMENT');
  if(typeof patch.description!=='string'||patch.description.length>80)fail('CAMPO_INVÁLIDO');
  return {...object,description:patch.description};
}

export function reserveOnce(state,{key,count}) {
  if(typeof key!=='string'||!key||!Number.isInteger(count)||count<=0)fail('RESERVA_INVÁLIDA');
  if(state.reservations.has(key))return state;
  if(state.stock<count)fail('SEM_ESTOQUE');
  // Transição síncrona in-memory; produção exige transação no DB e chave única persistida.
  return {stock:state.stock-count,reservations:new Set([...state.reservations,key])};
}

export function corsPolicy(origin,credentials=false) {
  const out={vary:'Origin'};
  if(!['https://app.local','https://admin.local'].includes(origin))return out;
  out['access-control-allow-origin']=origin;
  if(credentials)out['access-control-allow-credentials']='true';
  out['access-control-allow-methods']='GET, POST';
  return out;
}

export function securityHeaders(https) {
  const h={
    'content-security-policy':"default-src 'none'; script-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'",
    'x-content-type-options':'nosniff',
    'referrer-policy':'strict-origin-when-cross-origin'
  };
  if(https)h['strict-transport-security']='max-age=31536000';
  return h;
}

export function assessChain(edges,blocked=new Set()) {
  let cursor=edges[0]?.id;
  if(!cursor)return [];
  const sequence=[cursor],visited=new Set(sequence);
  for(const edge of edges){
    if(edge.id!==cursor||blocked.has(edge.requires))break;
    if(visited.has(edge.next))break;
    cursor=edge.next;sequence.push(cursor);visited.add(cursor);
  }
  return sequence;
}
