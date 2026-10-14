# Gabarito independente — AULA-033: De Pista a Hipótese

**Princípio:** use apenas depois de registrar a própria tentativa. O estudo usa casos fictícios e não autoriza testes externos.

## Contexto da avaliação

Um relatório automatizado aponta 'biblioteca antiga' apenas pelo texto de um HTML armazenado em cache. Outra pessoa demonstra que a versão real foi atualizada, mas o banner segue antigo.

## Respostas esperadas

## Questão 1

Texto servido com aparência de versão antiga; não há inventário de runtime ainda.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 2

Código antigo em execução; HTML de cache ou banner estático obsoleto.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 3

SBOM, lockfile e build implantado mais reprodução em ambiente próprio; cache-control e invalidação.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 4

Hipótese de versão no início, não confirmação de CVE; depois erro informacional de banner/cache.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 5

Após correlacionar componente/versionamento com advisory aplicável e contexto de exposição.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 6

Manter estado informativo, confiança e impacto separados, com evidências e data.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Rubrica de correção

| Item | Pontos | Como conferir |
| --- | ---: | --- |
| Interpretação técnica das questões 1–2 | 30 | Identifica fronteiras, ativos, política e efeitos, sem trocar causa por sintoma |
| Casos e controles das questões 3–4 | 30 | Um cenário legítimo, um negativo isolado, evidência de resultado |
| Regresso, incertezas e método das questões 5–6 | 30 | Reteste rastreável, hipóteses alternativas, limites honestos |
| Clareza, autorização e proteção de dados | 10 | Evidência sem dados reais, escopo limitado, terminologia coerente |

**Erro eliminatório:** Classificar CVE como CONFIRMADO exclusivamente pelo banner.

**Aprovação sugerida:** 80/100 sem erro eliminatório. Esta rubrica é avaliação de resposta, não demonstração observacional com alunos reais.
