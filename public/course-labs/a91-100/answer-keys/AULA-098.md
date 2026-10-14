# AULA-098 — gabarito e rubrica: Process Trees

1. PID pode ser reutilizado e não identifica a mesma instância ao longo do tempo; GUID e tempo são necessários.
2. Orphan significa pai referenciado, mas ausente nos dados; raiz conhecida tem parentGuid explicitamente vazio.
3. Manter conjunto de GUIDs visitados e terminar ao encontrar repetição com estado cycle.
4. Aplicativos legítimos podem iniciar ações incomuns; nome não comprova a legitimidade da cadeia.
5. IDs estáveis, horário, host, usuário, hash e argumentos dos processos, além da qualidade da fonte.
6. a→b→c produz complete; vínculo faltante produz orphan; relação circular produz cycle.

## Rubrica — 100 pontos
- Identidade e mecanismo: 20.
- Caso positivo: 20.
- Controles negativos: 20.
- Investigação defensiva e reteste: 20.
- Riscos e limitações: 20.

**Erro eliminatório:** inventar um nó ausente e registrar uma árvore completa sem evidência.

Fonte: https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer
