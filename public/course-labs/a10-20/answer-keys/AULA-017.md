# Gabarito independente — AULA-017

**Uso:** conferir somente após registrar a própria tentativa. Cenário e dados são fictícios, sem dependências comerciais.

## Respostas de referência para o cenário de transferência

**Cenário:** Há um único código promocional. Duas chamadas idênticas chegam no mesmo instante e ambas imprimem 'resgatado', mas o banco marca apenas um uso.

1. **Tabela de confiança:** identifique qual dado é enviado pelo cliente e qual estado deve vir de fonte confiável. Nomeie o servidor/browser/armazenamento que decide. Resultado esperado não é apenas um status: deve haver preservação do controle e do estado.
2. **Caminho legítimo:** defina a identidade ou recurso autorizado e descreva saída observável coerente. Não bloqueie indiscriminadamente todos os casos: Use APIs atômicas do armazenamento real e teste concorrência e retries; a fixture em memória demonstra somente a ordem dos eventos.
3. **Negativo isolado:** altere só a condição adversária. A prova requer mais que status: unsafeApproved=2; safeApproved=1; safeStock=0. A soma das aprovações, não apenas o saldo final, revela o defeito.
4. **Correção causal:** Dois clientes executam: LER(1), LER(1), VALIDAR, VALIDAR, ESCREVER(0), ESCREVER(0). O contador acaba em zero, mas foram emitidas duas confirmações. Para banco real, use transação/bloqueio ou UPDATE ... WHERE stock > 0 com verificação de linhas afetadas e unicidade/idempotência. **Erro eliminatório:** Olhar somente a flag final de cupom consumido.
5. **Regressão:** repita o negativo idêntico depois da defesa, com evidência de ausência do efeito proibido. Repita também o positivo e confirme que o usuário legítimo continua usando a funcionalidade.
6. **Limitações:** verifique a transferência apenas em sistema próprio/autorizado. Saldo final zero não prova integridade: é necessário conferir quantas autorizações foram concedidas.

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
