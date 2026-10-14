# Gabarito independente — AULA-112: Registradores e Instruções

**Abra depois de responder.** Evidências e cenários são sintéticos, de finalidade exclusivamente educacional.

## Situação

O debugger registra `mov rax, 7; cmp rax, 8; je igual; add rax, 1`. O time afirma que a instrução JE será tomada porque RAX terminou em 8.

## Respostas fundamentadas

### Questão 1

**Resposta esperada:** RAX continua 7; CMP não escreve no registrador.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 2

**Resposta esperada:** ZF=false porque 7≠8.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 3

**Resposta esperada:** Não; JE depende de ZF=1 naquele ponto de execução.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 4

**Resposta esperada:** RAX torna-se 8 após ADD, mas isso não muda retroativamente o salto.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 5

**Resposta esperada:** O modelo testa MOV/ADD/CMP, não implementa JE, atualizações completas de flags ou RIP; a decisão JE deve ser raciocinada separadamente.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 6

**Resposta esperada:** Snapshot de registradores e RFLAGS antes do salto com endereço/instrução e comparação a execução de teste próprio.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

## Rubrica — 100 pontos

| Dimensão | Pontos | Critério |
|---|---:|---|
| Fundamentação e mecanismo (Q1–2) | 30 | Explicação causal, não apenas nome da ferramenta |
| Comparação com evidência (Q3–4) | 30 | Caso positivo, resultado, hipótese controlada |
| Negativos e limites (Q5–6) | 30 | Contraexemplo, limite e reteste |
| Clareza e autorização | 10 | Programa próprio, sem segredo ou licença violada |

**Erro eliminatório:** Confundir resultado temporário da comparação com atribuição ao registrador de destino. A revisão só aprova após corrigir esse erro.

**Referência de aprovação:** 80/100 sem erro eliminatório. Esta rubrica não afirma avaliação humana observada.
