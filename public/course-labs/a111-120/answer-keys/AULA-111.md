# Gabarito independente — AULA-111: Assembly x86/x64

**Abra depois de responder.** Evidências e cenários são sintéticos, de finalidade exclusivamente educacional.

## Situação

Um professor mostra `83 C0 FF` em modo x86 e afirma que `FF` significa somar 255 a EAX. A turma quer explicar a operação e o efeito esperado para o valor inicial EAX=4.

## Respostas fundamentadas

### Questão 1

**Resposta esperada:** `83` opcode do grupo ADD com imediato sign-extended; `C0` ModR/M apontando EAX; `FF` imediato de 8 bits.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 2

**Resposta esperada:** Imediato com sinal; 0xFF representa -1, não +255, nesta forma.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 3

**Resposta esperada:** EAX fica 3 no caso, considerando aritmética modular com valores pequenos.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 4

**Resposta esperada:** Modo do disassembler/segmento/binário, arquitetura ativa e bytes em torno para alinhar fronteiras.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 5

**Resposta esperada:** Um encoding fora da whitelist deve ser rejeitado, sem inferir register ou instruction size; também compare EAX vs RAX.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 6

**Resposta esperada:** Apenas as variantes `83 C0 ib` em x86 e `48 83 C0 ib` em x64 são suportadas, nenhuma generalização a todas instruções x86.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

## Rubrica — 100 pontos

| Dimensão | Pontos | Critério |
|---|---:|---|
| Fundamentação e mecanismo (Q1–2) | 30 | Explicação causal, não apenas nome da ferramenta |
| Comparação com evidência (Q3–4) | 30 | Caso positivo, resultado, hipótese controlada |
| Negativos e limites (Q5–6) | 30 | Contraexemplo, limite e reteste |
| Clareza e autorização | 10 | Programa próprio, sem segredo ou licença violada |

**Erro eliminatório:** Afirmar que 'qualquer 0x48 é REX.W' sem especificar modo de execução. A revisão só aprova após corrigir esse erro.

**Referência de aprovação:** 80/100 sem erro eliminatório. Esta rubrica não afirma avaliação humana observada.
