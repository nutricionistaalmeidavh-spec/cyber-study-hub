# LAB-21 — Sysmon: oficina prática

**Tipo:** análise reproduzível de registros sintéticos. **Não executa** Sysmon ou outro programa externo automaticamente. **Custo obrigatório:** R$ 0. **Escopo:** localhost/VM própria, dados fictícios.

## O problema específico da aula

Vincule Event ID ao evento observado. Aqui você receberá uma entrada concreta, o motor local que toma uma decisão, um controle negativo e o roteiro para transferir o conceito à ferramenta real em ambiente próprio.

## Arquivos prontos

- [Modelos e regras locais](../model.mjs) — a checagem associada ao campo `eventId`.
- [Fixtures por assunto](../scenarios.json) — entradas `LAB-21` com cenário válido e cenário de revisão.
- [Runner de laboratório](../run.mjs) e [testes independentes](../lab.test.mjs).

## Como executar na raiz do repositório

```bash
node --version
node public/course-labs/lab-tools/run.mjs LAB-21
node --test public/course-labs/lab-tools/lab.test.mjs
```

**Cenário válido:** `{"eventId":1,"caseId":"LAB-21-POS"}`. Deve retornar `EXPECTED_LOCAL_CASE` porque evento 1 de criação de processo fictício.

**Controle negativo:** `{"eventId":255,"caseId":"LAB-21-NEG"}`. Deve retornar `REVIEW_NEGATIVE_CASE`: Event ID sem regra/mapeamento exige revisão.

## O que o aluno precisa fazer (não apenas copiar)

1. Antes de executar, declare a hipótese: qual campo interfere no limite de escopo ou qualidade da evidência?
2. Abra a fixture do LAB-21, modifique apenas `eventId` em **uma cópia** e preveja a saída.
3. Reexecute, confira o resultado negativo e restaure o exemplo legítimo.
4. Faça uma tabela curta: input, expectativa, output, motivo e limite.
5. Se já utiliza Sysmon em VM própria, reproduza a **observação equivalente** com material fictício/autorizado e anote versão, contexto e diferença em relação ao modelo.

## Critérios de aprovação A

O aluno identifica um objeto específico da ferramenta, prova o par positivo/negativo, mostra o arquivo executado, justifica qual variável causou o resultado e descreve quando precisaria de teste real. Não atribuir certificado nem segurança comprovada a um cenário sintético.

**Limitação crucial:** Event ID válido não torna um evento malicioso automaticamente.
