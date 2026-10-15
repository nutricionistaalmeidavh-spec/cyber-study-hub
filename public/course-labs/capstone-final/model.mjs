// Core local para o capstone integrado. Identidades são strings fictícias, NÃO autenticação.
export const invoice={id:'F001',owner:'alice',amountCents:15000};
export function decideRead({actor,invoice:target=invoice,mode='corrected'}){
 if(!['alice','bob'].includes(actor)||target?.id!=='F001')return{status:404,body:{error:'not found'}};
 const allowed=mode==='vulnerable'||target.owner===actor;
 return allowed?{status:200,body:{id:target.id,amountCents:target.amountCents}}:{status:403,body:{error:'forbidden'}};
}
export function makeAuditEvent({actor,result,at='2026-10-15T12:00:00.000Z',mode='corrected'}){
 if(!Number.isInteger(result.status))throw new TypeError('Resultado inválido');
 return {timestamp:at,asset:'lab-final',identity:actor,action:'read:F001',status:result.status,mode,classification:result.status===403?'denied':'observed'};
}
export function detectionRule(event){return event.action==='read:F001'&&event.identity!=='alice'&&event.status===200?'UNAUTHORIZED_READ_DEMO':null;}
