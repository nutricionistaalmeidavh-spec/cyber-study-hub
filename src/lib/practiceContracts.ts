import {getMainLabGuide,getParallelLabGuide} from './labCourseResources';
import type {MainCurriculumItem,ParallelCurriculumItem} from '../curriculum/types';

export type PracticeKind='Experimento didático'|'Kit funcional'|'Projeto incremental'|'Estudo aplicado';
export type PracticeResource={label:string;href:string;role:'guia'|'codigo'|'teste'|'base'};
export type PracticeContract={kind:PracticeKind;title:string;purpose:string;deliverable:string;preparation:string;verification:string;limits:string;resources:PracticeResource[]};
export type PracticeTarget=Pick<MainCurriculumItem,'kind'|'id'|'title'|'contentPath'>|Pick<ParallelCurriculumItem,'kind'|'code'|'title'|'contentPath'>;
type LabRange=readonly [number,number,string,string];
const mainFiles:readonly LabRange[]=[
 [1,1,'Fundamentos','/course-labs/pilot-a/test_pilot.py'],
 [2,8,'Web e HTTP','/course-labs/a-002-008/core.test.mjs'],
 [9,9,'CSRF','/course-labs/phase16-web-p0/web.test.mjs'],
 [10,20,'APIs e OAuth','/course-labs/a10-20/lab.test.mjs'],
 [21,30,'Redes, Linux e memória','/course-labs/a-021-030/test_labs.py'],
 [31,40,'Pentest e desenvolvimento seguro','/course-labs/a031-040/lab.test.mjs'],
 [41,46,'Web/AppSec avançado','/course-labs/a41-50/lab.test.mjs'],
 [47,47,'Web Cache Deception','/course-labs/aula-047/README.md'],
 [48,50,'Web/AppSec avançado','/course-labs/a41-50/lab.test.mjs'],
 [51,60,'AppSec avançado II','/course-labs/a051-060/labs.test.mjs'],
 [61,70,'Segurança de sistemas','/course-labs/a061-070/lab.test.mjs'],
 [71,80,'AD e Blue Team','/course-labs/a071-080/lab.test.mjs'],
 [81,90,'Blue Team/SOC','/course-labs/a81-90/lab.test.mjs'],
 [91,100,'EDR/Detection','/course-labs/a91-100/lab.test.mjs'],
 [101,110,'C/Windows Internals','/course-labs/a101-110/test_models.py'],
 [111,120,'Assembly/Reversing','/course-labs/a111-120/lab.test.mjs'],
 [121,130,'Reversing II','/course-labs/a121-130/labs.test.mjs'],
 [131,140,'Malware Analysis','/course-labs/a131-140/labs.test.mjs'],
 [141,150,'Malware Analysis II','/course-labs/a141-150/lab.test.mjs'],
 [151,159,'Detection Engineering','/course-labs/a151-159/lab.test.mjs'],
 [160,160,'Memória','/course-labs/phase16-memory/README.md'],
 [161,170,'Exploit Development','/course-labs/a161-170/lab.test.mjs'],
 [171,180,'Pesquisa de vulnerabilidades','/course-labs/a171-180/README.md'],
 [181,190,'Red/Purple Team','/course-labs/a181-190/README.md'],
 [191,200,'Cloud/DevSecOps','/course-labs/a191-200/README.md'],
 [201,208,'Segurança de IA','/course-labs/a201-208/README.md'],
 [209,218,'Projeto integrador','/course-labs/capstone-final/README.md']
];
const resource=(label:string,href:string,role:PracticeResource['role']):PracticeResource=>({label,href,role});
export function mainPracticeResource(id:number):PracticeResource|null{
 const e=mainFiles.find(([start,end])=>id>=start&&id<=end);
 return e?resource('Pacote compartilhado: '+e[2],e[3],e[3].endsWith('.md')?'guia':'teste'):null;
}
/** Arquivos V2 explícitos prevalecem, fallback apenas para pacotes reais. */
export function v2LabResources(id:number,explicit:readonly {label:string;href:string}[]=[]):PracticeResource[]{
 if(explicit.length)return explicit.map(x=>resource(x.label,x.href,'codigo'));
 if(id>=48&&id<=50)return [
   resource('models.mjs','/course-labs/a41-50/models.mjs','codigo'),
   resource('lab.test.mjs','/course-labs/a41-50/lab.test.mjs','teste'),
   resource('run.mjs','/course-labs/a41-50/run.mjs','codigo')];
 if(id>=51&&id<=60)return [
   resource('models.mjs','/course-labs/a051-060/models.mjs','codigo'),
   resource('labs.test.mjs','/course-labs/a051-060/labs.test.mjs','teste')];
 return [];
}
export function practiceFor(target:PracticeTarget,description?:string,deliverable?:string):PracticeContract{
 const kind:PracticeKind=target.kind==='main'&&target.id>=209?'Projeto incremental':
  target.kind==='parallel'&&!/^LAB-(0[1-9]|[12][0-9]|30)$/.test(target.code)?'Estudo aplicado':'Experimento didático';
 const guide=target.kind==='main'?getMainLabGuide(target.id):getParallelLabGuide(target.code);
 const resources:PracticeResource[]=guide?
  [resource('Roteiro específico',guide.guide,'guia'),resource('Código e dados',guide.code,'codigo'),resource('Testes',guide.tests,'teste')]:
  target.kind==='main'?[mainPracticeResource(target.id)].filter((x):x is PracticeResource=>Boolean(x)):[];
 resources.unshift(resource('Conteúdo integral da unidade',target.contentPath,'base'));
 const chosen=description?.trim()||target.title;
 return {
  kind,title:kind==='Projeto incremental'?'Construa a etapa do projeto final':'Pratique e comprove o conteúdo',
  purpose:kind==='Projeto incremental'?'Avance a entrega desta aula: '+chosen:
   kind==='Estudo aplicado'?'Faça o exercício indicado no conteúdo de '+target.title+'; não há kit executável específico identificado.':
   'Experimente em ambiente próprio e relacione hipótese, observação e defesa: '+chosen,
  deliverable:deliverable?.trim()||(kind==='Projeto incremental'?'Artefato do projeto, evidência, correção e reteste documentados.':
   'Registro da hipótese, casos positivo e negativo, resultado e explicação.'),
  preparation:kind==='Estudo aplicado'?'Leia o procedimento integral; use editor/caderno. Software só quando a aula indicar.':
   'Use dados fictícios, computador/VM ou aplicação sob seu controle. Consulte o guia antes de executar.',
  verification:kind==='Estudo aplicado'?'Compare a resposta aos critérios da aula e explique um contraexemplo.':
   'Execute o roteiro, guarde a saída e o reteste. Marcar um checklist não executa o código.',
  limits:resources.every(x=>x.role==='base')?'Não há kit pronto identificado nesta unidade; nenhuma execução automática é presumida.':
   'Testes podem ser compartilhados entre aulas. Simulações não são produto pronto nem auditoria real.',
  resources
 };
}
