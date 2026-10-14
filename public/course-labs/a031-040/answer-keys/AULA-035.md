# Gabarito independente — AULA-035: Relatório Profissional e Reteste

**Princípio:** use apenas depois de registrar a própria tentativa. O estudo usa casos fictícios e não autoriza testes externos.

## Contexto da avaliação

Uma equipe corrige uma exportação de planilhas fazendo todas as chamadas retornarem 403, inclusive para gestores legítimos, e marca o chamado como RESOLVIDO.

## Respostas esperadas

## Questão 1

Resultado anterior, autorização, cenário positivo/negativo, versão e nova execução no mesmo escopo.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 2

O controle bloqueia função legítima; é regressão de disponibilidade/negócio.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 3

Conta fictícia A acessa objeto de B, observa 403 e nenhuma resposta do objeto, com ID sintético.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 4

B acessa seu próprio objeto e recebe 200 com resultado íntegro.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 5

Token, cookie, segredo, identificadores pessoais reais e corpo além do estritamente necessário.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 6

CORREÇÃO INCOMPLETA; reabrir ajuste para preservar acesso autorizado e repetir ambos os casos.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Rubrica de correção

| Item | Pontos | Como conferir |
| --- | ---: | --- |
| Interpretação técnica das questões 1–2 | 30 | Identifica fronteiras, ativos, política e efeitos, sem trocar causa por sintoma |
| Casos e controles das questões 3–4 | 30 | Um cenário legítimo, um negativo isolado, evidência de resultado |
| Regresso, incertezas e método das questões 5–6 | 30 | Reteste rastreável, hipóteses alternativas, limites honestos |
| Clareza, autorização e proteção de dados | 10 | Evidência sem dados reais, escopo limitado, terminologia coerente |

**Erro eliminatório:** Marcar RESOLVIDO apenas porque todo mundo recebe 403.

**Aprovação sugerida:** 80/100 sem erro eliminatório. Esta rubrica é avaliação de resposta, não demonstração observacional com alunos reais.
