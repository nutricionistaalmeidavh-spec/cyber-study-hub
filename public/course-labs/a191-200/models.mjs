/**
 * Fixtures defensivas determinísticas. Modelam decisões locais, não executam
 * Docker/Kubernetes/AWS/Supabase/Firebase/Electron nem verificam tokens reais.
 * Node 22+; sem rede, credenciais ou dependências externas.
 */
export function assessContainer(c) {
  if (c.privileged) return 'PRIVILEGED';
  if (!c.user || ['root', '0', '0:0'].includes(String(c.user))) return 'ROOT_PROCESS';
  if (!c.readOnlyRootfs) return 'WRITABLE_ROOT';
  if (!c.dropAllCapabilities || (c.extraCapabilities || []).length) return 'CAPABILITIES';
  if ((c.volumes || []).some(x => x.includes('/var/run/docker.sock'))) return 'DAEMON_SOCKET';
  if (c.hostNetwork) return 'HOST_NETWORK';
  if (c.seccomp !== 'default' && c.seccomp !== 'restricted') return 'SECCOMP_DISABLED';
  return 'HARDENED_FIXTURE';
}

export function assessKubernetes(k) {
  if ((k.allowedVerbs || []).includes('*') || (k.allowedResources || []).includes('*')) return 'RBAC_WILDCARD';
  if (k.automountServiceAccountToken) return 'UNNECESSARY_TOKEN';
  if (!k.runAsNonRoot || k.privileged) return 'POD_PRIVILEGED';
  if (k.allowPrivilegeEscalation) return 'ESCALATION';
  if (!k.readOnlyRootFilesystem) return 'ROOTFS_WRITABLE';
  if (!Array.isArray(k.capDrop) || !k.capDrop.includes('ALL')) return 'CAPABILITIES';
  return 'MINIMUM_POD_FIXTURE';
}

export function assessIam({ action, resource, secureTransport }) {
  if (secureTransport !== true) return 'DENY_TRANSPORT';
  if (action === 's3:GetObject' && /^arn:aws:s3:::course-iam-lab\/reports\/[a-zA-Z0-9._/-]+$/.test(resource))
    return 'ALLOW_READ';
  return 'IMPLICIT_DENY';
}

export function assessSecretLifecycle(s) {
  if (s.location === 'repository' || s.location === 'client_bundle') return 'SOURCE_EXPOSURE';
  if (s.logExposed) return 'LOG_EXPOSURE';
  if (s.revoked) return 'REVOKED';
  if (!Number.isInteger(s.ageDays) || !Number.isInteger(s.rotationDays) || s.ageDays < 0 || s.rotationDays < 1) return 'INVALID_METADATA';
  if (s.ageDays >= s.rotationDays) return 'ROTATE';
  if (s.scope !== s.requiredScope) return 'EXCESS_SCOPE';
  if (!['local_env', 'restricted_file'].includes(s.location)) return 'UNKNOWN_LOCATION';
  return 'CONTROLLED_FIXTURE';
}

export function assessReleaseGate(p) {
  if (!p.authorizationPassed) return 'TEST_FAILED';
  if (!p.testedDigest || p.testedDigest !== p.sourceDigest || p.builtDigest !== p.testedDigest)
    return 'UNTESTED_SOURCE';
  if (!p.artifactDigest || p.artifactDigest !== p.verifiedDigest) return 'ARTIFACT_MISMATCH';
  if (p.failOpen) return 'FAIL_OPEN';
  return 'RELEASE_FIXTURE_APPROVED';
}

export function triageScanFinding(f) {
  if (!['SAST', 'DAST', 'SCA'].includes(f.kind)) return 'UNKNOWN_SCANNER';
  if (!f.component || !f.rule) return 'MISSING_CONTEXT';
  if (f.falsePositiveConfirmed) return 'FALSE_POSITIVE_IN_FIXTURE';
  if (!f.reproduced) return 'REQUIRES_TRIAGE';
  if (f.fixedAndRetested) return 'FIXED_IN_FIXTURE';
  return 'CONFIRMED_IN_FIXTURE';
}

export function assessSupplyChain(s) {
  if (!s.expectedDigest || s.expectedDigest !== s.actualDigest) return 'INTEGRITY_FAILED';
  if (!s.lockfilePinned) return 'UNPINNED_DEPENDENCY';
  if (!s.provenanceVerified) return 'ORIGIN_NOT_VERIFIED';
  if (!s.sbomAvailable) return 'INVENTORY_MISSING';
  return 'VERIFIED_FIXTURE';
}

export function assessRowChange({ authenticated, userId, oldOwner, newOwner, operation }) {
  if (!authenticated || !userId) return 'DENY_UNAUTHENTICATED';
  if (!['read', 'insert', 'update'].includes(operation)) return 'DENY_OPERATION';
  if (operation === 'read') return oldOwner === userId ? 'ALLOW' : 'DENY_OWNER';
  if (operation === 'insert') return newOwner === userId ? 'ALLOW' : 'DENY_OWNER';
  return oldOwner === userId && newOwner === userId ? 'ALLOW' : 'DENY_OWNER';
}

export function assessServerlessRequest(r) {
  if (!r.verifiedClaims) return 'UNVERIFIED_IDENTITY';
  if (!r.subject || r.role !== 'reader') return 'ROLE_DENIED';
  if (!Number.isFinite(r.now) || !Number.isFinite(r.exp) || r.now >= r.exp) return 'EXPIRED';
  if (r.tenant !== r.resourceTenant) return 'TENANT_MISMATCH';
  if (r.method !== 'GET') return 'METHOD_DENIED';
  return 'ALLOW_FIXTURE';
}

export function assessIpcRead(r) {
  if (r.senderId !== r.expectedSenderId || r.frameUrl !== r.expectedFrameUrl) return 'SENDER_DENIED';
  if (!r.args || Array.isArray(r.args) || Object.keys(r.args).length !== 1 ||
      typeof r.args.id !== 'string' || !['a','b'].includes(r.args.id)) return 'ARGUMENT_DENIED';
  if (!r.sessionUser) return 'UNAUTHENTICATED';
  return r.recordOwner === r.sessionUser ? 'ALLOW_FIXTURE' : 'FORBIDDEN';
}
