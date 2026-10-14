# AULA-073 — Respostas comentadas da prova independente

Abra depois de registrar sua tentativa. Nota A é avaliação editorial assistida por IA, não nota individual nem experimento com alunos.

**Cenário da atividade:** A OU=Admins contém ACE WriteDACL para helpdesk e ACE Read para audit. O relatório anterior chamou ambas de vulnerabilidades críticas.

## Questão 1

**Enunciado:** Qual ACE demanda revisão prioritária?

**Resposta e justificativa:** WriteDACL de helpdesk na OU sensível; Read é uma permissão diferente.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 2

**Enunciado:** Por que isso ainda não comprova escalada?

**Resposta e justificativa:** Caminho potencial não é execução de alteração ou acesso indevido.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 3

**Enunciado:** Que aprovação verificar antes de remover ACE?

**Resposta e justificativa:** Dono, justificativa, histórico, objeto e tarefas administrativas impactadas.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 4

**Enunciado:** Como preservar a atividade legítima?

**Resposta e justificativa:** Manter audit em Read e direitos mínimos do helpdesk em escopo próprio.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 5

**Enunciado:** Qual seria o negativo pós-correção?

**Resposta e justificativa:** WriteDACL sobre OU=Admins deixa de estar disponível para helpdesk.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 6

**Enunciado:** Por que allowlist de editores também merece auditoria?

**Resposta e justificativa:** Permitir um nome incorreto esconderia um risco; precisa de revisão independente.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Rubrica de correção

- 6 perguntas × 15 pontos = 90. Avaliar decisão, mecanismo, evidência e contraexemplo.
- 10 pontos pela execução, reteste e explicação do limite.
- Aprovação do exercício: 80/100 sem erro eliminatório; separada da classificação editorial.
- **Erro eliminatório:** propor somente desligar o serviço legítimo, afirmar intrusão comprovada por simulação ou ignorar autorização.
- Limite técnico do cenário: Não calcula DACL real, herança, deny, AdminSDHolder ou SDProp; filtro de ACL sintético.
