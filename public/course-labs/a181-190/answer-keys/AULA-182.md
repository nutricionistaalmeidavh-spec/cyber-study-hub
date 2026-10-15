# Gabarito AULA-182 — Adversary Emulation

**Uso:** avaliar apenas após tentativa independente. Respostas equivalentes com evidência e limites corretos são aceitas.

## Soluções esperadas — caso de transferência

1. **A relação pai-filho está confirmada?** Não. PID igual em hosts distintos não implica parentesco.

2. **Qual campo impede uma correlação falsa?** Host deve coincidir, além do PPID e da ordem temporal.

3. **Que telemetria adicional você pediria?** Horários, identificador de sessão, usuário e origem de executável.

4. **Qual hipótese benigna permanece plausível?** Processo de atualização ou ferramenta administrativa legitimamente iniciada.

5. **Que tipo de regra elevaria risco sem provas?** Regra que sinaliza apenas o nome 'child-lab' como execução maliciosa.

6. **Como retestaria após ajuste?** Inserir evento pai legítimo no mesmo host e confirmar CHAIN_OK, mantendo o caso entre hosts como REVIEW_LINEAGE.

## Rubrica analítica (6 pontos)

- Cada resposta vale 1 ponto apenas se nomear o aspecto técnico da pergunta e justificar usando os dados do cenário.
- **Aprovado:** 5/6 ou 6/6, desde que nenhuma conclusão apresente dado sintético como incidente real.
- **Revisão obrigatória:** qualquer recomendação de atacar terceiros, coletar credenciais verdadeiras ou desativar defesa real no laboratório; a atividade deve continuar exclusivamente com fixtures.
- Para responder sem decorar, altere um campo permitido em `fixtures[182]` e explique como a previsão mudaria; a rubrica exige raciocínio, não strings exatas.

**Evidência mínima do aluno:** anotação de `positive.status`, `negative.status`, mudança da entrada, falso positivo, plano de reteste e limitações. Os status são do modelo e não atestam incidente, ferramenta comercial, SOC ou infraestrutura em produção.

**Fonte primária:** https://attack.mitre.org/techniques/T1059/
