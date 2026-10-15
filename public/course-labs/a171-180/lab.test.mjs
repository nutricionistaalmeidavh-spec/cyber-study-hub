import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateFrame, coverageBucket, classifySanitizer, dedupeCrashes,
  diagnoseLengthField, reproduceFixture, validatePoCScope,
  comparePatch, findSiblingVariants, reviewAdvisory
} from './models.mjs';

test('171: fuzz harness accepts valid boundary and rejects mismatch/oversize', () => {
  assert.equal(validateFrame('PKT|3|abc').status,'OK');
  assert.equal(validateFrame('PKT|4|abc').status,'DECLARED_LENGTH_MISMATCH');
  assert.equal(validateFrame('PKT|0|').status,'OK');
  assert.equal(validateFrame('PKT|65|'+'a'.repeat(65)).status,'INPUT_LIMIT');
  assert.equal(validateFrame('GET /admin').status,'INVALID_FORMAT');
});
test('172: coverage signal reports distinct paths without treating coverage as correctness', () => {
  assert.equal(coverageBucket('').path,'EMPTY');
  assert.equal(coverageBucket('FORM|V=1').path,'VERSION_ONLY');
  assert.equal(coverageBucket('FORM|V=1|LEN=3').path,'HAS_LENGTH');
  assert.equal(coverageBucket('FORM|V=1|LEN=3|DATA=abc').path,'COMPLETE_FORM');
  assert.equal(coverageBucket('FORM|V=1|LEN=4|DATA=abc').path,'LENGTH_MISMATCH');
  assert.equal(coverageBucket('FORM|V=1|LEN=3|DATA=abc').memorySafe,'NOT_PROVED');
});
test('173: ASan, UBSan and clean trace carry different limits', () => {
  assert.equal(classifySanitizer('ERROR: AddressSanitizer: heap-use-after-free').category,'TEMPORAL_MEMORY');
  assert.equal(classifySanitizer('runtime error: signed integer overflow').category,'UNDEFINED_BEHAVIOR');
  assert.equal(classifySanitizer('exit code 0').category,'NO_REPORT_IN_TRACE');
  assert.equal(classifySanitizer('exit code 0').memorySafe,'NOT_PROVED');
});
test('174: duplicate crashes grouped by root symptom, not arbitrary input identity', () => {
  const out=dedupeCrashes([
    {kind:'heap-buffer-overflow',topFrame:'parse_len',inputId:'seed1'},
    {kind:'heap-buffer-overflow',topFrame:'parse_len',inputId:'seed2'},
    {kind:'heap-use-after-free',topFrame:'cleanup',inputId:'seed3'}]);
  assert.deepEqual(out.map(x=>x.count),[2,1]);
  assert.equal(out[0].classification,'hypothesis_not_root_cause');
  assert.equal(dedupeCrashes([{kind:'',topFrame:'',inputId:'A'}]).length,0);
});
test('175: invariant points to missing length guard; healthy input preserved', () => {
  assert.equal(diagnoseLengthField({declared:5,available:4,capacity:8}).rootCause,'UNTRUSTED_LENGTH_NOT_VALIDATED');
  assert.equal(diagnoseLengthField({declared:3,available:3,capacity:8}).rootCause,'NONE_OBSERVED');
  assert.equal(diagnoseLengthField({declared:9,available:9,capacity:8}).rootCause,'CAPACITY_BOUND_MISSING');
  assert.equal(diagnoseLengthField({declared:-1,available:5,capacity:8}).rootCause,'INVALID_FIXTURE');
});
test('176: reproducer distinguishes stable, mismatch and invalid preconditions', () => {
  const v={version:'fixture-v1',seed:17,input:'PKT|4|abc',expected:'DECLARED_LENGTH_MISMATCH'};
  assert.equal(reproduceFixture(v).status,'REPRODUCED');
  assert.equal(reproduceFixture({...v,expected:'OK'}).status,'EXPECTATION_MISMATCH');
  assert.equal(reproduceFixture({...v,version:'production'}).status,'OUT_OF_SCOPE');
  assert.equal(reproduceFixture({...v,input:'PKT|3|abc',expected:'OK'}).status,'REPRODUCED');
});
test('177: PoC must be local, synthetic, read-only and nondestructive', () => {
  const safe={target:'fixture',data:'synthetic',network:false,writes:false,authorization:true};
  assert.equal(validatePoCScope(safe).safe,true);
  assert.equal(validatePoCScope({...safe,network:true}).reason,'NETWORK_NOT_ALLOWED');
  assert.equal(validatePoCScope({...safe,data:'real'}).reason,'REAL_DATA_NOT_ALLOWED');
  assert.equal(validatePoCScope({...safe,authorization:false}).reason,'UNAUTHORIZED');
});
test('178: patch must fix invalid case AND preserve legitimate input', () => {
  assert.equal(comparePatch([{declared:4,actual:3},{declared:3,actual:3}]).status,'SECURITY_REGRESSION_FIXED');
  assert.equal(comparePatch([{declared:3,actual:3}]).status,'NO_NEGATIVE_CONTROL');
  assert.equal(comparePatch([{declared:4,actual:3}]).status,'NO_POSITIVE_CONTROL');
});
test('179: variant search identifies unchecked sibling code and excludes guarded paths', () => {
  const hits=findSiblingVariants([
   {name:'parse_header',readsLength:true,validatesLength:true},
   {name:'parse_attachment',readsLength:true,validatesLength:false},
   {name:'parse_export',readsLength:true,validatesLength:false},
   {name:'display_widget',readsLength:false,validatesLength:false}
  ]);
  assert.deepEqual(hits,['parse_attachment','parse_export']);
  assert.deepEqual(findSiblingVariants([{name:'safe',readsLength:true,validatesLength:true}]),[]);
});
test('180: advisory capstone requires evidence and does not invent CVE or score', () => {
  const full={fixtureId:'CSH-VR-01',rootCause:'untrusted-length',negativeRetest:true,positiveRetest:true,scope:'course-fixture'};
  assert.equal(reviewAdvisory(full).status,'READY_FOR_EDITORIAL_REVIEW');
  assert.equal(reviewAdvisory({...full,positiveRetest:false}).status,'INCOMPLETE');
  assert.equal(reviewAdvisory({...full,scope:'production'}).status,'OUT_OF_SCOPE');
  assert.equal(reviewAdvisory(full).cve,'NOT_ASSIGNED');
  assert.equal(reviewAdvisory(full).cvss,'NOT_CALCULATED');
});
