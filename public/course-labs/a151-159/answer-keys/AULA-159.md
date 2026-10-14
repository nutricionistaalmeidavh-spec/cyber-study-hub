# AULA-159 — gabarito individual e rubrica: SIEM Correlation

**Correção por evidências.** Cada resposta precisa identificar dados de entrada, saída prevista e limites do experimento.

### Questão 1

Eventos de instâncias distintas podem ser independentes; é necessária identidade comum e sequência.

**Reproduza:** verifique na função `correlateSiemTimeline` o contrato que fundamenta essa afirmação.

### Questão 2

Janela curta pode perder ações lentas; larga aumenta associações incidentais e falso positivo.

**Reproduza:** verifique na função `correlateSiemTimeline` o contrato que fundamenta essa afirmação.

### Questão 3

GUID estabelece vínculo estável e ordem mostra sequência, embora ainda não comprove causalidade.

**Reproduza:** verifique na função `correlateSiemTimeline` o contrato que fundamenta essa afirmação.

### Questão 4

Horário de recepção difere do horário do evento; sincronização e escolha do campo temporal importam.

**Reproduza:** verifique na função `correlateSiemTimeline` o contrato que fundamenta essa afirmação.

### Questão 5

Usuário, histórico, mudança aprovada, processo criador e assinatura da tarefa.

**Reproduza:** verifique na função `correlateSiemTimeline` o contrato que fundamenta essa afirmação.

### Questão 6

Mesma identidade e janela deve correlacionar, GUID distinto e evento tardio não devem formar cadeia.

**Reproduza:** verifique na função `correlateSiemTimeline` o contrato que fundamenta essa afirmação.

## Rubrica de correção (100 pontos)

- Conceito e mecanismo técnico: 20 pontos.
- Fixture positiva e justificativa: 20 pontos.
- Negativo e falso positivo plausível: 20 pontos.
- Defesa, monitoramento e reteste: 20 pontos.
- Fontes, dados ausentes e limites da inferência: 20 pontos.

**Erro eliminatório:** concluir comprometimento apenas por indicador, executar atividade em sistema de terceiro ou apresentar a simulação como teste de produto real.

Fonte: https://sigmahq.io/docs/basics/rules.html
