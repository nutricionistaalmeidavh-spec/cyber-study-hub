# AULA-130 — Gabarito independente

Abra somente após tentativa. Nota A é parecer editorial assistido por IA, não teste com aprendizes reais.

**Problema:** O parser próprio escreve name[8] sem reservar terminador; release usa PIE, NX e hash; alguém prefere obfuscar a corrigir o buffer.

## Questão 1

**Enunciado:** Por que PIE/NX não corrigem name[8]?

**Resposta comentada:** Mitigam exploração, não acessos inválidos.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 2

**Enunciado:** Que controle resolve causa raiz?

**Resposta comentada:** Verificar limite antes de escrever terminador.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 3

**Enunciado:** Qual distinção entre hash e assinatura?

**Resposta comentada:** Digest de bytes versus origem validada por chave.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 4

**Enunciado:** Por que obfuscação pode prejudicar investigação?

**Resposta comentada:** Dificulta leitura sem corrigir parser.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 5

**Enunciado:** Que evidência complementar existe?

**Resposta comentada:** Capstone Linux com parser, mapas e ELF.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 6

**Enunciado:** Como marcar controles ausentes?

**Resposta comentada:** Não verificado; definir aceitação futura.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Rubrica objetiva

- Questões 1–6: 15 pontos cada (90); atribuir nota só mediante mecanismo e evidência fundamentados.
- Laboratório com teste positivo, negativo e limite: 10 pontos.
- Aprovação do exercício: pelo menos 80/100 sem erro eliminatório; não é nota editorial nem teste de aprendizado com humanos.
- **Erro eliminatório:** confundir indício com prova de malware, operar bypass de software de terceiros, ignorar escopo ou só bloquear uso legítimo.
- **Limite do laboratório:** A matriz sintética não substitui ensaio Linux real com maps, compilador e parser.
