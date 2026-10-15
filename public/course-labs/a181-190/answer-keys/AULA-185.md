# Gabarito AULA-185 — Persistence — ofensivo e defensivo

**Uso:** avaliar apenas após tentativa independente. Respostas equivalentes com evidência e limites corretos são aceitas.

## Soluções esperadas — caso de transferência

1. **O que mudou em relação ao baseline?** Caminho executado mudou para origem não aprovada.

2. **Qual parte é gatilho e qual é artefato?** Horário diário é o gatilho; definição da tarefa e caminho do comando são artefatos.

3. **Que fontes de auditoria ajudariam?** Eventos de criação e edição de tarefa, identidade do autor, inventário e metadados do arquivo.

4. **Por que não apagar sem preservar evidência?** Preservar quem, quando, antes/depois e hipótese para investigação.

5. **Que exceção legítima é possível?** Atualizador assinado com mudança documentada; exige validação.

6. **Como comprovar rollback no exercício?** Remover a definição sintética, confirmar ausência no inventário simulado e restaurar baseline conhecido.

## Rubrica analítica (6 pontos)

- Cada resposta vale 1 ponto apenas se nomear o aspecto técnico da pergunta e justificar usando os dados do cenário.
- **Aprovado:** 5/6 ou 6/6, desde que nenhuma conclusão apresente dado sintético como incidente real.
- **Revisão obrigatória:** qualquer recomendação de atacar terceiros, coletar credenciais verdadeiras ou desativar defesa real no laboratório; a atividade deve continuar exclusivamente com fixtures.
- Para responder sem decorar, altere um campo permitido em `fixtures[185]` e explique como a previsão mudaria; a rubrica exige raciocínio, não strings exatas.

**Evidência mínima do aluno:** anotação de `positive.status`, `negative.status`, mudança da entrada, falso positivo, plano de reteste e limitações. Os status são do modelo e não atestam incidente, ferramenta comercial, SOC ou infraestrutura em produção.

**Fonte primária:** https://attack.mitre.org/techniques/T1053/
