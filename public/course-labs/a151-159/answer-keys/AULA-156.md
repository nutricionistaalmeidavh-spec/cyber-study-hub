# AULA-156 — respostas e rubrica de Suspicious Execution

**Responda antes da leitura.** O gabarito explica decisões defensivas em material sintético.

### Questão 1

Um editor de documento iniciando interpretador tem uso possível, mas exige contexto que não vem apenas do nome.

**Para validar:** cite entrada, saída da função `assessExecution` e limite da evidência.

### Questão 2

Integrações e macros autorizadas também podem criar executores.

**Para validar:** cite entrada, saída da função `assessExecution` e limite da evidência.

### Questão 3

Conferir sistema de mudanças e escopo por máquina/usuário/tempo, sem confiar cegamente no campo livre.

**Para validar:** cite entrada, saída da função `assessExecution` e limite da evidência.

### Questão 4

Falha de sensor pode esconder atividade; resultado correto é insufficient_data.

**Para validar:** cite entrada, saída da função `assessExecution` e limite da evidência.

### Questão 5

Linha de comando, origem da automação, assinatura, usuário e sequência de eventos de processo.

**Para validar:** cite entrada, saída da função `assessExecution` e limite da evidência.

### Questão 6

Não aprovado saudável → review, aprovado → no_alert e sensor indisponível → insufficient_data.

**Para validar:** cite entrada, saída da função `assessExecution` e limite da evidência.

## Rubrica de correção — 100 pontos

- Domínio do mecanismo e vocabulário técnico: 20 pontos.
- Experimento positivo e previsão confirmada: 20 pontos.
- Controle negativo e falso positivo reconhecido: 20 pontos.
- Mitigação, autorização e reteste: 20 pontos.
- Rastreabilidade, incerteza e relatório: 20 pontos.

**Erro eliminatório:** afirmar incidente malicioso sem contextualização, ignorar falha de sensor ou avaliar só o caso positivo.

**Referência:** https://attack.mitre.org/datasources/DS0009/
