# Gabarito independente — AULA-039: DevSecOps

**Princípio:** use apenas depois de registrar a própria tentativa. O estudo usa casos fictícios e não autoriza testes externos.

## Contexto da avaliação

O pipeline de um app financeiro aprova `npm run build`, mas falha teste que impede duas cobranças com mesmo idempotency key. Um desenvolvedor propõe ignorar o teste por 48 horas e deixar CI verde.

## Respostas esperadas

## Questão 1

Falha de regressão de integridade da cobrança; impacto de duplicação real.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 2

Antes de promover o artefato/deploy, em suíte determinística com teste simultâneo/repetição.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 3

Correção verificada com negativo e positivo passando, e evidência de integridade da operação.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 4

Processo de exceção governado e visível com risk owner; não `continue-on-error` silencioso.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 5

SHA, artefato imutável, logs e status de todos os testes no mesmo commit.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 6

Alertas de duplicação, erros e tendências, além de reteste periódico.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Rubrica de correção

| Item | Pontos | Como conferir |
| --- | ---: | --- |
| Interpretação técnica das questões 1–2 | 30 | Identifica fronteiras, ativos, política e efeitos, sem trocar causa por sintoma |
| Casos e controles das questões 3–4 | 30 | Um cenário legítimo, um negativo isolado, evidência de resultado |
| Regresso, incertezas e método das questões 5–6 | 30 | Reteste rastreável, hipóteses alternativas, limites honestos |
| Clareza, autorização e proteção de dados | 10 | Evidência sem dados reais, escopo limitado, terminologia coerente |

**Erro eliminatório:** Marcar gate verde ignorando teste de integridade que falha.

**Aprovação sugerida:** 80/100 sem erro eliminatório. Esta rubrica é avaliação de resposta, não demonstração observacional com alunos reais.
