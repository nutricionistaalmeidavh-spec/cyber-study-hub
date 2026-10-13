import repositoriesData from '../../content/references/repositories.json';
import integrationsData from '../../content/references/integrations.json';
import type { ExternalReferenceV2 } from '../../content/schema';
import type {
  MainCurriculumItem,
  ParallelCurriculumItem
} from '../../curriculum/types';
import './references.css';

type Repository = {
  id: string;
  name: string;
  url: string;
  license: string;
  bestFor: string[];
  safeUse: string;
};

type MainRule = {
  id: string;
  ranges?: [number, number][];
  lessonIds?: number[];
  repositoryIds: string[];
  reason: string;
};

type ParallelRule = {
  trackCodes: string[];
  repositoryIds: string[];
  reason: string;
};

const repositories = repositoriesData.repositories as Repository[];
const integrations = integrationsData as {
  version: number;
  mainRules: MainRule[];
  parallelRules: ParallelRule[];
};

export function ReferencePanel({
  lessonReferences,
  curriculumItem
}: {
  lessonReferences?: ExternalReferenceV2[];
  curriculumItem?: MainCurriculumItem | ParallelCurriculumItem;
}) {
  const resolved = lessonReferences?.length
    ? lessonReferences.map(reference => ({
        repositoryId: reference.catalogId,
        reason: `${reference.role}: ${reference.note}`
      }))
    : resolveCurriculumReferences(curriculumItem);

  const unique = new Map<string, { repository: Repository; reasons: string[] }>();

  for (const item of resolved) {
    const repository = repositories.find(candidate => candidate.id === item.repositoryId);
    if (!repository) continue;
    const current = unique.get(repository.id) ?? { repository, reasons: [] };
    current.reasons.push(item.reason);
    unique.set(repository.id, current);
  }

  if (!unique.size) return null;

  return (
    <section className="reference-panel">
      <span className="eyebrow">LABS E REFERÊNCIAS</span>
      <h3>Fontes externas controladas</h3>
      <p className="reference-intro">
        Use somente como complemento. Execução ativa deve permanecer local,
        própria ou explicitamente autorizada.
      </p>

      <div className="reference-list">
        {[...unique.values()].map(({ repository, reasons }) => (
          <article key={repository.id}>
            <div className="reference-head">
              <strong>{repository.name}</strong>
              <span>{repository.license}</span>
            </div>
            <p>{reasons.join(' ')}</p>
            <small>{repository.safeUse}</small>
            <a href={repository.url} target="_blank" rel="noreferrer">
              Abrir repositório ↗
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function resolveCurriculumReferences(
  item?: MainCurriculumItem | ParallelCurriculumItem
) {
  if (!item) return [];

  if (item.kind === 'main') {
    return integrations.mainRules.flatMap(rule => {
      const byId = rule.lessonIds?.includes(item.id) ?? false;
      const byRange =
        rule.ranges?.some(([start, end]) => item.id >= start && item.id <= end) ?? false;
      if (!byId && !byRange) return [];
      return rule.repositoryIds.map(repositoryId => ({
        repositoryId,
        reason: rule.reason
      }));
    });
  }

  return integrations.parallelRules.flatMap(rule => {
    if (!rule.trackCodes.includes(item.trackCode)) return [];
    return rule.repositoryIds.map(repositoryId => ({
      repositoryId,
      reason: rule.reason
    }));
  });
}
