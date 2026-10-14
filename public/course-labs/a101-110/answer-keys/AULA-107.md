# Gabarito independente — AULA-107: DLLs

> Corrija depois de responder. Os critérios são editoriais e não avaliação real de estudante.

## Referências de resposta

1. **Por que `LoadLibrary("helper.dll")` pode ser ambíguo?** O loader pode buscar em locais distintos conforme contexto e flags.
2. **O que limita risco de preload?** Usar diretórios confiáveis e caminho absoluto com política de busca apropriada.
3. **Por que verificar dependências?** Elas possuem seu próprio processo de resolução pelo loader.
4. **Qual acesso é permitido no lab?** DLL de caminho absoluto presente na allowlist.
5. **Qual acesso deve falhar?** Caminho relativo não mapeado ou diretório público não confiável.
6. **Qual conclusão não se pode tirar do modelo?** Que o loader real do Windows foi testado ou está protegido.

## Rubrica de correção

- **6 pontos:** um ponto por resposta específica correta (sem adivinhação pelo título).
- **2 pontos:** caso positivo e negativo com entrada, saída e razão, cada um vale um ponto.
- **1 ponto:** controle correto na causa, não apenas detecção.
- **1 ponto:** evidência reproduzível e limites declarados honestamente.
- **Aprovação sugerida:** ao menos 8/10 e nenhum erro eliminatório.

**Erro eliminatório:** confundir evidência de modelo com execução em Windows/terceiros, omitir caso negativo ou autorizar operação fora do contrato.

**Feedback de recuperação:** refaça o cenário anotando pré-condição, operação, privilégio, efeito permitido e caso legítimo; só então reveja o gabarito.
