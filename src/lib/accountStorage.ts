// Persistência isolada por conta, com fila durável para uso offline.
export const USER_PROGRESS_KEYS=[
  'cyber-study-lessons-v1','cyber-study-games-v1','cyber-study-recent-items-v1',
  'cyber-study-labs-v1','cyber-study-learning-v2','cyber-study-learning-v2-migration',
  'cyber-study-concept-mastery-v1','cyber-study-active-parallel-tracks-v1','cyber-study-fsrs-v1'
] as const;
type ProgressKey=typeof USER_PROGRESS_KEYS[number];
let activeUser:string|null=null;
const pending=new Map<string,string|null>();
let flushing:Promise<void>|null=null;
let lastError='';
const scoped=(id:string,key:string)=>'hub-account:'+id+':'+key;
const pendingKey=(id:string)=>scoped(id,'_pending');
function requireId(){if(!activeUser)throw new Error('Conta não autenticada');return activeUser;}
function supported(key:string):key is ProgressKey{return (USER_PROGRESS_KEYS as readonly string[]).includes(key);}
function notifySync(){ if(typeof window!=='undefined')window.dispatchEvent(new Event('hub-progress-sync')); }
export function getProgressSyncState(){return {pending:pending.size,saving:Boolean(flushing),error:lastError};}
function savePending(){
  if(activeUser)localStorage.setItem(pendingKey(activeUser),JSON.stringify(Object.fromEntries(pending)));
  notifySync();
}
async function api(path:string,options?:RequestInit) {
  const response=await fetch(path,{credentials:'same-origin',cache:'no-store',...options});
  if(!response.ok)throw new Error('Falha na sincronização ('+response.status+')');
  return response.json();
}
async function sendPending(){
  if(flushing)return flushing;
  if(!activeUser||!pending.size)return;
  const accountId=activeUser;
  flushing=(async()=>{
    while(pending.size&&activeUser===accountId){
      const [key,value]=pending.entries().next().value as [string,string|null];
      try{
        await api('/api/me/state',{
          method:value===null?'DELETE':'PUT',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(value===null?{key}:{key,value})
        });
        if(pending.get(key)===value)pending.delete(key);
        lastError='';
        savePending();
      }catch(e){lastError=String(e);notifySync();break;}
    }
  })().finally(()=>{flushing=null;notifySync();});
  return flushing;
}
export function getSyncError(){return lastError;}
export async function retryProgressSync(){await sendPending();return pending.size===0;}
export async function activateUserStorage(userId:string){
  if(activeUser&&activeUser!==userId){
    await sendPending();
    if(pending.size)throw Error('Há alterações não sincronizadas de outra conta.');
  }
  // Só substitui o cache após obter a versão canônica remota.
  const result=await api('/api/me/state');
  activeUser=userId;
  pending.clear();
  try{
    const saved=JSON.parse(localStorage.getItem(pendingKey(userId))||'{}');
    if(saved&&typeof saved==='object'&&!Array.isArray(saved))
      for(const [key,value] of Object.entries(saved)){
        if(supported(key)&&(typeof value==='string'||value===null))pending.set(key,value);
      }
  }catch{/* fila inválida não afeta as outras contas */}
  for(const key of USER_PROGRESS_KEYS){
    if(pending.has(key)){
      // Não sobrescrever alterações offline ainda não sincronizadas.
      const value=pending.get(key);
      if(value===null)localStorage.removeItem(scoped(userId,key));
      continue;
    }
    const remote=result.state?.[key];
    if(typeof remote==='string')localStorage.setItem(scoped(userId,key),remote);
    else localStorage.removeItem(scoped(userId,key));
  }
  void sendPending();
}
export async function deactivateUserStorage(){
  await sendPending();
  if(pending.size)return false; // Preserva o contexto enquanto houver mudanças pendentes.
  activeUser=null;
  pending.clear();
  return true;
}
export const accountStorage:Pick<Storage,'getItem'|'setItem'|'removeItem'>={
  getItem(key){if(!activeUser||!supported(key))return null;return localStorage.getItem(scoped(activeUser,key));},
  setItem(key,value){
    if(!supported(key))throw Error('Chave não autorizada: '+key);
    localStorage.setItem(scoped(requireId(),key),value);
    pending.set(key,value);savePending();void sendPending();
  },
  removeItem(key){
    if(!supported(key))return;
    localStorage.removeItem(scoped(requireId(),key));
    pending.set(key,null);savePending();void sendPending();
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
    if(old!==null){
      try{JSON.parse(old);accountStorage.setItem(key,old);count++;}
      catch{/* Dados antigos inválidos continuam preservados. */}
    }
  }
  await sendPending();
  if(pending.size)throw Error('Importação local realizada, mas ainda sem sincronização remota.');
  return count;
}
if(typeof window!=='undefined')window.addEventListener('online',()=>{void sendPending();});
