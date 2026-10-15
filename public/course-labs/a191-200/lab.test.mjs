import test from 'node:test';
import assert from 'node:assert/strict';
import { assessContainer, assessKubernetes, assessIam, assessSecretLifecycle,
  assessReleaseGate, triageScanFinding, assessSupplyChain, assessRowChange,
  assessServerlessRequest, assessIpcRead } from './models.mjs';

test('191: processo non-root, filesystem somente leitura e socket do daemon', () => {
  const c={user:'10001',readOnlyRootfs:true,dropAllCapabilities:true,extraCapabilities:[],volumes:[],hostNetwork:false,privileged:false,seccomp:'default'};
  assert.equal(assessContainer(c),'HARDENED_FIXTURE');
  assert.equal(assessContainer({...c,user:'0'}),'ROOT_PROCESS');
  assert.equal(assessContainer({...c,volumes:['/var/run/docker.sock:/var/run/docker.sock']}),'DAEMON_SOCKET');
  assert.equal(assessContainer({...c,readOnlyRootfs:false}),'WRITABLE_ROOT');
});
test('192: token de ServiceAccount e RBAC não são resolvidos apenas por securityContext', () => {
  const k={allowedVerbs:['get'],allowedResources:['configmaps'],automountServiceAccountToken:false,runAsNonRoot:true,privileged:false,allowPrivilegeEscalation:false,readOnlyRootFilesystem:true,capDrop:['ALL']};
  assert.equal(assessKubernetes(k),'MINIMUM_POD_FIXTURE');
  assert.equal(assessKubernetes({...k,allowedVerbs:['*']}),'RBAC_WILDCARD');
  assert.equal(assessKubernetes({...k,automountServiceAccountToken:true}),'UNNECESSARY_TOKEN');
  assert.equal(assessKubernetes({...k,runAsNonRoot:false}),'POD_PRIVILEGED');
});
test('193: autorização de leitura por prefixo, ação e transporte', () => {
  const r='arn:aws:s3:::course-iam-lab/reports/a.txt';
  assert.equal(assessIam({action:'s3:GetObject',resource:r,secureTransport:true}),'ALLOW_READ');
  assert.equal(assessIam({action:'s3:DeleteObject',resource:r,secureTransport:true}),'IMPLICIT_DENY');
  assert.equal(assessIam({action:'s3:GetObject',resource:r.replace('/reports/','/private/'),secureTransport:true}),'IMPLICIT_DENY');
  assert.equal(assessIam({action:'s3:GetObject',resource:r,secureTransport:false}),'DENY_TRANSPORT');
});
test('194: segredo nunca está no repo, no bundle ou em logs, com escopo/rotação controlados', () => {
  const s={location:'restricted_file',logExposed:false,revoked:false,ageDays:5,rotationDays:30,scope:'read',requiredScope:'read'};
  assert.equal(assessSecretLifecycle(s),'CONTROLLED_FIXTURE');
  assert.equal(assessSecretLifecycle({...s,location:'repository'}),'SOURCE_EXPOSURE');
  assert.equal(assessSecretLifecycle({...s,ageDays:30}),'ROTATE');
  assert.equal(assessSecretLifecycle({...s,scope:'admin'}),'EXCESS_SCOPE');
  assert.equal(assessSecretLifecycle({...s,logExposed:true}),'LOG_EXPOSURE');
});
test('195: artefato só libera o mesmo fonte aprovado e digest conferido', () => {
  const p={authorizationPassed:true,sourceDigest:'sha256:A',testedDigest:'sha256:A',builtDigest:'sha256:A',artifactDigest:'sha256:B',verifiedDigest:'sha256:B',failOpen:false};
  assert.equal(assessReleaseGate(p),'RELEASE_FIXTURE_APPROVED');
  assert.equal(assessReleaseGate({...p,testedDigest:'sha256:old'}),'UNTESTED_SOURCE');
  assert.equal(assessReleaseGate({...p,authorizationPassed:false}),'TEST_FAILED');
  assert.equal(assessReleaseGate({...p,verifiedDigest:'sha256:C'}),'ARTIFACT_MISMATCH');
});
test('196: SAST/DAST/SCA geram hipóteses, não prova automática de exploração', () => {
  const f={kind:'SCA',component:'lib-a@1',rule:'advisory-x',reproduced:false,falsePositiveConfirmed:false,fixedAndRetested:false};
  assert.equal(triageScanFinding(f),'REQUIRES_TRIAGE');
  assert.equal(triageScanFinding({...f,reproduced:true}),'CONFIRMED_IN_FIXTURE');
  assert.equal(triageScanFinding({...f,reproduced:true,fixedAndRetested:true}),'FIXED_IN_FIXTURE');
  assert.equal(triageScanFinding({...f,kind:'unknown'}),'UNKNOWN_SCANNER');
});
test('197: digest não atesta origem e SBOM não garante ausência de vulnerabilidade', () => {
  const s={expectedDigest:'SHA256:1',actualDigest:'SHA256:1',lockfilePinned:true,provenanceVerified:true,sbomAvailable:true};
  assert.equal(assessSupplyChain(s),'VERIFIED_FIXTURE');
  assert.equal(assessSupplyChain({...s,actualDigest:'SHA256:2'}),'INTEGRITY_FAILED');
  assert.equal(assessSupplyChain({...s,provenanceVerified:false}),'ORIGIN_NOT_VERIFIED');
  assert.equal(assessSupplyChain({...s,lockfilePinned:false}),'UNPINNED_DEPENDENCY');
});
test('198: USING e WITH CHECK precisam proteger o owner antigo e o novo', () => {
  assert.equal(assessRowChange({authenticated:true,userId:'alice',oldOwner:'alice',newOwner:'alice',operation:'update'}),'ALLOW');
  assert.equal(assessRowChange({authenticated:true,userId:'alice',oldOwner:'alice',newOwner:'bob',operation:'update'}),'DENY_OWNER');
  assert.equal(assessRowChange({authenticated:true,userId:'alice',oldOwner:'bob',newOwner:'alice',operation:'update'}),'DENY_OWNER');
  assert.equal(assessRowChange({authenticated:false,userId:'alice',oldOwner:'alice',operation:'read'}),'DENY_UNAUTHENTICATED');
});
test('199: evento serverless usa claims verificadas, tenant e método', () => {
  const r={verifiedClaims:true,subject:'alice',role:'reader',now:10,exp:20,tenant:'A',resourceTenant:'A',method:'GET'};
  assert.equal(assessServerlessRequest(r),'ALLOW_FIXTURE');
  assert.equal(assessServerlessRequest({...r,resourceTenant:'B'}),'TENANT_MISMATCH');
  assert.equal(assessServerlessRequest({...r,verifiedClaims:false}),'UNVERIFIED_IDENTITY');
  assert.equal(assessServerlessRequest({...r,now:20}),'EXPIRED');
  assert.equal(assessServerlessRequest({...r,method:'POST'}),'METHOD_DENIED');
});
test('200: renderer não pode forjar frame, identidade ou argumento de IPC', () => {
  const r={senderId:7,expectedSenderId:7,frameUrl:'course://app/index.html',expectedFrameUrl:'course://app/index.html',args:{id:'a'},sessionUser:'alice',recordOwner:'alice'};
  assert.equal(assessIpcRead(r),'ALLOW_FIXTURE');
  assert.equal(assessIpcRead({...r,senderId:8}),'SENDER_DENIED');
  assert.equal(assessIpcRead({...r,args:{id:'a',owner:'bob'}}),'ARGUMENT_DENIED');
  assert.equal(assessIpcRead({...r,recordOwner:'bob'}),'FORBIDDEN');
  assert.equal(assessIpcRead({...r,sessionUser:''}),'UNAUTHENTICATED');
});
