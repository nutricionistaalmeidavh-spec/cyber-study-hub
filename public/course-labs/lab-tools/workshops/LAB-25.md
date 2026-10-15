# LAB-25 — REMnux: oficina prática

**Tipo:** análise reproduzível de registros sintéticos. **Não executa** REMnux ou outro programa externo automaticamente. **Custo obrigatório:** R$ 0. **Escopo:** localhost/VM própria, dados fictícios.

## O problema específico da aula

Análise de amostra deve ser isolada e inerte. Aqui você receberá uma entrada concreta, o motor local que toma uma decisão, um controle negativo e o roteiro para transferir o conceito à ferramenta real em ambiente próprio.

## Arquivos prontos

- [Modelos e regras locais](../model.mjs) — a checagem associada ao campo `sampleType`.
- [Fixtures por assunto](../scenarios.json) — entradas `LAB-25` com cenário válido e cenário de revisão.
- [Runner de laboratório](../run.mjs) e [testes independentes](../lab.test.mjs).

## Como executar na raiz do repositório

```bash
node --version
node public/course-labs/lab-tools/run.mjs LAB-25
node --test public/course-labs/lab-tools/lab.test.mjs
```

**Cenário válido:** `{"sampleType":"text-fixture","caseId":"LAB-25-POS"}`. Deve retornar `EXPECTED_LOCAL_CASE` porque amostra de texto inerte.

**Controle negativo:** `{"sampleType":"unknown-binary","caseId":"LAB-25-NEG"}`. Deve retornar `REVIEW_NEGATIVE_CASE`: Binário desconhecido não é executado.

## O que o aluno precisa fazer (não apenas copiar)

1. Antes de executar, declare a hipótese: qual campo interfere no limite de escopo ou qualidade da evidência?
2. Abra a fixture do LAB-25, modifique apenas `sampleType` em **uma cópia** e preveja a saída.
3. Reexecute, confira o resultado negativo e restaure o exemplo legítimo.
4. Faça uma tabela curta: input, expectativa, output, motivo e limite.
5. Se já utiliza REMnux em VM própria, reproduza a **observação equivalente** com material fictício/autorizado e anote versão, contexto e diferença em relação ao modelo.

## Critérios de aprovação A

O aluno identifica um objeto específico da ferramenta, prova o par positivo/negativo, mostra o arquivo executado, justifica qual variável causou o resultado e descreve quando precisaria de teste real. Não atribuir certificado nem segurança comprovada a um cenário sintético.

**Limitação crucial:** Não instala REMnux e não executa malware.
