# AULA-076 — Respostas comentadas da prova independente

Abra depois de registrar sua tentativa. Nota A é avaliação editorial assistida por IA, não nota individual nem experimento com alunos.

**Cenário da atividade:** GPO Workstations baseline vinculada a OU=Workstations, securityFilter Employees; helpdesk possui edição não aprovada, e Guests não devem receber essa política.

## Questão 1

**Enunciado:** Por que Employees recebe GPO e Guests não?

**Resposta e justificativa:** Apenas Employees está no securityFilter, embora ambos estejam na OU.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 2

**Enunciado:** Que risco existe sem aplicação no host Guest?

**Resposta e justificativa:** Editor helpdesk ainda pode alterar o objeto GPO em escopo mais amplo.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 3

**Enunciado:** Que permissão remover sem bloquear política válida?

**Resposta e justificativa:** Edição não aprovada de helpdesk; manter GPO-Admins.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 4

**Enunciado:** Como observar efeito real além do link?

**Resposta e justificativa:** RSOP/gpresult, filtros, ordem e log de processamento.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 5

**Enunciado:** O que significa applies=false na simulação?

**Resposta e justificativa:** Só que os dois filtros modelados não correspondem, não que a GPO esteja desativada em produção.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 6

**Enunciado:** Quais mecanismos o exercício não implementa?

**Resposta e justificativa:** LSDOU, enforcement, WMI, herança e overrides.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Rubrica de correção

- 6 perguntas × 15 pontos = 90. Avaliar decisão, mecanismo, evidência e contraexemplo.
- 10 pontos pela execução, reteste e explicação do limite.
- Aprovação do exercício: 80/100 sem erro eliminatório; separada da classificação editorial.
- **Erro eliminatório:** propor somente desligar o serviço legítimo, afirmar intrusão comprovada por simulação ou ignorar autorização.
- Limite técnico do cenário: Não modela LSDOU, links enforced, bloqueio de herança, WMI, loopback ou precedência completa.
