# Gabarito independente — AULA-011

**Uso:** conferir somente após registrar a própria tentativa. Cenário e dados são fictícios, sem dependências comerciais.

## Respostas de referência para o cenário de transferência

**Cenário:** Uma API de pacientes recebe PATCH /me com {phone:'1111',verified:true}. Apenas telefone é autogerenciável e a verificação depende da equipe.

1. **Tabela de confiança:** identifique qual dado é enviado pelo cliente e qual estado deve vir de fonte confiável. Nomeie o servidor/browser/armazenamento que decide. Resultado esperado não é apenas um status: deve haver preservação do controle e do estado.
2. **Caminho legítimo:** defina a identidade ou recurso autorizado e descreva saída observável coerente. Não bloqueie indiscriminadamente todos os casos: Validar payload antes de persistir; separar PATCH /me de ações administrativas; registrar mudanças sensíveis auditáveis sem armazenar segredos.
3. **Negativo isolado:** altere só a condição adversária. A prova requer mais que status: No modelo antigo role muda para admin; na operação corrigida name muda e role permanece reader.
4. **Correção causal:** Misturar objeto de entrada com modelo interno transforma dados não confiáveis em decisões de permissão. Um schema deve validar tipos e rejeitar ou ignorar campos não permitidos. Papéis e saldos mudam por fluxos de negócio separados, autenticados e autorizados. **Erro eliminatório:** Aceitar verified porque pertence ao schema do banco.
5. **Regressão:** repita o negativo idêntico depois da defesa, com evidência de ausência do efeito proibido. Repita também o positivo e confirme que o usuário legítimo continua usando a funcionalidade.
6. **Limitações:** verifique a transferência apenas em sistema próprio/autorizado. Usar validação de tipo JSON não basta: role:'admin' é uma string válida, mas não é campo permitido.

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
