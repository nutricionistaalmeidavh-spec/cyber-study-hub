/**
 * Laboratório de decisão sintética, não cliente LLM nem sistema de segurança real.
 * Node 22+, sem pacotes npm, rede, contas, segredos, shell ou escrita em produção.
 * A decisão vem de dados autenticados e políticas, nunca de texto recuperado.
 */
export function decideBoundary({ actor, action, target }) {
  if (!actor?.authenticated || !actor.id) return 'IDENTITY_REQUIRED';
  if (!['report:read'].includes(action)) return 'ACTION_NOT_ALLOWED';
  if (!target?.id || !/^[a-z0-9-]+$/.test(target.id)) return 'INVALID_ARGUMENT';
  if (actor.tenant !== target.tenant) return 'TENANT_DENIED';
  if (!actor.permissions?.includes(action)) return 'PERMISSION_DENIED';
  return 'ALLOW_READ';
}
export function runPromptBoundary({origin, proposal, actor, target}) {
  // origin é atribuído pelo orquestrador confiável; jamais inferido do conteúdo.
  if (origin !== 'trusted-user') return 'UNTRUSTED_INSTRUCTION';
  return decideBoundary({actor, action:proposal?.action, target});
}
export function presentRecord({actor, record}) {
  if (!actor?.authenticated) return {status:'IDENTITY_REQUIRED'};
  if (!record || record.owner !== actor.id || record.tenant !== actor.tenant)
    return {status:'OWNER_DENIED'};
  // projection por allowlist antes de construir prompt/output; não há segredo no resultado.
  return {status:'ALLOW', context:{title:record.title,summary:record.summary}};
}
export function retrieveAuthorized({actor, chunks, query}) {
  if (!actor?.authenticated || !actor.id || !actor.tenant) return [];
  return chunks.filter(c=>c.tenant===actor.tenant &&
    Array.isArray(c.allowedUsers) && c.allowedUsers.includes(actor.id) &&
    c.origin && c.version && !c.revoked &&
    typeof c.text==='string' && c.text.toLowerCase().includes(query.toLowerCase()))
    .slice(0,3).map(({id,origin,version,text})=>({id,origin,version,text,role:'untrusted-data'}));
}
export function authorizeAgentCall({actor,tool,args,approval}) {
  if (!actor?.authenticated || !actor.id) return 'IDENTITY_REQUIRED';
  if (!['read-note','update-note'].includes(tool)) return 'UNKNOWN_TOOL';
  if (!args?.noteId || typeof args.noteId !== 'string') return 'INVALID_ARGUMENTS';
  if (actor.tenant !== args.tenant) return 'TENANT_DENIED';
  if (!actor.permissions?.includes(tool)) return 'TOOL_PERMISSION_DENIED';
  if (tool==='update-note') {
    if (!approval || approval.actorId!==actor.id || approval.noteId!==args.noteId ||
        approval.tenant!==args.tenant || approval.action!=='update-note' ||
        approval.granted!==true) return 'APPROVAL_REQUIRED';
  }
  return 'TOOL_ALLOWED';
}
export function verifyModelPackage({item, manifest}) {
  if (!item || !manifest) return 'MISSING_METADATA';
  if (item.source!==manifest.approvedSource || !item.version) return 'ORIGIN_DENIED';
  if (!/^sha256:[a-f0-9]{64}$/.test(item.digest||'') ||
      item.digest!==manifest.approvedDigest) return 'DIGEST_MISMATCH';
  if (!manifest.allowedLicenses?.includes(item.license)) return 'LICENSE_UNAPPROVED';
  if (!manifest.dependenciesPinned || !manifest.reviewedEvaluations) return 'EVALUATION_REQUIRED';
  return 'APPROVED_FIXTURE';
}
const RISK_CONTROLS={
  prompt_injection:{boundary:'retrieval',control:'trusted-origin-tool-gate',test:'untrusted-proposal-denied'},
  sensitive_disclosure:{boundary:'data',control:'pre-context-acl-and-projection',test:'cross-tenant-private-denied'},
  excessive_agency:{boundary:'tool',control:'capability-and-approval',test:'write-without-approval-denied'},
  supply_chain:{boundary:'artifact',control:'provenance-and-digest',test:'digest-mismatch-denied'}
};
export function reviewRisk({risk, declaredBoundary, evidence}) {
  const spec=RISK_CONTROLS[risk];
  if (!spec) return {status:'REQUIRES_MANUAL_MODELING'};
  if (declaredBoundary!==spec.boundary) return {status:'BOUNDARY_MISMATCH',control:spec.control};
  if (!evidence?.includes(spec.test)) return {status:'EVIDENCE_MISSING',control:spec.control};
  return {status:'CONTROL_MAPPED',control:spec.control};
}
export function executeCapstoneAgent({actor, chunks, proposal, approval}) {
  const retrieved=retrieveAuthorized({actor,chunks,query:'projeto'});
  // Documento recuperado nunca pode iniciar chamadas. Apenas proposta do usuário confiável.
  const verdict=authorizeAgentCall({actor,tool:proposal.tool,args:proposal.args,approval});
  const trace={actorId:actor?.id||null,documentIds:retrieved.map(c=>c.id),
    tool:proposal.tool,decision:verdict}; // sem texto sensível nem approval em log
  return {decision:verdict,executed:verdict==='TOOL_ALLOWED',trace};
}
export function validateLabScope({owner,authorization,targets,stopCondition,dataKind,resetPlan}) {
  if (!owner || !authorization || authorization.owner!==owner || !authorization.explicit)
    return 'AUTHORIZATION_MISSING';
  if (!Array.isArray(targets)||!targets.length ||
      targets.some(t=>!t.startsWith('localhost:')&&!t.startsWith('fixture:')))
    return 'OUT_OF_SCOPE';
  if (dataKind!=='synthetic') return 'DATA_SCOPE_DENIED';
  if (!stopCondition || !resetPlan) return 'SAFETY_PLAN_MISSING';
  return 'SCOPE_APPROVED_FIXTURE';
}
export function reviewThreatModel({assets,flows,threats}) {
  if (!assets?.length || !flows?.length) return 'MODEL_INCOMPLETE';
  if (flows.some(f=>!f.from || !f.to || !f.trustBoundary ||
      !assets.includes(f.to))) return 'FLOW_UNMODELED';
  if (!threats?.length || threats.some(t=>!t.asset || !assets.includes(t.asset) ||
      !t.control || !t.negativeTest || !t.owner)) return 'CONTROL_WITHOUT_EVIDENCE';
  if (flows.some(f=>!threats.some(t=>t.asset===f.to))) return 'UNCOVERED_ASSET';
  return 'MODEL_READY_FOR_REVIEW';
}
