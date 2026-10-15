# Gabarito separado — AULA-212: Pentest controlado — hipóteses e validação

> Abra após escrever as respostas. Este gabarito descreve o modelo determinístico EscolaLab, não observação de aluno.

## Oráculo e análise

vulnerable: Alice 200, Bob 200, desconhecido 404; corrected: Alice 200, Bob 403, desconhecido 404.

**Causa / princípio:** Uma hipótese deve ter ativo, ator, modo, condição inicial, oráculo, evidência e critério de parada. BOLA/IDOR aparece quando a autoridade de acesso a objetos não é verificada no servidor.

**Contraprova:** Se Bob já receber 403 no modo vulnerable, não marque 'explorado': classifique como hipótese refutada/inconclusiva e investigue a versão do laboratório.

## Perguntas resolvidas

1. **Como diferenciar hipótese de comando de scanner?** Hipótese prevê decisão observável e possibilidade de refutação; scanner é só um meio de obter dados.

2. **Por que Alice é teste positivo obrigatório?** Bloquear Alice também poderia ocultar falha à custa da função legítima.

3. **Qual relação entre IDOR e propriedade F001?** A leitura requer autorização específica ao objeto e não apenas identidade declarada.

4. **Bob 200 em corrected confirma qual problema?** Indica ausência do controle esperado na variante corrigida — deve ser investigado, sem afirmar produto real.

5. **Como registrar uma saída diferente do previsto sem forçar conclusão?** Marque refutado ou inconclusivo, guarde versão/observado e reconcilie o oráculo.

6. **Quando a execução deve parar?** Quando cada decisão mínima estiver registrada ou o escopo/ambiente deixar de corresponder.

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

**Fonte:** https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/
