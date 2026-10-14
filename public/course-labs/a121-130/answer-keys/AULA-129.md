# AULA-129 — Gabarito independente

Abra somente após tentativa. Nota A é parecer editorial assistido por IA, não teste com aprendizes reais.

**Problema:** Manifesto de build próprio inclui publicSigningKey e, por engano, fixtureSigningPrivate classificada private-key.

## Questão 1

**Enunciado:** Por que public-key é permitida?

**Resposta comentada:** Foi feita para verificação pública.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 2

**Enunciado:** Por que renomear não soluciona?

**Resposta comentada:** Segredo permanece no artefato.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 3

**Enunciado:** Qual defesa primária?

**Resposta comentada:** Remover privada e girar a chave.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 4

**Enunciado:** O que faz obfuscação?

**Resposta comentada:** Aumenta custo de leitura sem garantir sigilo.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 5

**Enunciado:** Que positivo deve existir?

**Resposta comentada:** Chave pública continua distribuível.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 6

**Enunciado:** O que não foi inspecionado?

**Resposta comentada:** Binário nem credenciais reais.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Rubrica objetiva

- Questões 1–6: 15 pontos cada (90); atribuir nota só mediante mecanismo e evidência fundamentados.
- Laboratório com teste positivo, negativo e limite: 10 pontos.
- Aprovação do exercício: pelo menos 80/100 sem erro eliminatório; não é nota editorial nem teste de aprendizado com humanos.
- **Erro eliminatório:** confundir indício com prova de malware, operar bypass de software de terceiros, ignorar escopo ou só bloquear uso legítimo.
- **Limite do laboratório:** Verifica metadados sintéticos, não binário, strings reais, DLP ou supply chain.
