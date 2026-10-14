# Gabarito independente — AULA-103: Stack e Heap

> Corrija depois de responder. Os critérios são editoriais e não avaliação real de estudante.

## Referências de resposta

1. **Por que retornar `&local` é inseguro?** Lifetime de local automático acaba no retorno.
2. **Quem libera um objeto malloc?** O proprietário documentado, exatamente uma vez.
3. **O que fazer ao falhar malloc?** Propagar erro e não desreferenciar NULL.
4. **Que anomalia aparece sem cleanup no erro?** Vazamento de recurso.
5. **Qual evidência negativa prova a guarda?** Falha simulada não incrementa uso/liberação indevida.
6. **Qual etapa adicional encontra erros de memória nativos?** Compilar o próprio código com AddressSanitizer onde suportado.

## Rubrica de correção

- **6 pontos:** um ponto por resposta específica correta (sem adivinhação pelo título).
- **2 pontos:** caso positivo e negativo com entrada, saída e razão, cada um vale um ponto.
- **1 ponto:** controle correto na causa, não apenas detecção.
- **1 ponto:** evidência reproduzível e limites declarados honestamente.
- **Aprovação sugerida:** ao menos 8/10 e nenhum erro eliminatório.

**Erro eliminatório:** confundir evidência de modelo com execução em Windows/terceiros, omitir caso negativo ou autorizar operação fora do contrato.

**Feedback de recuperação:** refaça o cenário anotando pré-condição, operação, privilégio, efeito permitido e caso legítimo; só então reveja o gabarito.
