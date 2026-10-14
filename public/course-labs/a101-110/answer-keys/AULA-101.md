# Gabarito independente — AULA-101: C aplicado à Segurança

> Corrija depois de responder. Os critérios são editoriais e não avaliação real de estudante.

## Referências de resposta

1. **Como justificar 260 → 4 sem tratar isto como overflow signed?** Conversão para uint8_t é módulo 256; 260 mod 256 = 4, diferente de signed overflow.
2. **Qual fronteira exige verificação de tamanho?** Antes do cast, reserva e cópia, no tipo suficientemente amplo.
3. **Por que sizeof de um ponteiro não mede a memória apontada?** sizeof(char*) mede representação do ponteiro, não capacidade alocada.
4. **O que o teste com 4 demonstra?** Caminho legítimo preservado com saída aceito:4.
5. **Qual resultado reprova o controle com 260?** Aceitar 260 como 4 ou efetuar cópia seria falha.
6. **Como documentar o que não foi verificado?** Mencionar Linux/GCC e ausência de teste de sistemas externos.

## Rubrica de correção

- **6 pontos:** um ponto por resposta específica correta (sem adivinhação pelo título).
- **2 pontos:** caso positivo e negativo com entrada, saída e razão, cada um vale um ponto.
- **1 ponto:** controle correto na causa, não apenas detecção.
- **1 ponto:** evidência reproduzível e limites declarados honestamente.
- **Aprovação sugerida:** ao menos 8/10 e nenhum erro eliminatório.

**Erro eliminatório:** confundir evidência de modelo com execução em Windows/terceiros, omitir caso negativo ou autorizar operação fora do contrato.

**Feedback de recuperação:** refaça o cenário anotando pré-condição, operação, privilégio, efeito permitido e caso legítimo; só então reveja o gabarito.
