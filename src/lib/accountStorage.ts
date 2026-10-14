// Persistência isolada por conta; nunca lê o armazenamento legado sem consentimento.
export const USER_PROGRESS_KEYS=[
  'cyber-study-lessons-v1','cyber-study-games-v1','cyber-study-recent-items-v1',
  'cyber-study-labs-v1','cyber-study-learning-v2','cyber-study-learning-v2-migration',
  'cyber-study-concept-mastery-v1','cyber-study-active-parallel-tracks-v1','cyber-study-fsrs-v1'
] as const;
type ProgressKey=typeof USER_PROGRESS_KEYS[number];
let activeUser:string|null=null;
const pending=new Map<string,string>();
let flushing:Promise<void>|null=null;
let lastError='';
const scoped=(id:string,key:string)=>'hub-account:'+id+':'+key;
function requireId(){if(!activeUser)throw new Error('Conta não autenticada');return activeUser;}
function supported(key:string):key is ProgressKey{return (USER_PROGRESS_KEYS as readonly string[]).includes(key);}

async function api(path:string,options?:RequestInit) {
  const response=await fetch(path,{credentials:'same-origin',cache:'no-store',...options});
  if(!response.ok)throw new Error('Falha na sincronização ('+response.status+')');
  return response.json();
}
async function sendPending(){
  if(flushing)return flushing;
  flushing=(async()=>{
    while(pending.size){
      const [key,value]=pending.entries().next().value as [string,string];
      try{
        await api('/api/me/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({key,value})});
        if(pending.get(key)===value)pending.delete(key);
        lastError='';
      }catch(e){lastError=String(e);break;}
    }
  })().finally(()=>{flushing=null;});
  return flushing;
}
export function getSyncError(){return lastError;}
export function retryProgressSync(){return sendPending();}
export async function activateUserStorage(userId:string){
  if(activeUser&&activeUser!==userId){await sendPending();if(pending.size)throw Error('Há alterações não sincronizadas de outra conta.');}
  activeUser=userId;
  const result=await api('/api/me/state');
  for(const key of USER_PROGRESS_KEYS){
    const value=result.state?.[key];
    if(typeof value==='string')localStorage.setItem(scoped(userId,key),value);
    else localStorage.removeItem(scoped(userId,key));
  }
}
export async function deactivateUserStorage(){
  await sendPending();
  const ok=pending.size===0;
  activeUser=null;
  pending.clear();
  return ok;
}
export const accountStorage:Pick<Storage,'getItem'|'setItem'|'removeItem'>={
  getItem(key){if(!activeUser||!supported(key))return null;return localStorage.getItem(scoped(activeUser,key));},
  setItem(key,value){
    if(!supported(key))throw Error('Chave de progresso não autorizada: '+key);
    const id=requireId();
    localStorage.setItem(scoped(id,key),value);
    pending.set(key,value);
    void sendPending();
  },
  removeItem(key){
    if(!supported(key))return;
    const id=requireId();
    localStorage.removeItem(scoped(id,key));
    // Mantém a remoção explícita em estado JSON válido.
    pending.set(key,'null');void sendPending();
  }
};
export function hasLegacyProgress(){
  return USER_PROGRESS_KEYS.some(key=>localStorage.getItem(key)!==null);
}
export async function importLegacyProgress(){
  requireId();
  let count=0;
  for(const key of USER_PROGRESS_KEYS){
    const old=localStorage.getItem(key);
    if(old!==null){try{JSON.parse(old);accountStorage.setItem(key,old);count++;}catch{/* legado inválido preservado */}}
  }
  await sendPending();
  if(pending.size)throw Error('Importação local feita, mas a sincronização falhou. Tente novamente.');
  return count;
}
if(typeof window!=='undefined')window.addEventListener('online',()=>{void sendPending();});
