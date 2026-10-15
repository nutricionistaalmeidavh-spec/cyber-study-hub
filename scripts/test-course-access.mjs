import test from 'node:test';
import assert from 'node:assert/strict';
import {ownersForPath,canonicalAssetPath,permitted,protectedPath,publishedCourseIds} from '../src/worker/course-access.mjs';
const student={id:'u1',role:'student',status:'active'};
const owner=(course)=>[{course_id:course,revoked_at:null,expires_at:null}];
test('as 218 aulas principais continuam mapeadas sem rota pública',()=>{
 for(let id=1;id<=218;id++){
  const owners=ownersForPath('/course-library/main/'+String(id).padStart(3,'0')+'.md');
  assert.equal(owners.length,1,'aula '+id);
 }
 assert.equal(ownersForPath('/course-library/main/218.md')[0],'projeto-final');
 assert.ok(publishedCourseIds.has('projeto-final'));
});
test('fail closed para URLs arbitrárias, pareamento e bypass',()=>{
 for(const path of ['/course-library/main/../main/001.md','/course-library//main/001.md','/course-library/main/%30%30%31.md','/course-labs/unknown/file.py','/materials/../../x']) {
  assert.equal(ownersForPath(path).length,0,path);
  if (!path.includes('/unknown/')) assert.equal(canonicalAssetPath(path),null,path);
 }
 assert.equal(canonicalAssetPath('/course-library/main/001.md'),'/course-library/main/001.md');
 assert.equal(protectedPath('/course-labs/a41-50/models.mjs'),true);
 assert.equal(protectedPath('/api/me'),false);
});
test('permissão deve vir de grant do servidor ou assinatura ativa, nunca do frontend',()=>{
 const ids=ownersForPath('/course-library/main/001.md');
 assert.equal(permitted(student,ids,[],false),false);
 assert.equal(permitted(student,ids,owner('web-apis'),false),true);
 assert.equal(permitted(student,ids,owner('blue-team'),false),false);
 assert.equal(permitted(student,ids,[{course_id:'web-apis',expires_at:1,revoked_at:null}],false,2),false);
 assert.equal(permitted(student,ids,[{course_id:'web-apis',expires_at:null,revoked_at:1}],false),false);
 assert.equal(permitted(student,ids,[],true),true);
 assert.equal(permitted({...student,status:'suspended'},ids,owner('web-apis'),true),false);
 assert.equal(permitted({...student,role:'admin'},[],[],false),true);
});
test('apostilas consolidadas só com assinatura ativa; paralelas draft não vazam',()=>{
 const pdf=ownersForPath('/materials/Ethical_Hacking_Aulas_01_10.pdf');
 assert.deepEqual(pdf,['@subscription-only']);
 assert.equal(permitted(student,pdf,owner('web-apis'),false),false);
 assert.equal(permitted(student,pdf,[],true),true);
 assert.equal(permitted(student,ownersForPath('/course-library/parallel/PY-01.md'),owner('paralela-py'),false),false);
 assert.equal(permitted(student,ownersForPath('/course-library/parallel/PY-01.md'),[],true),false);
 assert.equal(permitted(student,ownersForPath('/course-library/parallel/LOG-01.md'),owner('desenvolvimento-com-ia'),false),true);
});

test('novo laboratorio reverse-ai e protegido: staff pode, aluno sem curso publicado nao',()=>{
 const owners=ownersForPath('/course-labs/reverse-ai/lab.mjs');
 assert.deepEqual(owners,['engenharia-reversa-com-ia']);
 assert.equal(permitted(student,owners,[],false),false);
 assert.equal(permitted(student,owners,owner('engenharia-reversa-com-ia'),false),false);
 assert.equal(permitted({...student,role:'admin'},owners,[],false),true);
 assert.equal(ownersForPath('/course-labs/reverse-ai/../secret'),[]);
});
