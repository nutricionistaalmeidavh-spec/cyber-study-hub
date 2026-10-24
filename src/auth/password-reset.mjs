// Shared API contract for Cloudflare Durable Objects and local SQLite.
// No external credentials, mail provider or runtime-specific dependencies.
export const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;
const generic = {ok:true,message:'Se existir uma conta ativa para este e-mail, enviaremos um link de recuperação.'};
const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

export function recoveryEmail({to,resetUrl,from}) {
  if(!isEmail(to) || !isEmail(from) || !/^https?:\/\/[^\s]+$/.test(resetUrl))
    throw Error('Destinatário, remetente ou URL de recuperação inválidos.');
  return {
    from,to,subject:'Redefinição de senha — ArtiSys Academy',
    text:'Recebemos uma solicitação para redefinir sua senha na ArtiSys Academy.\n\n'+
      'Para escolher uma nova senha, acesse (válido por 30 minutos, uso único):\n'+resetUrl+
      '\n\nSe você não solicitou, ignore este e-mail. Nenhuma alteração foi feita na sua conta.\n'
  };
}

// Call only for /api/auth/password/forgot and /api/auth/password/reset.
// The digest and password hash are injected so the same flow supports Workers and Node.
export async function handlePasswordRecovery({
  path,body,ip,origin,academy,sendReady,sendMail,one,run,digest,hashPassword,
  validatePassword,newToken,fail,reply
}) {
  const now=Date.now();
  if(path==='/api/auth/password/forgot'){
    if(!sendReady)throw fail(503,'Recuperação por e-mail temporariamente indisponível.');
    const mail=typeof body.email==='string'?body.email.trim().toLowerCase():'';
    if(!isEmail(mail))throw fail(400,'Informe um e-mail válido.');

    for(const [kind,value,limit] of [['ip',String(ip||'unknown'),8],['address',mail,4]]){
      const key=await digest('password-reset:'+kind+':'+value);
      const record=one('SELECT count,reset_at FROM login_attempts WHERE key=?',key);
      const current=Boolean(record&&record.reset_at>now);
      if(current&&record.count>=limit)throw fail(429,'Muitas solicitações. Tente novamente em 15 minutos.');
      run('INSERT INTO login_attempts(key,count,reset_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,reset_at=excluded.reset_at',
        key,current?record.count+1:1,current?record.reset_at:now+900000);
    }
    const user=one("SELECT id,email FROM users WHERE email=? AND status='active'",mail);
    if(user){
      const token=newToken(),hashed=await digest(token);
      run('INSERT INTO password_resets(token_hash,user_id,expires_at,used_at) VALUES(?,?,?,NULL)',
        hashed,user.id,now+PASSWORD_RESET_TTL_MS);
      const resetUrl=origin+(academy?'/academy/study':'/')+'?reset='+encodeURIComponent(token);
      try{
        await sendMail({to:user.email,resetUrl});
        // Only the most recent successfully mailed token remains valid.
        run('DELETE FROM password_resets WHERE user_id=? AND token_hash<>?',user.id,hashed);
      }catch(error){
        run('DELETE FROM password_resets WHERE token_hash=?',hashed);
        // Never disclose whether an address exists, including transport failures.
        console.error('Academy password recovery delivery failed:',String(error?.message||error));
      }
    }
    return reply(200,generic);
  }
  if(path==='/api/auth/password/reset'){
    const token=body.token;
    if(typeof token!=='string'||! /^[A-Za-z0-9_-]{40,100}$/.test(token))
      throw fail(400,'Link de recuperação inválido ou expirado.');
    validatePassword(body.newPassword);
    const hashedToken=await digest(token);
    const passwordDigest=await hashPassword(body.newPassword);
    // Atomic conditional UPDATE prevents concurrent token replay in SQLite.
    const changed=one("UPDATE users SET password_hash=? WHERE id=("+
      "SELECT p.user_id FROM password_resets p JOIN users u ON u.id=p.user_id "+
      "WHERE p.token_hash=? AND p.used_at IS NULL AND p.expires_at>? AND u.status='active') RETURNING id",
      passwordDigest,hashedToken,Date.now());
    if(!changed)throw fail(400,'Link de recuperação inválido ou expirado.');
    run('DELETE FROM password_resets WHERE user_id=?',changed.id);
    run('DELETE FROM sessions WHERE user_id=?',changed.id);
    return reply(200,{ok:true,requiresLogin:true});
  }
  throw fail(404,'Rota não encontrada.');
}
