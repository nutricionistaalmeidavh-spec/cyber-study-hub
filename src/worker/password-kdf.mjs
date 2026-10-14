// Executado no Worker real. O runtime de produção limita cada PBKDF2 a 100.000 iterações.
// Aplicamos seis estágios, com salts derivados do salt aleatório do usuário.
// O formato versionado NÃO é PBKDF2(600.000); não reivindicar essa equivalência.
const encoder=new TextEncoder();
const MAX_PER_CALL=100_000;
const STAGES=6;
const toHex=value=>Array.from(new Uint8Array(value),b=>b.toString(16).padStart(2,'0')).join('');
const fromHex=text=>{
  if(typeof text!=='string'||!(/^[0-9a-f]+$/.test(text))||text.length%2)throw Error('Invalid digest');
  return Uint8Array.from(text.match(/../g),pair=>parseInt(pair,16));
};
async function pbkdf2(input,salt,iterations){
  if(!Number.isSafeInteger(iterations)||iterations<1||iterations>MAX_PER_CALL)
    throw Error('Unsupported PBKDF2 iteration count');
  const key=await crypto.subtle.importKey('raw',input,'PBKDF2',false,['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({
    name:'PBKDF2',hash:'SHA-256',salt,iterations
  },key,256));
}
async function chain(password,salt,rounds=STAGES){
  if(!Number.isInteger(rounds)||rounds<1||rounds>STAGES)throw Error('Invalid work factor');
  const base=fromHex(salt);
  if(base.length!==16)throw Error('Invalid salt');
  let key=encoder.encode(password);
  for(let i=0;i<rounds;i++){
    const separated=new Uint8Array(base.length+1);
    separated.set(base,0);
    separated[base.length]=i;
    key=await pbkdf2(key,separated,MAX_PER_CALL);
  }
  return toHex(key);
}
function constantEquals(a,b){
  if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;
  let diff=0;
  for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);
  return diff===0;
}
export async function passwordHash(password){
  if(typeof password!=='string'||password.length<12||password.length>128)
    throw Error('Invalid password length');
  const salt=toHex(crypto.getRandomValues(new Uint8Array(16)));
  return ['pbkdf2-chain-sha256',MAX_PER_CALL,STAGES,salt,await chain(password,salt)].join('$');
}
export async function passwordMatches(password,stored){
  if(typeof password!=='string'||typeof stored!=='string')return false;
  const parts=stored.split('$');
  try{
    if(parts[0]==='pbkdf2-chain-sha256'&&parts.length===5){
      const count=Number(parts[1]),rounds=Number(parts[2]),salt=parts[3],expected=parts[4];
      if(count!==MAX_PER_CALL||rounds!==STAGES||!/^[a-f0-9]{64}$/.test(expected))return false;
      return constantEquals(await chain(password,salt,rounds),expected);
    }
    // Compatibilidade para registros PBKDF2 antigos possíveis em outras origens.
    // Registros de 600k são impossíveis de verificar com WebCrypto nesta plataforma;
    // não reduzir rounds silenciosamente nem emitir erro 500.
    if(parts[0]==='pbkdf2-sha256'&&parts.length===4){
      const iterations=Number(parts[1]),salt=parts[2],expected=parts[3];
      if(!Number.isSafeInteger(iterations)||iterations<1||iterations>MAX_PER_CALL||
         !/^[a-f0-9]{64}$/.test(expected))return false;
      return constantEquals(toHex(await pbkdf2(encoder.encode(password),fromHex(salt),iterations)),expected);
    }
    return false;
  }catch{return false;}
}
export const passwordPolicy={maxIterationsPerCall:MAX_PER_CALL,stages:STAGES};
