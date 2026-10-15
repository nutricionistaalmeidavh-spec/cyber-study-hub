import { useEffect, useState } from 'react';
import { getProgressSyncState, retryProgressSync } from '../lib/accountStorage';

export default function ProgressSyncStatus() {
  const [state, setState] = useState(getProgressSyncState);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const update = () => setState(getProgressSyncState());
    window.addEventListener('hub-progress-sync', update);
    update();
    return () => window.removeEventListener('hub-progress-sync', update);
  }, []);
  const retry = async () => {
    setBusy(true);
    try { await retryProgressSync(); } finally { setBusy(false); setState(getProgressSyncState()); }
  };
  return <div className="study-sync" role="status">
    <span>{state.pending ? state.error ? 'Salvo neste dispositivo · sincronização pendente' : 'Salvo neste dispositivo · sincronizando…' : 'Progresso sincronizado com sua conta'}</span>
    {state.pending > 0 && state.error && <button type="button" disabled={busy || state.saving} onClick={() => void retry()}>{busy ? 'Sincronizando…' : 'Tentar sincronizar'}</button>}
  </div>;
}
