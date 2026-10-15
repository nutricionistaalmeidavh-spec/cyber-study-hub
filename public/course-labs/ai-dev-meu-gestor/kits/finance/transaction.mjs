// Exemplo de normalização de lançamento fictício, sem persistência.
export function orderToTransaction({id,accountId,date,description,amountCents}){
 if(!id||!accountId||!/^\\d{4}-\\d{2}-\\d{2}$/.test(date)||!description||!Number.isSafeInteger(amountCents)||amountCents<=0)throw new TypeError('Lançamento inválido');
 return{id:String(id),accountId:String(accountId),date,description:String(description),amountCents,direction:'credit'};
}
