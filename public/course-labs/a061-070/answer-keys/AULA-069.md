# Gabarito independente — AULA-069: Validação segura de PoCs em laboratório

**Use só após a tentativa.** A solução se refere a um cenário novo e exclusivamente fictício.

## Cenário da prova

O time prepara uma demonstração de uma falha de concorrência em sistema próprio. O teste deve fazer dez operações simultâneas e pode criar lançamentos duplicados. Há snapshot, mas o plano usa banco de produção clonado com dados identificáveis.

## Respostas técnicas e justificativas

### Questão 1

**Resposta:** Uma chave de idempotência deve impedir múltiplos efeitos para a mesma operação concorrente.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 2

**Resposta:** Dados reais mantêm risco de exposição e violam minimização; usar fixtures anonimizadas/sintéticas.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 3

**Resposta:** IDs sintéticos, único saldo/lançamento e contador de efeitos com chave de idempotência.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 4

**Resposta:** Snapshot limpo, bloqueio de egress, operações limitadas, rollback verificável e autorização explícita.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 5

**Resposta:** Negativo: mesma chave não gera duplicação; positivo: operações diferentes legítimas processam corretamente.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 6

**Resposta:** Entradas, hashes, versão, sequência, estados antes/depois, comportamento observado e não extrapolar para produção.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

## Rubrica de correção — 100 pontos

| Dimensão | Pontos | Exigência |
|---|---:|---|
| Conceitos e hipóteses (Q1–2) | 30 | Conceito correto e ausência de inferência não demonstrada |
| Evidências e controles (Q3–4) | 30 | Fonte verificável, controle no componente certo |
| Reteste, limites e método (Q5–6) | 30 | Positivo e negativo; risco residual expresso |
| Escopo e clareza profissional | 10 | Autorização, mínimo necessário, sem segredos |

**Erro eliminatório:** Executar código de origem desconhecida com efeito destrutivo ou exfiltração em ambiente real.

**Referência de aprovação da atividade:** 80/100 sem erro eliminatório. Nenhum resultado de alunos humanos foi medido.
