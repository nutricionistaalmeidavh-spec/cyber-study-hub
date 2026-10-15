/** Section links keep the study route in the hash, including catalog filters. */
export function studyRouteHash(hash: string) {
  const [path, query = ''] = hash.replace(/^#/, '').split('?');
  const params = new URLSearchParams(query);
  params.delete('section');
  return (path || 'dashboard') + (params.size ? '?' + params.toString() : '');
}

export function studySectionId(hash: string) {
  return new URLSearchParams(hash.split('?')[1] || '').get('section');
}

export function studySectionHref(sectionId: string, hash = window.location.hash) {
  const [path, query = ''] = studyRouteHash(hash).split('?');
  const params = new URLSearchParams(query);
  params.set('section', sectionId);
  return '#' + path + '?' + params.toString();
}

export function scrollStudySection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (!target) return false;
  target.scrollIntoView({ block: 'start', behavior: 'instant' });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  return true;
}
