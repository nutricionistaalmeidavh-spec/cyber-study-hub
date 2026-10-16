/** Canonical ArtiSys Academy mount, independent of the old workers.dev host. */
export const ACADEMY_BASE = '/academy';
export function stripAcademyPath(pathname) {
  if (pathname === ACADEMY_BASE) return '/';
  return pathname.startsWith(ACADEMY_BASE + '/') ? pathname.slice(ACADEMY_BASE.length) : pathname;
}
const ownPath = /^\/(api|course-labs|course-library|materials)(?:\/|$)/;
export function academyPublicHref(href) {
  if (typeof href !== 'string' || !ownPath.test(href)) return href;
  return ACADEMY_BASE + href;
}
/** Build-only transform: scoped URLs in browser TS/TSX, never server code or curriculum JSON. */
export function prefixBrowserPaths(source) {
  return source.replace(/(['"`])\/(api|course-labs|course-library|materials)(?=\/)/g,
    (_matched, quote, segment) => quote + ACADEMY_BASE + '/' + segment);
}
