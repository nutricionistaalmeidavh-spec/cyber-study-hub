# AULA-175 — Root Cause Analysis: laboratório reproduzível

**Tipo:** experimento didático local e seguro, não módulo de produção. **Pré-requisitos:** Node.js 22+ e repositório HubEstudos; sem serviço pago, rede externa, máquina vulnerável ou credencial.

## O que o estudante recebe

- [Modelos e fixtures](../models.mjs) implementam valores declarados, reais e capacidade.
- [Execução selecionada](../run.mjs) e [testes de regressão](../lab.test.mjs) são código de verdade, com entradas fictícias controladas.
- Aula teórica: [AULA-175](../../../course-library/main/175.md). 

## O que deverá conseguir fazer

Apontar inconsistência de comprimento e guarda apropriada. Antes de executar, descreva a hipótese e o que mudaria a decisão.

## Como executar — raiz do repositório

```bash
node --version
node public/course-labs/a171-180/run.mjs 175
node --test public/course-labs/a171-180/lab.test.mjs
```

**Caso esperado:** declared=4 capacity=8. O campo `casePositive.status` deve corresponder ao estado esperado em `cases[175].okStatus`. **Controle negativo:** declared=12 capacity=8; verifique `caseNegative.status` e explique por que o resultado difere.

## Desafio independente

1. Abra `cases[175]` em `models.mjs` e copie para um arquivo temporário fora da pasta canônica.
2. Preveja a decisão para a mudança de **um único parâmetro**. Justifique por condição exata, não por impressão.
3. Execute novamente, compare resultado, retorne ao código original e reteste os dois casos.
4. Registre: Node, cenário, campo alterado, saída, evidência e qual teste adicional seria exigido num sistema próprio.

## Critérios para nível A

Consegue apontar o mecanismo específico, reproduzir os dois resultados, explicar causa e contraprova, preservar o caminho legítimo, declarar o limite do modelo e criar um teste de transferência independente. Uma marcação na interface **não prova execução**.

**Limite do artefato:** Modelo aritmético, sem leitura de memória real. Jamais execute em alvo ou binário sem autorização explícita.
