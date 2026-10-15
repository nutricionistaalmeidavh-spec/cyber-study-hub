# Gabarito separado — AULA-218: Relatório e apresentação final

> Abra após escrever as respostas. Este gabarito descreve o modelo determinístico EscolaLab, não observação de aluno.

## Oráculo e análise

Resumo estruturado: scope synthetic-local, before 200, after 403, positive 200, detector UNAUTHORIZED_READ_DEMO, produção não avaliada.

**Causa / princípio:** Comunicação de segurança separa escopo, método, achado, risco, controle, evidência, reteste, lacunas e próximo passo. Impacto de produção não pode ser inferido automaticamente de uma fixture didática.

**Contraprova:** Não escreva 'pentest aprovado', 'empresa segura' ou CVSS/CVE inventados; a evidência só sustenta comportamento da fixture.

## Perguntas resolvidas

1. **Qual é o achado demonstrado — e em que escopo?** Bob recebe 200 para F001 no modo fictício vulnerable, sem autorização baseada em propriedade.

2. **Por que não atribuir CVE ou CVSS ao exercício?** Não há vulnerabilidade atribuída a produto real nem cálculo fundamentado de gravidade.

3. **Qual prova apoia a eficácia do controle na fixture?** Bob corrigido 403 e Alice corrigida 200, ambos retestados com mesmo alvo.

4. **Por que incluir teste positivo na apresentação?** Evita elogiar bloqueio indiscriminado de todos os usuários.

5. **Que informações uma liderança precisa para decidir?** Risco, evidência, escopo, impacto simulado, responsável, plano, custo e limites.

6. **Que afirmação deve ser evitada no encerramento?** Não afirmar segurança de produção ou certificação por ter passado na fixture.

## Transferência a F002/Carol

O cenário F002/Carol é hipótese no papel. A fixture atual só reconhece F001, Alice e Bob. Uma resposta correta prevê a necessidade de alterar o dataset e vincular autorização à propriedade da fatura antes de executar; NÃO alega que F002 foi ensaiada. O teste positivo deveria permitir Carol ver o próprio objeto; o negativo deve impedir outro ator. Registre escopo e condição de parada.

## Rubrica (100 pontos)

| Dimensão | Pontos | Evidência observável |
|---|---:|---|
| Mecanismo e conceitos | 30 | Explicação do fluxo e da fronteira de confiança |
| Causa/defesa | 20 | Controle no componente que decide o acesso |
| Contraprova segura | 20 | Entrada, esperado, observado e interpretação |
| Reteste positivo | 20 | Ação legítima continua válida |
| Escopo/limites | 10 | Dados sintéticos, autorização e conclusão proporcional |

**Meta 80/100. Erro eliminatório:** testar fora de escopo ou inventar evidência. A classificação editorial A não equivale a uma nota do aluno nem validação humana.

**Fonte:** https://csrc.nist.gov/pubs/sp/800/115/final
