# Gabarito independente — AULA-040: Projeto Final — Pentest Completo de Laboratório

**Princípio:** use apenas depois de registrar a própria tentativa. O estudo usa casos fictícios e não autoriza testes externos.

## Contexto da avaliação

O Conselho EscolaSul autoriza apenas um módulo fictício de biblioteca. Um segundo endpoint `GET /export` aparece no inventário mas não foi autorizado. O relatório diz que 'pentest completo encontrou 0 vulnerabilidades' mesmo sem testar autorização de exportação.

## Respostas esperadas

## Questão 1

Owner, ativo, janela, métodos e limites; /export fica apenas documentada e sem teste ativo até autorização.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 2

Separar descoberta, escopo permitido, cobertura e status de teste por rota.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 3

Usuário B conhece ID de empréstimo A mas servidor precisa consultar proprietário de forma confiável.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 4

B recebe 403/404 sem dado; A acessa 200 e preserva fluxo legítimo.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 5

Rotas fora do escopo, controles não executados, ambiente sintético, versões e risco residual.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 6

Exigir testes verdes, artefato reproduzível, findings e retestes; não chamar ausência de achados de segurança comprovada.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Rubrica de correção

| Item | Pontos | Como conferir |
| --- | ---: | --- |
| Interpretação técnica das questões 1–2 | 30 | Identifica fronteiras, ativos, política e efeitos, sem trocar causa por sintoma |
| Casos e controles das questões 3–4 | 30 | Um cenário legítimo, um negativo isolado, evidência de resultado |
| Regresso, incertezas e método das questões 5–6 | 30 | Reteste rastreável, hipóteses alternativas, limites honestos |
| Clareza, autorização e proteção de dados | 10 | Evidência sem dados reais, escopo limitado, terminologia coerente |

**Erro eliminatório:** Afirmar '0 vulnerabilidades' na aplicação inteira apesar de cobertura incompleta.

**Aprovação sugerida:** 80/100 sem erro eliminatório. Esta rubrica é avaliação de resposta, não demonstração observacional com alunos reais.
