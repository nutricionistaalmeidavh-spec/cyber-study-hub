# Gabarito AULA-181 — Red Team Methodology

**Uso:** avaliar apenas após tentativa independente. Respostas equivalentes com evidência e limites corretos são aceitas.

## Soluções esperadas — caso de transferência

1. **Quais duas condições concretas impedem o teste?** LAB03 está fora do escopo e 02h está fora da janela; benignidade não substitui autorização.

2. **Que evidência comprova autorização antes de iniciar?** ROE aprovada, versão, aprovador e ticket antes do horário do exercício.

3. **Como deconfliction evitaria alarmes indevidos?** Aviso prévio ao responsável SOC, contato de emergência e identificador do teste.

4. **Qual evento determina parada imediata?** Perda de visibilidade, instabilidade ou acesso a dado externo; interromper e registrar.

5. **Que ação seria autorizada sem mudar a ROE?** Somente uma ação prevista em LAB01/LAB02 dentro da janela autorizada e sem stop condition.

6. **Quais campos constariam do relatório final?** Objetivo, ativos, janela, autorização, execução observada, evidência, condições de parada, rollback e risco residual.

## Rubrica analítica (6 pontos)

- Cada resposta vale 1 ponto apenas se nomear o aspecto técnico da pergunta e justificar usando os dados do cenário.
- **Aprovado:** 5/6 ou 6/6, desde que nenhuma conclusão apresente dado sintético como incidente real.
- **Revisão obrigatória:** qualquer recomendação de atacar terceiros, coletar credenciais verdadeiras ou desativar defesa real no laboratório; a atividade deve continuar exclusivamente com fixtures.
- Para responder sem decorar, altere um campo permitido em `fixtures[181]` e explique como a previsão mudaria; a rubrica exige raciocínio, não strings exatas.

**Evidência mínima do aluno:** anotação de `positive.status`, `negative.status`, mudança da entrada, falso positivo, plano de reteste e limitações. Os status são do modelo e não atestam incidente, ferramenta comercial, SOC ou infraestrutura em produção.

**Fonte primária:** https://csrc.nist.gov/pubs/sp/800/115/final
