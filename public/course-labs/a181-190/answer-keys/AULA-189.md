# Gabarito AULA-189 — Arquitetura conceitual de C2

**Uso:** avaliar apenas após tentativa independente. Respostas equivalentes com evidência e limites corretos são aceitas.

## Soluções esperadas — caso de transferência

1. **Regularidade é evidência suficiente de C2?** Não. Ferramentas autorizadas também produzem periodicidade.

2. **Que contexto explica a mudança?** Ticket de manutenção, versão, proprietário, destino e assinatura do processo.

3. **Que métrica temporal usaria?** Intervalos entre timestamps e dispersão/jitter, sem inferir atribuição.

4. **Como reduzir falso positivo com segurança?** Correlacionar processo, proprietário, janela, destino e baseline antes de alertar.

5. **O que uma série irregular prova?** Não descarta ameaça; apenas enfraquece uma hipótese de periodicidade forte.

6. **Qual critério exige investigação?** Destino/processo não aprovados e ausência de justificativa, com telemetria suficiente.

## Rubrica analítica (6 pontos)

- Cada resposta vale 1 ponto apenas se nomear o aspecto técnico da pergunta e justificar usando os dados do cenário.
- **Aprovado:** 5/6 ou 6/6, desde que nenhuma conclusão apresente dado sintético como incidente real.
- **Revisão obrigatória:** qualquer recomendação de atacar terceiros, coletar credenciais verdadeiras ou desativar defesa real no laboratório; a atividade deve continuar exclusivamente com fixtures.
- Para responder sem decorar, altere um campo permitido em `fixtures[189]` e explique como a previsão mudaria; a rubrica exige raciocínio, não strings exatas.

**Evidência mínima do aluno:** anotação de `positive.status`, `negative.status`, mudança da entrada, falso positivo, plano de reteste e limitações. Os status são do modelo e não atestam incidente, ferramenta comercial, SOC ou infraestrutura em produção.

**Fonte primária:** https://attack.mitre.org/tactics/TA0011/
