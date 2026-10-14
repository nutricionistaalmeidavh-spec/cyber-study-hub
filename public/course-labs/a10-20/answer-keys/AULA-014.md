# Gabarito independente — AULA-014

**Uso:** conferir somente após registrar a própria tentativa. Cenário e dados são fictícios, sem dependências comerciais.

## Respostas de referência para o cenário de transferência

**Cenário:** https://aluno.exemplo.test acessa uma API que autoriza apenas https://portal.exemplo.test com cookies. O desenvolvedor quer usar '*' para corrigir erro no console.

1. **Tabela de confiança:** identifique qual dado é enviado pelo cliente e qual estado deve vir de fonte confiável. Nomeie o servidor/browser/armazenamento que decide. Resultado esperado não é apenas um status: deve haver preservação do controle e do estado.
2. **Caminho legítimo:** defina a identidade ou recurso autorizado e descreva saída observável coerente. Não bloqueie indiscriminadamente todos os casos: Use origens exatas, Vary: Origin, autorize cada recurso no backend e revise política de cookies. Não confunda negar leitura JS com impedir envio de uma ação.
3. **Negativo isolado:** altere só a condição adversária. A prova requer mais que status: Origem exata recebe allow-origin e Vary; duas origens diferentes não recebem allow-origin.
4. **Correção causal:** CORS é aplicado pelo navegador; curl e Node podem ver uma resposta que o script de outra origem não consegue ler. Headers CORS não autenticam pessoas. Cookies cross-site e credentials requerem política deliberada; '*' não combina com resposta credenciada. **Erro eliminatório:** Liberar '*' e achar que o endpoint está autenticado.
5. **Regressão:** repita o negativo idêntico depois da defesa, com evidência de ausência do efeito proibido. Repita também o positivo e confirme que o usuário legítimo continua usando a funcionalidade.
6. **Limitações:** verifique a transferência apenas em sistema próprio/autorizado. Resposta HTTP 200 observada fora do navegador não significa que CORS liberou a leitura pelo script da página.

## Rubrica de correção

| Critério | Pontos | Evidência exigida |
| --- | ---: | --- |
| Fronteira e fonte de verdade | 20 | Quatro campos coerentes na tabela da questão 1 |
| Fluxo positivo | 15 | Estado inicial, ação permitida e resultado verificável |
| Negativo | 20 | Uma variável alterada, hipótese e observação do efeito |
| Correção causal | 20 | Controle no componente decisor sem confiança no cliente |
| Reteste | 15 | Um negativo e um positivo + estado persistido ou evento |
| Limites e escopo | 10 | Não generaliza a simulação e mantém ambiente autorizado |

**Aprovação recomendada:** 80/100 sem erro eliminatório. A rubrica mede competência demonstrada nessa atividade e não constitui teste observacional com estudantes reais ou certificado de segurança.
