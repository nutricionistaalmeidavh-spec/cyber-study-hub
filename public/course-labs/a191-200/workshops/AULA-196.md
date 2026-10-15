# AULA-196 — SAST, DAST e SCA em pipelines: laboratório reproduzível

**Tipo:** simulação defensiva local com código real de regras, sem instanciar o serviço estudado. **Custo obrigatório:** R$0. **Pré-requisito:** Node.js 22+, repositório do Hub. **ID canônico:** AULA-196.

## O que iremos construir

Um teste local da política: **Finding sem reprodução precisa ser triado, não marcado como resolvido**. Você recebe o motor `../models.mjs`, o executor `../run.mjs` e os testes `../lab.test.mjs` / `../run.test.mjs`.

## Preparação e comandos

Na raiz do repositório:

```sh
node public/course-labs/a191-200/run.mjs 196
node --test public/course-labs/a191-200/lab.test.mjs public/course-labs/a191-200/run.test.mjs
```

**Caso de conformidade esperado:** `REQUIRES_TRIAGE`. **Contraexemplo esperado:** `CONFIRMED_IN_FIXTURE`.

## Verificação independente do aluno

1. Anote ambiente, regra que você acredita ser decisiva e saída esperada.
2. Execute e guarde o JSON dos dois casos. Compare com os resultados acima.
3. Identifique em `models.mjs` a função responsável pela decisão de **SAST, DAST e SCA em pipelines**.
4. Copie a fixture positiva e mude somente **um controle** para provocar a negativa; descreva qual propriedade de segurança mudou.
5. Rode os testes e documente a limitação: o modelo não executou Docker, Kubernetes, nuvem, scanner ou aplicativo Electron reais.
6. Para transferir o aprendizado a um sistema real, use um projeto **próprio e autorizado**, compare a configuração auditada e evidencie resultados; a simulação não é homologação.

## Critério A de laboratório

Comando reproduzido, dois resultados distintos, explicação da causa, negativo independente, reteste e limite declarado. **Nenhum gabarito é revelado aqui.**
