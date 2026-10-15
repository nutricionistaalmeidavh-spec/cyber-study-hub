// Projeto EscolaLab: evidências locais e determinísticas, não exploração de sistema real.
import {decideRead,makeAuditEvent,detectionRule} from './model.mjs';
export function runFinalStage(id){
 const stage=Number(id),alice=decideRead({actor:'alice'}),bobVulnerable=decideRead({actor:'bob',mode:'vulnerable'}),
  bobFixed=decideRead({actor:'bob',mode:'corrected'}),unknown=decideRead({actor:'mallory'});
 const before=makeAuditEvent({actor:'bob',mode:'vulnerable',result:bobVulnerable});
 const after=makeAuditEvent({actor:'bob',mode:'corrected',result:bobFixed});
 const evidence={alice:alice.status,bobVulnerable:bobVulnerable.status,bobFixed:bobFixed.status,unknown:unknown.status,
  detectionBefore:detectionRule(before),detectionAfter:detectionRule(after)};
 const scoped={host:'127.0.0.1',port:4191,asset:'EscolaLab / fatura F001',production:false};
 const cases={
  209:{requiredTemplates:['SCOPE.md','LAB_ARCHITECTURE.md'],exercise:{scope:scoped,stopOn:'Fora do loopback ou identidade real'},check:'Porta e dados fictícios'},
  210:{requiredTemplates:['THREAT_MODEL.md'],exercise:{actor:'bob',asset:'F001 de alice',trustBoundary:'client-provided-identity vs object-owner'},check:'Autorização no objeto'},
  211:{requiredTemplates:['ASSET_INVENTORY.csv'],exercise:{routes:[{method:'GET',path:'/health'},{method:'GET',path:'/invoices/F001'}],host:scoped.host},check:'Escopo restrito'},
  212:{requiredTemplates:['HYPOTHESES.md'],exercise:{hypothesis:'Bob obtém F001 apenas em modo vulnerável toy',expectedBefore:200,expectedAfter:403},check:'Hipótese falsificável'},
  213:{requiredTemplates:['EVIDENCE_LOG.md'],exercise:{before:bobVulnerable,after:bobFixed,authorized:alice},check:'Impacto limitado a fatura fictícia'},
  214:{requiredTemplates:['TIMELINE.csv'],exercise:{events:[before,after],ordered:true},check:'Contexto, timestamp e resposta'},
  215:{requiredTemplates:['TEST_CASES.md'],exercise:{positive:detectionRule(before),negative:detectionRule(after),source:'evento toy-local'},check:'Detecção com negativo'},
  216:{requiredTemplates:['REMEDIATION_PLAN.md'],exercise:{control:'owner === actor',denied:bobFixed.status,legitimate:alice.status},check:'Corrige sem quebrar uso legítimo'},
  217:{requiredTemplates:['RETEST_REPORT.md'],exercise:{alice:alice.status,bob:bobFixed.status,unknown:unknown.status},check:'200/403/404 em conjunto'},
  218:{requiredTemplates:['FINAL_REPORT.md'],exercise:{findings:1,impact:'Leitura fictícia sem autorização',remediation:'ACL por proprietário',retest:evidence,scope:scoped},check:'Relatório acessível e baseado em evidências'}
 };
 if(!Object.hasOwn(cases,stage))return {status:'UNKNOWN_STAGE',id:stage};
 return {id:stage,canonical:'AULA-'+stage,source:'toy-local',...cases[stage],evidence,studentMustCompleteTemplate:true};
}
if(process.argv[1]?.endsWith('/capstone-final/stage-runner.mjs')){
 const id=Number(process.argv[2]);if(!Number.isInteger(id)||id<209||id>218){console.error('Uso: node public/course-labs/capstone-final/stage-runner.mjs 209..218');process.exitCode=2;}
 else console.log(JSON.stringify(runFinalStage(id),null,2));
}
