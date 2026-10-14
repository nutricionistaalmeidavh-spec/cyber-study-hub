# Gabarito independente — AULA-019

**Uso:** conferir somente após registrar a própria tentativa. Cenário e dados são fictícios, sem dependências comerciais.

## Respostas de referência para o cenário de transferência

**Cenário:** A API de biblioteca recebe token com assinatura válida, mas aud aponta para outra API; um colega decide aceitá-lo porque sub identifica o mesmo aluno.

1. **Tabela de confiança:** identifique qual dado é enviado pelo cliente e qual estado deve vir de fonte confiável. Nomeie o servidor/browser/armazenamento que decide. Resultado esperado não é apenas um status: deve haver preservação do controle e do estado.
2. **Caminho legítimo:** defina a identidade ou recurso autorizado e descreva saída observável coerente. Não bloqueie indiscriminadamente todos os casos: Não registre tokens completos; segredos não pertencem ao frontend/repositório. Use biblioteca mantida e política de chaves/rotação no sistema real.
3. **Negativo isolado:** altere só a condição adversária. A prova requer mais que status: verifyJwt(token,t válido) retorna sub A17; decodeJwt(forged) mostra ADMIN; verifyJwt(forged) gera ASSINATURA_INVALIDA; expiração gera EXPIRADO.
4. **Correção causal:** O verificador deve fixar algoritmos permitidos, checar assinatura e claims de emissor, audiência, expiração e uso. Access token não substitui ID Token ou refresh. A chave literal no lab é uma fixture pública, não orientação para produção. Refresh tokens reais precisam de guarda, rotação/replay detection e revogação. **Erro eliminatório:** Reutilizar token emitido para outra audiência.
5. **Regressão:** repita o negativo idêntico depois da defesa, com evidência de ausência do efeito proibido. Repita também o positivo e confirme que o usuário legítimo continua usando a funcionalidade.
6. **Limitações:** verifique a transferência apenas em sistema próprio/autorizado. Base64url legível não é criptografia, e verificar somente exp não autentica a origem.

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
