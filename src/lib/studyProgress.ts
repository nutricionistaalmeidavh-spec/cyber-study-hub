import { accountStorage } from './accountStorage';
import type { LessonLearningProgress } from './learningProgress';
import { guidedCanonicalId, guidedItems } from './guidedIdentity';

// Extend entries in the existing account-owned state. No new endpoint or storage key.
const KEY = 'cyber-study-learning-v2';
export type StudyVisit = {
  title: string;
  href: string;
  kind: 'reading' | 'interactive' | 'ai';
  sectionId?: string;
  sectionLabel?: string;
  updatedAt: string;
  read?: boolean;
};
type Entry = LessonLearningProgress & { study?: StudyVisit; draft?: unknown };
function entries(): Record<string, Entry> {
  try {
    const value = JSON.parse(accountStorage.getItem(KEY) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}
export function getStudyVisit(key: string): StudyVisit | undefined {
  return entries()[key]?.study;
}
export function getStudyDraft(key: string): unknown { return entries()[key]?.draft; }
export function getStudyVisits(): Array<StudyVisit & { key: string }> {
  return Object.entries(entries()).flatMap(([key, value]) =>
    value?.study?.href && value?.study?.updatedAt ? [{ ...value.study, key }] : [])
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}
export function saveStudyVisit(key: string, visit: Omit<StudyVisit, 'updatedAt'>, draft?: unknown) {
  const all = entries();
  const now = new Date().toISOString();
  const current = all[key] as Entry | undefined;
  all[key] = {
    migratedFromLegacy: false, completed: false, favorite: false, doubt: false,
    completedActivityIds: [], completedLabStepIds: [],
    quizHistory: [], firstSeenAt: now, ...current, lastSeenAt: now,
    study: { ...current?.study, ...visit, updatedAt: now },
    ...(draft === undefined ? {} : { draft }),
    visitedSectionIds: [...new Set([...(current?.visitedSectionIds || []), ...(visit.sectionId ? [visit.sectionId] : [])])]
  };
  accountStorage.setItem(KEY, JSON.stringify(all));
  return all[key].study!;
}

/**
 * Índice individual por ID canônico, dentro da chave account-owned já sincronizada.
 * Migra COMPLETADOS, notas e checklists locais/anteriores sem apagar o snapshot de trilha.
 * As referências reutilizadas não marcam automaticamente suas unidades de origem.
 */
export function syncCanonicalGuidedProgress(
  source:'ai-dev'|'channel-dark',
  currentStepId:number,
  progress:{completed:number[];notes:Record<number,string>;checked:Record<number,number[]>;drafts?:Record<number,unknown>}
){
 const list=guidedItems(source);
 guidedCanonicalId(source,currentStepId); // Impede escrita com identidade desconhecida.
 const known=new Set(list.map(x=>x.stepId));
 const touched=new Set<number>([currentStepId,...progress.completed,
    ...Object.keys(progress.notes).map(Number),...Object.keys(progress.checked).map(Number),
    ...Object.keys(progress.drafts||{}).map(Number)]);
 const all=entries();const now=new Date().toISOString();
 for(const stepId of touched){
  if(!known.has(stepId))continue; // Mantém o snapshot legado intacto para eventual auditoria.
  const item=list.find(x=>x.stepId===stepId)!;
  const key=guidedCanonicalId(source,stepId),current=all[key];
  const completed=progress.completed.includes(stepId);
  const notes=progress.notes[stepId]??'';
  const checks=progress.checked[stepId]??[];
  const previousDraft=(current?.draft && typeof current.draft==='object' && !Array.isArray(current.draft))
    ? current.draft as Record<string,unknown>:{};
  const draft={...previousDraft,notes,checked:checks,answer:progress.drafts?.[stepId]};
  const active=stepId===currentStepId;
  const defaults: Entry={
   migratedFromLegacy:false,completed:false,favorite:false,doubt:false,
   visitedSectionIds:[],completedActivityIds:[],completedLabStepIds:[],
   quizHistory:[],firstSeenAt:now,lastSeenAt:now
  };
  all[key]={
   ...defaults,...current,
   migratedFromLegacy:Boolean(current?.migratedFromLegacy||completed||notes||checks.length),
   completed:Boolean(current?.completed||completed),
   lastSeenAt:active?now:current?.lastSeenAt??now,
   study:active?{title:item.title,href:item.href,kind:'ai',sectionLabel:item.moduleTitle,read:completed,updatedAt:now}:current?.study,
   draft
  };
 }
 accountStorage.setItem(KEY,JSON.stringify(all)); // Uma única escrita/sincronização por mudança.
 return guidedCanonicalId(source,currentStepId);
}
export function getCanonicalGuidedCompletion(){
 const all=entries();
 return {completed: [...guidedItems('ai-dev'),...guidedItems('channel-dark')]
  .filter(item=>all[item.code]?.completed).length,
  total:guidedItems('ai-dev').length+guidedItems('channel-dark').length};
}
