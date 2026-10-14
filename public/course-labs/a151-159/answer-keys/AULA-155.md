# AULA-155 — respostas e rubrica de Persistence Detection

**Responda antes da leitura.** O gabarito explica decisões defensivas em material sintético.

### Questão 1

Diff prova mudança de configuração; intenção maliciosa exige contexto, autorização e outras evidências.

**Para validar:** cite entrada, saída da função `diffStartupEntries` e limite da evidência.

### Questão 2

Mesmo nome com digest diferente representa mudança que precisa de explicação.

**Para validar:** cite entrada, saída da função `diffStartupEntries` e limite da evidência.

### Questão 3

Registrar IDs, digests, versão, tempo, origem da captura e controle de integridade.

**Para validar:** cite entrada, saída da função `diffStartupEntries` e limite da evidência.

### Questão 4

Registro startup/B com aprovação específica e verificável não deve ir para reviewIds.

**Para validar:** cite entrada, saída da função `diffStartupEntries` e limite da evidência.

### Questão 5

Criador da tarefa/entrada, assinatura do binário, usuário, changelog e janela de manutenção.

**Para validar:** cite entrada, saída da função `diffStartupEntries` e limite da evidência.

### Questão 6

Testar simultaneamente mudança aprovada ignorada e outra não aprovada mantida na fila.

**Para validar:** cite entrada, saída da função `diffStartupEntries` e limite da evidência.

## Rubrica de correção — 100 pontos

- Domínio do mecanismo e vocabulário técnico: 20 pontos.
- Experimento positivo e previsão confirmada: 20 pontos.
- Controle negativo e falso positivo reconhecido: 20 pontos.
- Mitigação, autorização e reteste: 20 pontos.
- Rastreabilidade, incerteza e relatório: 20 pontos.

**Erro eliminatório:** afirmar incidente malicioso sem contextualização, ignorar falha de sensor ou avaliar só o caso positivo.

**Referência:** https://attack.mitre.org/tactics/TA0003/
