# LAB-14 — curl: oficina prática

**Tipo:** análise reproduzível de registros sintéticos. **Não executa** curl ou outro programa externo automaticamente. **Custo obrigatório:** R$ 0. **Escopo:** localhost/VM própria, dados fictícios.

## O problema específico da aula

Status HTTP esperado deve ser verificado. Aqui você receberá uma entrada concreta, o motor local que toma uma decisão, um controle negativo e o roteiro para transferir o conceito à ferramenta real em ambiente próprio.

## Arquivos prontos

- [Modelos e regras locais](../model.mjs) — a checagem associada ao campo `status`.
- [Fixtures por assunto](../scenarios.json) — entradas `LAB-14` com cenário válido e cenário de revisão.
- [Runner de laboratório](../run.mjs) e [testes independentes](../lab.test.mjs).

## Como executar na raiz do repositório

```bash
node --version
node public/course-labs/lab-tools/run.mjs LAB-14
node --test public/course-labs/lab-tools/lab.test.mjs
```

**Cenário válido:** `{"status":200,"caseId":"LAB-14-POS"}`. Deve retornar `EXPECTED_LOCAL_CASE` porque resposta 200 no endpoint próprio.

**Controle negativo:** `{"status":500,"caseId":"LAB-14-NEG"}`. Deve retornar `REVIEW_NEGATIVE_CASE`: Erro 500 exige diagnosticar servidor e corpo.

## O que o aluno precisa fazer (não apenas copiar)

1. Antes de executar, declare a hipótese: qual campo interfere no limite de escopo ou qualidade da evidência?
2. Abra a fixture do LAB-14, modifique apenas `status` em **uma cópia** e preveja a saída.
3. Reexecute, confira o resultado negativo e restaure o exemplo legítimo.
4. Faça uma tabela curta: input, expectativa, output, motivo e limite.
5. Se já utiliza curl em VM própria, reproduza a **observação equivalente** com material fictício/autorizado e anote versão, contexto e diferença em relação ao modelo.

## Critérios de aprovação A

O aluno identifica um objeto específico da ferramenta, prova o par positivo/negativo, mostra o arquivo executado, justifica qual variável causou o resultado e descreve quando precisaria de teste real. Não atribuir certificado nem segurança comprovada a um cenário sintético.

**Limitação crucial:** Não envie requests para endereços externos; cenário é JSON fixo.
