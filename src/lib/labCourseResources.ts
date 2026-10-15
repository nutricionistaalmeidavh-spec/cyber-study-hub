/** Mapeamento explícito de oficinas executáveis. Nenhum link contém material privado. */
export type CourseLabGuide={kind:string;title:string;description:string;guide:string;code:string;tests:string;command:string;safety:string};
const local='Arquivos educativos e dados fictícios; executar somente em ambiente próprio ou autorizado. Simulação não certifica ferramentas reais.';
export function getMainLabGuide(id:number):CourseLabGuide|null{
 if(!Number.isInteger(id))return null;
 if(id>=171&&id<=180)return{kind:'Pesquisa de vulnerabilidades · experimento local',
  title:'Reproduza e explique o laboratório A'+id,
  description:'Hipótese, entrada válida, contraprova, observação e reteste. Código Node executável; mecanismo de pesquisa sintético, não exploração.',
  guide:'/course-labs/a171-180/workshops/AULA-'+id+'.md',
  code:'/course-labs/a171-180/models.mjs',tests:'/course-labs/a171-180/lab.test.mjs',
  command:'node public/course-labs/a171-180/run.mjs '+id,safety:local};
 if(id>=181&&id<=190)return{kind:'Red/Purple Team · simulação de telemetria',
  title:'Oficina '+id+' — decisões e evidências',
  description:'Fixtures independentes por aula: caso permitido, controle negativo, escopo e evidência sem tráfego de rede.',
  guide:'/course-labs/a181-190/README.md',code:'/course-labs/a181-190/models.mjs',
  tests:'/course-labs/a181-190/lab.test.mjs',command:'node --test public/course-labs/a181-190/lab.test.mjs',safety:local};
 if(id>=191&&id<=200)return{kind:'Cloud/Plataforma · decisão local',
  title:'Teste de política e controle — aula '+id,
  description:'Casos de permissão e negação. Os modelos não executam Docker, AWS, Firebase nem Electron; consulte a aula para práticas nativas opcionais.',
  guide:'/course-labs/a191-200/README.md',code:'/course-labs/a191-200/models.mjs',
  tests:'/course-labs/a191-200/lab.test.mjs',command:'node --test public/course-labs/a191-200/lab.test.mjs',safety:local};
 if(id>=201&&id<=208)return{kind:'Segurança de IA · política sem LLM',
  title:'Teste de controles de IA — aula '+id,
  description:'Estudo determinístico de ACL, conteúdo não confiável, RAG, tools e auditoria. Não comprova robustez de um LLM real.',
  guide:'/course-labs/a201-208/README.md',code:'/course-labs/a201-208/models.mjs',
  tests:'/course-labs/a201-208/lab.test.mjs',command:'node --test public/course-labs/a201-208/lab.test.mjs',safety:local};
 if(id>=209&&id<=218)return{kind:'Projeto final integrado · cenário único',
  title:'EscolaLab: projeto final — etapa '+id,
  description:'Aplicação localhost com falha fictícia, correção, evidências e templates encadeados. Não é sistema comercial.',
  guide:'/course-labs/capstone-final/README.md',code:'/course-labs/capstone-final/server.mjs',
  tests:'/course-labs/capstone-final/lab.test.mjs',command:'node --test public/course-labs/capstone-final/lab.test.mjs',safety:local};
 return null;
}
export function getParallelLabGuide(code:string):CourseLabGuide|null{
 if(!/^LAB-(0[1-9]|[12][0-9]|30)$/.test(code))return null;
 return{kind:'Ferramentas · interpretação de evidências',title:code+' — oficina com artefatos',
  description:'Caso específico da ferramenta, input declarado, controle negativo e roteiro para transferir o aprendizado ao programa real. O runner não instala nem executa a ferramenta.',
  guide:'/course-labs/lab-tools/workshops/'+code+'.md',code:'/course-labs/lab-tools/scenarios.json',
  tests:'/course-labs/lab-tools/lab.test.mjs',command:'node public/course-labs/lab-tools/run.mjs '+code,safety:local};
}
