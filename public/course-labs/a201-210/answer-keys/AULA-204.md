# Gabarito — Aula 204: RAG Security

> Consulte somente após tentar a atividade de transferência.

## Oráculos locais e interpretação

1. **`['a']`:** Só chunk autorizado atravessa fronteira.

2. **`[]`:** Sem autenticação a lista deve estar vazia.

3. **`untrusted-data`:** Origem como conteúdo não confere autoridade.

**Causa raiz:** Um retriever retorna o documento mais similar sem filtrar ACL, ou o agent obedece à ordem embutida no chunk retornado.

**Resposta defensiva:** Aplicar autorização antes da recuperação, preservar provenance e classificar todos os chunks como `untrusted-data`; invalidar caches após revogação.

## Perguntas resolvidas

1. **Qual a ordem do filtro ACL?** Antes de construir contexto e de expor documentos ao modelo.

2. **O que significa provenance?** ID, fonte, versão, owner/tenant e trajetória do conteúdo.

3. **Chunk permitido pode conter injection?** Sim, autorizado para leitura não significa confiável para instruções.

4. **Como revogar chunks em caches reais?** Invalidar índice/cache e atualizar ACL em todas as camadas, testando reteste.

5. **Qual proteção não é demonstrada pela string role?** A string não implementa sandbox nem isolamento do orquestrador real.

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

**Fonte:** https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/.
