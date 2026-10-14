import test from 'node:test';
import assert from 'node:assert/strict';
import {filterPackets,suricataAlerts,correlateFailures,mapTechniqueEvidence,triageIndicator,
sigmaOfficePowerShell,yaraTrainingMatch,huntOfficeShell,advanceIncident,verifyEvidence,runLesson} from './models.mjs';
test('081 filtro de display preserva original e segmenta stream',()=>{
 const p=[{proto:'DNS',stream:null},{proto:'TCP',stream:7},{proto:'TCP',stream:7}];
 assert.equal(filterPackets(p,{protocol:'TCP',stream:7}).length,2);
 assert.equal(p.length,3);
 assert.equal(filterPackets(p,{protocol:'DNS'}).length,1);
});
test('082 IDS alerta apenas GET HTTP na direção/estado requeridos',()=>{
 const e=[{proto:'http',method:'GET',flow:'to_server',established:true},
 {proto:'http',method:'POST',flow:'to_server',established:true},
 {proto:'http',method:'GET',flow:'to_server',established:false}];
 assert.deepEqual(suricataAlerts(e),[{sid:1000001,action:'alert',flow_id:null}]);
});
test('083 SIEM não mistura usuários, conta ou eventos de sucesso',()=>{
 const e=[{user:'ana',host:'pc1',minute:0,ok:false},{user:'ana',host:'pc1',minute:1,ok:false},
 {user:'ana',host:'pc1',minute:3,ok:false},{user:'bia',host:'pc1',minute:0,ok:false},
 {user:'bia',host:'pc1',minute:2,ok:false},{user:'ana',host:'pc1',minute:4,ok:true}];
 assert.deepEqual(correlateFailures(e),[{user:'ana',host:'pc1',count:3}]);
});
test('083 janela de 5 minutos exclui falha no limite direito',()=>{
 assert.deepEqual(correlateFailures([{user:'ana',host:'h',minute:0,ok:false},
 {user:'ana',host:'h',minute:5,ok:false},{user:'ana',host:'h',minute:10,ok:false}]),[]);
});
test('084 ATT&CK marca hipótese observável, não atribui adversário',()=>{
 assert.equal(mapTechniqueEvidence({eventType:'process_start',source:'Sysmon',parent:'WINWORD.EXE',image:'powershell.exe'}).technique,'T1059.001');
 assert.equal(mapTechniqueEvidence({eventType:'login_failed',source:'Security'}),null);
});
test('085 IOC expirado não dispara bloqueio sem contexto',()=>{
 assert.equal(triageIndicator({kind:'ioc',now:11,expiresAt:10,context:false,observed:true}),'contextualizar');
 assert.equal(triageIndicator({kind:'ioa',observed:true}),'investigar');
});
test('086 Sigma exige pai Word, filho PowerShell e EventID 1',()=>{
 assert.equal(sigmaOfficePowerShell({eventId:1,parentImage:'C:\\Office\\WINWORD.EXE',image:'C:\\Windows\\powershell.exe'}),true);
 assert.equal(sigmaOfficePowerShell({eventId:1,parentImage:'cmd.exe',image:'powershell.exe'}),false);
 assert.equal(sigmaOfficePowerShell({eventId:2,parentImage:'WINWORD.EXE',image:'powershell.exe'}),false);
});
test('087 YARA minimodelo exige os dois marcadores benignos',()=>{
 assert.equal(yaraTrainingMatch('LAB_MARKER_742 training'),true);
 assert.equal(yaraTrainingMatch('LAB_MARKER_742 invoice'),false);
 assert.equal(yaraTrainingMatch('training notes'),false);
});
test('088 hunt impede cross-host e respeita intervalo de 5 minutos',()=>{
 const p=[{host:'a',minute:0,process:'WINWORD.EXE'},
 {host:'a',minute:2,process:'powershell.exe',parent:'WINWORD.EXE'},
 {host:'b',minute:3,process:'powershell.exe',parent:'WINWORD.EXE'},
 {host:'a',minute:8,process:'powershell.exe',parent:'WINWORD.EXE'}];
 assert.deepEqual(huntOfficeShell(p),[{host:'a',minute:2,verdict:'investigate'}]);
});
test('089 IR registra responsável e não salta etapas',()=>{
 assert.deepEqual(advanceIncident('triagem','contencao',{evidenceRecorded:true,owner:'SOC'}),{stage:'contencao',owner:'SOC'});
 assert.throws(()=>advanceIncident('triagem','recuperacao',{evidenceRecorded:true,owner:'SOC'}),/salto/);
 assert.throws(()=>advanceIncident('triagem','contencao',{owner:'SOC'}),/rastreabilidade/);
});
test('090 DFIR compara SHA-256 de bytes',()=>{
 const same=verifyEvidence('registro-lab-001','registro-lab-001');
 assert.equal(same.identical,true);assert.equal(same.sourceHash.length,64);
 assert.equal(verifyEvidence('registro-lab-001','registro-lab-002').identical,false);
});
test('081–090 todos expõem controles positivos e negativos',()=>{
 for(let id=81;id<=90;id++){
  const r=runLesson(id);
  assert.ok(Object.hasOwn(r,'positive')&&Object.hasOwn(r,'negative'),String(id));
 }
});
