/** Adaptadores educacionais puros, sem acesso a browser, rede ou dados reais. */
export type Client={id:string;name:string};
export type Order={id:string;clientId:string;service:string;status:'pendente'|'em andamento'|'concluído'};
export type FinancePreview={id:string;amountCents:number;category:string;status:string;source:string};
function validText(input:unknown,max=160):string{
 if(typeof input!=='string'||!input.trim()||input.trim().length>max||/[\u0000-\u001f]/.test(input))throw new TypeError('Campo de texto inválido');
 return input.trim();
}
export function neutralizeSpreadsheet(value:unknown):string{
 const text=String(value??'').replace(/[\r\n\t]/g,' ').trimStart();
 return /^[=+@\-]/.test(text)?"'"+text:text;
}
export function ordersToCsv(orders:Order[],clients:Client[]):string{
 const clientMap=new Map(clients.map(c=>[validText(c.id,48),validText(c.name,100)]));
 const quote=(x:unknown)=>'"'+neutralizeSpreadsheet(x).replace(/"/g,'""')+'"';
 const header=['id','cliente','servico','situacao'];
 const lines=orders.map(o=>{
  const name=clientMap.get(o.clientId);
  if(!name)throw new TypeError('Ordem sem cliente existente: '+o.id);
  return [o.id,name,validText(o.service),o.status].map(quote).join(',');
 });
 return '\uFEFF'+[header.map(quote).join(','),...lines].join('\r\n')+'\r\n';
}
export function normalizeScale(input:string):{kg:number;unit:'kg';source:'simulador'}{
 const text=input.trim();
 const match=/^([0-9]+(?:[.,][0-9]{1,3})?)\s*kg$/i.exec(text);
 if(!match)throw new TypeError('Use um peso fictício: 1,250 kg');
 const kg=Number(match[1].replace(',','.'));
 if(!Number.isFinite(kg)||kg>300)throw new RangeError('Fora da faixa didática de 0 a 300 kg');
 return {kg,unit:'kg',source:'simulador'};
}
export function financePreview({id,amountCents,category}: {id:string;amountCents:number;category:string}):FinancePreview{
 const code=validText(id,48);
 if(!Number.isSafeInteger(amountCents)||amountCents<=0||amountCents>100_000_000)throw new RangeError('Centavos devem ser inteiros, positivos e fictícios');
 if(!['servico','produto','outros'].includes(category))throw new TypeError('Categoria desconhecida');
 return {id:code,amountCents,category,status:'PREVIA_SEM_LANCAMENTO',source:'demo-local'};
}
export function escapeHtml(value:unknown):string{
 return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]||char));
}
export function printableOrder(order:Order,client:Client):string{
 if(order.clientId!==client.id)throw new TypeError('Ordem e cliente não correspondem');
 const id=escapeHtml(validText(order.id,48)),name=escapeHtml(validText(client.name,100));
 const service=escapeHtml(validText(order.service,160)),status=escapeHtml(order.status);
 return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>OS '+id+'</title><meta name="viewport" content="width=device-width, initial-scale=1">'+
 '<style>body{margin:0;padding:36px;font:16px/1.6 system-ui,sans-serif;color:#2c2440;background:#fff}header{border-bottom:3px solid #8248b5;padding-bottom:24px;margin-bottom:26px}h1{font-size:29px;letter-spacing:-1px}small{color:#6c5983}.tag{display:inline-block;color:#653091;border:1px solid #bca0d8;border-radius:99px;padding:4px 12px}dt{font-size:12px;color:#6a5b77}dd{margin:5px 0 18px;font-size:17px}footer{margin-top:48px;padding-top:16px;border-top:1px solid #ddd;color:#625775;font-size:12px}@media print{body{padding:12mm}@page{size:A4;margin:12mm}}</style></head><body>'+
 '<header><small>MEU GESTOR · DEMONSTRAÇÃO</small><h1>Ordem de serviço</h1><div class="tag">'+id+'</div></header>'+
 '<dl><dt>Cliente fictício</dt><dd>'+name+'</dd><dt>Serviço</dt><dd>'+service+'</dd><dt>Situação</dt><dd>'+status+'</dd></dl>'+
 '<footer>Documento didático. Não é nota fiscal nem comprovante de serviço. No navegador, use Imprimir → Salvar como PDF.</footer></body></html>';
}
