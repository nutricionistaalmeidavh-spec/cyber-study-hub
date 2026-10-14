// A121–130: casos locais, sintéticos e defensivos. Sem rede, debugger,
 // ofuscação operacional, extração de segredos, instalação ou evasão.
import {createHash,verify} from 'node:crypto';

export function analyzePacking({entropy,imports,knownPacker=false,sourceReproducible=false}){
 if(!Number.isFinite(entropy)||entropy<0||entropy>8||!Number.isInteger(imports)||imports<0)
  throw Error('telemetria inválida');
 return {
  classification: knownPacker&&sourceReproducible
    ? 'compatible-with-legitimate-packing' : 'review',
  evidence:{entropy,imports,knownPacker,sourceReproducible},
  maliciousProven:false,
  note:'Entropia/imports são indicadores, não prova de execução maliciosa.'
 };
}
export function decodeFixture(value,encoding){
 if(typeof value!=='string'||value.length>1024)throw Error('tamanho excedido');
 if(encoding!=='hex'&&encoding!=='base64')throw Error('encoding não suportado');
 if(encoding==='hex'&&(!/^(?:[0-9a-f]{2})*$/i.test(value)))throw Error('hex inválido');
 if(encoding==='base64'&&(!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)))
  throw Error('base64 inválido');
 const b=Buffer.from(value,encoding);
 return {decoded:b.toString('utf8'),executed:false,encoding};
}
export function compareDebugTelemetry(normal,instrumented){
 for(const r of [normal,instrumented])if(!Number.isFinite(r.durationMs)||r.durationMs<0)
  throw Error('duração inválida');
 return {outputChanged:normal.output!==instrumented.output,
  timingShift:Math.abs(instrumented.durationMs-normal.durationMs)>100,
  provesAntiDebug:false,note:'Variação de tempo isolada não prova técnica anti-debug.'};
}
export function compareEnvironment(a,b){
 const keys=[...new Set([...Object.keys(a),...Object.keys(b)])].sort();
 return {differences:keys.filter(k=>a[k]!==b[k]),provesEvasion:false,
 note:'Inventário de VM/host é observação; não executa evasão nem detecta malware.'};
}
export function checkOwnedFile(bytes,manifest){
 if(!/^[0-9a-f]{64}$/i.test(manifest?.sha256??''))throw Error('SHA-256 ausente');
 const actual=createHash('sha256').update(bytes).digest('hex');
 return {status:actual!==manifest.sha256.toLowerCase()?'mismatch':
  manifest.trustedSource===true?'match-trusted-reference':'integrity-only-no-provenance',
  sha256:actual,
  note:'Manifesto sem fonte autenticada não prova autoria'};
}
export function verifyArtifact(bytes,signature,publicKey,trustedFingerprint){
 const computed=createHash('sha256').update(publicKey.export({type:'spki',format:'der'})).digest('hex');
 if(computed!==trustedFingerprint)return {status:'untrusted-public-key'};
 return {status:verify(null,bytes,publicKey,signature)?'trusted-signature-valid':'invalid-signature',
  note:'Fingerprint de chave confiável pinada, não validação PKI completa'};
}
export function verifyOwnLicense(payload,signature,publicKey,{product,feature,now}){
 if(typeof payload!=='string'||payload.length>4096)return {status:'invalid-payload'};
 if(!verify(null,Buffer.from(payload),publicKey,signature))return {status:'invalid-signature'};
 let d;try{d=JSON.parse(payload);}catch{return {status:'invalid-payload'};}
 if(d.product!==product||d.feature!==feature)return {status:'wrong-scope'};
 const nowMs=Date.parse(now),expiry=Date.parse(d.expiresAt);
 if(!Number.isFinite(nowMs)||!Number.isFinite(expiry))return {status:'invalid-time'};
 if(nowMs>=expiry)return {status:'expired'};
 return {status:'allowed',note:'Licença de produto próprio; validade local não substitui revogação/verificação de servidor'};
}
export function reviewTrustBoundary({decision,serverRechecks}){
 return {risk:decision==='server'&&serverRechecks===true
  ?'authority-enforced-on-server':'local-decision-can-be-modified',
  recommendation:'Autoridade para ações críticas no servidor self-hosted; modo offline usa grants limitados e expirados'};
}
export function inspectBuildManifest(entries){
 if(!Array.isArray(entries))throw Error('manifesto inválido');
 return {sensitive:entries.filter(e=>['private-key','secret','token'].includes(e.kind)).map(e=>e.name).sort(),
  provesReverseEngineeringImpossible:false,
  note:'Somente metadados sintéticos de build; não examina segredos reais'};
}
export function compareMitigations(threat,controls){
 const allowed=new Set(['bounds-check','code-signing','pie','nx','relro','canary','obfuscation','hash','license']);
 if(!controls.every(c=>allowed.has(c)))throw Error('controle desconhecido');
 return {rootCauseFixed:threat==='out-of-bounds-write'&&controls.includes('bounds-check'),
  hardening:controls.filter(c=>['pie','nx','relro','canary'].includes(c)),
  provenance:controls.includes('code-signing')?'key-trust-must-be-checked':'not-established',
  note:'PIE/NX/RELRO/canary mitigam classes de exploração, não corrigem violação de limites'};
}
export function runWorkshop(n){
 switch(n){
 case 121:{
  const legitimate=analyzePacking({entropy:7.8,imports:4,knownPacker:true,sourceReproducible:true});
  const contrast=analyzePacking({entropy:7.9,imports:2});
  return {legitimate,contrast,retest:legitimate.classification==='compatible-with-legitimate-packing'&&!contrast.maliciousProven,
   limit:'Indicadores estáticos sintéticos não executam unpacking nem classificam malware.'};
 }
 case 122:{
  const legitimate=decodeFixture('4f4b','hex'),contrast='hex 4g is invalid';
  return {legitimate,contrast,retest:legitimate.decoded==='OK'&&!legitimate.executed,
   limit:'Decodifica somente fixtures em hex/base64; não analisa CFG real nem executa texto decodificado.'};
 }
 case 123:{
  const legitimate=compareDebugTelemetry({durationMs:120,output:'OK'},{durationMs:121,output:'OK'});
  const contrast=compareDebugTelemetry({durationMs:120,output:'OK'},{durationMs:350,output:'DIFF'});
  return {legitimate,contrast,retest:!contrast.provesAntiDebug&&contrast.outputChanged,
   limit:'Tempos artificiais não reproduzem exceções de processo, debugger, sistema operacional ou jitter.'};
 }
 case 124:{
  const legitimate=compareEnvironment({hypervisor:true,cpus:2},{hypervisor:true,cpus:2});
  const contrast=compareEnvironment({hypervisor:true,cpus:2},{hypervisor:false,cpus:8});
  return {legitimate,contrast,retest:contrast.differences.length===2&&!contrast.provesEvasion,
   limit:'Apenas inventário de propriedades, sem instrumentação de VM e sem evadir análise.'};
 }
 case 125:{
  const bytes='release-own';const digest=createHash('sha256').update(bytes).digest('hex');
  const legitimate=checkOwnedFile(bytes,{sha256:digest,trustedSource:true});
  const contrast=checkOwnedFile('modified',{sha256:digest,trustedSource:true});
  return {legitimate,contrast,retest:legitimate.status==='match-trusted-reference'&&contrast.status==='mismatch',
   limit:'Fonte de manifesto é um booleano didático; confiança e distribuição exigem cadeia de confiança real.'};
 }
 case 126:{
  // Em vez de embutir chaves, este caso verifica estrutura e registra limites.
  // O teste dedicado demonstra Ed25519 real com chaves efêmeras criadas localmente.
  const legitimate={publicKeyPinned:true,signatureRequired:true};
  const contrast={publicKeyPinned:false,signatureRequired:true};
  return {legitimate,contrast,retest:legitimate.publicKeyPinned&&!contrast.publicKeyPinned,
   limit:'Exemplo de decisão; assinatura Ed25519 efetiva é testada separadamente com chaves efêmeras.'};
 }
 case 127:{
  const legitimate={product:'study-lab',feature:'reports',expiresAt:'2027-01-01T00:00:00Z'};
  const contrast={...legitimate,expiresAt:'2026-01-01T00:00:00Z'};
  return {legitimate,contrast,retest:Date.parse(legitimate.expiresAt)>Date.parse('2026-10-13T12:00:00Z')&&Date.parse(contrast.expiresAt)<Date.parse('2026-10-13T12:00:00Z'),
   limit:'Licenças fictícias assinadas apenas nos testes; não implementa backend comercial ou revogação.'};
 }
 case 128:{
  const legitimate=reviewTrustBoundary({decision:'server',serverRechecks:true});
  const contrast=reviewTrustBoundary({decision:'client',serverRechecks:false});
  return {legitimate,contrast,retest:legitimate.risk==='authority-enforced-on-server',
   limit:'Mapa de arquitetura self-hosted não substitui modelagem de ameaças, autenticação e logs reais.'};
 }
 case 129:{
  const legitimate=inspectBuildManifest([{name:'publicKey',kind:'public-key'}]);
  const contrast=inspectBuildManifest([{name:'signingPrivateFixture',kind:'private-key'}]);
  return {legitimate,contrast,retest:legitimate.sensitive.length===0&&contrast.sensitive.length===1,
   limit:'Auditoria de metadados fictícios, não scanner de binários nem garantia contra engenharia reversa.'};
 }
 case 130:{
  const legitimate=compareMitigations('out-of-bounds-write',['bounds-check','pie','nx']);
  const contrast=compareMitigations('out-of-bounds-write',['obfuscation','hash','pie']);
  return {legitimate,contrast,retest:legitimate.rootCauseFixed&&!contrast.rootCauseFixed,
   limit:'Matriz de controles não mede endereços ASLR, efetividade de mitigadores ou crash em execução real.'};
 }
 default:throw Error('Oficina fora do intervalo 121–130');
 }
}
