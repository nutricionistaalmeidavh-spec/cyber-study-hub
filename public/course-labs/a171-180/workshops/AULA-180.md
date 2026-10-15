# AULA-180 — CVE Research: laboratório reproduzível

**Tipo:** experimento didático local e seguro, não módulo de produção. **Pré-requisitos:** Node.js 22+ e repositório HubEstudos; sem serviço pago, rede externa, máquina vulnerável ou credencial.

## O que o estudante recebe

- [Modelos e fixtures](../models.mjs) implementam advisory fictício e versão local declarada.
- [Execução selecionada](../run.mjs) e [testes de regressão](../lab.test.mjs) são código de verdade, com entradas fictícias controladas.
- Aula teórica: [AULA-180](../../../course-library/main/180.md). 

## O que deverá conseguir fazer

Distinguir versão possivelmente afetada de comprovação de impacto. Antes de executar, descreva a hipótese e o que mudaria a decisão.

## Como executar — raiz do repositório

```bash
node --version
node public/course-labs/a171-180/run.mjs 180
node --test public/course-labs/a171-180/lab.test.mjs
```

**Caso esperado:** DEMO-ADVISORY v1.2. O campo `casePositive.status` deve corresponder ao estado esperado em `cases[180].okStatus`. **Controle negativo:** versão 2.0 não listada; verifique `caseNegative.status` e explique por que o resultado difere.

## Desafio independente

1. Abra `cases[180]` em `models.mjs` e copie para um arquivo temporário fora da pasta canônica.
2. Preveja a decisão para a mudança de **um único parâmetro**. Justifique por condição exata, não por impressão.
3. Execute novamente, compare resultado, retorne ao código original e reteste os dois casos.
4. Registre: Node, cenário, campo alterado, saída, evidência e qual teste adicional seria exigido num sistema próprio.

## Critérios para nível A

Consegue apontar o mecanismo específico, reproduzir os dois resultados, explicar causa e contraprova, preservar o caminho legítimo, declarar o limite do modelo e criar um teste de transferência independente. Uma marcação na interface **não prova execução**.

**Limite do artefato:** Não usa CVE real nem baixa software vulnerável; verifique avisos oficiais e autorização. Jamais execute em alvo ou binário sem autorização explícita.
