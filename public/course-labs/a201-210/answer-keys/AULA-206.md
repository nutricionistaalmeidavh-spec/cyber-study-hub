# Gabarito — Aula 206: Model & AI Supply Chain

> Consulte somente após tentar a atividade de transferência.

## Oráculos locais e interpretação

1. **`APPROVED_FIXTURE`:** Contrato local completo.

2. **`DIGEST_MISMATCH`:** Arquivo/digest não bate com referência.

3. **`LICENSE_UNAPPROVED`:** Licença é restrição separada.

4. **`EVALUATION_REQUIRED`:** Promover sem testes não é aceito.

**Causa raiz:** O digest muda, a licença não é aprovada ou o modelo nunca foi avaliado, mas um operador tenta liberar porque o nome parece o mesmo.

**Resposta defensiva:** Fixar origem e versão, verificar bytes reais e proveniência em CI, aprovar licença, registrar dependências e executar regressão antes de liberar.

## Perguntas resolvidas

1. **Digest prova origem?** Não, é necessário atestar canal/proveniência.

2. **O que o lab simula?** Comparação determinística de strings sintéticas, não verificação criptográfica.

3. **Por que avaliar mesmo com hash correto?** Modelo íntegro pode se comportar de forma insegura ou piorar segurança ao atualizar.

4. **O que incluir além do modelo?** Runtime, adapters, embeddings, dependências, modelos-base, plugins e MCP servers.

5. **Qual evidência permite rollback?** Manifesto pinado, digest verificado, conjunto de testes e histórico de versão.

## Reteste e limites do que foi provado

A condição negativa deve ser recusada e o caso legítimo deve continuar aceito. O `lab.test.mjs` contém ambas as provas. Esse resultado vale para `models.mjs` em memória, não para um serviço remoto nem uma inferência real; o procedimento não usa dados reais nem age fora da propriedade do aluno.

## Rubrica (100 pontos)

| Dimensão | Pontos | O que validar |
| --- | ---: | --- |
| Modelo de confiança e mecanismo | 30 | Identifica ator, dados e ponto de enforcement |
| Causa raiz / defesa | 20 | Correção no componente causal |
| Adversarial seguro | 20 | Input, esperado e observado reproduzíveis |
| Reteste positivo | 20 | Continua funcionando após bloquear risco |
| Limites e ética | 10 | Sem autorização ou conta de terceiros |

Meta: 80/100. Sem teste em estudantes humanos; nota A é uma avaliação editorial IA da aula, não nota automática do aluno.

**Fonte:** https://slsa.dev/spec/v1.1/.
