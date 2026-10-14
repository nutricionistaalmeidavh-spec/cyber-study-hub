# AULA-074 — Respostas comentadas da prova independente

Abra depois de registrar sua tentativa. Nota A é avaliação editorial assistida por IA, não nota individual nem experimento com alunos.

**Cenário da atividade:** O grafo de inventário mostra ana→ops (memberOf) e ops→admins (WriteDACL); é necessário encontrar e quebrar o alcance sem executar exploração.

## Questão 1

**Enunciado:** Desenhe as duas arestas e identifique direitos.

**Resposta e justificativa:** ana memberOf ops; ops WriteDACL admins.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 2

**Enunciado:** O que um caminho no grafo realmente comprova?

**Resposta e justificativa:** Alcance na representação, não execução nem administração obtida.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 3

**Enunciado:** Que aresta remover sem prejudicar o membership?

**Resposta e justificativa:** ops→admins WriteDACL, após revisão.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 4

**Enunciado:** Que controle positivo deve continuar verde?

**Resposta e justificativa:** ana→ops segue alcançável e funções comuns permanecem disponíveis.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 5

**Enunciado:** Como evitar loop infinito com ciclo ana→ops→ana?

**Resposta e justificativa:** Usar visited e explorar cada nó uma vez.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 6

**Enunciado:** O que falta para validar exploração potencial real?

**Resposta e justificativa:** ACL efetiva, trust, grupos, owners, negações e contexto de autenticação.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Rubrica de correção

- 6 perguntas × 15 pontos = 90. Avaliar decisão, mecanismo, evidência e contraexemplo.
- 10 pontos pela execução, reteste e explicação do limite.
- Aprovação do exercício: 80/100 sem erro eliminatório; separada da classificação editorial.
- **Erro eliminatório:** propor somente desligar o serviço legítimo, afirmar intrusão comprovada por simulação ou ignorar autorização.
- Limite técnico do cenário: Grafo simplificado ignora ACL efetiva, credenciais, negações e pré-condições do AD real.
