# Gabarito independente — AULA-105: Processes e Threads

> Corrija depois de responder. Os critérios são editoriais e não avaliação real de estudante.

## Referências de resposta

1. **Threads de um processo compartilham o quê?** Em geral espaço de endereçamento do processo, enquanto cada thread tem pilha/estado próprios.
2. **Por que PID e TID importam em telemetria?** Identificam processo e execução; não bastam para provar ato malicioso.
3. **O que o lock protege?** Transição do contador compartilhado contra atualização concorrente não coordenada.
4. **Qual evidência do caso positivo?** 200 operações contabilizadas.
5. **Qual teste negativo não depende de race aleatória?** Tentar execução sem role e verificar contador inalterado.
6. **Qual limite da prova em Python?** Não certifica comportamento de sincronização em C/Windows.

## Rubrica de correção

- **6 pontos:** um ponto por resposta específica correta (sem adivinhação pelo título).
- **2 pontos:** caso positivo e negativo com entrada, saída e razão, cada um vale um ponto.
- **1 ponto:** controle correto na causa, não apenas detecção.
- **1 ponto:** evidência reproduzível e limites declarados honestamente.
- **Aprovação sugerida:** ao menos 8/10 e nenhum erro eliminatório.

**Erro eliminatório:** confundir evidência de modelo com execução em Windows/terceiros, omitir caso negativo ou autorizar operação fora do contrato.

**Feedback de recuperação:** refaça o cenário anotando pré-condição, operação, privilégio, efeito permitido e caso legítimo; só então reveja o gabarito.
