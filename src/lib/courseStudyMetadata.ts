export function lessonDurationLabel(item: { id: number; durationMin: number }) {
  // Aula 001 includes the desk exercise in its published 40–55 minute estimate.
  return item.id === 1 ? '40–55 min com prática' : item.durationMin + ' min estimados';
}

export const moduleObjectives: Record<number, string> = {
  1: 'Explique riscos, identidade e decisões de acesso em aplicações web.',
  11: 'Analise permissões, tokens e fluxos de autenticação de APIs.',
  21: 'Relacione redes, Linux e memória ao funcionamento dos sistemas.',
  31: 'Organize uma análise de segurança e seu reteste em laboratório.',
  41: 'Investigue falhas web e compare correções com evidências.',
  61: 'Explore permissões, serviços e processos em sistemas.',
  70: 'Compreenda identidades e relações de confiança em Active Directory.',
  79: 'Interprete registros e organize uma investigação defensiva.',
  91: 'Entenda camadas de detecção e proteção de endpoints.',
  101: 'Relacione código C, memória e mecanismos internos do Windows.',
  111: 'Leia instruções e reconstrua o comportamento de programas.',
  131: 'Analise comportamento de software em ambiente controlado.',
  161: 'Investigue corrupção de memória e valide hipóteses em laboratório.',
  181: 'Organize simulações e conecte evidências de ataque e defesa.',
  191: 'Examine segurança de containers, nuvem e entrega de software.',
  201: 'Explore riscos e controles de aplicações com modelos de linguagem.',
  209: 'Reúna o aprendizado em um projeto com evidências e retestes.'
};
