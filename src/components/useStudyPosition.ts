import { useEffect, useState } from 'react';
import { getStudyVisit, saveStudyVisit, type StudyVisit } from '../lib/studyProgress';
import { scrollStudySection, studySectionId } from '../lib/studyNavigation';

export type StudySection = { id: string; label: string };
export function useStudyPosition(key: string, title: string, href: string,
  kind: StudyVisit['kind'], sections: StudySection[], ready = true) {
  const [active, setActive] = useState('');
  const [saveError, setSaveError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const sectionSignature = JSON.stringify(sections);
  useEffect(() => {
    if (!ready) return;
    const outline = JSON.parse(sectionSignature) as StudySection[];
    const previous = getStudyVisit(key);
    const requested = studySectionId(window.location.hash) || previous?.sectionId;
    let current = requested && outline.some(section => section.id === requested) ? requested : '';
    const persist = (id: string) => {
      const section = outline.find(item => item.id === id);
      try {
        saveStudyVisit(key, { title, href, kind, sectionId: id || undefined, sectionLabel: section?.label });
        setSaveError('');
      } catch { setSaveError('Não foi possível salvar o ponto de parada. Mantenha esta página aberta e tente novamente.'); }
    };
    persist(current);
    setActive(current);
    // Restore only after the lesson has mounted (and Markdown has loaded).
    const frame = requestAnimationFrame(() => { if (current) scrollStudySection(current); });
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top - 100) - Math.abs(b.boundingClientRect.top - 100))[0];
      if (!visible || current === visible.target.id) return;
      current = visible.target.id;
      setActive(current);
      persist(current);
    }, { rootMargin: '-8% 0px -55% 0px', threshold: 0 });
    outline.forEach(section => { const element = document.getElementById(section.id); if (element) observer?.observe(element); });
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [key, title, href, kind, ready, sectionSignature, attempt]);
  return { active, saveError, retry: () => setAttempt(value => value + 1) };
}
