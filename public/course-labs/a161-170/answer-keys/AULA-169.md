# Gabarito de transferência — AULA-169: ROP em laboratório educacional — modelos de fluxo

**Independentemente do exemplo anterior.** Estas respostas descrevem somente o cenário sintético; nenhum estudante humano foi avaliado.

## Caso de trabalho

Um serviço próprio compila com páginas de código `r-x` e dados `rw-`, e com CFI aplicado a chamadas indiretas, mas não há evidência de verificação dos retornos. Um relatório diz que 'todo desvio de retorno foi bloqueado pelo CFI' apenas porque a opção de compilação está presente.

## Respostas comentadas

### Questão 1

**Resposta esperada:** Permissão de execução por página, como negar executar instrução em região de dados rw-.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 2

**Resposta esperada:** O código existente já é executável; NX não determina se destino de retorno é válido.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 3

**Resposta esperada:** Se a implementação cobre returns e qual mecanismo (por exemplo shadow stack) protege essas transferências.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 4

**Resposta esperada:** Flags do build, módulos habilitados e trace autorizado mostrando destino normal e rejeição de destino fora de política, se suportado.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 5

**Resposta esperada:** Retorno esperado é permitido; desvio fictício fora da allowlist é rejeitado por simulador ou harness próprio.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 6

**Resposta esperada:** São mitigações de consequência e integridade; causa espacial/temporal ainda exige validação própria.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

## Rubrica — 100 pontos

| Critério | Pontos | Condição |
|---|---:|---|
| Mecanismos e diferenças (Q1–2) | 30 | Mecanismo correto, sem falsa causalidade |
| Correção e evidência (Q3–4) | 30 | Contexto do binário, teste e patch causal |
| Limitações e reteste (Q5–6) | 30 | Caminho válido/negativo e cobertura declarada |
| Método profissional | 10 | Laboratório próprio, sem alegações indevidas |

**Erro eliminatório:** Apresentar grafo ilustrativo ou presença de CFI como demonstração de exploração/bloqueio de ROP em produção.

**Aprovação orientativa:** 80/100 sem erro eliminatório; não há resultado de estudo com alunos.
