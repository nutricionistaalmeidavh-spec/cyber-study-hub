# Gabarito independente — AULA-092: Assinaturas, hashes e reputação

**Avaliar evidência, não só terminologia.** Use `fileDigestAssessment` e os dois casos contrários.

## Questão 1

Igualdade prática de bytes sob o algoritmo, não legitimidade ou autoria.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 2

Manifesto e conteúdo podem ter sido alterados pela mesma origem.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 3

Codificação UTF-8 ou finais de linha CRLF/LF já mudam bytes.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 4

Hash exato identifica amostra; padrão busca traço compartilhado e pode errar.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 5

Fonte, timestamp, digest, prevalência, versão e política.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Questão 6

Gerar digest local, obter referência por canal confiável e documentar resultado/limitações.

Critério: indicar condição observável, justificar a decisão e registrar o limite da inferência.

## Rubrica de correção (100 pontos)

- Conceito e mecanismo específico: 20 pontos.
- Caso positivo com dados, saída e interpretação: 20 pontos.
- Caso negativo com hipótese alternativa: 20 pontos.
- Defesa/controle principal e reteste reprodutível: 20 pontos.
- Limites, cobertura e documentação de evidências: 20 pontos.

**Erro eliminatório:** declarar atividade maliciosa comprovada sem evidências, omitir controle negativo ou confundir o modelo local com validação real. A nota editorial não é nota de aprendiz.

Referência: https://nodejs.org/api/crypto.html
