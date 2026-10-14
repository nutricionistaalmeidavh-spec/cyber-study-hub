# Gabarito independente — AULA-013

**Uso:** conferir somente após registrar a própria tentativa. Cenário e dados são fictícios, sem dependências comerciais.

## Respostas de referência para o cenário de transferência

**Cenário:** Um portal de estágios recebe avatar.png com script HTML em vez de imagem, declarado image/png.

1. **Tabela de confiança:** identifique qual dado é enviado pelo cliente e qual estado deve vir de fonte confiável. Nomeie o servidor/browser/armazenamento que decide. Resultado esperado não é apenas um status: deve haver preservação do controle e do estado.
2. **Caminho legítimo:** defina a identidade ou recurso autorizado e descreva saída observável coerente. Não bloqueie indiscriminadamente todos os casos: Em serviço real, valide o arquivo inteiro com parser apropriado, isole armazenamento, gere nomes novos, limite tamanho e não sirva com execução ativa.
3. **Negativo isolado:** altere só a condição adversária. A prova requer mais que status: A fixture curta com %PDF- é aceita; HTML disfarçado e 1 MiB+1 byte são rejeitados.
4. **Correção causal:** O fluxo de upload cruza extensões, metadados, bytes, parser, limite de tamanho, nome persistido e forma de servir. A fixture reconhece apenas o marcador %PDF- e tamanho: é uma demonstração didática insuficiente para aceitar PDFs reais em produção. **Erro eliminatório:** Confiar na extensão e no MIME enviados.
5. **Regressão:** repita o negativo idêntico depois da defesa, com evidência de ausência do efeito proibido. Repita também o positivo e confirme que o usuário legítimo continua usando a funcionalidade.
6. **Limitações:** verifique a transferência apenas em sistema próprio/autorizado. O teste não comprova que um arquivo com %PDF- é PDF válido ou inofensivo; jamais reutilize a fixture como gateway de produção.

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
