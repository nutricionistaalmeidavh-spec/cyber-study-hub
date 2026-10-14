# AULA-127 — Gabarito independente

Abra somente após tentativa. Nota A é parecer editorial assistido por IA, não teste com aprendizes reais.

**Problema:** Um produto fictício study-lab disponibiliza reports com entitlement JSON Ed25519 contendo product, feature e expiresAt.

## Questão 1

**Enunciado:** O que vem antes de ler claims?

**Resposta comentada:** Verificar assinatura do payload exato.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 2

**Enunciado:** Para que validar feature?

**Resposta comentada:** Evitar usar direito de outro recurso.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 3

**Enunciado:** Qual diferença entre expired e wrong-scope?

**Resposta comentada:** Tempo vencido versus recurso/produto diferente.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 4

**Enunciado:** Por que autoridade local é limitada?

**Resposta comentada:** Pode ser modificada e não vê revogação.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 5

**Enunciado:** Como preservar core R$0?

**Resposta comentada:** Licenciamento é só fixture; curso não exige compra.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 6

**Enunciado:** Qual negativo é obrigatório?

**Resposta comentada:** Token expirado, adulterado ou com produto diferente deve falhar.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Rubrica objetiva

- Questões 1–6: 15 pontos cada (90); atribuir nota só mediante mecanismo e evidência fundamentados.
- Laboratório com teste positivo, negativo e limite: 10 pontos.
- Aprovação do exercício: pelo menos 80/100 sem erro eliminatório; não é nota editorial nem teste de aprendizado com humanos.
- **Erro eliminatório:** confundir indício com prova de malware, operar bypass de software de terceiros, ignorar escopo ou só bloquear uso legítimo.
- **Limite do laboratório:** Não implementa revogação, clock rollback, serviço comercial nem bypass de licença.
