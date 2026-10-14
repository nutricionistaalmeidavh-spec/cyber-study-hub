# Gabarito independente — AULA-108: Formato PE

> Corrija depois de responder. Os critérios são editoriais e não avaliação real de estudante.

## Referências de resposta

1. **Para que serve e_lfanew?** Aponta ao offset no arquivo onde se espera PE\0\0.
2. **O que é RVA?** Endereço relativo à base carregada, diferente de file offset.
3. **O que precede a tabela de seções?** Cabeçalho COFF e optional header de tamanho informado.
4. **Qual evidência de aceitação?** Uma seção com Machine=0x8664 no fixture sintético.
5. **Qual caso negativo?** e_lfanew apontando além do tamanho ou falta de assinatura PE.
6. **Por que MZ isolado não basta?** Não comprova estruturas PE posteriores válidas.

## Rubrica de correção

- **6 pontos:** um ponto por resposta específica correta (sem adivinhação pelo título).
- **2 pontos:** caso positivo e negativo com entrada, saída e razão, cada um vale um ponto.
- **1 ponto:** controle correto na causa, não apenas detecção.
- **1 ponto:** evidência reproduzível e limites declarados honestamente.
- **Aprovação sugerida:** ao menos 8/10 e nenhum erro eliminatório.

**Erro eliminatório:** confundir evidência de modelo com execução em Windows/terceiros, omitir caso negativo ou autorizar operação fora do contrato.

**Feedback de recuperação:** refaça o cenário anotando pré-condição, operação, privilégio, efeito permitido e caso legítimo; só então reveja o gabarito.
