# Gabarito AULA-190 — Purple Team Exercise

**Uso:** avaliar apenas após tentativa independente. Respostas equivalentes com evidência e limites corretos são aceitas.

## Soluções esperadas — caso de transferência

1. **Qual é a cobertura de telemetria?** 3/4=75% dos casos possuem fonte suficiente.

2. **Quantos alertas corretos existem?** Dois alertas corretos, conforme a tabela do cenário; separar de cobertura.

3. **Qual falso positivo precisa de ajuste?** O evento benigno alertado; investigar regra e manter o caso negativo.

4. **Por que o caso sem eventos é particularmente crítico?** Sem telemetria não é possível distinguir falha de detecção de falha de coleta.

5. **Como tornar a melhoria auditável?** Registrar tabela antes/depois, origem dos eventos, dono do ajuste e repetir mesma fixture.

6. **Quais critérios aprovam o capstone?** ROE, quatro casos com evidência, regra justificada, teste negativo, gap priorizado e reteste idêntico.

## Rubrica analítica (6 pontos)

- Cada resposta vale 1 ponto apenas se nomear o aspecto técnico da pergunta e justificar usando os dados do cenário.
- **Aprovado:** 5/6 ou 6/6, desde que nenhuma conclusão apresente dado sintético como incidente real.
- **Revisão obrigatória:** qualquer recomendação de atacar terceiros, coletar credenciais verdadeiras ou desativar defesa real no laboratório; a atividade deve continuar exclusivamente com fixtures.
- Para responder sem decorar, altere um campo permitido em `fixtures[190]` e explique como a previsão mudaria; a rubrica exige raciocínio, não strings exatas.

**Evidência mínima do aluno:** anotação de `positive.status`, `negative.status`, mudança da entrada, falso positivo, plano de reteste e limitações. Os status são do modelo e não atestam incidente, ferramenta comercial, SOC ou infraestrutura em produção.

**Fonte primária:** https://attack.mitre.org/resources/working-with-attack/
