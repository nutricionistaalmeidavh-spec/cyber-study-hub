# AULA-157 — gabarito individual e rubrica: Suspicious PowerShell

**Correção por evidências.** Cada resposta precisa identificar dados de entrada, saída prevista e limites do experimento.

### Questão 1

É parâmetro legítimo com usos diversos; intenção depende de conteúdo, origem e contexto.

**Reproduza:** verifique na função `assessPowerShellEvent` o contrato que fundamenta essa afirmação.

### Questão 2

Linha de comando descreve invocação; script block logging, se ativado, registra blocos que podem fornecer mais contexto da execução.

**Reproduza:** verifique na função `assessPowerShellEvent` o contrato que fundamenta essa afirmação.

### Questão 3

Aprovação específica e verificável documenta hipótese benigna; não é whitelist ilimitada.

**Reproduza:** verifique na função `assessPowerShellEvent` o contrato que fundamenta essa afirmação.

### Questão 4

Sem fonte confiável não há cobertura suficiente para descartar atividade ou afirmar comportamento.

**Reproduza:** verifique na função `assessPowerShellEvent` o contrato que fundamenta essa afirmação.

### Questão 5

Ancestralidade, usuário, horários, logs existentes, script block, assinatura e autorização documentada.

**Reproduza:** verifique na função `assessPowerShellEvent` o contrato que fundamenta essa afirmação.

### Questão 6

Caso codificado não aprovado pede review, aprovado é no_alert, -NoProfile é no_alert e fonte offline é insufficient_data.

**Reproduza:** verifique na função `assessPowerShellEvent` o contrato que fundamenta essa afirmação.

## Rubrica de correção (100 pontos)

- Conceito e mecanismo técnico: 20 pontos.
- Fixture positiva e justificativa: 20 pontos.
- Negativo e falso positivo plausível: 20 pontos.
- Defesa, monitoramento e reteste: 20 pontos.
- Fontes, dados ausentes e limites da inferência: 20 pontos.

**Erro eliminatório:** concluir comprometimento apenas por indicador, executar atividade em sistema de terceiro ou apresentar a simulação como teste de produto real.

Fonte: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows
