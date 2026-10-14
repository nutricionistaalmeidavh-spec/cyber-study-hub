# AULA-153 — gabarito e critérios: Detection Rules

**Não consultar antes de concluir a própria investigação.** Compare seus dados com o contrato de `assessDetectionRule` e com o controle negativo.

### Questão 1

Hipótese, fonte, schema, condição, exceção, resposta, proprietário, versão e testes.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 2

Se dataComplete=false, a regra não observou todas as condições; retornar insufficient_data.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 3

Por registro formal de mudança, identidade, escopo e validade; não confiar cegamente em texto de evento manipulado.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 4

A regra alerta/revisa atividade; gestão de permissões e política de inicialização atuam na causa.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 5

FP é atualização legítima sem registro de aprovação; FN é alteração não registrada por sensor deficiente.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 6

Mudança não aprovada → review; mudança aprovada → no_alert; evento incompleto → insufficient_data.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

## Rubrica de correção (100 pontos)

- **Mecanismo técnico e precisão:** 20 pontos.
- **Reprodução positiva:** 20 pontos.
- **Contraexemplo e interpretação prudente:** 20 pontos.
- **Controle defensivo e reteste:** 20 pontos.
- **Rastreabilidade, limitações e apresentação:** 20 pontos.

**Erro eliminatório:** alegar comprometimento só com um indicador sintético, omitir o negativo ou confundir exercício local com prova sobre ambiente real.

**Fonte:** https://sigmahq.io/docs/basics/rules.html
