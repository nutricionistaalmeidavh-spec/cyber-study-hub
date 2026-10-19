/**
 * Uma instalação, quatro missões canônicas. Todos os cenários usam o mesmo
 * servidor HTTP localhost, apenas dados fictícios e a fatura F001.
 * Objetivos diferentes conforme a etapa pedagógica da Academy.
 */
export const LAB_MISSIONS=Object.freeze({
  '034':{
    code:'034',title:'Autorização e descoberta',description:'Reconheça a falha de acesso entre Alice e Bob antes e depois da correção.',
    focus:'Investigar quem é dono de F001 e observar o comportamento HTTP de cada identidade.',
    outcome:'Você identificou um acesso indevido e demonstrou como a API deveria responder.',
    steps:[
      {id:'alice-initial',route:'/invoices/F001',actor:'alice',mode:'vulnerable',status:200,title:'Estabeleça o acesso legítimo',instruction:'A dona Alice deve conseguir consultar F001.'},
      {id:'bob-vulnerable',route:'/invoices/F001',actor:'bob',mode:'vulnerable',status:200,title:'Observe a falha de autorização',instruction:'Bob recebe 200 no sistema vulnerável, apesar de F001 pertencer a Alice.',detection:'UNAUTHORIZED_READ_DEMO'},
      {id:'bob-fixed',route:'/invoices/F001',actor:'bob',mode:'corrected',status:403,title:'Comprove o bloqueio',instruction:'Na versão corrigida, a API deve negar Bob com HTTP 403.'},
      {id:'alice-fixed',route:'/invoices/F001',actor:'alice',mode:'corrected',status:200,title:'Verifique o uso legítimo',instruction:'Alice precisa continuar consultando F001 após a correção.'}
    ]
  },
  '040':{
    code:'040',title:'Relatório, correção e decisão de publicação',description:'Reproduza o defeito, confirme a correção e prepare uma conclusão técnica para a equipe.',
    focus:'Coletar evidência antes e depois do patch e avaliar uma decisão de publicação didática.',
    outcome:'Você comparou a falha original com o reteste e reuniu as condições de uma liberação segura do exemplo.',
    steps:[
      {id:'finding',route:'/invoices/F001',actor:'bob',mode:'vulnerable',status:200,title:'Registre o achado',instruction:'Reproduza Bob 200 no modo vulnerável: documente ator, recurso e condição.',detection:'UNAUTHORIZED_READ_DEMO'},
      {id:'owner-baseline',route:'/invoices/F001',actor:'alice',mode:'vulnerable',status:200,title:'Confira a referência legítima',instruction:'Alice 200 é o baseline que não pode ser perdido durante a correção.'},
      {id:'patched-denial',route:'/invoices/F001',actor:'bob',mode:'corrected',status:403,title:'Teste a correção no backend',instruction:'A leitura de Bob deve passar de 200 para 403.'},
      {id:'regression',route:'/invoices/F001',actor:'alice',mode:'corrected',status:200,title:'Decida sobre a liberação',instruction:'Confirme Alice 200. A comparação será usada na recomendação de release didática.'}
    ]
  },
  '213':{
    code:'213',title:'Reconhecimento e prova de impacto',description:'Inventarie um alvo local permitido, formule uma hipótese e produza uma evidência controlada.',
    focus:'Construir o inventário, comparar comportamentos e evitar conclusões não comprovadas.',
    outcome:'Você documentou os dois endpoints autorizados e uma hipótese verificável para a fatura F001.',
    steps:[
      {id:'health',route:'/health',actor:'alice',mode:'corrected',status:200,title:'Confirme o servidor no escopo',instruction:'Use GET /health para inventariar o serviço local e comprovar que está ativo.'},
      {id:'route-owner',route:'/invoices/F001',actor:'alice',mode:'corrected',status:200,title:'Inventarie o endpoint protegido',instruction:'A proprietária Alice obtém F001 com 200 em modo corrigido.'},
      {id:'hypothesis',route:'/invoices/F001',actor:'bob',mode:'vulnerable',status:200,title:'Teste a hipótese de exposição',instruction:'Verifique se Bob lê o objeto de Alice na variante vulnerável.',detection:'UNAUTHORIZED_READ_DEMO'},
      {id:'impact',route:'/invoices/F001',actor:'bob',mode:'corrected',status:403,title:'Delimite a prova de impacto',instruction:'Repita com a correção e documente a mudança para HTTP 403.'}
    ]
  },
  '218':{
    code:'218',title:'Telemetria, detecção e reteste final',description:'Analise os logs HTTP e os sinais gerados, teste falsos positivos e finalize o relatório.',
    focus:'Distinguir evento observado, alerta de leitura indevida, bloqueio e ausência justificada de alerta.',
    outcome:'Você comprovou o sinal positivo, o caso benigno, o bloqueio e a regressão legítima.',
    steps:[
      {id:'detection-positive',route:'/invoices/F001',actor:'bob',mode:'vulnerable',status:200,title:'Produza um alerta verdadeiro',instruction:'Observe Bob 200 no modo vulnerável e o sinal UNAUTHORIZED_READ_DEMO.',detection:'UNAUTHORIZED_READ_DEMO'},
      {id:'benign-case',route:'/invoices/F001',actor:'alice',mode:'vulnerable',status:200,title:'Confira o falso positivo',instruction:'Alice 200 não deve disparar o alerta: é um acesso legítimo.',detection:null},
      {id:'deny-case',route:'/invoices/F001',actor:'bob',mode:'corrected',status:403,title:'Valide o reteste defensivo',instruction:'Bob 403 deve constar no evento de auditoria sem alerta de exposição.',detection:null},
      {id:'final-regression',route:'/invoices/F001',actor:'alice',mode:'corrected',status:200,title:'Feche a linha do tempo',instruction:'Alice 200 na versão corrigida encerra a prova do acesso legítimo.',detection:null}
    ]
  }
});
// IDs canônicos têm ordem pedagógica; Object.keys reordena as chaves numéricas.
export const LAB_MISSION_CODES=Object.freeze(['034','040','213','218']);
export function getLabMission(code){return Object.prototype.hasOwnProperty.call(LAB_MISSIONS,code)?LAB_MISSIONS[code]:null;}
