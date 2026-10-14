# Gabarito independente — AULA-010

**Uso:** conferir somente após registrar a própria tentativa. Cenário e dados são fictícios, sem dependências comerciais.

## Respostas de referência para o cenário de transferência

**Cenário:** No serviço fictício de notas, GET /boletim?visao=curta responde com header x-lab-mode=leitura. Um colega muda ao mesmo tempo a query e o header e afirma que o header provocou a alteração.

1. **Tabela de confiança:** identifique qual dado é enviado pelo cliente e qual estado deve vir de fonte confiável. Nomeie o servidor/browser/armazenamento que decide. Resultado esperado não é apenas um status: deve haver preservação do controle e do estado.
2. **Caminho legítimo:** defina a identidade ou recurso autorizado e descreva saída observável coerente. Não bloqueie indiscriminadamente todos os casos: Preserve as requisições originais e não registre cookies reais ou Authorization. Use apenas o servidor loopback do material.
3. **Negativo isolado:** altere só a condição adversária. A prova requer mais que status: baseline.echo=original, modified.echo=teste-local e count=2; os dois status são 200.
4. **Correção causal:** HTTP método, caminho, query, headers e corpo são partes diferentes. Se dois envios mudarem várias coisas ao mesmo tempo, não se sabe qual entrada causou o efeito. Burp Community pode ser usado como ferramenta opcional; o script local funciona sem Burp. **Erro eliminatório:** Atribuir a mudança ao header sem experimento controlado.
5. **Regressão:** repita o negativo idêntico depois da defesa, com evidência de ausência do efeito proibido. Repita também o positivo e confirme que o usuário legítimo continua usando a funcionalidade.
6. **Limitações:** verifique a transferência apenas em sistema próprio/autorizado. Status 200 e mudança de eco mostram transporte e processamento de um header, não uma falha de segurança nem bypass.

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
