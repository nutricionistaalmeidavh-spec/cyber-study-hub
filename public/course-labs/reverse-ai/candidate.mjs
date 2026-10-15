// Reimplementação independente inicial; modifique e execute os testes diferenciais.
export function classifyCandidate(input){
 if(input===null||typeof input!=='object'||Array.isArray(input))throw new TypeError('invalid input');
 const severity=input.severity,impact=input.impact,blocked=input.blocked;
 if(!Number.isInteger(severity)||severity<0||severity>10)throw new RangeError('invalid severity');
 if(!Number.isInteger(impact)||impact<0||impact>10)throw new RangeError('invalid impact');
 if(typeof blocked!=='boolean')throw new TypeError('invalid blocked');
 const points=(2*severity)+impact+(blocked?5:0);
 let priority='normal';
 if(points>=22)priority='critical';
 else if(points>=14)priority='high';
 return {score:points,priority};
}
