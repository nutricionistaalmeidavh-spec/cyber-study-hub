# Gabarito de transferência — AULA-167: DEP / NX — permissões de execução

**Independentemente do exemplo anterior.** Estas respostas descrevem somente o cenário sintético; nenhum estudante humano foi avaliado.

## Caso de trabalho

Em um programa próprio, uma biblioteca permite página `rwx` para gerar código em memória, enquanto o parser de rede continua aceitando índices além do array. O time ativa NX no restante das páginas e informa 'vulnerabilidade de buffer corrigida'.

## Respostas comentadas

### Questão 1

**Resposta esperada:** Permissão simultânea de escrita e execução na mesma região, contra W^X como política.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 2

**Resposta esperada:** NX pode impedir execução em páginas não executáveis, mas não valida índices nem elimina corrupção de dados.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 3

**Resposta esperada:** Alternar fases de escrita/execução com permissões distintas, quando suportado, monitorando necessidade e mantendo política mínima.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 4

**Resposta esperada:** Mapas efetivos e flags de páginas do processo próprio, arquitetura e política OS; metadados ELF não bastam.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 5

**Resposta esperada:** Entrada inválida não provoca OOB; entrada válida é processada; testes de execução de código legítimo são separados.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 6

**Resposta esperada:** É uma condição de configuração; sem fluxo, dados e efeito observados não há prova de abuso.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

## Rubrica — 100 pontos

| Critério | Pontos | Condição |
|---|---:|---|
| Mecanismos e diferenças (Q1–2) | 30 | Mecanismo correto, sem falsa causalidade |
| Correção e evidência (Q3–4) | 30 | Contexto do binário, teste e patch causal |
| Limitações e reteste (Q5–6) | 30 | Caminho válido/negativo e cobertura declarada |
| Método profissional | 10 | Laboratório próprio, sem alegações indevidas |

**Erro eliminatório:** Declarar que habilitar NX corrigiu uma escrita fora dos limites sem alterar verificação de índices.

**Aprovação orientativa:** 80/100 sem erro eliminatório; não há resultado de estudo com alunos.
