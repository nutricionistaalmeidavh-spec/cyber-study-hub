# Gabarito independente — AULA-034: Validação de Impacto

**Princípio:** use apenas depois de registrar a própria tentativa. O estudo usa casos fictícios e não autoriza testes externos.

## Contexto da avaliação

Duas avaliações internas: A mostra página de demonstração pública com um ID previsível; B mostra acesso não autorizado a um único boletim acadêmico sintético cuja política exige restrição.

## Respostas esperadas

## Questão 1

B, se leitura não autorizada de objeto existente e restrito é reproduzível; A pode ser comportamento público intencional.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 2

B viola confidencialidade; A tem apenas ID previsível sem consequência demonstrada.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 3

Autenticação exigida, complexidade, privilégios, superfície acessível e controles existentes.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 4

Sem avaliar vetor CVSS e condições do sistema real não há fundamento para um escore numérico.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 5

Bob não lê boletim de Alice; Alice lê o seu, com logs e estados definidos.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 6

Seção separada entre comprovado, hipótese e limites, mantendo registro do efeito autorizado.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Rubrica de correção

| Item | Pontos | Como conferir |
| --- | ---: | --- |
| Interpretação técnica das questões 1–2 | 30 | Identifica fronteiras, ativos, política e efeitos, sem trocar causa por sintoma |
| Casos e controles das questões 3–4 | 30 | Um cenário legítimo, um negativo isolado, evidência de resultado |
| Regresso, incertezas e método das questões 5–6 | 30 | Reteste rastreável, hipóteses alternativas, limites honestos |
| Clareza, autorização e proteção de dados | 10 | Evidência sem dados reais, escopo limitado, terminologia coerente |

**Erro eliminatório:** Inventar nota CVSS ou ampliar extração de dados para 'provar' impacto.

**Aprovação sugerida:** 80/100 sem erro eliminatório. Esta rubrica é avaliação de resposta, não demonstração observacional com alunos reais.
