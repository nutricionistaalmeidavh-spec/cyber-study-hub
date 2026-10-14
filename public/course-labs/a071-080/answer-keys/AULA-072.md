# AULA-072 — Respostas comentadas da prova independente

Abra depois de registrar sua tentativa. Nota A é avaliação editorial assistida por IA, não nota individual nem experimento com alunos.

**Cenário da atividade:** A conta svc-report pertence à OU Services e ao grupo Readers, expõe SPN HTTP/reports.lab.test; a exportação anterior também publicou um campo password sintético.

## Questão 1

**Enunciado:** Quais campos são necessários e qual deve ser ocultado?

**Resposta e justificativa:** id, type, ou, spns e memberOf; password deve ficar fora da projeção.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 2

**Enunciado:** Por que SPN não prova acesso administrativo?

**Resposta e justificativa:** SPN identifica serviço; direitos são determinados por membership e ACLs efetivas.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 3

**Enunciado:** Como verificar que o inventário é somente leitura?

**Resposta e justificativa:** Conferir operações, permissões e ausência de escrita em auditoria; o modelo só faz projeção.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 4

**Enunciado:** Que resultado distingue a consulta autorizada da não autorizada?

**Resposta e justificativa:** A primeira gera ficha sem segredo; a segunda é recusada antes da listagem.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 5

**Enunciado:** Como investigar privilégios herdados sem concluir prematuramente?

**Resposta e justificativa:** Expandir membership, ACLs, trusts e escopos e comparar com baseline.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 6

**Enunciado:** Por que este modelo não equivale a LDAP real?

**Resposta e justificativa:** Não realiza bind, filtros, limites de diretório, replicação ou autorização server-side.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Rubrica de correção

- 6 perguntas × 15 pontos = 90. Avaliar decisão, mecanismo, evidência e contraexemplo.
- 10 pontos pela execução, reteste e explicação do limite.
- Aprovação do exercício: 80/100 sem erro eliminatório; separada da classificação editorial.
- **Erro eliminatório:** propor somente desligar o serviço legítimo, afirmar intrusão comprovada por simulação ou ignorar autorização.
- Limite técnico do cenário: Array JSON local não oferece consultas LDAP reais, trusts, paginação, ACL efetiva ou nested groups.
