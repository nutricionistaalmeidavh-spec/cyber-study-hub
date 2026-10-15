export type MainCurriculumItem = {
  kind: 'main';
  id: number;
  code: string;
  title: string;
  track: string;
  block: string;
  depth: 'C' | 'N' | 'P' | 'CAP';
  durationMin: number;
  contentPath: string;
};

export type ParallelCurriculumItem = {
  kind: 'parallel';
  code: string;
  title: string;
  track: string;
  trackCode: string;
  contentPath: string;
};

export type GuidedCurriculumItem = {
  kind: 'guided';
  code: string;
  source: 'ai-dev' | 'channel-dark';
  stepId: number;
  moduleId: number;
  title: string;
  track: string;
  moduleTitle: string;
  stepType: 'microaula' | 'microaula-ia' | 'referencia' | 'laboratorio';
  durationMin: number;
  href: string;
  aliasOf?: string;
  referencePath?: string;
};
export type CurriculumCatalog = {
  version: number;
  main: MainCurriculumItem[];
  parallel: ParallelCurriculumItem[];
  guided: GuidedCurriculumItem[];
};
