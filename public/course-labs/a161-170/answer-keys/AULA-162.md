# Gabarito de transferência — AULA-162: Buffer Overflow

**Atenção:** exercício independente, sem observação com estudantes reais. Só consulte após elaborar sua tentativa.

## Cenário

Um endpoint interno recebe campo `desc`, com buffer fixo de 12 bytes e protocolo de string terminada. O pacote A declara 11 e entrega 11 bytes; B declara 12 e entrega 12; C declara 11 e entrega 9.

## Respostas comentadas

### Questão 1

**Resposta esperada:** A (n=11, cap=12, origem 11) cabe com NUL.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 2

**Resposta esperada:** Doze bytes de conteúdo ocupam toda a capacidade, sem espaço para terminador.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 3

**Resposta esperada:** O comprimento declarado ultrapassa os bytes realmente disponíveis na origem.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 4

**Resposta esperada:** Checar ponteiros, cap>0, n<cap e n<=lenReal, além de validar cabeçalho e tipos.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 5

**Resposta esperada:** A passa sem truncamento; B e C são rejeitados sem falhar/crash; o endpoint saudável continua operando.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 6

**Resposta esperada:** Em parâmetro, array ajusta-se para ponteiro e sizeof mede ponteiro, não buffer original.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

## Rubrica — 100 pontos

| Critério | Pontos | Condição |
|---|---:|---|
| Princípios, objeto e lifetime (Q1–2) | 30 | Causa identificada e distinções corretas |
| Validação e correção causal (Q3–4) | 30 | Controle no lugar certo, sem efeito indevido |
| Casos e limites (Q5–6) | 30 | Positivo, negativo e incertezas |
| Relatório e autorização | 10 | Fixture própria, sem segredos ou alvo externo |

**Erro eliminatório:** Alterar o teste para aceitar n==cap sem prever byte NUL.

**Meta orientativa:** 80/100, sem erro eliminatório. Os testes executáveis cobrem apenas os modelos; correção com pessoas não foi realizada.
