# Gabarito independente — AULA-018

**Uso:** conferir somente após registrar a própria tentativa. Cenário e dados são fictícios, sem dependências comerciais.

## Respostas de referência para o cenário de transferência

**Cenário:** Um professor com papel viewer tenta aprovar notas alterando header x-user-role: manager, enquanto sua sessão ainda registra viewer.

1. **Tabela de confiança:** identifique qual dado é enviado pelo cliente e qual estado deve vir de fonte confiável. Nomeie o servidor/browser/armazenamento que decide. Resultado esperado não é apenas um status: deve haver preservação do controle e do estado.
2. **Caminho legítimo:** defina a identidade ou recurso autorizado e descreva saída observável coerente. Não bloqueie indiscriminadamente todos os casos: Adote privilégio mínimo, trilha de alteração de papéis, revisão de rotas e testes positivos/negativos de autorização.
3. **Negativo isolado:** altere só a condição adversária. A prova requer mais que status: Autoatualização muda apenas name; authorizeAdmin(reader)=false e authorizeAdmin(admin)=true.
4. **Correção causal:** A sessão identifica o usuário; o backend consulta papel/permissões confiáveis e aplica o controle no recurso e operação. Botões escondidos não substituem autorização. PATCH /me não deve alterar role, e um retorno 403 em admin precisa impedir o efeito da operação. **Erro eliminatório:** Confiar no header enviado pelo cliente como origem do papel.
5. **Regressão:** repita o negativo idêntico depois da defesa, com evidência de ausência do efeito proibido. Repita também o positivo e confirme que o usuário legítimo continua usando a funcionalidade.
6. **Limitações:** verifique a transferência apenas em sistema próprio/autorizado. Remover link Admin da interface não impede uma chamada direta à rota.

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
