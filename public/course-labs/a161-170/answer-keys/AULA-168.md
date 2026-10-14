# Gabarito de transferência — AULA-168: Stack Canaries — detecção e escopo

**Independentemente do exemplo anterior.** Estas respostas descrevem somente o cenário sintético; nenhum estudante humano foi avaliado.

## Caso de trabalho

Um programa interno grava string C em buffer fixo de 16 bytes. Uma execução com entrada longa aborta por verificação de integridade; outra execução com entrada curta conclui normalmente. A equipe pretende eliminar o alerta desabilitando stack protector para restaurar disponibilidade.

## Respostas comentadas

### Questão 1

**Resposta esperada:** Detectou inconsistência no estado monitorado do frame; não prova exploração remota nem identifica todos os bytes afetados.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 2

**Resposta esperada:** Somente remove alarme/aborto e permite persistência da corrupção.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 3

**Resposta esperada:** Validar capacidade do destino, tamanho da origem, terminador e tipos; rejeitar antes do acesso.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 4

**Resposta esperada:** String válida é aceita e processada; entrada acima do limite é rejeitada sem corrupção/aborto.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 5

**Resposta esperada:** Opções reais do build, versão do compilador, assembly/símbolos que indicam verificações nas funções relevantes.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

### Questão 6

**Resposta esperada:** Canary não monitora toda memória e ausência de detecção não demonstra ausência de bug ou desvio lógico.

**Por quê importa:** a resposta precisa separar observação, autorização, controle primário e risco residual.

## Rubrica — 100 pontos

| Critério | Pontos | Condição |
|---|---:|---|
| Mecanismos e diferenças (Q1–2) | 30 | Mecanismo correto, sem falsa causalidade |
| Correção e evidência (Q3–4) | 30 | Contexto do binário, teste e patch causal |
| Limitações e reteste (Q5–6) | 30 | Caminho válido/negativo e cobertura declarada |
| Método profissional | 10 | Laboratório próprio, sem alegações indevidas |

**Erro eliminatório:** Interpretar a ausência de erro de canary como prova de segurança completa da função.

**Aprovação orientativa:** 80/100 sem erro eliminatório; não há resultado de estudo com alunos.
