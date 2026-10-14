# Gabarito independente — AULA-068: CVE, CWE, CVSS e advisories

**Use só após a tentativa.** A solução se refere a um cenário novo e exclusivamente fictício.

## Cenário da prova

A equipe afirma que o ERP está vulnerável porque usa `AgentX 3.1`, mas o fornecedor aplica hotfix `3.1+hf8`, preservando string 3.1 na interface. O advisory cita apenas builds sem hotfix.

## Respostas técnicas e justificativas

### Questão 1

**Resposta:** Identificador do build, changelog de hotfix, arquivo/versão efetiva e confirmação do fabricante.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 2

**Resposta:** CVE é registro individual do problema; CWE é taxonomia de classe de fraqueza, não prova de ocorrência.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 3

**Resposta:** Backport/hotfix pode corrigir o código mantendo versão de marketing.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 4

**Resposta:** Severidade técnica deve ser combinada a exposição, função afetada, controles, criticidade e política interna.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 5

**Resposta:** Hipótese, precisa revisão, aplicabilidade confirmada e efeito validado separados.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 6

**Resposta:** Verificação de build e condição afetada, reteste mínimo autorizado e manutenção do uso legítimo.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

## Rubrica de correção — 100 pontos

| Dimensão | Pontos | Exigência |
|---|---:|---|
| Conceitos e hipóteses (Q1–2) | 30 | Conceito correto e ausência de inferência não demonstrada |
| Evidências e controles (Q3–4) | 30 | Fonte verificável, controle no componente certo |
| Reteste, limites e método (Q5–6) | 30 | Positivo e negativo; risco residual expresso |
| Escopo e clareza profissional | 10 | Autorização, mínimo necessário, sem segredos |

**Erro eliminatório:** Declarar todos os servidores 'críticos comprovados' apenas por CVSS e banner.

**Referência de aprovação da atividade:** 80/100 sem erro eliminatório. Nenhum resultado de alunos humanos foi medido.
