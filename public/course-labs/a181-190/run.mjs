// Oficinas Red/Purple sem rede, credenciais nem execução ofensiva.
import {inScope,detectEvent,buildPurpleReport} from './models.mjs';
const event=(category)=>({asset:'LAB01',eventId:'E-'+category,category,source:'fixture-local.json'});
export function runWorkshop(id){
 switch(Number(id)){
  case 181:return {id,positive:inScope({asset:'LAB01',action:'simulation'}),negative:inScope({asset:'externo',action:'simulation'}),expected:[true,false],noActiveActions:true};
  case 190:{const positive=buildPurpleReport([event('normal-service'),event('unapproved-login'),event('remote-hop'),event('missing-telemetry')]);
   const negative=buildPurpleReport([event('normal-service'),event('normal-service')]);
   return {id,positive,negative,expectedReview:2,expectedIncomplete:true,noActiveActions:true};}
  default:{
   const map={182:['normal-service','unapproved-login'],183:['unapproved-login','normal-service'],
    184:['unexpected-privilege','normal-service'],185:['new-persistence','normal-service'],
    186:['credential-read','normal-service'],187:['remote-hop','normal-service'],
    188:['missing-telemetry','normal-service'],189:['unapproved-remote-control','normal-service']};
   const pair=map[id];if(!pair)return {id,status:'UNKNOWN_LAB'};
   return {id,positive:detectEvent(event(pair[0])),negative:detectEvent(event(pair[1])),noActiveActions:true};
  }
 }
}
const id=Number(process.argv[2]);if(import.meta.url==='file://'+process.argv[1]||process.argv[1]?.endsWith('/a181-190/run.mjs')){
 if(!Number.isInteger(id)||id<181||id>190){console.error('Uso: node public/course-labs/a181-190/run.mjs 181..190');process.exitCode=2;}
 else console.log(JSON.stringify(runWorkshop(id),null,2));
}
