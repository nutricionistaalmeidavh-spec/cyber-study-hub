# Gabarito de transferência — AULA-163: Debugger e Crash Analysis

**Atenção:** exercício independente, sem observação com estudantes reais. Só consulte após elaborar sua tentativa.

## Cenário

Uma equipe reproduz duas falhas. A apresenta `heap-use-after-free READ of size 4`, referência a arquivo próprio e sequência de liberação. B encerra com código 139, sem core nem log. Um gerente quer rotular ambas 'execução arbitrária confirmada'.

## Respostas comentadas

### Questão 1

**Resposta esperada:** Acesso temporal após free; leitura de 4 bytes de objeto heap liberado.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 2

**Resposta esperada:** Stack de alocação, liberação e leitura sinalizadas no mesmo relatório, mais input da reprodução.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 3

**Resposta esperada:** Indica encerramento por sinal em ambiente possível, mas não classe, frame, causa ou impacto.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 4

**Resposta esperada:** Input mínimo, stderr, build/símbolos e sanitizer/debugger em processo próprio autorizado.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 5

**Resposta esperada:** Negativo: alias não lê após liberar; positivo: dado é copiado enquanto objeto vivo e operação conserva saída.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 6

**Resposta esperada:** Há UAF reproduzido em fixture no trajeto executado; exploração e impacto permanecem não estabelecidos.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

## Rubrica — 100 pontos

| Critério | Pontos | Condição |
|---|---:|---|
| Princípios, objeto e lifetime (Q1–2) | 30 | Causa identificada e distinções corretas |
| Validação e correção causal (Q3–4) | 30 | Controle no lugar certo, sem efeito indevido |
| Casos e limites (Q5–6) | 30 | Positivo, negativo e incertezas |
| Relatório e autorização | 10 | Fixture própria, sem segredos ou alvo externo |

**Erro eliminatório:** Declarar RCE comprovada somente pelo crash ou log de sanitizer.

**Meta orientativa:** 80/100, sem erro eliminatório. Os testes executáveis cobrem apenas os modelos; correção com pessoas não foi realizada.
