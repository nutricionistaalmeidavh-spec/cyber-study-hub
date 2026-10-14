# AULA-078 — Respostas comentadas da prova independente

Abra depois de registrar sua tentativa. Nota A é avaliação editorial assistida por IA, não nota individual nem experimento com alunos.

**Cenário da atividade:** Às 13:00Z 4728 registra Ana adicionada a Domain Admins; às 13:05Z 4624 mostra logon de Ana. O ticket CHG-27, quando presente, contextualiza a mudança.

## Questão 1

**Enunciado:** Qual sequência precisa existir para gerar triagem?

**Resposta e justificativa:** 4728 de Ana em Domain Admins seguido de 4624 da mesma Ana em até dez minutos.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 2

**Enunciado:** Como o ticket altera a severidade?

**Resposta e justificativa:** Marca expected, mas mantém trilha auditável para confirmar autorização.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 3

**Enunciado:** Por que 4624 isolado não é incidente?

**Resposta e justificativa:** Registra sucesso de logon, não comprova alteração de grupo ou intrusão.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 4

**Enunciado:** Como evitar falso positivo por relógios distintos?

**Resposta e justificativa:** Sincronizar/normalizar UTC e considerar latência e integridade da coleta.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 5

**Enunciado:** Qual reteste negativo verifica a janela?

**Resposta e justificativa:** Logon após 60 min não gera correlação na regra atual.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 6

**Enunciado:** O que faltaria para produção?

**Resposta e justificativa:** Auditoria DC completa, grupos e eventos correlatos, ticket validado e SIEM com cobertura.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Rubrica de correção

- 6 perguntas × 15 pontos = 90. Avaliar decisão, mecanismo, evidência e contraexemplo.
- 10 pontos pela execução, reteste e explicação do limite.
- Aprovação do exercício: 80/100 sem erro eliminatório; separada da classificação editorial.
- **Erro eliminatório:** propor somente desligar o serviço legítimo, afirmar intrusão comprovada por simulação ou ignorar autorização.
- Limite técnico do cenário: Não há DC real nem SIEM; não modela atraso, 4732, 4756, falhas de cobertura ou logon types.
