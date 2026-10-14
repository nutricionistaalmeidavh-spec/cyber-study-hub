# Gabarito de transferência — AULA-164: Stack Overflow

**Atenção:** exercício independente, sem observação com estudantes reais. Só consulte após elaborar sua tentativa.

## Cenário

Um serviço próprio usa recursão para ler níveis de JSON, aceita profundidade 32 inclusive e rejeita 33. Após revisão, a equipe passa a aceitar 33 porque aumentou tamanho da stack da thread, mas mantém a política documentada em 32.

## Respostas comentadas

### Questão 1

**Resposta esperada:** Limite documentado de profundidade máxima 32.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 2

**Resposta esperada:** 32, inclusive.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 3

**Resposta esperada:** 33.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 4

**Resposta esperada:** Cresce orçamento da thread mas não estabelece limite de recurso ou previsibilidade; entradas maiores continuam possíveis.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 5

**Resposta esperada:** Percurso iterativo com estrutura de dados explicitamente limitada e orçamento de nós/tempo.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 6

**Resposta esperada:** Buffer OOB é violação espacial em objeto específico, diferente de esgotamento total de frames.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

## Rubrica — 100 pontos

| Critério | Pontos | Condição |
|---|---:|---|
| Princípios, objeto e lifetime (Q1–2) | 30 | Causa identificada e distinções corretas |
| Validação e correção causal (Q3–4) | 30 | Controle no lugar certo, sem efeito indevido |
| Casos e limites (Q5–6) | 30 | Positivo, negativo e incertezas |
| Relatório e autorização | 10 | Fixture própria, sem segredos ou alvo externo |

**Erro eliminatório:** Chamar estouro do array local e esgotamento de stack de um único problema com mesma correção.

**Meta orientativa:** 80/100, sem erro eliminatório. Os testes executáveis cobrem apenas os modelos; correção com pessoas não foi realizada.
