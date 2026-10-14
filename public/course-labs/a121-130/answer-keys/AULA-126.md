# AULA-126 — Gabarito independente

Abra somente após tentativa. Nota A é parecer editorial assistido por IA, não teste com aprendizes reais.

**Problema:** Release própria Ed25519 é assinada com chave efêmera; a validação dispõe de bytes, assinatura e fingerprint da chave pública previamente confiada.

## Questão 1

**Enunciado:** Por que assinatura correta não basta?

**Resposta comentada:** Pode estar vinculada a chave não confiada.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 2

**Enunciado:** Que material nunca deve ir no cliente?

**Resposta comentada:** Chave privada de assinatura.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 3

**Enunciado:** O que mudar bytes provoca?

**Resposta comentada:** Verificação da assinatura falha.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 4

**Enunciado:** Qual dado dá origem à confiança?

**Resposta comentada:** Fingerprint da chave publicado por canal confiável.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 5

**Enunciado:** Que positivo preservar?

**Resposta comentada:** Atualização legítima assinada.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 6

**Enunciado:** Qual limite da oficina?

**Resposta comentada:** Não modela CA, revogação e identidade real.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Rubrica objetiva

- Questões 1–6: 15 pontos cada (90); atribuir nota só mediante mecanismo e evidência fundamentados.
- Laboratório com teste positivo, negativo e limite: 10 pontos.
- Aprovação do exercício: pelo menos 80/100 sem erro eliminatório; não é nota editorial nem teste de aprendizado com humanos.
- **Erro eliminatório:** confundir indício com prova de malware, operar bypass de software de terceiros, ignorar escopo ou só bloquear uso legítimo.
- **Limite do laboratório:** Não implementa PKI, X.509, revogação, carimbo temporal ou política de SO.
