import catalog from '../curriculum/catalog.json' with { type: 'json' };
import offers from '../curriculum/courses.json' with { type: 'json' };

// Paths resolve to course identities, never client-controlled roles or progress keys.
const byLesson = new Map();
for (const course of offers.courses) {
  for (const mod of course.modules) for (const code of mod.lessonCodes) {
    if (byLesson.has(code)) throw Error('Duplicate course ownership: ' + code);
    byLesson.set(code, course.id);
  }
}
export const publishedCourseIds = new Set(offers.courses.filter(c => c.status === 'published').map(c => c.id));
export const knownCourseIds = new Set(offers.courses.map(c => c.id));
const parallelCodes = new Set(catalog.parallel.map(c => c.code));

export function protectedPath(pathname) {
  return /^\/(?:course-library|course-labs|materials)(?:\/|$)/.test(pathname);
}
export function ownersForPath(pathname) {
  if (!protectedPath(pathname) || typeof pathname !== 'string' || pathname.length > 512
      || /[\\?#%]/.test(pathname) || pathname.includes('..') || pathname.includes('//')) return [];
  const main = /^\/course-library\/main\/(\d{3})\.md$/.exec(pathname);
  if (main) {
    const id = byLesson.get('AULA-' + main[1]);
    return id ? [id] : [];
  }
  const parallel = /^\/course-library\/parallel\/([A-Z0-9-]+)\.md$/.exec(pathname);
  if (parallel && parallelCodes.has(parallel[1])) {
    const id = byLesson.get(parallel[1]);
    if (parallel[1]==='LOG-01' && offers.publishedStandaloneLessonCodes?.includes('LOG-01')) return ['desenvolvimento-com-ia'];
    // Units in draft courses remain blocked, including for subscribers.
    if (id) return [id];
  }
  const lab = /^\/course-labs\/([a-zA-Z0-9-]+)\/[a-zA-Z0-9_./-]+$/.exec(pathname);
  if (lab) {
    const folder = lab[1].toLowerCase();
    if (folder === 'ai-dev-meu-gestor') return ['desenvolvimento-com-ia'];
    if (folder === 'channel-dark') return ['automacao-canal-dark'];
    if (folder === 'capstone-final') return ['projeto-final'];
    if (folder === 'lab-tools') return ['web-apis', 'redes-sistemas', 'pentest-seguro'];
    if (folder === 'phase16-web-p0' || folder === 'phase16-foundations' || folder === 'pilot-a') return ['web-apis'];
    if (folder === 'phase16-memory') return ['exploit-research'];
    if (folder === 'phase16-platform') return ['cloud-devsecops'];
    if (folder === 'phase16-logic') return ['pentest-seguro'];
    const one = /^aula-(\d{3})$/.exec(folder);
    if (one) return [byLesson.get('AULA-' + one[1])].filter(Boolean);
    const range = /^a-?(\d{1,3})-(\d{1,3})/.exec(folder);
    if (range) {
      const start = Number(range[1]),end = Number(range[2]);
      if (start < 1 || end < start || end - start > 100) return [];
      const ids = new Set();
      for (let number = start; number <= end; number++) {
        const id = byLesson.get('AULA-' + String(number).padStart(3, '0'));
        if (id) ids.add(id);
      }
      return [...ids];
    }
    return [];
  }
  if (pathname.startsWith('/materials/')) {
    // Consolidated PDFs may include several courses: restrict to subscription/admin.
    if (/\.pdf$/i.test(pathname)) return ['@subscription-only'];
    // General onboarding tools accompany any published paid course.
    if (/^\/materials\/[a-zA-Z0-9_.-]+\.(?:txt|md)$/.test(pathname)) return [...publishedCourseIds];
  }
  return [];
}
export function permitted(user, owners, grants, subscriptionActive, now = Date.now()) {
  if (!user || !['active'].includes(user.status)) return false;
  if (user.role === 'admin' || user.role === 'teacher') return true;
  if (!owners.length) return false;
  if (!owners.some(id => publishedCourseIds.has(id) || id==='@subscription-only')) return false;
  if (subscriptionActive) return true;
  if (owners.includes('@subscription-only')) return false;
  return owners.some(id => publishedCourseIds.has(id) && grants.some(grant =>
    grant.course_id === id && grant.revoked_at === null && (grant.expires_at === null || grant.expires_at > now)));
}
export function canonicalAssetPath(raw) {
  if (typeof raw !== 'string' || raw.length > 512 || !raw.startsWith('/')) return null;
  if (raw.includes('%') || raw.includes('\\') || raw.includes('//') || raw.includes('?') || raw.includes('#')) return null;
  if (raw.split('/').includes('..') || raw.split('/').includes('.')) return null;
  return protectedPath(raw) ? raw : null;
}
