# Gabarito AULA-188 — Defense Evasion — conceitos

**Uso:** avaliar apenas após tentativa independente. Respostas equivalentes com evidência e limites corretos são aceitas.

## Soluções esperadas — caso de transferência

1. **A ausência prova evasão?** Não. Ausência isolada não atribui intenção nem causa.

2. **Qual hipótese não adversarial é forte?** Manutenção, atraso, filtro ou falha na fonte identity.

3. **Que dado precisa vir do coletor?** Saúde, sequência, carimbo de tempo, backlog e configuração do pipeline.

4. **Como evitar falso negativo de cobertura?** Não declarar cobertura quando a fonte essencial não está presente.

5. **Qual é a decisão prudente?** Registrar GAP_IDENTIFIED, investigar pipeline e suspender afirmação de visibilidade plena.

6. **Como demonstrar recuperação de visibilidade?** Reinserir evento esperado na fixture e obter COVERED; em produção exigir métricas de ingestão.

## Rubrica analítica (6 pontos)

- Cada resposta vale 1 ponto apenas se nomear o aspecto técnico da pergunta e justificar usando os dados do cenário.
- **Aprovado:** 5/6 ou 6/6, desde que nenhuma conclusão apresente dado sintético como incidente real.
- **Revisão obrigatória:** qualquer recomendação de atacar terceiros, coletar credenciais verdadeiras ou desativar defesa real no laboratório; a atividade deve continuar exclusivamente com fixtures.
- Para responder sem decorar, altere um campo permitido em `fixtures[188]` e explique como a previsão mudaria; a rubrica exige raciocínio, não strings exatas.

**Evidência mínima do aluno:** anotação de `positive.status`, `negative.status`, mudança da entrada, falso positivo, plano de reteste e limitações. Os status são do modelo e não atestam incidente, ferramenta comercial, SOC ou infraestrutura em produção.

**Fonte primária:** https://attack.mitre.org/tactics/TA0005/
