// Artefato DIDÁTICO de autoria do curso. Observar sem abrir o fonte antes da primeira matriz.
export function classifyTicket(input){
 if(!input || typeof input!=='object' || Array.isArray(input))throw new TypeError('invalid input');
 const {severity,impact,blocked}=input;
 if(!Number.isInteger(severity)||severity<0||severity>10)throw new RangeError('invalid severity');
 if(!Number.isInteger(impact)||impact<0||impact>10)throw new RangeError('invalid impact');
 if(typeof blocked!=='boolean')throw new TypeError('invalid blocked');
 const score=severity*2+impact+(blocked?5:0);
 return {score,priority:score>=22?'critical':score>=14?'high':'normal'};
}
