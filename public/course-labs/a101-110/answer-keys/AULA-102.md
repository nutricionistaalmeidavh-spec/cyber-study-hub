# Gabarito independente — AULA-102: Ponteiros

> Corrija depois de responder. Os critérios são editoriais e não avaliação real de estudante.

## Referências de resposta

1. **Ponteiro não nulo prova validade?** Não; o objeto pode ter sido liberado ou o ponteiro pode estar fora dos limites.
2. **Qual dado deve acompanhar uma string de bytes arbitrários?** Capacidade/tamanho e contrato de posse/tempo de vida.
3. **Por que o retorno do endereço de local automático é problemático?** O objeto perde sua validade após a função.
4. **Que caso negativo deve falhar?** capacidade=8 e comprimento=9.
5. **Como o reteste não quebra o legítimo?** capacidade=8 e comprimento=8 ainda aceito.
6. **Qual limite resta?** Sem ASan no modelo Python não se detecta comportamento indefinido de C.

## Rubrica de correção

- **6 pontos:** um ponto por resposta específica correta (sem adivinhação pelo título).
- **2 pontos:** caso positivo e negativo com entrada, saída e razão, cada um vale um ponto.
- **1 ponto:** controle correto na causa, não apenas detecção.
- **1 ponto:** evidência reproduzível e limites declarados honestamente.
- **Aprovação sugerida:** ao menos 8/10 e nenhum erro eliminatório.

**Erro eliminatório:** confundir evidência de modelo com execução em Windows/terceiros, omitir caso negativo ou autorizar operação fora do contrato.

**Feedback de recuperação:** refaça o cenário anotando pré-condição, operação, privilégio, efeito permitido e caso legítimo; só então reveja o gabarito.
