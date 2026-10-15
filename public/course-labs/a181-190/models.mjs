// Purple Team didático: os eventos são JSON local, NÃO ações contra computador/rede.
export const allowedAssets=['LAB01','LAB02'];
export function inScope({asset,action}){
 return allowedAssets.includes(asset)&&['log-review','simulation','verify-detection'].includes(action);
}
export function normalizeEvent(event){
 if(!event||!allowedAssets.includes(event.asset)||!event.eventId)return{valid:false,reason:'UNAUTHORIZED_SCOPE'};
 return{valid:true,asset:event.asset,eventId:String(event.eventId),category:String(event.category||'unknown'),source:String(event.source||'fixture'),detected:Boolean(event.detected)};
}
export function detectEvent(event){
 const e=normalizeEvent(event);if(!e.valid)return{signal:'STOP_OUT_OF_SCOPE',complete:false};
 const rules=new Set(['unapproved-login','unexpected-privilege','new-persistence','credential-read','remote-hop','missing-telemetry','unapproved-remote-control']);
 if(e.category==='missing-telemetry')return{signal:'INCOMPLETE_TELEMETRY',complete:false};
 return{signal:rules.has(e.category)?'REVIEW':null,complete:true};
}
export function buildPurpleReport(events){
 const results=events.map(detectEvent);
 return{total:results.length,review:results.filter(x=>x.signal==='REVIEW').length,complete:results.every(x=>x.complete),results};
}
