import test from 'node:test';
import assert from 'node:assert/strict';
import {runWorkshop,evaluateLesson,fixtures,digest} from './models.mjs';
const expected={
  "181": [
    "ALLOW",
    "DENY"
  ],
  "182": [
    "CHAIN_OK",
    "REVIEW_LINEAGE"
  ],
  "183": [
    "VALIDATED",
    "REVIEW_INTEGRITY"
  ],
  "184": [
    "AUTHORIZED",
    "REVIEW_CHANGE"
  ],
  "185": [
    "BASELINE_OK",
    "REVIEW_AUTOSTART"
  ],
  "186": [
    "EXPECTED_READ",
    "REVIEW_CANARY"
  ],
  "187": [
    "AUTHORIZED_SESSION",
    "REVIEW_SESSION"
  ],
  "188": [
    "GAP_IDENTIFIED",
    "COVERED"
  ],
  "189": [
    "APPROVED_HEARTBEAT",
    "CONTEXT_REQUIRED"
  ],
  "190": [
    "COVERED",
    "GAP_IDENTIFIED"
  ]
};
for(const [id,states] of Object.entries(expected)){
 test('AULA-'+id+' positive, negative and no side effects',()=>{
  const result=runWorkshop(Number(id));
  assert.equal(result.positive.status,states[0]);assert.equal(result.negative.status,states[1]);
  assert.equal(evaluateLesson(Number(id),null).status,'INVALID_INPUT');
  assert.notDeepEqual(result.positive,result.negative);
 });
}
test('181 stop rule overrides even approved lab',()=>assert.equal(evaluateLesson(181,{...fixtures[181].positive,stop:true}).status,'STOP'));
test('182 identical PID across different hosts is not trusted',()=>assert.equal(evaluateLesson(182,{...fixtures[182].positive,childHost:'LAB02'}).status,'REVIEW_LINEAGE'));
test('183 digest is recalculated from bytes, not declared metadata',()=>assert.equal(evaluateLesson(183,{...fixtures[183].positive,bytes:'tampered'}).status,'REVIEW_INTEGRITY'));
test('183 real digest matches SHA256 known string',()=>assert.equal(digest(Buffer.from('abc')), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'));
test('184 no token/user update is ever executed',()=>assert.equal(evaluateLesson(184,fixtures[184].positive).privilegeChanged,false));
test('185 there is no scheduler side effect',()=>assert.equal(evaluateLesson(185,fixtures[185].positive).taskCreated,false));
test('186 a canary is never real credential exposure',()=>assert.equal(evaluateLesson(186,fixtures[186].negative).credentialExposed,false));
test('187 no network session exists',()=>assert.equal(evaluateLesson(187,fixtures[187].positive).connectionCreated,false));
test('188 telemetry gap does not prove evasion',()=>assert.equal(evaluateLesson(188,fixtures[188].positive).evasionProven,false));
test('189 heartbeat never proves C2',()=>assert.equal(evaluateLesson(189,fixtures[189].negative).c2Proven,false));
test('190 4/4 coverage and zero false alarms in controlled positive',()=>{let x=evaluateLesson(190,fixtures[190].positive);assert.equal(x.coverage,1);assert.equal(x.falsePositive,0);});
test('190 missing telemetry and benign false alert are counted',()=>{let x=evaluateLesson(190,fixtures[190].negative);assert.equal(x.telemetry,3);assert.equal(x.falsePositive,1);assert.equal(x.coverage,0.75);});
