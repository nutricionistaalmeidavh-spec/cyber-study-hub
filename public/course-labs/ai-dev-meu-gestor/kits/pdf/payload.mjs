// Construção original de dados fictícios; não requer dependências para testar.
export function makeOrderPdfPayload(order) {
  if (!order || typeof order !== 'object') throw new TypeError('Ordem ausente');
  const clean = (value, max=100) => {
    if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u001f]/.test(value)) throw new TypeError('Campo de texto inválido');
    return value.trim();
  };
  const id=clean(order.id,32),cliente=clean(order.cliente,100),servico=clean(order.servico,160);
  const status=clean(order.status,24);
  if (!['pendente','em andamento','concluído'].includes(status)) throw new TypeError('Estado desconhecido');
  return {template:{basePdf:{width:210,height:297,padding:[10,10,10,10]},schemas:[[
    {name:'titulo',type:'text',position:{x:16,y:18},width:178,height:14,fontSize:18},
    {name:'ordem',type:'text',position:{x:16,y:44},width:178,height:9,fontSize:11},
    {name:'cliente',type:'text',position:{x:16,y:63},width:178,height:9,fontSize:11},
    {name:'servico',type:'text',position:{x:16,y:82},width:178,height:15,fontSize:11},
    {name:'status',type:'text',position:{x:16,y:108},width:178,height:9,fontSize:11}
  ]]},inputs:[{titulo:'Meu Gestor - Ordem de Serviço',ordem:'OS: '+id,cliente:'Cliente: '+cliente,servico:'Serviço: '+servico,status:'Situação: '+status}]};
}
