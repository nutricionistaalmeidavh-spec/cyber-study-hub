# Gabarito independente — AULA-016

**Uso:** conferir somente após registrar a própria tentativa. Cenário e dados são fictícios, sem dependências comerciais.

## Respostas de referência para o cenário de transferência

**Cenário:** Um sistema de reservas vende duas vagas por R$90,00; o cliente envia desconto arbitrário sem cupom aprovado e qty=0.

1. **Tabela de confiança:** identifique qual dado é enviado pelo cliente e qual estado deve vir de fonte confiável. Nomeie o servidor/browser/armazenamento que decide. Resultado esperado não é apenas um status: deve haver preservação do controle e do estado.
2. **Caminho legítimo:** defina a identidade ou recurso autorizado e descreva saída observável coerente. Não bloqueie indiscriminadamente todos os casos: Calcule valores server-side, aplique invariantes transacionais e mantenha trilha de auditoria sem registrar dados de cartão.
3. **Negativo isolado:** altere só a condição adversária. A prova requer mais que status: qty=2 retorna 14000; qty=-2 falha com QUANTIDADE_INVALIDA; qty=4 falha com ESTOQUE_INSUFICIENTE.
4. **Correção causal:** Validação sintática é diferente de validação econômica. Uma quantidade inteira negativa continua sendo número; preço do cliente não determina cobrança; uma compra não pode consumir mais que o estoque. O lab usa inteiros em centavos para evitar ruídos de ponto flutuante. **Erro eliminatório:** Usar total vindo do navegador como fonte confiável.
5. **Regressão:** repita o negativo idêntico depois da defesa, com evidência de ausência do efeito proibido. Repita também o positivo e confirme que o usuário legítimo continua usando a funcionalidade.
6. **Limitações:** verifique a transferência apenas em sistema próprio/autorizado. Validar apenas qty como número não impede negativo, oversell nem preço adulterado.

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
