/**
 * Simulador determinístico da AULA-034. Nenhuma requisição de rede é feita aqui.
 * O ambiente HTTP executável permanece em public/course-labs/capstone-final/.
 */
export const LAB_LESSON_ID = 34;
export const LAB_STEPS = Object.freeze([
  {id:'alice-before', actor:'alice', mode:'vulnerable', expectedStatus:200, title:'Estabeleça o acesso legítimo',
    instruction:'Alice é a dona da fatura F001. Acesse como Alice na versão vulnerável e observe a resposta HTTP.'},
  {id:'bob-before', actor:'bob', mode:'vulnerable', expectedStatus:200, title:'Verifique a autorização de Bob',
    instruction:'Mude para Bob, mantenha a versão vulnerável e tente abrir a mesma fatura F001.'},
  {id:'bob-after', actor:'bob', mode:'corrected', expectedStatus:403, title:'Comprove a proteção',
    instruction:'Selecione a versão corrigida e repita como Bob. O acesso indevido deve ser negado.'},
  {id:'alice-after', actor:'alice', mode:'corrected', expectedStatus:200, title:'Teste a regressão',
    instruction:'Volte para Alice mantendo a correção. A dona deve continuar conseguindo abrir F001.'}
]);
export function simulateInvoiceAccess(actor, mode) {
  if (!['alice','bob'].includes(actor) || !['vulnerable','corrected'].includes(mode))
    throw new Error('invalid simulated actor or mode');
  const owner = 'alice';
  const allowed = mode === 'vulnerable' || actor === owner;
  return Object.freeze({
    status: allowed ? 200 : 403,
    actor, owner, mode, asset:'F001',
    unauthorizedExposure: allowed && actor !== owner,
    body: allowed
      ? {id:'F001', owner:'Alice', amountCents:25000, fictional:true}
      : {error:'Acesso negado'}
  });
}
export function isExpectedLabStep(step, actor, mode, result) {
  return Boolean(step && result && step.actor === actor && step.mode === mode
    && result.actor === actor && result.mode === mode && result.status === step.expectedStatus);
}
