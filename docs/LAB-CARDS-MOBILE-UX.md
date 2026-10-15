# Correção da orientação prática — legibilidade e contexto

## Evidência que motivou a alteração
No iPhone, o card de `DEV-IA-004` aparecia quase branco sobre um fundo cinza-transparente e repetia instruções que a própria aula já apresentava. O problema era duplo: falta de contraste (UI) e contradição entre texto genérico e atividade verdadeira (Flow).

## Comportamento aprovado no código
- **Microaula / microaula IA / referência:** a aula apresenta seu próprio conteúdo e exercício; o card adicional não é renderizado.
- **Etapas de laboratório nas duas trilhas:** uma única faixa compacta mostra o ID canônico, a natureza correta da etapa, a entrega definida pela fonte e um link `Ver atividade e arquivos` que salta ao laboratório existente. A aula `DEV-IA-004` recupera o escopo inicial do catálogo específico de laboratórios em vez de recomendar código genérico.
- **Detalhes de laboratório Meu Gestor:** bloco próprio exibe a entrega e o link direto para o recurso. Preparação, teste, evidências e kits opcionais ficam em `details` acessível sob demanda.
- **Aulas principais e paralelas:** `PracticeOrientation` fica recolhido como `details` com resumo legível. Nada do conteúdo, links ou critérios de verificação foi excluído.
- **Visual:** ambas as superfícies usam fundo sólido `#1b1730`, corpo `#f6f0ff` e realce `#e4cbff`, sem dependência de contraste com a página ou tema. Botões têm altura de 44 px, foco visível e empilham em 680px. Conteúdo longo quebra linhas, evitando rolagem horizontal.
- **Nenhuma mutação:** 607 IDs, storage, progresso, avaliação, senha, OAuth, login, Cloudflare, conteúdo de módulos e comandos de laboratório inalterados.

## Validação
O fluxo de CI executa contraste WCAG AA numérico para pares de cores aplicados, asserts de renderização condicional e especificidade, build TypeScript, testes de continuidade e contagem dos 607 IDs. Testes de fonte e CI não equivalem a observação de alunos em dispositivos reais; a aceitação visual ideal requer captura posterior de iPhone nos modos escuro e claro e navegação por teclado.
