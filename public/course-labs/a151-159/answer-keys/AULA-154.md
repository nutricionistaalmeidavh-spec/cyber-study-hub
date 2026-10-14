# AULA-154 — respostas e rubrica de MITRE Mapping

**Responda antes da leitura.** O gabarito explica decisões defensivas em material sintético.

### Questão 1

Tática descreve objetivo; técnica, um tipo observável de comportamento ou método.

**Para validar:** cite entrada, saída da função `mapMitreEvidence` e limite da evidência.

### Questão 2

Criação de tarefa com fonte task_audit sustenta técnica candidata; intenção e atribuição permanecem desconhecidas.

**Para validar:** cite entrada, saída da função `mapMitreEvidence` e limite da evidência.

### Questão 3

Atualizações, backup e manutenção criam tarefas autorizadas; investigar identidade e contexto.

**Para validar:** cite entrada, saída da função `mapMitreEvidence` e limite da evidência.

### Questão 4

Não há evidência da origem dos dados, portanto retornar insufficient_data.

**Para validar:** cite entrada, saída da função `mapMitreEvidence` e limite da evidência.

### Questão 5

Guardar versão da matriz, data, plataforma, ID, evidência e histórico da revisão.

**Para validar:** cite entrada, saída da função `mapMitreEvidence` e limite da evidência.

### Questão 6

O caso de criação retorna a técnica; login não mapeia e origem ausente é insuficiente.

**Para validar:** cite entrada, saída da função `mapMitreEvidence` e limite da evidência.

## Rubrica de correção — 100 pontos

- Domínio do mecanismo e vocabulário técnico: 20 pontos.
- Experimento positivo e previsão confirmada: 20 pontos.
- Controle negativo e falso positivo reconhecido: 20 pontos.
- Mitigação, autorização e reteste: 20 pontos.
- Rastreabilidade, incerteza e relatório: 20 pontos.

**Erro eliminatório:** afirmar incidente malicioso sem contextualização, ignorar falha de sensor ou avaliar só o caso positivo.

**Referência:** https://attack.mitre.org/techniques/T1053/005/
