# AULA-125 — Gabarito independente

Abra somente após tentativa. Nota A é parecer editorial assistido por IA, não teste com aprendizes reais.

**Problema:** Release própria tem bytes e hash de manifesto confiável; uma cópia muda os bytes; outra muda arquivo e hash de fonte não autenticada.

## Questão 1

**Enunciado:** O que o SHA-256 confirma?

**Resposta comentada:** Coincidência de bytes com referência.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 2

**Enunciado:** Por que hash trocado não comprova origem?

**Resposta comentada:** Binário e hash podem ter sido substituídos juntos.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 3

**Enunciado:** O que mismatch não demonstra?

**Resposta comentada:** Malware; pode ser corrupção ou update legítimo.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 4

**Enunciado:** Qual controle protege referência?

**Resposta comentada:** Assinatura por chave previamente confiada.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 5

**Enunciado:** Que positivo preservar?

**Resposta comentada:** Release original autorizada e íntegra.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 6

**Enunciado:** O que falta para produção?

**Resposta comentada:** Cadeia de confiança e revogação.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Rubrica objetiva

- Questões 1–6: 15 pontos cada (90); atribuir nota só mediante mecanismo e evidência fundamentados.
- Laboratório com teste positivo, negativo e limite: 10 pontos.
- Aprovação do exercício: pelo menos 80/100 sem erro eliminatório; não é nota editorial nem teste de aprendizado com humanos.
- **Erro eliminatório:** confundir indício com prova de malware, operar bypass de software de terceiros, ignorar escopo ou só bloquear uso legítimo.
- **Limite do laboratório:** A confiança no manifesto é booleano didático, sem PKI nem protocolo real de update.
