import { useEffect, useState, type ReactNode, type FormEvent } from 'react';
import { activateUserStorage, deactivateUserStorage, retryProgressSync } from '../lib/accountStorage';
import './platform.css';
import AcademyBrand from './AcademyBrand';

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
    if(window.location.search.includes('invite=')||new URLSearchParams(window.location.search).get('register')==='1')history.replaceState(null,'',window.location.pathname+window.location.hash);
    const requested=new URLSearchParams(window.location.search).get('next');
    if(requested==='roadmap')history.replaceState(null,'',window.location.pathname+'#roadmap');
    else window.location.hash='#dashboard';
  };
  const logout=async()=>{
    setError('');
    const synced=await retryProgressSync();
    if(!synced){setError('Há progresso pendente de sincronização. Verifique a conexão antes de sair.');return;}
    try{await platformApi<{ok:boolean}>('/api/auth/logout','POST');await deactivateUserStorage();setUser(null);window.location.hash='#dashboard';}
    catch(e){setError(String(e));}
  };
  if(busy)return <div className="platform-gate"><div className="platform-auth"><span className="eyebrow">ARTISYS ACADEMY</span><h1>Carregando conta</h1><p>Verificando sua sessão e seu progresso.</p></div></div>;
  if(user)return <>{error&&<div className="platform-alert" role="alert">{error}</div>}{children(user,{logout,refresh})}</>;
  return <AuthScreen settings={settings} outerError={error} onSuccess={authenticated}/>;
}
function AuthScreen({settings,outerError,onSuccess}:{settings:Settings|null;outerError:string;onSuccess:(r:AuthResponse)=>Promise<void>}){
  const searchParams=new URLSearchParams(window.location.search);
  const invitation=searchParams.get('invite')??'';
  const publicSignup=searchParams.get('register')==='1';
  const resetToken=searchParams.get('reset')??'';
  const [mode,setMode]=useState<'login'|'register'|'bootstrap'|'forgot'|'reset'>(!settings?.ready?'bootstrap':resetToken?'reset':invitation||publicSignup?'register':'login');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [passwordConfirm,setPasswordConfirm]=useState('');
  const [notice,setNotice]=useState('');
  const [bootstrapKey,setBootstrapKey]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  useEffect(()=>{if(settings)setMode(!settings.ready?'bootstrap':resetToken?'reset':invitation||publicSignup?'register':'login');},[settings,invitation,publicSignup,resetToken]);
  const submit=async(e:FormEvent)=>{
    e.preventDefault();setLoading(true);setError('');setNotice('');
    try{
      if(mode==='forgot'){
        const reply=await platformApi<{ok:boolean;message:string}>('/api/auth/password/forgot','POST',{email});
        setNotice(reply.message);
        return;
      }
      if(mode==='reset'){
        if(password!==passwordConfirm)throw new Error('As senhas não coincidem.');
        await platformApi<{ok:boolean}>('/api/auth/password/reset','POST',{token:resetToken,newPassword:password});
        history.replaceState(null,'',window.location.pathname+window.location.hash);
        setPassword('');setPasswordConfirm('');setMode('login');
        setNotice('Senha atualizada. Entre com sua nova senha.');
        return;
      }
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
      <a href="/academy" className="platform-logo" aria-label="ArtiSys Academy — apresentação"><AcademyBrand /></a>
      <span className="eyebrow">PLATAFORMA DE ESTUDOS</span>
      <h1>{mode==='bootstrap'?'Configurar plataforma':mode==='register'?'Criar sua conta':mode==='forgot'?'Recuperar acesso':mode==='reset'?'Nova senha':'Acesse seus estudos'}</h1>
      <p>{mode==='bootstrap'?'Configure o primeiro administrador com a chave definida no servidor.':
        mode==='register'?'Crie sua conta de aluno sem convite. O cadastro não libera cursos pagos automaticamente.':
        mode==='forgot'?'Informe o e-mail da sua conta para receber um link de recuperação.':
        mode==='reset'?'Escolha uma nova senha com pelo menos 12 caracteres.':
        'Entre para continuar suas aulas, revisões e laboratórios.'}</p>
      {(error||outerError)&&<div className="platform-error" role="alert">{error||outerError}</div>}
      {notice&&<div className="platform-notice" role="status">{notice}</div>}
      {settings&&<form onSubmit={submit} className="platform-form">
        {!['login','forgot','reset'].includes(mode)&&<label>Nome completo<input required autoComplete="name" minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)}/></label>}
        {mode!=='reset'&&<label>E-mail<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>}
        {mode!=='forgot'&&<label>{mode==='reset'?'Nova senha':'Senha'}<input type="password" required minLength={mode==='login'?1:12} maxLength={128}
          autoComplete={mode==='login'?'current-password':'new-password'}
          value={password} onChange={e=>setPassword(e.target.value)}/></label>}
        {mode==='reset'&&<label>Confirmar nova senha<input type="password" required autoComplete="new-password" minLength={12} maxLength={128} value={passwordConfirm} onChange={e=>setPasswordConfirm(e.target.value)}/></label>}
        {mode==='bootstrap'&&<label>Chave de instalação<input type="password" required autoComplete="off" value={bootstrapKey} onChange={e=>setBootstrapKey(e.target.value)}/></label>}
        <button className="button primary wide" type="submit" disabled={loading}>
          {loading?'Verificando…':mode==='bootstrap'?'Criar administrador':mode==='register'?'Criar conta':mode==='forgot'?'Enviar link de recuperação':mode==='reset'?'Salvar nova senha':'Entrar'}
        </button>
      </form>}
      {settings?.ready&&<div className="platform-switch">
        {mode==='register'||mode==='forgot'||mode==='reset'?
          <button type="button" onClick={()=>{setMode('login');setNotice('');setError('');}}>Voltar ao login</button>:
          <>
            <button type="button" onClick={()=>{setMode('forgot');setNotice('');setError('');}}>Esqueci minha senha</button>
            {allowRegister&&<button type="button" onClick={()=>{setMode('register');setNotice('');}}>Criar minha conta</button>}
          </>}
      </div>}
      {!settings&&<p className="platform-help">A API de contas não está configurada neste endereço. Execute a edição self-hosted conforme as instruções do projeto.</p>}
      <small className="platform-footnote">Suas aulas, práticas e revisões em um só lugar.</small>
    </main>
    <aside className="platform-intro">
      <span className="eyebrow">ESTUDE COM CONTINUIDADE</span>
      <h2>Seu aprendizado, organizado.</h2>
      <p>Biblioteca técnica, laboratórios práticos, revisão espaçada e histórico individual em uma única plataforma.</p>
      <div className="platform-benefits"><span>17 módulos principais</span><span>13 trilhas paralelas</span><span>Progresso individual</span></div>
    </aside>
  </div>;
}
