// Demonstração determinística: não executa modelo de IA nem confia em texto recebido dele.
import {createHash} from 'node:crypto';
export const DEMO_DOCS=Object.freeze([
 {id:'public-1',owner:'public',text:'Política pública fictícia'},
 {id:'alice-1',owner:'alice',text:'Nota privada da Alice'},
 {id:'bob-1',owner:'bob',text:'Nota privada do Bob'}
]);
export function listAuthorizedDocs(principal,docs=DEMO_DOCS){
 if(!principal||typeof principal!=='string')return [];
 return docs.filter(d=>d.owner==='public'||d.owner===principal).map(d=>({...d}));
}
export function trustedDecision({principal,docId,docs=DEMO_DOCS,untrustedContent=''}){
 const item=listAuthorizedDocs(principal,docs).find(d=>d.id===docId);
 return {allowed:Boolean(item),reason:item?'AUTHORIZED':'DENIED_BY_ACL',untrustedContentObserved:Boolean(untrustedContent)};
}
export function executeToolIntent({tool,principal,approved=false}){
 const allowRead=new Set(['list-docs','read-owned-document']);
 if(allowRead.has(tool))return{decision:principal?'allow':'deny',reason:'READ_ALLOWLIST'};
 if(tool==='export-selected-document')return{decision:principal&&approved?'allow':'approval-required',reason:'APPROVAL_GATE'};
 return{decision:'deny',reason:'TOOL_NOT_ALLOWLISTED'};
}
export function scrubOutput(text){
 if(typeof text!=='string')throw new TypeError('Texto inválido');
 return text.replace(/(token|secret|api[_-]?key)\s*[:=]\s*[^\s,;]+/gi,'$1=[REDACTED]');
}
export function verifyToolBundle({content,sha256,source,allowedSources}){
 if(!allowedSources.includes(source))return{trusted:false,reason:'UNAPPROVED_SOURCE'};
 const computed=createHash('sha256').update(content).digest('hex');
 return {trusted:computed===sha256,reason:computed===sha256?'PINNED':'HASH_MISMATCH'};
}
export function auditAgentCase({principal,docId,untrustedContent='',tool='list-docs',approved=false}){
 const permission=trustedDecision({principal,docId,untrustedContent});
 const action=executeToolIntent({tool,principal,approved});
 const decision=permission.allowed&&action.decision==='allow'?'allow':'deny';
 return {principal:principal||'unknown',docId,decision,acl:permission.reason,tool:action.reason,modelOutputAuthoritative:false};
}
