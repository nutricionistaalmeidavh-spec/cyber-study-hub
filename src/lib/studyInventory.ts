import catalogData from '../curriculum/catalog.json';
import aiManifest from '../trails/ai-dev/manifest.json';
import channelManifest from '../trails/channel-dark/manifest.json';

/**
 * Inventário de ETAPAS, não de aulas inéditas nem denominador de progresso.
 * As referências guiadas contam como passos de navegação, mas não como aulas novas.
 * O catálogo canônico preserva as identidades e notas das 218+325 unidades originais.
 */
type CatalogInput = {main: unknown[];parallel: unknown[]};
type GuidedManifest = {modules: Array<{status?: string; steps: Array<{type: string}>}>};
export function calculateStudyInventory(
  catalog: CatalogInput,
  ia: GuidedManifest,
  channel: GuidedManifest
) {
  const main = catalog.main.length;
  const parallel = catalog.parallel.length;
  const activeSteps = (manifest: GuidedManifest) => manifest.modules
    .filter(module => module.status === 'available')
    .flatMap(module => module.steps);
  const aiSteps = activeSteps(ia);
  const channelSteps = activeSteps(channel);
  const references = [...aiSteps,...channelSteps].filter(step => step.type === 'referencia').length;
  return {
    main,
    parallel,
    canonical: main + parallel,
    ai: aiSteps.length,
    channel: channelSteps.length,
    guided: aiSteps.length + channelSteps.length,
    referenceSteps: references,
    totalSteps: main + parallel + aiSteps.length + channelSteps.length
  } as const;
}
export const studyInventory = calculateStudyInventory(catalogData, aiManifest, channelManifest);
