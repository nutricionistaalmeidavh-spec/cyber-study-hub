# AULA-158 — gabarito individual e rubrica: Process Injection Detection

**Correção por evidências.** Cada resposta precisa identificar dados de entrada, saída prevista e limites do experimento.

### Questão 1

Sem vínculo ao mesmo processo os eventos podem ser operações independentes; correlação reduz interpretação indevida.

**Reproduza:** verifique na função `assessInjectionEvidence` o contrato que fundamenta essa afirmação.

### Questão 2

Ferramenta de depuração ou endpoint security autorizada pode operar de modo parecido.

**Reproduza:** verifique na função `assessInjectionEvidence` o contrato que fundamenta essa afirmação.

### Questão 3

Falta uma pré-condição da cadeia didática; classificar insufficient_chain, não concluir por força do nome.

**Reproduza:** verifique na função `assessInjectionEvidence` o contrato que fundamenta essa afirmação.

### Questão 4

Sinais justificam investigar; sucesso da técnica exigiria provas adicionais de origem, execução e efeito.

**Reproduza:** verifique na função `assessInjectionEvidence` o contrato que fundamenta essa afirmação.

### Questão 5

IDs de origem/destino, tempo, processGuid, usuário, assinatura, fonte do sensor e autorização.

**Reproduza:** verifique na função `assessInjectionEvidence` o contrato que fundamenta essa afirmação.

### Questão 6

Positivo não aprovado investiga; ferramenta aprovada não alerta; sinal incompleto não forma cadeia; sensor falho é inconclusivo.

**Reproduza:** verifique na função `assessInjectionEvidence` o contrato que fundamenta essa afirmação.

## Rubrica de correção (100 pontos)

- Conceito e mecanismo técnico: 20 pontos.
- Fixture positiva e justificativa: 20 pontos.
- Negativo e falso positivo plausível: 20 pontos.
- Defesa, monitoramento e reteste: 20 pontos.
- Fontes, dados ausentes e limites da inferência: 20 pontos.

**Erro eliminatório:** concluir comprometimento apenas por indicador, executar atividade em sistema de terceiro ou apresentar a simulação como teste de produto real.

Fonte: https://attack.mitre.org/techniques/T1055/
