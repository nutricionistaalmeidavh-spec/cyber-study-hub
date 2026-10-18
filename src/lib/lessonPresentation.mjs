/**
 * Transformações da apresentação do conteúdo canônico da Academy.
 * Não reescreve arquivos, SHA editorial, conteúdo técnico ou gabaritos.
 * Aplica-se às 543 aulas principais e paralelas, não à documentação de desenvolvimento.
 */
export function presentLessonMarkdown(markdown, _lesson) {
  if (typeof markdown !== 'string') return '';
  // A camada de aluno não deve expor scores/pareceres de revisão por IA.
  const sections = markdown.replace(/\r\n/g, '\n').split(/(?=^## )/gm);
  const output = [];
  for (const section of sections) {
    const heading = section.match(/^## ([^\n]+)/);
    const title = heading?.[1]?.trim() ?? '';
    if (/^(?:refer[eê]ncias(?: bibliogr[aá]ficas)?|bibliografia|fontes(?: (?:e|para|t[eé]cnicas).*)?)$/i.test(title)) continue;
    let lines = section.split('\n');
    // "Revisão ativa" pode ter flashcards: mantê-los, removendo somente a lista de links.
    lines = lines.filter(line => {
      if (/^\s*\*\*(?:Fonte(?:s)? t[eé]cnica(?:s)?(?: para aprofundamento)?|Limite de aprendizagem|Bibliografia|Refer[eê]ncias(?: (?:externas|bibliogr[aá]ficas))?):\*\*/i.test(line)) return false;
      if (/^\s*\*\*(?:Revis[aã]o|Estado):\*\*\s*(?:A t[eé]cnico-editorial|aprofundamento editorial|parecer editorial|auditoria editorial)/i.test(line)) return false;
      return true;
    });
    let rendered = lines.join('\n')
      .replace(/(\s*)\*\*Estado:\*\*\s*aprofundamento editorial A \(IA\) sujeito a registro SHA-256\.\s*/gi, '$1')
      .replace(/isso demonstra apenas controle de escopo fictício, não contrato jurídico\./gi, 'o exemplo mostra por que os testes precisam respeitar o escopo autorizado.')
      .replace(/Este trecho é um recorte da fixture da aula; execute o teste completo pelo comando abaixo, a partir da raiz do projeto\. A sintaxe de import acima representa o módulo do diretório de laboratório, e não uma dependência publicada\./gi,
        'O código é apenas um exemplo da lógica do laboratório. Não é preciso instalá-lo ou executá-lo para acompanhar esta aula. Quando uma atividade exigir execução local, ela informará os arquivos e o preparo necessários.')
      .replace(/## Revisão ativa e fontes/g, '## Revisão ativa')
      .replace(/## Limites, extensões e fonte primária/g, '## Limites e extensões');
    if (/^## Revisão ativa\n\s*$/m.test(rendered.trim() + '\n')) continue;
    if (/^## Revisão ativa\s*$/m.test(rendered) && !rendered.split('\n').slice(1).join('').trim()) continue;
    output.push(rendered);
  }
  return output.join('').trimEnd() + '\n';
}
