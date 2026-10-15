# Gabarito separado — AULA-216: Correções e Hardening

> Abra após escrever as respostas. Este gabarito descreve o modelo determinístico EscolaLab, não observação de aluno.

## Oráculo e análise

Alice 200/200; Bob 200/403; Mallory 404/404. O modo corrected preserva uso legítimo e nega o caso indevido.

**Causa / princípio:** Autorização exige relação entre ator autenticado, recurso e operação no componente que tem autoridade sobre dados. A decisão de modo corrected compara target.owner===actor; na produção seria necessário identidade verificada, controle de sessão, tenants e política de dados.

**Contraprova:** Tentar remediar com bloqueio de toda rota geraria Bob 403 mas Alice também falharia; classifique essa alternativa como regressão funcional.

## Perguntas resolvidas

1. **Por que ocultar botão não corrige BOLA?** Clientes podem solicitar a rota sem passar pela interface.

2. **Qual componente deve comparar sujeito e proprietário?** Servidor autorizado que controla a leitura do objeto.

3. **Por que a condição owner===actor é insuficiente em produção?** O ator seria fornecido pelo cliente; produção exige identidade autenticada e políticas adicionais.

4. **Como provar que não houve bloqueio excessivo?** Alice deve continuar recebendo 200 após alterar o controle.

5. **Detecção substitui correção preventiva?** Não. Detecção revela evento; autorização evita sua ocorrência.

6. **Qual evidência vincula correção à hipótese original?** Mesmo F001, ator e testes H1–H3 nas versões vulnerable e corrected.

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

**Fonte:** https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
