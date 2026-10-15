import { useEffect, useState, type FormEvent } from 'react';
import { platformApi, type PlatformUser } from './PlatformGate';
import { getSyncError, hasLegacyProgress, importLegacyProgress, retryProgressSync } from '../lib/accountStorage';

type UserList={users:PlatformUser[]};
type Invitation={inviteUrl:string;token:string;expiresInHours:number};
export function PlatformProfile({user,onUpdated,onSignOut}:{user:PlatformUser;onUpdated:()=>Promise<void>;onSignOut:()=>Promise<void>}){
  const [name,setName]=useState(user.name);
  const [currentPassword,setCurrentPassword]=useState('');
  const [newPassword,setNewPassword]=useState('');
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const action=async(fn:()=>Promise<unknown>,success:string)=>{
    setBusy(true);setMessage('');
    try{await fn();setMessage(success);}catch(e){setMessage(String(e).replace(/^Error: /,''));}
    finally{setBusy(false);}
  };
  return <div className="page stack-lg platform-page">
    <section className="page-title"><span className="eyebrow">MINHA CONTA</span><h1>Seu perfil</h1><p>Gerencie suas informações e o acesso aos seus estudos.</p></section>
    <div className="two-col align-start">
      <section className="panel stack"><h2>Dados pessoais</h2>
        <p className="muted">{user.email} · {user.role==='admin'?'Administrador':user.role==='teacher'?'Instrutor':'Aluno'}</p>
        <form className="platform-form" onSubmit={e=>{e.preventDefault();void action(async()=>{await platformApi('/api/me','PATCH',{name});await onUpdated();},'Nome atualizado.');}}>
          <label>Nome<input value={name} minLength={2} maxLength={100} required onChange={e=>setName(e.target.value)}/></label>
          <button className="button primary" disabled={busy}>Salvar nome</button>
        </form>
      </section>
      <section className="panel stack"><h2>Alterar senha</h2><p>A alteração encerra todas as sessões da sua conta.</p>
        <form className="platform-form" onSubmit={e=>{e.preventDefault();void action(async()=>{await platformApi('/api/me/password','PATCH',{currentPassword,newPassword});await onSignOut();},'Senha alterada. Faça login novamente.');}}>
          <label>Senha atual<input type="password" autoComplete="current-password" required value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)}/></label>
          <label>Nova senha (12 caracteres ou mais)<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={newPassword} onChange={e=>setNewPassword(e.target.value)}/></label>
          <button className="button ghost" disabled={busy}>Atualizar senha</button>
        </form>
      </section>
    </div>
    <section className="panel stack"><h2>Progresso e sincronização</h2>
      <p>Seu progresso fica separado por usuário e é enviado ao servidor da plataforma. O conteúdo antigo do navegador não é importado automaticamente.</p>
      {getSyncError()&&<div className="platform-error" role="alert">Há registros não sincronizados. <button className="button ghost" onClick={()=>void retryProgressSync()}>Tentar novamente</button></div>}
      {hasLegacyProgress()&&<div className="platform-import"><p>Há dados de estudo anteriores ao login neste navegador. Importe-os somente se forem seus: a importação substitui os dados correspondentes nesta conta.</p>
        <button className="button ghost" disabled={busy} onClick={()=>{if(window.confirm('Importar o progresso antigo para esta conta?'))void action(async()=>{const n=await importLegacyProgress();setMessage(n+' registros importados.');},'Importação concluída.');}}>Importar progresso antigo</button>
      </div>}
      <a className="button ghost" href="#feedback">Meus feedbacks</a>
      <a className="button ghost" href="#roadmap">Roadmap e novidades</a>
      {user.role==='admin'&&<a className="button ghost" href="#admin/feedback">Central de feedback</a>}
      {user.role==='admin'&&<a className="button ghost" href="#admin/users">Gerenciar usuários</a>}
      <button className="button ghost" onClick={()=>void action(async()=>{if(!(await retryProgressSync()))throw Error('Ainda há registros aguardando envio.');},'Sincronização verificada.')}>Sincronizar agora</button>
      {message&&<p role="status">{message}</p>}
    </section>
  </div>;
}

export function PlatformUsers({me}:{me:PlatformUser}){
  const [users,setUsers]=useState<PlatformUser[]>([]);
  const [email,setEmail]=useState('');
  const [role,setRole]=useState<'student'|'teacher'|'admin'>('student');
  const [invitation,setInvitation]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const reload=async()=>{
    const result=await platformApi<UserList>('/api/admin/users');
    setUsers(result.users);
  };
  useEffect(()=>{void reload().catch(e=>setError(String(e)));},[]);
  const createInvite=async(event:FormEvent)=>{
    event.preventDefault();setLoading(true);setError('');setInvitation('');
    try{
      const result=await platformApi<Invitation>('/api/admin/invitations','POST',{email,role});
      setInvitation(result.inviteUrl);setEmail('');
    }catch(e){setError(String(e));}finally{setLoading(false);}
  };
  const patch=async(u:PlatformUser,part:{role?:PlatformUser['role'];status?:PlatformUser['status']})=>{
    setError('');
    try{await platformApi('/api/admin/users/'+encodeURIComponent(u.id),'PATCH',part);await reload();}
    catch(e){setError(String(e));}
  };
  return <div className="page stack-lg platform-page">
    <section className="page-title"><span className="eyebrow">ADMINISTRAÇÃO</span><h1>Usuários e convites</h1><p>Gerencie alunos, instrutores, administradores e acessos. As senhas nunca são exibidas.</p></section>
    <section className="panel stack"><h2>Convidar usuário</h2><p>O convite é válido por 48 horas e pode ser utilizado uma única vez.</p>
      <form className="platform-invite" onSubmit={createInvite}>
        <label>E-mail<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="aluno@exemplo.com"/></label>
        <label>Perfil<select value={role} onChange={e=>setRole(e.target.value as typeof role)}>
          <option value="student">Aluno</option><option value="teacher">Instrutor</option><option value="admin">Administrador</option>
        </select></label>
        <button className="button primary" disabled={loading}>Gerar convite</button>
      </form>
      {invitation&&<div className="platform-invitation" role="status"><strong>Link criado — copie agora</strong>
        <p>Este link contém um segredo de acesso temporário. Compartilhe somente com o destinatário.</p>
        <div className="platform-copy"><input readOnly aria-label="Link do convite" value={invitation}/><button className="button ghost" onClick={()=>void navigator.clipboard.writeText(invitation)}>Copiar</button></div>
      </div>}
      {error&&<div className="platform-error" role="alert">{error}</div>}
    </section>
    <section className="panel stack"><div className="section-head"><h2>Contas cadastradas</h2><strong>{users.length} usuários</strong></div>
      <div className="platform-user-table" role="table" aria-label="Lista de usuários">
        <div className="platform-user-header" role="row"><span>Usuário</span><span>Perfil</span><span>Situação</span></div>
        {users.map(u=><div className="platform-user-row" role="row" key={u.id}>
          <div><strong>{u.name}</strong><small>{u.email}</small></div>
          <div>{u.id===me.id?<span>Administrador (você)</span>:<select aria-label={'Perfil de '+u.name} value={u.role} onChange={e=>void patch(u,{role:e.target.value as PlatformUser['role']})}>
            <option value="student">Aluno</option><option value="teacher">Instrutor</option><option value="admin">Administrador</option>
          </select>}</div>
          <div>{u.id===me.id?<span>Ativa</span>:<select aria-label={'Situação de '+u.name} value={u.status} onChange={e=>void patch(u,{status:e.target.value as PlatformUser['status']})}>
            <option value="active">Ativa</option><option value="suspended">Suspensa</option>
          </select>}</div>
        </div>)}
      </div>
    </section>
  </div>;
}
