# Engenharia Reversa com IA — Dossiê local reproduzível
**Core obrigatório R$ 0 · self-hosted · sem credenciais, serviços pagos ou rede.**
Arquivos executáveis: `reference.mjs` (programa próprio sob observação), `candidate.mjs` (reimplementação independente), `lab.mjs` (8 matrizes de entrada/saída), `lab.test.mjs` (testes diferenciais) e `sample.c` (binário C opcional).

## Comece pelo comportamento
1. Não abra `reference.mjs` antes da primeira previsão: primeiro trate o programa como caixa-preta.
2. Execute `node public/course-labs/reverse-ai/lab.mjs --module 1`. Anote entrada, previsão, saída observada e controle negativo. Repita com 2..8.
3. Execute `node --test public/course-labs/reverse-ai/lab.test.mjs` e explique o caso limite 21/22.
4. Compare e altere `candidate.mjs` num clone do projeto. Refaça todos os testes e registre divergências.
5. O arquivo `sample.c` pode ser compilado com `cc -O0 -g -Wall -Wextra -Werror sample.c -o sample` no diretório do laboratório (opcional), e analisado no Ghidra open source. O código C é seu fixture, não um binário desconhecido.

## Agente REA (opcional, não necessário para conclusão)
Fonte e licença: https://github.com/morluto/rea (consulte requisitos de plataforma e integrações).
O setup `npx rea-agents setup` instala/configura componentes; **revise mudanças antes de aprovar**. Não configure API paga. Se quiser assistência de IA, use apenas modelo local auto-hospedado que seu hardware suporta. Ghidra pode ser usado sem agente. REA não recupera o fonte original nem garante cópia perfeita.

## Controles
Sem imagens, dados, licença ou programa proprietário de terceiros. Não realizar bypass de DRM, anti-cheat, ativação ou licenças. Os oito módulos têm provas e gabaritos separados. Este runner é uma oficina controlada, não prova de segurança nem execução real do REA/Ghidra.
