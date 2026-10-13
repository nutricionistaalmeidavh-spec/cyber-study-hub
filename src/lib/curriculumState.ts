const ACTIVE_PARALLEL_KEY = 'cyber-study-active-parallel-tracks-v1';

function store() {
  return typeof localStorage === 'undefined' ? null : localStorage;
}

export function getActiveParallelTracks(): string[] {
  const storage = store();
  if (!storage) return [];

  try {
    const parsed = JSON.parse(storage.getItem(ACTIVE_PARALLEL_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(value => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

export function setActiveParallelTracks(trackCodes: string[]) {
  const storage = store();
  if (!storage) return;
  storage.setItem(ACTIVE_PARALLEL_KEY, JSON.stringify([...new Set(trackCodes)]));
}
