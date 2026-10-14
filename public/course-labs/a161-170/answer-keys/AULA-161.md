# Gabarito de transferência — AULA-161: Memory Corruption

**Atenção:** exercício independente, sem observação com estudantes reais. Só consulte após elaborar sua tentativa.

## Cenário

Uma biblioteca própria contém um buffer de 16 bytes e precisa ler 5 bytes iniciando no índice 12. Outro consumidor guarda alias do mesmo buffer depois de o proprietário liberar. O time propõe apenas substituir `offset < len` por `offset <= len`.

## Respostas comentadas

### Questão 1

**Resposta esperada:** Leitura de índices 12 a 16; índice 16 já fica fora do objeto de comprimento 16.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 2

**Resposta esperada:** Ele ignora width e ainda admite índice igual a len; a condição correta deve incluir extensão inteira.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 3

**Resposta esperada:** Checar offset<=capacity e width<=capacity-offset com valores não negativos.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 4

**Resposta esperada:** O objeto já terminou lifetime, independentemente do offset do alias.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 5

**Resposta esperada:** Ler bytes 11–15 com objeto vivo deve passar; ler 12–16 ou depois de free deve ser recusado.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

### Questão 6

**Resposta esperada:** Evidencia acesso inválido no caminho testado; não prova exploitability ou severidade universal.

**Critério de correção:** explicar o vínculo entre estado, operação, efeito e contraexemplo sem extrapolar a evidência.

## Rubrica — 100 pontos

| Critério | Pontos | Condição |
|---|---:|---|
| Princípios, objeto e lifetime (Q1–2) | 30 | Causa identificada e distinções corretas |
| Validação e correção causal (Q3–4) | 30 | Controle no lugar certo, sem efeito indevido |
| Casos e limites (Q5–6) | 30 | Positivo, negativo e incertezas |
| Relatório e autorização | 10 | Fixture própria, sem segredos ou alvo externo |

**Erro eliminatório:** Confundir um OOB ou UAF demonstrado com exploração remota comprovada.

**Meta orientativa:** 80/100, sem erro eliminatório. Os testes executáveis cobrem apenas os modelos; correção com pessoas não foi realizada.
