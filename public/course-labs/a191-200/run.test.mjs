import test from 'node:test';import assert from 'node:assert/strict';import {runCloudLab} from './run.mjs';
const expectations=[{"id":191,"p":"HARDENED_FIXTURE","n":"ROOT_PROCESS"},{"id":192,"p":"MINIMUM_POD_FIXTURE","n":"RBAC_WILDCARD"},{"id":193,"p":"ALLOW_READ","n":"IMPLICIT_DENY"},{"id":194,"p":"CONTROLLED_FIXTURE","n":"SOURCE_EXPOSURE"},{"id":195,"p":"RELEASE_FIXTURE_APPROVED","n":"UNTESTED_SOURCE"},{"id":196,"p":"REQUIRES_TRIAGE","n":"CONFIRMED_IN_FIXTURE"},{"id":197,"p":"VERIFIED_FIXTURE","n":"INTEGRITY_FAILED"},{"id":198,"p":"ALLOW","n":"DENY_OWNER"},{"id":199,"p":"ALLOW_FIXTURE","n":"TENANT_MISMATCH"},{"id":200,"p":"ALLOW_FIXTURE","n":"SENDER_DENIED"}];
for(const x of expectations)test('Aula '+x.id+' — modelo, prova e controle negativo',()=>{
 const v=runCloudLab(x.id);assert.equal(v.positive,x.p);assert.equal(v.negative,x.n);assert.equal(v.toolExecuted,false);
 assert.notEqual(v.positive,v.negative);
});
