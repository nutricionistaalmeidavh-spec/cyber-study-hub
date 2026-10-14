# Gabarito independente — AULA-012

**Uso:** conferir somente após registrar a própria tentativa. Cenário e dados são fictícios, sem dependências comerciais.

## Respostas de referência para o cenário de transferência

**Cenário:** Um exportador de prontuários recebe ID P202 da clínica beta, mas quem solicita está na clínica alfa.

1. **Tabela de confiança:** identifique qual dado é enviado pelo cliente e qual estado deve vir de fonte confiável. Nomeie o servidor/browser/armazenamento que decide. Resultado esperado não é apenas um status: deve haver preservação do controle e do estado.
2. **Caminho legítimo:** defina a identidade ou recurso autorizado e descreva saída observável coerente. Não bloqueie indiscriminadamente todos os casos: Vincule queries ao tenant autenticado; evite logs com dados da fatura e confirme caso legítimo após correção.
3. **Negativo isolado:** altere só a condição adversária. A prova requer mais que status: org-b: 404 e corpo nulo na versão protegida; org-a: 200 para a mesma F101.
4. **Correção causal:** Buscar a fatura por ID não conclui a autorização. A consulta precisa restringir pelo tenant da sessão ou usar guard equivalente antes da resposta. Teste leitura individual, listagem, exportação e escrita. IDs aleatórios não são política de acesso. **Erro eliminatório:** Expor o PDF porque o ID foi fornecido corretamente.
5. **Regressão:** repita o negativo idêntico depois da defesa, com evidência de ausência do efeito proibido. Repita também o positivo e confirme que o usuário legítimo continua usando a funcionalidade.
6. **Limitações:** verifique a transferência apenas em sistema próprio/autorizado. 404 não é suficiente como prova quando o recurso sequer existe; o teste usa objeto sabidamente presente da outra empresa.

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
