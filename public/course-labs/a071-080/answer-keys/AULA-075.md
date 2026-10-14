# AULA-075 — Respostas comentadas da prova independente

Abra depois de registrar sua tentativa. Nota A é avaliação editorial assistida por IA, não nota individual nem experimento com alunos.

**Cenário da atividade:** Ops usa jump→server-a via logon tipo 3 autorizado; surge workstation→server-b via tipo 10 não previsto na allowlist.

## Questão 1

**Enunciado:** Classifique jump→server-a e workstation→server-b.

**Resposta e justificativa:** Primeira rota allowed e segunda review segundo a allowlist.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 2

**Enunciado:** Por que logon remoto não prova ataque?

**Resposta e justificativa:** Pode ser atividade administrativa autorizada; verificar contexto.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 3

**Enunciado:** Quais dados mínimos enriquecem a triagem?

**Resposta e justificativa:** User, origem, destino, tipo, timestamp, processo e ticket.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 4

**Enunciado:** Qual operação precisa seguir funcionando após remediação?

**Resposta e justificativa:** Administração aprovada via jump→server-a.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 5

**Enunciado:** O que comprova correção da rota imprópria?

**Resposta e justificativa:** Teste autorizado mostra recusa da rota indevida e sucesso da aprovada.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 6

**Enunciado:** Quando reuso de credenciais aumenta o risco?

**Resposta e justificativa:** Quando a mesma conta funciona em hosts e domínios além do escopo previsto.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Rubrica de correção

- 6 perguntas × 15 pontos = 90. Avaliar decisão, mecanismo, evidência e contraexemplo.
- 10 pontos pela execução, reteste e explicação do limite.
- Aprovação do exercício: 80/100 sem erro eliminatório; separada da classificação editorial.
- **Erro eliminatório:** propor somente desligar o serviço legítimo, afirmar intrusão comprovada por simulação ou ignorar autorização.
- Limite técnico do cenário: Não cria sessão SMB, RDP, WinRM nem executa hosts; não comprova movimento lateral.
