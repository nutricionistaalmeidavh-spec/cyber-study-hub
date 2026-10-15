# Gabarito AULA-187 — Lateral Movement — laboratório

**Uso:** avaliar apenas após tentativa independente. Respostas equivalentes com evidência e limites corretos são aceitas.

## Soluções esperadas — caso de transferência

1. **Por que a direção importa?** Escopo permite pares orientados de origem e destino; inversão não herda autorização.

2. **Quais metadados ligam o evento ao usuário?** Conta, host, carimbo de tempo, sessão, ticket e fator de autenticação.

3. **É ataque confirmado?** Não; atividade remota fora da política requer investigação e correlação.

4. **Qual autorização seria necessária?** Permissão específica de LAB02→LAB01 e nova janela com aprovação.

5. **Que controle de rede ajuda?** ACL/segmentação por zona e autenticação forte em endpoint gerenciado.

6. **Como retestar com falso positivo controlado?** Testar sessão aprovada LAB01→LAB02 e cenário fora da janela; só o primeiro deve ser autorizado.

## Rubrica analítica (6 pontos)

- Cada resposta vale 1 ponto apenas se nomear o aspecto técnico da pergunta e justificar usando os dados do cenário.
- **Aprovado:** 5/6 ou 6/6, desde que nenhuma conclusão apresente dado sintético como incidente real.
- **Revisão obrigatória:** qualquer recomendação de atacar terceiros, coletar credenciais verdadeiras ou desativar defesa real no laboratório; a atividade deve continuar exclusivamente com fixtures.
- Para responder sem decorar, altere um campo permitido em `fixtures[187]` e explique como a previsão mudaria; a rubrica exige raciocínio, não strings exatas.

**Evidência mínima do aluno:** anotação de `positive.status`, `negative.status`, mudança da entrada, falso positivo, plano de reteste e limitações. Os status são do modelo e não atestam incidente, ferramenta comercial, SOC ou infraestrutura em produção.

**Fonte primária:** https://attack.mitre.org/tactics/TA0008/
