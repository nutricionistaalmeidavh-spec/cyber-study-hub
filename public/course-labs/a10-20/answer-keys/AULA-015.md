# Gabarito independente — AULA-015

**Uso:** conferir somente após registrar a própria tentativa. Cenário e dados são fictícios, sem dependências comerciais.

## Respostas de referência para o cenário de transferência

**Cenário:** Uma integração de imagens aceita ID 'banner' mapeado para um endpoint local e recebe redirect 307 para uma segunda origem não prevista.

1. **Tabela de confiança:** identifique qual dado é enviado pelo cliente e qual estado deve vir de fonte confiável. Nomeie o servidor/browser/armazenamento que decide. Resultado esperado não é apenas um status: deve haver preservação do controle e do estado.
2. **Caminho legítimo:** defina a identidade ou recurso autorizado e descreva saída observável coerente. Não bloqueie indiscriminadamente todos os casos: Não encaminhe requests para serviços cloud de metadata, hosts privados ou terceiros; a simulação opera exclusivamente em 127.0.0.1.
3. **Negativo isolado:** altere só a condição adversária. A prova requer mais que status: O fluxo legado incrementa internalHits; depois da correção, internalHitsAfterFix é zero.
4. **Correção causal:** Validar apenas a origem inicial não protege a requisição seguinte. A defesa demonstrada usa ID mapeado e redirect:'manual', com timeout e leitura limitada. Esse lab não comprova defesa geral para DNS rebinding ou IPv6. **Erro eliminatório:** Confiar na primeira origem sem controlar o redirect.
5. **Regressão:** repita o negativo idêntico depois da defesa, com evidência de ausência do efeito proibido. Repita também o positivo e confirme que o usuário legítimo continua usando a funcionalidade.
6. **Limitações:** verifique a transferência apenas em sistema próprio/autorizado. Uma exceção 500 sem contador ou log de conexão não é prova de SSRF.

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
