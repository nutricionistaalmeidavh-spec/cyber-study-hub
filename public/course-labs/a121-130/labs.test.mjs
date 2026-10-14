import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash,generateKeyPairSync,sign} from 'node:crypto';
import {analyzePacking,decodeFixture,compareDebugTelemetry,compareEnvironment,
 checkOwnedFile,verifyArtifact,verifyOwnLicense,reviewTrustBoundary,
 inspectBuildManifest,compareMitigations,runWorkshop} from './models.mjs';

test('121: compactador legítimo não é sinônimo de malware',()=>{
 const r=analyzePacking({entropy:7.8,imports:4,knownPacker:true,sourceReproducible:true});
 assert.equal(r.classification,'compatible-with-legitimate-packing');
 assert.equal(r.maliciousProven,false);
});
test('121: alta entropia isolada é evidência insuficiente',()=>{
 const r=analyzePacking({entropy:7.9,imports:2,knownPacker:false,sourceReproducible:false});
 assert.equal(r.classification,'review');
 assert.equal(r.maliciousProven,false);
});
test('122: representação hex válida decodifica dados, não executa código',()=>{
 const r=decodeFixture('4f4b','hex');
 assert.deepEqual(r,{decoded:'OK',executed:false,encoding:'hex'});
});
test('122: formato inválido e tamanho excessivo falham de modo seguro',()=>{
 assert.throws(()=>decodeFixture('4g','hex'),/hex/);
 assert.throws(()=>decodeFixture('aa'.repeat(600),'hex'),/tamanho/);
});
test('123: comparar execução sob debugger não é técnica de bypass',()=>{
 const r=compareDebugTelemetry({durationMs:120,output:'OK'},{durationMs:350,output:'OK'});
 assert.equal(r.outputChanged,false);
 assert.equal(r.timingShift,true);
 assert.equal(r.provesAntiDebug,false);
});
test('123: saída diferente exige confirmação em múltiplas amostras',()=>{
 const r=compareDebugTelemetry({durationMs:120,output:'OK'},{durationMs:121,output:'DIFF'});
 assert.equal(r.outputChanged,true);
 assert.equal(r.provesAntiDebug,false);
});
test('124: presença de marca de VM é só informação de inventário',()=>{
 const r=compareEnvironment({hypervisor:true,cpus:2},{hypervisor:false,cpus:8});
 assert.deepEqual(r.differences,['cpus','hypervisor']);
 assert.equal(r.provesEvasion,false);
});
test('124: ambientes equivalentes produzem diferença vazia',()=>{
 const r=compareEnvironment({hypervisor:true,cpus:2},{hypervisor:true,cpus:2});
 assert.deepEqual(r.differences,[]);
});
test('125: SHA-256 compara bytes a referência de confiança prévia',()=>{
 const bytes='programa-autorizado';
 const known=createHash('sha256').update(bytes).digest('hex');
 assert.equal(checkOwnedFile(bytes,{sha256:known,trustedSource:true}).status,'match-trusted-reference');
});
test('125: hash igual vindo de fonte não confiável não prova autoria',()=>{
 const bytes='programa-adulterado';
 const known=createHash('sha256').update(bytes).digest('hex');
 assert.equal(checkOwnedFile(bytes,{sha256:known,trustedSource:false}).status,'integrity-only-no-provenance');
 assert.equal(checkOwnedFile(bytes,{sha256:'0'.repeat(64),trustedSource:true}).status,'mismatch');
});
test('126: assinatura Ed25519 válida depende de chave pública previamente confiada',()=>{
 const {publicKey,privateKey}=generateKeyPairSync('ed25519');
 const bytes=Buffer.from('release-v1');
 const signature=sign(null,bytes,privateKey);
 const trustedFingerprint=createHash('sha256').update(publicKey.export({type:'spki',format:'der'})).digest('hex');
 assert.equal(verifyArtifact(bytes,signature,publicKey,trustedFingerprint).status,'trusted-signature-valid');
});
test('126: assinatura de chave distinta é recusada mesmo se criptograficamente válida',()=>{
 const a=generateKeyPairSync('ed25519'),b=generateKeyPairSync('ed25519');
 const bytes=Buffer.from('release-v1');
 const signature=sign(null,bytes,a.privateKey);
 const trustedFingerprint=createHash('sha256').update(b.publicKey.export({type:'spki',format:'der'})).digest('hex');
 assert.equal(verifyArtifact(bytes,signature,a.publicKey,trustedFingerprint).status,'untrusted-public-key');
});
test('127: licença própria assinada, audience/exp corretos e escopo validado',()=>{
 const keys=generateKeyPairSync('ed25519');
 const lic={product:'study-lab',feature:'reports',expiresAt:'2027-01-01T00:00:00Z'};
 const payload=JSON.stringify(lic),signature=sign(null,Buffer.from(payload),keys.privateKey);
 assert.equal(verifyOwnLicense(payload,signature,keys.publicKey,{product:'study-lab',feature:'reports',now:'2026-10-13T12:00:00Z'}).status,'allowed');
});
test('127: licença expirada ou produto diferente falha fechado',()=>{
 const keys=generateKeyPairSync('ed25519');
 const payload=JSON.stringify({product:'study-lab',feature:'reports',expiresAt:'2026-01-01T00:00:00Z'});
 const signature=sign(null,Buffer.from(payload),keys.privateKey);
 assert.equal(verifyOwnLicense(payload,signature,keys.publicKey,{product:'study-lab',feature:'reports',now:'2026-10-13T12:00:00Z'}).status,'expired');
 assert.equal(verifyOwnLicense(payload,signature,keys.publicKey,{product:'different',feature:'reports',now:'2025-10-13T12:00:00Z'}).status,'wrong-scope');
});
test('128: licença só no cliente não é autoridade final para permissão crítica',()=>{
 const r=reviewTrustBoundary({decision:'client',serverRechecks:false});
 assert.equal(r.risk,'local-decision-can-be-modified');
});
test('128: serviço de validação self-hosted preserva decisão de servidor',()=>{
 const r=reviewTrustBoundary({decision:'server',serverRechecks:true});
 assert.equal(r.risk,'authority-enforced-on-server');
});
test('129: artefato contém segredo privado fictício, não confundir com chave pública',()=>{
 const r=inspectBuildManifest([{name:'publicSigningKey',kind:'public-key'},
  {name:'fixtureSigningPrivate',kind:'private-key'},{name:'debugSymbols',kind:'symbols'}]);
 assert.deepEqual(r.sensitive,['fixtureSigningPrivate']);
});
test('129: sem segredo distribuído não há conclusão enganosa de invulnerabilidade',()=>{
 const r=inspectBuildManifest([{name:'publicSigningKey',kind:'public-key'}]);
 assert.deepEqual(r.sensitive,[]);
 assert.equal(r.provesReverseEngineeringImpossible,false);
});
test('130: obfuscação, PIE/NX e hash não corrigem escrita fora do buffer',()=>{
 const r=compareMitigations('out-of-bounds-write',['obfuscation','pie','nx','hash']);
 assert.equal(r.rootCauseFixed,false);
 assert.deepEqual(r.hardening,['pie','nx']);
});
test('130: correção de limite atua na causa; assinatura atende outra ameaça',()=>{
 const r=compareMitigations('out-of-bounds-write',['bounds-check','code-signing','pie']);
 assert.equal(r.rootCauseFixed,true);
 assert.deepEqual(r.hardening,['pie']);
});
test('121–130: cada oficina oferece positivo, contraste, defesa e limite explícitos',()=>{
 for(let n=121;n<=130;n++){
  const r=runWorkshop(n);
  assert.ok(r.legitimate!==undefined,'positivo ausente em '+n);
  assert.ok(r.contrast!==undefined,'contraste ausente em '+n);
  assert.ok(r.retest===true,'reteste ausente em '+n);
  assert.ok(r.limit?.length>25,'limite ausente em '+n);
 }
});
