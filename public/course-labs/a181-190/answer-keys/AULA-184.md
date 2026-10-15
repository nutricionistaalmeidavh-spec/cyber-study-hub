# Gabarito AULA-184 — Privilege Escalation — exercício controlado

**Uso:** avaliar apenas após tentativa independente. Respostas equivalentes com evidência e limites corretos são aceitas.

## Soluções esperadas — caso de transferência

1. **Qual campo invalida a concessão?** Papel concedido difere do papel autorizado; prazo também excede o aprovado.

2. **Por que aprovação não é um simples booleano?** É necessário vincular identidade, papel, escopo, aprovador, instante e expiração.

3. **Que dois eventos precisam aparecer em logs?** Concessão antes/depois e revogação, com identidade e correlação ao ticket.

4. **Qual controle limita o prazo?** Expiração automática mais revisão periódica de acessos.

5. **Qual é o falso positivo plausível?** Plantão excepcional documentado e aprovado no escopo correto.

6. **Como demonstrar correção e caso legítimo preservado?** Negar admin, autorizar analyst dentro de uma hora e verificar revogação no modelo de auditoria.

## Rubrica analítica (6 pontos)

- Cada resposta vale 1 ponto apenas se nomear o aspecto técnico da pergunta e justificar usando os dados do cenário.
- **Aprovado:** 5/6 ou 6/6, desde que nenhuma conclusão apresente dado sintético como incidente real.
- **Revisão obrigatória:** qualquer recomendação de atacar terceiros, coletar credenciais verdadeiras ou desativar defesa real no laboratório; a atividade deve continuar exclusivamente com fixtures.
- Para responder sem decorar, altere um campo permitido em `fixtures[184]` e explique como a previsão mudaria; a rubrica exige raciocínio, não strings exatas.

**Evidência mínima do aluno:** anotação de `positive.status`, `negative.status`, mudança da entrada, falso positivo, plano de reteste e limitações. Os status são do modelo e não atestam incidente, ferramenta comercial, SOC ou infraestrutura em produção.

**Fonte primária:** https://attack.mitre.org/tactics/TA0004/
