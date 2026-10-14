# AULA-077 — Respostas comentadas da prova independente

Abra depois de registrar sua tentativa. Nota A é avaliação editorial assistida por IA, não nota individual nem experimento com alunos.

**Cenário da atividade:** A equipe implantou LAPS e tiering, mas não concluiu gMSA, inventário NTLM nem teste de rollback; querem desabilitar legado imediatamente.

## Questão 1

**Enunciado:** Quais são os gaps exatos?

**Resposta e justificativa:** gMSA, NTLM inventory e rollback test.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 2

**Enunciado:** Como LAPS e gMSA se distinguem?

**Resposta e justificativa:** LAPS gere senha de conta local; gMSA gere senha de conta de serviço de domínio.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 3

**Enunciado:** Por que não desligar NTLM sem inventário?

**Resposta e justificativa:** Pode quebrar serviços e impedir autenticações críticas.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 4

**Enunciado:** Qual teste positivo protege continuidade?

**Resposta e justificativa:** Serviço e administração autorizados continuam após piloto.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 5

**Enunciado:** Como verificar cobertura real de hardening?

**Resposta e justificativa:** Eventos de rotação, inventário de clientes, compliance e testes de failover.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 6

**Enunciado:** O que significa readyForEnforcement=true aqui?

**Resposta e justificativa:** Somente prontidão dos campos sintéticos, não autorização automática de mudança.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Rubrica de correção

- 6 perguntas × 15 pontos = 90. Avaliar decisão, mecanismo, evidência e contraexemplo.
- 10 pontos pela execução, reteste e explicação do limite.
- Aprovação do exercício: 80/100 sem erro eliminatório; separada da classificação editorial.
- **Erro eliminatório:** propor somente desligar o serviço legítimo, afirmar intrusão comprovada por simulação ou ignorar autorização.
- Limite técnico do cenário: Checklist não comprova configuração efetiva de AD, Windows LAPS ou compatibilidade de serviços.
