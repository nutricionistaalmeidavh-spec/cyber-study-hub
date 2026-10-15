# Gabarito separado — AULA-214: Coleta e análise de logs

> Abra após escrever as respostas. Este gabarito descreve o modelo determinístico EscolaLab, não observação de aluno.

## Oráculo e análise

Dois JSONs em UTC: Bob status 200 no modo vulnerable; Bob status 403 no corrected. O nome classification não substitui avaliação contextual.

**Causa / princípio:** Log de auditoria descreve decisão observada, não sua legitimidade. A classificação observed emitida em 200 não significa 'autorizado'. Fonte, carimbo temporal e modo são essenciais para interpretação.

**Contraprova:** Se os timestamps não tiverem ordenação confiável, identifique a lacuna; nunca invente eventos ausentes nem conclua 'nenhum incidente' apenas por falta de log.

## Perguntas resolvidas

1. **Por que 'observed' não quer dizer 'autorizado'?** É uma etiqueta mecânica do retorno HTTP, sem consulta à política de autorização.

2. **Qual o valor de usar timestamp UTC?** Permite ordenação e correlação independente do fuso da máquina.

3. **Que diferença entre log e evidência de impacto?** Log registra evento; impacto exige hipóteses e regra de interpretação junto ao ativo.

4. **Por que não guardar tokens ou corpo de resposta?** Evita vazamento de material sensível e desnecessário para decidir esta hipótese.

5. **O que representa status 403 no modo corrigido?** A regra por objeto negou a leitura de Bob na fixture.

6. **Se eventos estiverem fora de ordem, qual conclusão é segura?** Marcar incerteza de sequência e reconciliar clock/versão antes de inferir causa.

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

**Fonte:** https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
