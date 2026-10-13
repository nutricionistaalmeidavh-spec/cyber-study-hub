/** Apenas links estáticos do curso e URLs HTTP(S); texto de lição não é HTML confiável. */
export function resolveCourseLink(raw: string): { href: string; external: boolean } | null {
  const value = raw.trim();
  if (!value || /[\\\s<>"']/u.test(value)) return null;
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if ((url.protocol === 'http:' || url.protocol === 'https:') && !url.username && !url.password) {
        return { href: value, external: true };
      }
    } catch { /* não é endereço válido */ }
    return null;
  }
  if (value.startsWith('//') || !/^\/(course-labs|course-library)\/[a-zA-Z0-9_./-]+$/.test(value)) return null;
  if (value.split('/').includes('..') || /%2e|%2f|%5c/i.test(value)) return null;
  return { href: value, external: false };
}

/** Parser conservador para tabelas pipe, sem interpretar HTML bruto de aulas. */
export function parsePipeRow(line: string): string[] {
  const raw = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return raw.split(/(?<!\\)\|/).map(cell => cell.trim().replace(/\\\|/g, '|'));
}

export function isTableSeparator(line: string): boolean {
  const cells = parsePipeRow(line);
  return cells.length >= 2 && cells.every(cell => /^:?-{3,}:?$/.test(cell));
}
