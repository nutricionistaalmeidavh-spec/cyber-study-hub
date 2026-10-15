# Gabarito separado — AULA-213: Exploração controlada e prova de impacto

> Abra após escrever as respostas. Este gabarito descreve o modelo determinístico EscolaLab, não observação de aluno.

## Oráculo e análise

Bob 200→403 e Alice 200; evidência registra apenas metadados/códigos, com condição de parada satisfeita.

**Causa / princípio:** Prova de conceito mínima confirma mecanismo causal com variação de uma condição. No EscolaLab, a identidade é um rótulo de fixture e a fatura F001 é fictícia; a saída não é prova de exfiltração ou pentest externo.

**Contraprova:** Não repita solicitações para IDs desconhecidos para 'aumentar o impacto'; não teste dados de clientes nem associe Bob fictício a uma pessoa real.

## Perguntas resolvidas

1. **200 de Bob no modelo comprova invasão de serviço real?** Não: trata-se de uma fixture intencionalmente vulnerável e sem autenticação real.

2. **Qual é a menor evidência suficiente para H2?** Ator Bob, modo vulnerable, F001 e status 200 observados.

3. **Por que preservar as versões testadas?** Sem versão não se reproduz a diferença de modo ou se atribui causa com segurança.

4. **O que fazer se a condição de parada já foi atingida?** Encerrar execução e registrar resultado; não expandir a exploração.

5. **Como registrar impacto sem exibir os dados da fatura?** Descreva tipo de dado fictício e decisão de autorização, não o payload.

6. **Que teste mostra que a defesa não bloqueou o uso legítimo?** Alice continua com 200 no modo corrected.

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
