# Gabarito de transferência — AULA-170: Exploit Mitigations — capstone de engenharia defensiva

**Independentemente do exemplo anterior.** Estas respostas descrevem somente o cenário sintético; nenhum estudante humano foi avaliado.

## Caso de trabalho

Uma biblioteca interna usa buffer de 24 bytes para texto C. O novo build habilita PIE, NX e stack protector, mas mantém n=24 como comprimento aceito e faz `dst[n]='\0'`. A equipe recebe um relatório verde do scanner de dependências e deseja encerrar o incidente.

## Respostas comentadas

### Questão 1

**Resposta esperada:** Com n=24 o byte NUL tenta dst[24], fora do intervalo 0–23.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 2

**Resposta esperada:** Protegem classes diferentes e scanner pode não executar caso de índice; bug permanece.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 3

**Resposta esperada:** Validar origem real, capacidade positiva e n<cap; rejeitar antes de copiar; usar tipos/cheques corretos.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 4

**Resposta esperada:** n=23 com 23 bytes de origem deve aceitar e terminar; n=24 deve rejeitar sem dano; manter caso válido.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 5

**Resposta esperada:** Flags da toolchain, ELF/PE resultante, suporte do SO/CPU, build ID, páginas efetivas e cobertura da instrumentação.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 6

**Resposta esperada:** Não liberar antes de prova de correção causal e regressão positiva/negativa; registrar mitigadores confirmados como defesa em profundidade, com riscos residuais.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

## Rubrica — 100 pontos

| Critério | Pontos | Condição |
|---|---:|---|
| Mecanismos e diferenças (Q1–2) | 30 | Mecanismo correto, sem falsa causalidade |
| Correção e evidência (Q3–4) | 30 | Contexto do binário, teste e patch causal |
| Limitações e reteste (Q5–6) | 30 | Caminho válido/negativo e cobertura declarada |
| Método profissional | 10 | Laboratório próprio, sem alegações indevidas |

**Erro eliminatório:** Liberar como 'corrigido' um parser que ainda grava fora dos limites apenas por ter vários mitigadores ativados.

**Aprovação orientativa:** 80/100 sem erro eliminatório; não há resultado de estudo com alunos.
