/**
 * Fonte de navegação didática do Meu Gestor. Este manifesto NÃO cria novas
 * unidades curriculares: os 8 labs existentes mantêm DEV-IA-004..032.
 * Cada URL aponta para um arquivo/pasta da árvore pública verificada.
 */
const ROOT = '/course-labs/ai-dev-meu-gestor';
const REPO = 'https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub';
const TREE = REPO+'/tree/main/public/course-labs/ai-dev-meu-gestor';
export const repoZipUrl = REPO+'/archive/refs/heads/main.zip';

export type LabJourney = {
 moduleId:number;why:string;fileLabel:string;fileUrl:string;
 projectUrl:string;setup:string[];run:string[];howTo:string;
 proof:string;exerciseFocus:string;hasApp:boolean;
};
const checkpoints=['v0.1','v0.2','v0.3','v0.4','v0.5','v1.0'];
const path=(version:string)=>ROOT+'/checkpoints/'+version+'/README.md';
const folder=(version:string)=>TREE+'/checkpoints/'+version;

export const labJourneys:LabJourney[]=[
 {moduleId:1,why:'Entender estados de ordens de serviço e por que uma alteração de tela não é persistência.',
  fileLabel:'Protótipo starter.html',fileUrl:ROOT+'/starter.html',projectUrl:TREE,
  setup:['Não é necessário instalar nada.','Abra o arquivo starter.html no navegador; para editar, faça uma cópia no computador.'],
  run:['Abra a OS pendente e avance até concluída.','Edite apenas um título fictício no HTML e recarregue.'],
  howTo:'Altere o título, registre a mudança de estado e escreva seu primeiro escopo do Meu Gestor.',
  proof:'Comprove a mudança visual e que uma OS concluída não aumenta o contador duas vezes.',
  exerciseFocus:'Protótipo HTML e documento de escopo; sem backend.',hasApp:false},
 {moduleId:2,why:'Transformar o protótipo em requisitos que outra pessoa consegue construir e testar.',
  fileLabel:'Modelo de especificação',fileUrl:ROOT+'/module-02/spec-template.md',projectUrl:TREE+'/module-02',
  setup:['Não é necessário instalar Node nem React.','Abra o modelo Markdown em um editor ou anote os requisitos em documento próprio.'],
  run:['Documente Cliente, Ordem, os estados e a regra de vínculo por ID.','Simule um cadastro válido e uma OS sem cliente.'],
  howTo:'Preencha cinco critérios de aceitação, com caso positivo e negativo, sem escrever software novo nesta etapa.',
  proof:'Um requisito deve permitir verificar a rejeição de uma OS sem cliente e impedir uma mudança de estado inválida.',
  exerciseFocus:'Documento de requisitos e fluxos; ainda não há um novo executável.',hasApp:false},
 ...checkpoints.map((version,i)=>{
  const moduleId=i+3;
  const content=[
   ['Criar seu primeiro projeto React/TypeScript e compreender o processo de build.',
    ['npm install --no-audit --no-fund','npm run dev','npm run build'],
    'Mude um título no código React e registre o diff antes/depois.',
    'Build aprovado após a alteração e caso com erro de JSX rejeitado pelo compilador.'],
   ['Construir telas de painel, clientes e serviços a partir de uma fonte única de dados.',
    ['npm install --no-audit --no-fund','npm run dev','npm run build'],
    'Navegue pelas telas, teste teclado e viewport de 360px e altere uma fixture.',
    'Os indicadores devem refletir a alteração; ainda não há persistência nem API.'],
   ['Adicionar cadastro, edição e validação de clientes e ordens.',
    ['npm install --no-audit --no-fund','npm run test','npm run dev'],
    'Cadastre uma OS com cliente válido e tente criar outra com ID inexistente.',
    'Testes passam, entradas inválidas são rejeitadas e conclusão repetida não duplica o contador.'],
   ['Persistir os cadastros em SQLite usando API Node local.',
    ['npm install --no-audit --no-fund','npm run dev:api   # terminal 1','npm run dev       # terminal 2','npm run test'],
    'Cadastre cliente e OS fictícios e reinicie a API para comparar os IDs persistidos.',
    'Teste status inválidos e confirme que os dados continuam no SQLite após reiniciar.'],
   ['Investigar falhas reproduzíveis sem confundir teste verde com sistema seguro.',
    ['npm install --no-audit --no-fund','npm run test','npm run build','npm run dev:api   # terminal 1','npm run dev       # terminal 2'],
    'Em uma cópia, introduza um bug controlado, observe o teste vermelho e reverta.',
    'Teste volta a passar depois da correção; há evidências do erro e do reteste.'],
   ['Finalizar a aplicação local e demonstrar manutenção, backup e extensões funcionais.',
    ['npm install --no-audit --no-fund','npm test','npm run build','npm run start:local'],
    'Cadastre uma OS fictícia, faça backup/restauração isolada e abra Extensões (kits) no Meu Gestor local.',
    'Confirme a persistência, restauração e testes. Teste cada extensão sem dados reais nem equipamento obrigatório.']
  ][i];
  return {moduleId,why:content[0] as string,fileLabel:'Projeto Meu Gestor '+version+' e README',
   fileUrl:path(version),projectUrl:folder(version),
   setup:['Instale Node.js 24+ e npm no seu computador.','Baixe o ZIP completo do repositório e abra apenas a pasta public/course-labs/ai-dev-meu-gestor/checkpoints/'+version+' no editor.','Execute os comandos abaixo dentro dessa pasta; npm pode precisar de internet na primeira instalação.'],
   run:content[1] as string[],howTo:content[2] as string,proof:content[3] as string,
   exerciseFocus:'Checkpoint '+version+' executado no seu computador; não é um aplicativo hospedado no Hub.',hasApp:true};
 })
];
export function labJourney(moduleId:number){
 const result=labJourneys.find(x=>x.moduleId===moduleId);
 if(!result)throw new Error('Laboratório sem roteiro específico: '+moduleId);
 return result;
}

export type KitPath={
 id:'pdf'|'serial'|'finance'|'reporting'|'ui'|'scan';title:string;
 why:string;file:string;fileLabel:string;link:string;
 setup:string;howTo:string;proof:string;status:string;
};
export const kitPaths:KitPath[]=[
 {id:'pdf',title:'Gerador de PDF de OS',
  why:'Entregar uma ordem de serviço legível ao cliente, sem confundir impressão com nota fiscal.',
  file:'pdf/generate-pdf.mjs',fileLabel:'Código do gerador com pdfme',
  link:ROOT+'/kits/pdf/README.md',
  setup:'No Meu Gestor v1.0, abra Extensões → Ordem de serviço. Para um PDF binário pelo módulo artisys-pdf, siga a instalação adicional do README; essa dependência não vem na aplicação principal.',
  howTo:'Selecione uma OS fictícia e escolha Abrir documento para PDF. No navegador use Imprimir → Salvar como PDF. Depois compare com a versão programática do kit opcional.',
  proof:'PDF visualmente legível, com os dados da OS selecionada; teste serviço vazio ou status inválido no kit programático. A UI padrão cria HTML imprimível, não um PDF binário no servidor.',
  status:'Impressão funcional no v1.0; motor PDF binário opcional.'},
 {id:'serial',title:'Leitura de balança',
  why:'Entender leitura, unidade e erros antes de conectar hardware.',
  file:'serial/scale-simulator.cjs',fileLabel:'Simulador com casos positivos e negativos',
  link:ROOT+'/kits/serial/README.md',
  setup:'Abra Extensões → Simulador de balança no v1.0. Não precisa de porta USB, placa nem driver para o exercício. Hardware físico exige protocolo e perfil reais.',
  howTo:'Digite 1,250 kg e execute a simulação. Depois insira texto inválido ou peso fora do limite. Para integração serial real, consulte a biblioteca artisys-serialport.',
  proof:'Resultado tipado em kg e rejeição de entrada inválida. O simulador não prova a compatibilidade com uma balança física.',
  status:'Simulação funcional; integração USB/COM opcional e dependente de equipamento.'},
 {id:'finance',title:'Regras financeiras',
  why:'Evitar lançamentos inválidos e distinguir uma prévia de pagamento real.',
  file:'finance/classify-demo.mjs',fileLabel:'Exemplo de classificação',
  link:ROOT+'/kits/finance/README.md',
  setup:'Abra Extensões → Classificar lançamento no v1.0. O domínio completo artisys-finance-domain é uma integração avançada, fora do núcleo.',
  howTo:'Associe a prévia a uma OS, digite o valor e escolha a categoria. Para o domínio reutilizável, estude transaction.mjs e classify-demo.mjs.',
  proof:'Valor convertido em centavos, categoria aceita e valor zero rejeitado no kit. Nenhuma cobrança nem saldo é persistido automaticamente.',
  status:'Prévia funcional; financeiro completo não implementado.'},
 {id:'reporting',title:'Relatórios e CSV',
  why:'Exportar ordens com cliente correto e planilhas seguras contra fórmulas.',
  file:'reporting/export-orders.mjs',fileLabel:'Exemplo de exportação',
  link:ROOT+'/kits/reporting/README.md',
  setup:'Abra Extensões → Exportar ordens no v1.0. A API e as ordens são todas fictícias e locais.',
  howTo:'Cadastre/alterne OS fictícias, exporte o CSV e compare contagem e nomes com o aplicativo; para agregações, use o exemplo artisys-reporting.',
  proof:'CSV corresponde aos registros da aplicação; casos com cliente inexistente e texto iniciado por = são rejeitados ou neutralizados.',
  status:'Exportação CSV funcional; relatórios avançados opcionais.'},
 {id:'ui',title:'Interface e indicadores',
  why:'Construir componentes legíveis e consistentes sem duplicar a fonte dos contadores.',
  file:'ui/StatusCard.tsx',fileLabel:'Componente React reutilizável',
  link:ROOT+'/kits/ui/README.md',
  setup:'Abra Extensões → Interface reaproveitável no v1.0. O componente didático independente não exige acesso ao frontEnds privado.',
  howTo:'Observe os totais de clientes e OS. Teste as mesmas métricas num card separado e compare teclado, 360px e zoom.',
  proof:'Os contadores só mudam quando a fonte real de ordens/clientes muda. Acesso ao repositório privado não é necessário.',
  status:'Indicadores locais funcionais; bibliotecas privadas apenas como referência autorizada.'},
 {id:'scan',title:'QA e segurança',
  why:'Encontrar inconsistências reais do SQLite e reconhecer os limites de um scanner.',
  file:'scan/README.md',fileLabel:'Guia ArtiSys Scan e QA',
  link:ROOT+'/kits/scan/README.md',
  setup:'No v1.0, acesse Extensões → Integridade do banco e execute o diagnóstico. O ArtiSys Scan roda apenas em checkout autorizado separado.',
  howTo:'Execute o diagnóstico SQLite e, no terminal do v1.0, npm test e npm run build. Para auditoria opcional, siga as instruções específicas do artisysScan.',
  proof:'integrity_check retorna estado e ligações de clientes/OS; falhas devem ser registradas. Scanner não executado não pode ser marcado como aprovado.',
  status:'Integridade SQLite e testes funcionais; scanner estático externo opcional.'}
];
export function kitPublicFile(kit:KitPath){return ROOT+'/kits/'+kit.file;}
