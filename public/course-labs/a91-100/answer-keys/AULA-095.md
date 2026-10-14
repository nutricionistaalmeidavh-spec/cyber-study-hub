# Gabarito independente — AULA-095: Sandboxing

**Avaliar evidência, não só terminologia.** Use `sandboxReadiness` e os dois casos contrários.

## Questão 1

Snapshot restaura estado local, isolamento limita alcance durante execução.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 2

Uma conexão pode atingir ativos reais e produzir efeitos que rollback não desfaz.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 3

Confirmar integridade do sensor, relógio e fontes coletadas.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 4

Antes de reverter estado, com hashes e identificação da execução.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 5

Comportamento conhecido permite avaliar instrumentos sem exposição desnecessária.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 6

snapshot=false e networkMode=bridged devem produzir not_ready.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Rubrica de correção (100 pontos)

- Conceito e mecanismo específico: 20 pontos.
- Caso positivo com dados, saída e interpretação: 20 pontos.
- Caso negativo com hipótese alternativa: 20 pontos.
- Defesa/controle principal e reteste reprodutível: 20 pontos.
- Limites, cobertura e documentação de evidências: 20 pontos.

**Erro eliminatório:** declarar atividade maliciosa comprovada sem evidências, omitir controle negativo ou confundir o modelo local com validação real. A nota editorial não é nota de aprendiz.

Referência: https://docs.oracle.com/en/virtualization/virtualbox/7.1/user/
