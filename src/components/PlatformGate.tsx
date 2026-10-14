import { useEffect, useState, type ReactNode, type FormEvent } from 'react';
import { activateUserStorage, deactivateUserStorage, retryProgressSync } from '../lib/accountStorage';
import './platform.css';

export type PlatformUser={
  id:string; name:string; email:string; role:'admin'|'teacher'|'student'; status:'active'|'suspended'; createdAt:string;
};
type AuthResponse={user:PlatformUser};
type Settings={ready:boolean;openRegistration:boolean};
export async function platformApi<T>(path:string,method='GET',data?:object):Promise<T>{
  const response=await fetch(path,{
    method, credentials:'same-origin',cache:'no-store',
    ...(data?{headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{})
  });
  if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Servidor de contas indisponível neste endereço.');
  let payload:Record<string,unknown>={};
  try{payload=await response.json();}catch{/* resposta não JSON */}
  if(!response.ok)throw new Error(typeof payload.error==='string'?payload.error:'Erro HTTP '+response.status);
  return payload as T;
}
export function PlatformGate({children}:{children:(user:PlatformUser,actions:{logout:()=>Promise<void>;refresh:()=>Promise<void>})=>ReactNode}){
  const [user,setUser]=useState<PlatformUser|null>(null);
  const [settings,setSettings]=useState<Settings|null>(null);
  const [busy,setBusy]=useState(true);
  const [error,setError]=useState('');
  const refresh=async()=>{
    const result=await platformApi<AuthResponse>('/api/me');
    setUser(result.user);
  };
  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        const config=await platformApi<Settings>('/api/auth/config');
        if(!alive)return;
        setSettings(config);
        try{
          const auth=await platformApi<AuthResponse>('/api/me');
          await activateUserStorage(auth.user.id);
          if(alive)setUser(auth.user);
        }catch(e){
          if(String(e).includes('Falha na sincronização'))throw e;
        }
      }catch(e){if(alive)setError('Não foi possível conectar ao servidor de contas. '+String(e));}
      finally{if(alive)setBusy(false);}
    })();
    return()=>{alive=false;};
  },[]);
  const authenticated=async(value:AuthResponse)=>{
    await activateUserStorage(value.user.id);
    setUser(value.user);
    setError('');
    if(window.location.search.includes('invite='))history.replaceState(null,'',window.location.pathname+window.location.hash);
    window.location.hash='#dashboard';
  };
  const logout=async()=>{
    setError('');
    const synced=await retryProgressSync();
    if(!synced){setError('Há progresso pendente de sincronização. Verifique a conexão antes de sair.');return;}
    try{await platformApi<{ok:boolean}>('/api/auth/logout','POST');await deactivateUserStorage();setUser(null);window.location.hash='#dashboard';}
    catch(e){setError(String(e));}
  };
  if(busy)return <div className="platform-gate"><div className="platform-auth"><span className="eyebrow">CYBER STUDY HUB</span><h1>Carregando conta</h1><p>Verificando sua sessão e seu progresso.</p></div></div>;
  if(user)return <>{error&&<div className="platform-alert" role="alert">{error}</div>}{children(user,{logout,refresh})}</>;
  return <AuthScreen settings={settings} outerError={error} onSuccess={authenticated}/>;
}
function AuthScreen({settings,outerError,onSuccess}:{settings:Settings|null;outerError:string;onSuccess:(r:AuthResponse)=>Promise<void>}){
  const invitation=new URLSearchParams(window.location.search).get('invite')??'';
  const [mode,setMode]=useState<'login'|'register'|'bootstrap'>(!settings?.ready?'bootstrap':invitation?'register':'login');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [bootstrapKey,setBootstrapKey]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  useEffect(()=>{if(settings)setMode(!settings.ready?'bootstrap':invitation?'register':'login');},[settings,invitation]);
  const submit=async(e:FormEvent)=>{
    e.preventDefault();setLoading(true);setError('');
    try{
      const result=await platformApi<AuthResponse>(
        mode==='bootstrap'?'/api/auth/bootstrap':mode==='register'?'/api/auth/register':'/api/auth/login',
        'POST',
        mode==='bootstrap'?{name,email,password,bootstrapKey}:
        mode==='register'?{name,email,password,...(invitation?{inviteToken:invitation}:{})}:
        {email,password}
      );
      await onSuccess(result);
    }catch(e){setError(String(e).replace(/^Error: /,''));}
    finally{setLoading(false);}
  };
  const allowRegister=Boolean(settings?.openRegistration||invitation);
  return <div className="platform-gate">
    <main className="platform-auth">
      <div className="platform-logo"><span>+</span><div><strong>Cyber Study Hub</strong><small>Seu espaço de aprendizagem</small></div></div>
      <span className="eyebrow">PLATAFORMA DE ESTUDOS</span>
      <h1>{mode==='bootstrap'?'Configurar plataforma':mode==='register'?'Criar sua conta':'Acesse seus estudos'}</h1>
      <p>{mode==='bootstrap'?'Configure o primeiro administrador com a chave definida no servidor.':
        mode==='register'?'Complete o cadastro para começar a estudar.':
        'Entre para continuar suas aulas, revisões e laboratórios.'}</p>
      {(error||outerError)&&<div className="platform-error" role="alert">{error||outerError}</div>}
      {settings&&<form onSubmit={submit} className="platform-form">
        {mode!=='login'&&<label>Nome completo<input required autoComplete="name" minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)}/></label>}
        <label>E-mail<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>
        <label>Senha<input type="password" required minLength={mode==='login'?1:12} maxLength={128}
          autoComplete={mode==='login'?'current-password':'new-password'}
          value={password} onChange={e=>setPassword(e.target.value)}/></label>
        {mode==='bootstrap'&&<label>Chave de instalação<input type="password" required autoComplete="off" value={bootstrapKey} onChange={e=>setBootstrapKey(e.target.value)}/></label>}
        <button className="button primary wide" type="submit" disabled={loading}>
          {loading?'Verificando…':mode==='bootstrap'?'Criar administrador':mode==='register'?'Criar conta':'Entrar'}
        </button>
      </form>}
      {settings?.ready&&<div className="platform-switch">
        {mode==='register'?<button type="button" onClick={()=>setMode('login')}>Já tenho conta. Entrar</button>:
          allowRegister?<button type="button" onClick={()=>setMode('register')}>Criar uma conta</button>:
          <span>Cadastros disponíveis por convite do administrador.</span>}
      </div>}
      {!settings&&<p className="platform-help">A API de contas não está configurada neste endereço. Execute a edição self-hosted conforme as instruções do projeto.</p>}
      <small className="platform-footnote">Aulas e progresso vinculados à sua conta. Núcleo sem serviço de autenticação pago.</small>
    </main>
    <aside className="platform-intro">
      <span className="eyebrow">ESTUDE COM CONTINUIDADE</span>
      <h2>Seu aprendizado, organizado.</h2>
      <p>Biblioteca técnica, laboratórios práticos, revisão espaçada e histórico individual em uma única plataforma.</p>
      <div className="platform-benefits"><span>218 aulas principais</span><span>325 unidades paralelas</span><span>Progresso individual</span></div>
    </aside>
  </div>;
}
