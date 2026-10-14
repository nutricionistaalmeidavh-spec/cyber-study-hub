# Gabarito independente — AULA-091: Arquitetura de antivírus

**Avaliar evidência, não só terminologia.** Use `classifyObject` e os dois casos contrários.

## Questão 1

Ausência é unknown: falta evidência; bad é associação positiva à fonte indicada.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 2

A política dá prioridade a indicador confirmado, com fonte rastreável.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 3

Exigir ação de isolamento registrada e confirmação do estado, ligada à identidade do objeto.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 4

Ausência de sensor aumenta incerteza: degraded, não clean.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 5

Aplicar verificação de proveniência e monitoramento, com revisão se surgirem sinais adicionais.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 6

Confirmar block para knownBad, allow_monitor para desconhecido baixo e degraded para sensor fora.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Rubrica de correção (100 pontos)

- Conceito e mecanismo específico: 20 pontos.
- Caso positivo com dados, saída e interpretação: 20 pontos.
- Caso negativo com hipótese alternativa: 20 pontos.
- Defesa/controle principal e reteste reprodutível: 20 pontos.
- Limites, cobertura e documentação de evidências: 20 pontos.

**Erro eliminatório:** declarar atividade maliciosa comprovada sem evidências, omitir controle negativo ou confundir o modelo local com validação real. A nota editorial não é nota de aprendiz.

Referência: https://learn.microsoft.com/en-us/defender-endpoint/microsoft-defender-antivirus-windows
