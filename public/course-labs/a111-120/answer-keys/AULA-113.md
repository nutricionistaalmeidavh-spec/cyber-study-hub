# Gabarito independente — AULA-113: Stack Frames e Calling Conventions

**Abra depois de responder.** Evidências e cenários são sintéticos, de finalidade exclusivamente educacional.

## Situação

Uma função própria `sum5(a,b,c,d,e)` foi compilada para Windows x64 com cinco argumentos inteiros de 64 bits. Um colega garante que o quinto argumento chega em R8, pois faltou contar o quarto; outro diz que shadow space de 32 bytes pertence a uma variável local da callee.

## Respostas fundamentadas

### Questão 1

**Resposta esperada:** RCX, RDX, R8 e R9 na ordem dos argumentos 1 a 4.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 2

**Resposta esperada:** O quinto fica na pilha de chamada segundo a ABI, não em R8 que carrega o terceiro.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 3

**Resposta esperada:** O caller reserva espaço de 32 bytes disponível à callee para homing dos argumentos em registradores.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 4

**Resposta esperada:** É área prescrita pela ABI, não uma variável local identificável nem garantia de conteúdo útil.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 5

**Resposta esperada:** No SysV, os cinco inteiros cabem em RDI, RSI, RDX, RCX e R8.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 6

**Resposta esperada:** Alinhamento, prólogo, retorno, otimização, tipos mistos/variádicos e convenções específicas podem alterar layout real.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

## Rubrica — 100 pontos

| Dimensão | Pontos | Critério |
|---|---:|---|
| Fundamentação e mecanismo (Q1–2) | 30 | Explicação causal, não apenas nome da ferramenta |
| Comparação com evidência (Q3–4) | 30 | Caso positivo, resultado, hipótese controlada |
| Negativos e limites (Q5–6) | 30 | Contraexemplo, limite e reteste |
| Clareza e autorização | 10 | Programa próprio, sem segredo ou licença violada |

**Erro eliminatório:** Misturar System V e Win64 ou inferir a posição real de cada argumento apenas a partir do array lógico da fixture. A revisão só aprova após corrigir esse erro.

**Referência de aprovação:** 80/100 sem erro eliminatório. Esta rubrica não afirma avaliação humana observada.
