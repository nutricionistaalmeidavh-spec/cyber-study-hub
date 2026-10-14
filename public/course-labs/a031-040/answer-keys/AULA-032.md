# Gabarito independente — AULA-032: Reconhecimento e Superfície de Ataque

**Princípio:** use apenas depois de registrar a própria tentativa. O estudo usa casos fictícios e não autoriza testes externos.

## Contexto da avaliação

Um inventário aprovado de um painel acadêmico lista `GET /notas` (401), `GET /assets/logo.svg` (200) e `POST /exportar` (403 para usuário comum). O scanner marca os dois erros 4xx como críticos.

## Respostas esperadas

## Questão 1

Método, papel esperado, dono, versão, fonte e data, além de destino e fronteira de confiança.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 2

São respostas de controle ou ausência de sessão e não evidenciam vulnerabilidade isoladamente.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 3

Servidor e sua política de autorização, não nome ou botão do frontend.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 4

Conta fictícia autorizada da fixture lê o recurso próprio e usuário não autorizado continua negado.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 5

Antes de nova verificação ativa ou quando mudar serviço, dono, endpoint ou permissão.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 6

Registro auditável com alvo, método, data, resposta redigida e justificativa do enquadramento.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Rubrica de correção

| Item | Pontos | Como conferir |
| --- | ---: | --- |
| Interpretação técnica das questões 1–2 | 30 | Identifica fronteiras, ativos, política e efeitos, sem trocar causa por sintoma |
| Casos e controles das questões 3–4 | 30 | Um cenário legítimo, um negativo isolado, evidência de resultado |
| Regresso, incertezas e método das questões 5–6 | 30 | Reteste rastreável, hipóteses alternativas, limites honestos |
| Clareza, autorização e proteção de dados | 10 | Evidência sem dados reais, escopo limitado, terminologia coerente |

**Erro eliminatório:** Declarar falha crítica apenas porque uma rota devolve 401/403.

**Aprovação sugerida:** 80/100 sem erro eliminatório. Esta rubrica é avaliação de resposta, não demonstração observacional com alunos reais.
