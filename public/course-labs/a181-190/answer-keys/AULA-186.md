# Gabarito AULA-186 — Credential Access — conceitos e defesa

**Uso:** avaliar apenas após tentativa independente. Respostas equivalentes com evidência e limites corretos são aceitas.

## Soluções esperadas — caso de transferência

1. **Esse evento prova roubo de segredo real?** Não. Trata-se de marcador inerte; leitura não demonstra exfiltração.

2. **Que duas fontes de contexto faltam?** Janela/ticket de migração e identidade exata do backup no ativo.

3. **O que um canário pode e não pode provar?** Indica acesso a recurso isca, não revela propósito nem roubo de segredo real.

4. **Que princípio protege segredos reais?** Least privilege, isolamento de vault, não gravar tokens em log e rotação planejada.

5. **Quando há justificativa para reduzir ruído?** Após confirmar operação autorizada e preservar o alerta de leituras desconhecidas.

6. **Que resultado indicaria detecção útil?** O sistema distingue EXPECTED_READ de REVIEW_CANARY por identidade e autorização.

## Rubrica analítica (6 pontos)

- Cada resposta vale 1 ponto apenas se nomear o aspecto técnico da pergunta e justificar usando os dados do cenário.
- **Aprovado:** 5/6 ou 6/6, desde que nenhuma conclusão apresente dado sintético como incidente real.
- **Revisão obrigatória:** qualquer recomendação de atacar terceiros, coletar credenciais verdadeiras ou desativar defesa real no laboratório; a atividade deve continuar exclusivamente com fixtures.
- Para responder sem decorar, altere um campo permitido em `fixtures[186]` e explique como a previsão mudaria; a rubrica exige raciocínio, não strings exatas.

**Evidência mínima do aluno:** anotação de `positive.status`, `negative.status`, mudança da entrada, falso positivo, plano de reteste e limitações. Os status são do modelo e não atestam incidente, ferramenta comercial, SOC ou infraestrutura em produção.

**Fonte primária:** https://attack.mitre.org/tactics/TA0006/
