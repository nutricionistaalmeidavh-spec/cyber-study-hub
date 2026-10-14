# Gabarito independente — AULA-036: Threat Modeling com STRIDE

**Princípio:** use apenas depois de registrar a própria tentativa. O estudo usa casos fictícios e não autoriza testes externos.

## Contexto da avaliação

O portal adiciona um worker de conversão de PDFs com permissão de leitura para tudo no storage, embora ele precise somente da pasta `incoming/`.

## Respostas esperadas

## Questão 1

API→worker e worker→storage, com principal novo e paths declarados.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 2

Escalada de privilégio/information disclosure, dependendo da operação/efeito demonstrável; não inferir ocorrência.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 3

IAM por prefixo/operação no storage e autorização de solicitação/identidade na API.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 4

Solicitação sintética de arquivo permitido resulta em decisão Allow.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 5

Simular pedido a recurso fictício privado e observar Deny sem baixar o conteúdo.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 6

Mudança de identidade, fluxo e autoridade; registrar testes e risco residual.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Rubrica de correção

| Item | Pontos | Como conferir |
| --- | ---: | --- |
| Interpretação técnica das questões 1–2 | 30 | Identifica fronteiras, ativos, política e efeitos, sem trocar causa por sintoma |
| Casos e controles das questões 3–4 | 30 | Um cenário legítimo, um negativo isolado, evidência de resultado |
| Regresso, incertezas e método das questões 5–6 | 30 | Reteste rastreável, hipóteses alternativas, limites honestos |
| Clareza, autorização e proteção de dados | 10 | Evidência sem dados reais, escopo limitado, terminologia coerente |

**Erro eliminatório:** Concluir que adicionar uma tag STRIDE ao diagrama protege arquivos.

**Aprovação sugerida:** 80/100 sem erro eliminatório. Esta rubrica é avaliação de resposta, não demonstração observacional com alunos reais.
