# Trilha Engenharia Reversa com IA — Oficina local de 8 módulos

**R$ 0 · Node.js 22+ · sem rede, contas, chaves, DRM, software de terceiros ou modelos pagos obrigatórios.** Esta é uma atividade pedagógica sobre programa de autoria do curso; a IA é apoio optativo.

## Objetivo final

Observar comportamento da caixa-preta, mapear hipóteses e casos-limite, comparar com código C/JavaScript próprio, inspecionar evidências de agentes e construir reimplementação independente validada por testes diferenciais. Não há promessa de recriar Photoshop, jogos PS5, ativos licenciados nem todo o fonte original.

## Material pronto

| Módulo | Roteiro | Saída verificável |
| --- | --- | --- |
| 01 | [Escopo e linha de base](./module-01.md) | `01-baseline.json` |
| 02 | [Matriz e hipótese](./module-02.md) | `02-matrix.json`, `02-coverage.json` |
| 03 | [C e Ghidra](./module-03.md) | `03-static-source-map.json` |
| 04 | [Rastreamento controlado](./module-04.md) | `04-controlled-trace.json` |
| 05 | [Módulos JavaScript](./module-05.md) | `05-js-boundaries.json` |
| 06 | [REA/MCP e agente](./module-06.md) | `06-agent-evidence.json` |
| 07 | [Reconstrução e mutação](./module-07.md) | `07-differential-report.json` |
| 08 | [Dossiê final](./module-08.md) | `08-capstone-manifest.json`, `08-report.md` |

Fixtures e fontes: `reference.mjs`, `candidate.mjs`, `sample.c`, `sample-ui.mjs` e `sample-rule.mjs`. Motor: `engine.mjs`. Testes automatizados: `engine.test.mjs` e `lab.test.mjs`.

## Como executar

Na raiz do repositório:

```sh
node public/course-labs/reverse-ai/engine.mjs --module 1 --out ./rev-evidencias/m01
node public/course-labs/reverse-ai/engine.mjs --module 2 --out ./rev-evidencias/m02
node public/course-labs/reverse-ai/engine.mjs --module 3 --out ./rev-evidencias/m03
node public/course-labs/reverse-ai/engine.mjs --module 4 --out ./rev-evidencias/m04
node public/course-labs/reverse-ai/engine.mjs --module 5 --out ./rev-evidencias/m05
node public/course-labs/reverse-ai/engine.mjs --module 6 --out ./rev-evidencias/m06
node public/course-labs/reverse-ai/engine.mjs --module 7 --out ./rev-evidencias/m07
node public/course-labs/reverse-ai/engine.mjs --module 8 --out ./rev-evidencias/m08
node --test public/course-labs/reverse-ai/engine.test.mjs public/course-labs/reverse-ai/lab.test.mjs
```

O aluno deve primeiro escrever a própria previsão, depois executar e comparar. Arquivos gerados são registros de programa próprio — **não são prints de um agente real**.

## Complemento Ghidra gratuito (M03)

No diretório do laboratório, com compilador C disponível:

```sh
cc -O0 -g -Wall -Wextra -Werror sample.c -o sample
./sample 8 1 1
```

Abra `sample` no [Ghidra](https://github.com/NationalSecurityAgency/ghidra); investigue `main`, `parse`, strings e referências. Se não instalou Ghidra, faça a análise manual documentada do fonte C; nunca marque como executado.

## Complemento REA/MCP opcional (M06)

[REA original](https://github.com/morluto/rea) (licença MIT, verificar versões e requisitos): `npx rea-agents setup`, revisando o que será instalado/configurado e consentindo antes de alterar o ambiente. Para inspecionar uma **pasta JS própria e autorizada**, a CLI oferece `npx -y rea-agents@latest analyze-javascript-application /caminho/absoluto --json`. Exige versão compatível de Node; não há necessidade de acesso pago para concluir os módulos. Uma integração com modelo remoto pode enviar resultados ao provedor do modelo, sujeito aos termos dele. Evite dados privados.

## Provas e gabaritos

Cada módulo tem prova de seis questões sob `assessments/module-NN.md` e gabarito separado em `answer-keys/module-NN.md`. A correção exige evidências; clicar em “concluído” na plataforma não atesta testes executados, certificação ou avaliação humana.

## Segurança e limites

Não investigue aplicações de terceiros sem autorização, não burle DRM/anti-cheat/licenças, não trate análise estática do fonte como decompilação real. Um teste diferencial positivo não garante equivalência completa. Ninguém precisa pagar para completar a trilha.
