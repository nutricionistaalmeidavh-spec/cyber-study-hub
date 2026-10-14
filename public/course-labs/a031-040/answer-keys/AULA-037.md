# Gabarito independente — AULA-037: Secure Coding

**Princípio:** use apenas depois de registrar a própria tentativa. O estudo usa casos fictícios e não autoriza testes externos.

## Contexto da avaliação

Um sistema de RH recebe `{displayName:'Iara', approvedHours:400}` no PATCH do próprio perfil. `approvedHours` só pode ser alterado pelo gestor em fluxo auditado.

## Respostas esperadas

## Questão 1

displayName editável, approvedHours controlado pelo fluxo gerencial.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 2

Propaga campos inesperados para entidade persistida sem política específica.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 3

PATCH /me com approvedHours=400 retorna rejeição ou ignora campo sem alterar valor armazenado.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 4

displayName muda e é persistido para o usuário autenticado correto.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 5

Operação separada com decisão de papel/permissão server-side e log de aprovador.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 6

Transação, acesso concorrente, identidade da sessão, registro de alteração e consistência de ORM.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Rubrica de correção

| Item | Pontos | Como conferir |
| --- | ---: | --- |
| Interpretação técnica das questões 1–2 | 30 | Identifica fronteiras, ativos, política e efeitos, sem trocar causa por sintoma |
| Casos e controles das questões 3–4 | 30 | Um cenário legítimo, um negativo isolado, evidência de resultado |
| Regresso, incertezas e método das questões 5–6 | 30 | Reteste rastreável, hipóteses alternativas, limites honestos |
| Clareza, autorização e proteção de dados | 10 | Evidência sem dados reais, escopo limitado, terminologia coerente |

**Erro eliminatório:** Confiar em role ou approvedHours vindo do request do próprio funcionário.

**Aprovação sugerida:** 80/100 sem erro eliminatório. Esta rubrica é avaliação de resposta, não demonstração observacional com alunos reais.
