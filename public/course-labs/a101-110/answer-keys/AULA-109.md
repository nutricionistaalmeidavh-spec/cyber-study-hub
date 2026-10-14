# Gabarito independente — AULA-109: User Mode vs Kernel Mode

> Corrija depois de responder. Os critérios são editoriais e não avaliação real de estudante.

## Referências de resposta

1. **Quem precisa validar uma solicitação privilegiada?** A rotina no limite privilegiado, sem confiar em ponteiros/length do usuário.
2. **O que uma syscall não prova?** Autorização de leitura/escrita de qualquer recurso.
3. **Que risco existe em comprimento não validado?** Cópia além do objeto / memória corrompida ou falha.
4. **Qual operação positiva?** READ de oito bytes autorizado.
5. **Qual negativa?** WRITE sem permissão ou tamanho maior que o buffer.
6. **Por que não rodar driver no laboratório?** Objetivo é modelar contrato sem risco ao host ou terceiro.

## Rubrica de correção

- **6 pontos:** um ponto por resposta específica correta (sem adivinhação pelo título).
- **2 pontos:** caso positivo e negativo com entrada, saída e razão, cada um vale um ponto.
- **1 ponto:** controle correto na causa, não apenas detecção.
- **1 ponto:** evidência reproduzível e limites declarados honestamente.
- **Aprovação sugerida:** ao menos 8/10 e nenhum erro eliminatório.

**Erro eliminatório:** confundir evidência de modelo com execução em Windows/terceiros, omitir caso negativo ou autorizar operação fora do contrato.

**Feedback de recuperação:** refaça o cenário anotando pré-condição, operação, privilégio, efeito permitido e caso legítimo; só então reveja o gabarito.
