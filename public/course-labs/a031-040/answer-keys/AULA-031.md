# Gabarito independente — AULA-031: Metodologia de Pentest

**Princípio:** use apenas depois de registrar a própria tentativa. O estudo usa casos fictícios e não autoriza testes externos.

## Contexto da avaliação

Uma consultoria autorizou verificar somente `https://qa.exemplo.test:443/api/status` entre 9h–11h, mas o analista encontra um link para `https://login.exemplo.test`. O cliente disse genericamente 'o site inteiro é nosso'.

## Respostas esperadas

## Questão 1

Especificação escrita de proprietário/autorizador, ativos completos, ações e janela/limites, com responsável por incidentes.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 2

Hostname e autorização são dimensões diferentes; vínculo administrativo não amplia o escopo sem aceitação explícita.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 3

Log mínimo de hora, alvo e operação autorizada, sem solicitar resposta sensível nem expandir destinos.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 4

Interromper testes ativos e solicitar aditamento de escopo.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 5

Executar apenas a operação permitida durante a janela e anexar evidência mínima com tratamento de dados.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 6

Não autentica assinaturas nem acompanha DNS, redirecionamentos, proxies ou decisões humanas de autorização.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Rubrica de correção

| Item | Pontos | Como conferir |
| --- | ---: | --- |
| Interpretação técnica das questões 1–2 | 30 | Identifica fronteiras, ativos, política e efeitos, sem trocar causa por sintoma |
| Casos e controles das questões 3–4 | 30 | Um cenário legítimo, um negativo isolado, evidência de resultado |
| Regresso, incertezas e método das questões 5–6 | 30 | Reteste rastreável, hipóteses alternativas, limites honestos |
| Clareza, autorização e proteção de dados | 10 | Evidência sem dados reais, escopo limitado, terminologia coerente |

**Erro eliminatório:** Prosseguir contra o subdomínio fora da autorização alegando descoberta técnica.

**Aprovação sugerida:** 80/100 sem erro eliminatório. Esta rubrica é avaliação de resposta, não demonstração observacional com alunos reais.
