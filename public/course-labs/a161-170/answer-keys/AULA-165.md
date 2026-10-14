# Gabarito de transferência — AULA-165: Heap Fundamentals

**Atenção:** exercício independente, sem observação com estudantes reais. Só consulte após elaborar sua tentativa.

## Cenário

Um worker próprio agenda callback que recebe ponteiro para buffer de 16 bytes. O handler principal libera o buffer após enfileirar trabalho. O callback só lê offset zero e verifica se ponteiro é diferente de NULL. Outra proposta cria uma cópia do dado necessário antes de agendar.

## Respostas comentadas

### Questão 1

**Resposta esperada:** O callback pode acessar objeto cuja vida terminou, causando UAF.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 2

**Resposta esperada:** Valor não nulo não demonstra alocação viva nem ausência de alias.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 3

**Resposta esperada:** Transferir ownership com lifetime explícito ou passar cópia dos dados antes de liberar.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 4

**Resposta esperada:** Permanece válida porque não depende do objeto original após free.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 5

**Resposta esperada:** Validar callback com cópia retorna valor correto e negativo com alias expirado é detectado.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 6

**Resposta esperada:** Race entre threads, referências múltiplas, reutilização de endereço, double free e alocador real.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

## Rubrica — 100 pontos

| Critério | Pontos | Condição |
|---|---:|---|
| Princípios, objeto e lifetime (Q1–2) | 30 | Causa identificada e distinções corretas |
| Validação e correção causal (Q3–4) | 30 | Controle no lugar certo, sem efeito indevido |
| Casos e limites (Q5–6) | 30 | Positivo, negativo e incertezas |
| Relatório e autorização | 10 | Fixture própria, sem segredos ou alvo externo |

**Erro eliminatório:** Afirmar que atribuir NULL ao proprietário invalida todos os aliases.

**Meta orientativa:** 80/100, sem erro eliminatório. Os testes executáveis cobrem apenas os modelos; correção com pessoas não foi realizada.
