# AULA-177 — Safe PoC: laboratório reproduzível

**Tipo:** experimento didático local e seguro, não módulo de produção. **Pré-requisitos:** Node.js 22+ e repositório HubEstudos; sem serviço pago, rede externa, máquina vulnerável ou credencial.

## O que o estudante recebe

- [Modelos e fixtures](../models.mjs) implementam rejeição observável de input inválido.
- [Execução selecionada](../run.mjs) e [testes de regressão](../lab.test.mjs) são código de verdade, com entradas fictícias controladas.
- Aula teórica: [AULA-177](../../../course-library/main/177.md). 

## O que deverá conseguir fazer

Converter hipótese em teste de regressão não invasivo. Antes de executar, descreva a hipótese e o que mudaria a decisão.

## Como executar — raiz do repositório

```bash
node --version
node public/course-labs/a171-180/run.mjs 177
node --test public/course-labs/a171-180/lab.test.mjs
```

**Caso esperado:** R:123 rejeitado. O campo `casePositive.status` deve corresponder ao estado esperado em `cases[177].okStatus`. **Controle negativo:** R:123 aceito; verifique `caseNegative.status` e explique por que o resultado difere.

## Desafio independente

1. Abra `cases[177]` em `models.mjs` e copie para um arquivo temporário fora da pasta canônica.
2. Preveja a decisão para a mudança de **um único parâmetro**. Justifique por condição exata, não por impressão.
3. Execute novamente, compare resultado, retorne ao código original e reteste os dois casos.
4. Registre: Node, cenário, campo alterado, saída, evidência e qual teste adicional seria exigido num sistema próprio.

## Critérios para nível A

Consegue apontar o mecanismo específico, reproduzir os dois resultados, explicar causa e contraprova, preservar o caminho legítimo, declarar o limite do modelo e criar um teste de transferência independente. Uma marcação na interface **não prova execução**.

**Limite do artefato:** PoC segura somente para parser inventado e local. Jamais execute em alvo ou binário sem autorização explícita.
