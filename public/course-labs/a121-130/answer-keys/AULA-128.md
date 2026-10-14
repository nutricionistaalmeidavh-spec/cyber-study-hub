# AULA-128 — Gabarito independente

Abra somente após tentativa. Nota A é parecer editorial assistido por IA, não teste com aprendizes reais.

**Problema:** Aplicativo self-hosted esconde botão premium no cliente e pressupõe que isso protege operação sensível no servidor.

## Questão 1

**Enunciado:** Por que botão oculto não é controle de autorização?

**Resposta comentada:** Cliente pode alterar interface e requisições.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 2

**Enunciado:** Onde fica decisão final?

**Resposta comentada:** Servidor que executa ação sensível.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 3

**Enunciado:** Como preservar operação offline?

**Resposta comentada:** Direitos limitados com expiração e política documentada.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 4

**Enunciado:** Que sinal indica falha?

**Resposta comentada:** Falta de serverRechecks.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 5

**Enunciado:** Qual reteste aplicar?

**Resposta comentada:** Allow/deny server-side em fixture autorizada.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 6

**Enunciado:** O que faltaria para produção?

**Resposta comentada:** Testes de sessão, replay, logs e autenticação.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Rubrica objetiva

- Questões 1–6: 15 pontos cada (90); atribuir nota só mediante mecanismo e evidência fundamentados.
- Laboratório com teste positivo, negativo e limite: 10 pontos.
- Aprovação do exercício: pelo menos 80/100 sem erro eliminatório; não é nota editorial nem teste de aprendizado com humanos.
- **Erro eliminatório:** confundir indício com prova de malware, operar bypass de software de terceiros, ignorar escopo ou só bloquear uso legítimo.
- **Limite do laboratório:** É apenas modelo de arquitetura, não pentest nem fluxo real de autenticação.
