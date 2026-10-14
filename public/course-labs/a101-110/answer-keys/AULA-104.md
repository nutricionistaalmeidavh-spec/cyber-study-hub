# Gabarito independente — AULA-104: Memória Virtual

> Corrija depois de responder. Os critérios são editoriais e não avaliação real de estudante.

## Referências de resposta

1. **Por que endereço numérico não é prova de acesso?** A tradução e a proteção do mapeamento podem negar a operação.
2. **O que diferencia reservar de proteger memória?** Reserva de faixa não concede automaticamente páginas presentes nem direitos de acesso.
3. **O que significa W^X?** Evitar a mesma região gravável e executável ao mesmo tempo como política mitigadora.
4. **Qual operação legítima deve continuar?** Ler 0x1100 em região R.
5. **Qual operação deve ser negada?** Escrever em 0x1100 ou ler fora da região.
6. **Qual dado pediria em investigação real?** Mapa de regiões, processo e direitos com ferramentas autorizadas.

## Rubrica de correção

- **6 pontos:** um ponto por resposta específica correta (sem adivinhação pelo título).
- **2 pontos:** caso positivo e negativo com entrada, saída e razão, cada um vale um ponto.
- **1 ponto:** controle correto na causa, não apenas detecção.
- **1 ponto:** evidência reproduzível e limites declarados honestamente.
- **Aprovação sugerida:** ao menos 8/10 e nenhum erro eliminatório.

**Erro eliminatório:** confundir evidência de modelo com execução em Windows/terceiros, omitir caso negativo ou autorizar operação fora do contrato.

**Feedback de recuperação:** refaça o cenário anotando pré-condição, operação, privilégio, efeito permitido e caso legítimo; só então reveja o gabarito.
