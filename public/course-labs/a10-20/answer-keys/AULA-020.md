# Gabarito independente — AULA-020

**Uso:** conferir somente após registrar a própria tentativa. Cenário e dados são fictícios, sem dependências comerciais.

## Respostas de referência para o cenário de transferência

**Cenário:** Dois logins locais A e B foram iniciados em abas distintas. O navegador devolve código da transação A com state de B. Há tentação de prosseguir porque ambos têm o mesmo usuário.

1. **Tabela de confiança:** identifique qual dado é enviado pelo cliente e qual estado deve vir de fonte confiável. Nomeie o servidor/browser/armazenamento que decide. Resultado esperado não é apenas um status: deve haver preservação do controle e do estado.
2. **Caminho legítimo:** defina a identidade ou recurso autorizado e descreva saída observável coerente. Não bloqueie indiscriminadamente todos os casos: Use o provedor fictício do lab, nunca contas externas ou tokens de usuários. Não inclua token real em URL, logs ou capturas compartilhadas.
3. **Negativo isolado:** altere só a condição adversária. A prova requer mais que status: O laboratório existente retorna login alice; nega state trocado, PKCE incorreto, nonce incorreto, código reutilizado e token destinado ao recurso errado.
4. **Correção causal:** OAuth delega autorização; OIDC adiciona autenticação federada. Código é uso único, curto e destinado a cliente/redirect; access token é para resource server, ID Token é para cliente. Um login não fica correto só porque um JSON foi decodificado. **Erro eliminatório:** Aceitar o callback sem vínculo à transação original.
5. **Regressão:** repita o negativo idêntico depois da defesa, com evidência de ausência do efeito proibido. Repita também o positivo e confirme que o usuário legítimo continua usando a funcionalidade.
6. **Limitações:** verifique a transferência apenas em sistema próprio/autorizado. State não substitui PKCE, nonce não substitui verificação de assinatura, e access token não substitui ID Token.

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
