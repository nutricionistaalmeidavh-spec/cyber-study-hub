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

export type CurriculumCatalog = {
  version: number;
  main: MainCurriculumItem[];
  parallel: ParallelCurriculumItem[];
};
