# Gabarito AULA-183 — Initial Access em laboratório

**Uso:** avaliar apenas após tentativa independente. Respostas equivalentes com evidência e limites corretos são aceitas.

## Soluções esperadas — caso de transferência

1. **O hash correto prova que o artefato é seguro?** Não. Integridade não implica legitimidade ou ausência de conteúdo perigoso.

2. **Qual problema permanece na procedência?** Remetente e hash no mesmo canal não fornecem raiz de confiança independente.

3. **Que referência de hash seria confiável?** Manifesto aprovado por mantenedor, cadeia de assinatura ou repositório controlado.

4. **Que evento você registraria na estação?** Origem, arquivo, digest, identidade, data, fluxo de aprovação e decisão.

5. **Qual teste negativo faria?** Alterar um byte e verificar REVIEW_INTEGRITY mantendo o digest de referência.

6. **Quando a distribuição deveria ser barrada?** Quando a origem não puder ser estabelecida, mesmo que bytes e digest coincidam.

## Rubrica analítica (6 pontos)

- Cada resposta vale 1 ponto apenas se nomear o aspecto técnico da pergunta e justificar usando os dados do cenário.
- **Aprovado:** 5/6 ou 6/6, desde que nenhuma conclusão apresente dado sintético como incidente real.
- **Revisão obrigatória:** qualquer recomendação de atacar terceiros, coletar credenciais verdadeiras ou desativar defesa real no laboratório; a atividade deve continuar exclusivamente com fixtures.
- Para responder sem decorar, altere um campo permitido em `fixtures[183]` e explique como a previsão mudaria; a rubrica exige raciocínio, não strings exatas.

**Evidência mínima do aluno:** anotação de `positive.status`, `negative.status`, mudança da entrada, falso positivo, plano de reteste e limitações. Os status são do modelo e não atestam incidente, ferramenta comercial, SOC ou infraestrutura em produção.

**Fonte primária:** https://attack.mitre.org/tactics/TA0001/
