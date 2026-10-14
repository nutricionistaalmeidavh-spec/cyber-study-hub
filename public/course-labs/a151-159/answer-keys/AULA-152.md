# AULA-152 — gabarito e critérios: Sigma aplicado

**Não consultar antes de concluir a própria investigação.** Compare seus dados com o contrato de `sigmaEventMatch` e com o controle negativo.

### Questão 1

Campos, valores e eventos diferem entre provedores; backend precisa mapear logsource e schema para a consulta real.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 2

selection define critérios de campos; condition combina seleções e filtros com operadores lógicos.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 3

Uma automação autorizada é hipótese benigna específica, não um falso incidente automaticamente.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 4

Ausência impede concluir a condição de autorização; sinalize insufficient_data para não produzir alertas ou permissões sem contexto.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 5

Evento positivo e negativo, dados de origem, versão da regra, frequência, justificativa da exceção e impacto operacional.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 6

Rodar o caso não aprovado ainda produz alert; caso aprovado no_alert; campo faltante permanece insufficient_data.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

## Rubrica de correção (100 pontos)

- **Mecanismo técnico e precisão:** 20 pontos.
- **Reprodução positiva:** 20 pontos.
- **Contraexemplo e interpretação prudente:** 20 pontos.
- **Controle defensivo e reteste:** 20 pontos.
- **Rastreabilidade, limitações e apresentação:** 20 pontos.

**Erro eliminatório:** alegar comprometimento só com um indicador sintético, omitir o negativo ou confundir exercício local com prova sobre ambiente real.

**Fonte:** https://sigmahq.io/docs/basics/rules.html
