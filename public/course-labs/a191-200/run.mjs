import {assessContainer,assessKubernetes,assessIam,assessSecretLifecycle,assessReleaseGate,triageScanFinding,assessSupplyChain,assessRowChange,assessServerlessRequest,assessIpcRead} from './models.mjs';
export function runCloudLab(id){
 const x=Number(id);let positive,negative;
 switch(x){
 case 191:{const q={user:'10001',readOnlyRootfs:true,dropAllCapabilities:true,extraCapabilities:[],volumes:[],hostNetwork:false,privileged:false,seccomp:'default'};positive=assessContainer(q);negative=assessContainer({...q,user:'0'});break}
 case 192:{const q={allowedVerbs:['get'],allowedResources:['configmaps'],automountServiceAccountToken:false,runAsNonRoot:true,privileged:false,allowPrivilegeEscalation:false,readOnlyRootFilesystem:true,capDrop:['ALL']};positive=assessKubernetes(q);negative=assessKubernetes({...q,allowedVerbs:['*']});break}
 case 193:{const q={action:'s3:GetObject',resource:'arn:aws:s3:::course-iam-lab/reports/a.txt',secureTransport:true};positive=assessIam(q);negative=assessIam({...q,action:'s3:DeleteObject'});break}
 case 194:{const q={location:'restricted_file',logExposed:false,revoked:false,ageDays:5,rotationDays:30,scope:'read',requiredScope:'read'};positive=assessSecretLifecycle(q);negative=assessSecretLifecycle({...q,location:'repository'});break}
 case 195:{const q={authorizationPassed:true,sourceDigest:'sha256:A',testedDigest:'sha256:A',builtDigest:'sha256:A',artifactDigest:'sha256:B',verifiedDigest:'sha256:B',failOpen:false};positive=assessReleaseGate(q);negative=assessReleaseGate({...q,testedDigest:'sha256:old'});break}
 case 196:{const q={kind:'SCA',component:'lib-a@1',rule:'advisory-x',reproduced:false,falsePositiveConfirmed:false,fixedAndRetested:false};positive=triageScanFinding(q);negative=triageScanFinding({...q,reproduced:true});break}
 case 197:{const q={expectedDigest:'SHA256:1',actualDigest:'SHA256:1',lockfilePinned:true,provenanceVerified:true,sbomAvailable:true};positive=assessSupplyChain(q);negative=assessSupplyChain({...q,actualDigest:'SHA256:2'});break}
 case 198:{const q={authenticated:true,userId:'alice',oldOwner:'alice',newOwner:'alice',operation:'update'};positive=assessRowChange(q);negative=assessRowChange({...q,newOwner:'bob'});break}
 case 199:{const q={verifiedClaims:true,subject:'alice',role:'reader',now:10,exp:20,tenant:'A',resourceTenant:'A',method:'GET'};positive=assessServerlessRequest(q);negative=assessServerlessRequest({...q,resourceTenant:'B'});break}
 case 200:{const q={senderId:7,expectedSenderId:7,frameUrl:'course://app/index.html',expectedFrameUrl:'course://app/index.html',args:{id:'a'},sessionUser:'alice',recordOwner:'alice'};positive=assessIpcRead(q);negative=assessIpcRead({...q,senderId:8});break}
 default:return {id:x,status:'UNKNOWN_LAB'};
 }
 return {id:x,positive,negative,toolExecuted:false};
}
if(process.argv[1]?.endsWith('/a191-200/run.mjs')){
 const id=Number(process.argv[2]);if(!Number.isInteger(id)||id<191||id>200){console.error('Uso: node public/course-labs/a191-200/run.mjs 191..200');process.exitCode=2}
 else console.log(JSON.stringify(runCloudLab(id),null,2));
}
