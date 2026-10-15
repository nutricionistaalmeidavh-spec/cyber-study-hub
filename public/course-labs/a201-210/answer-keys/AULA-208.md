# Gabarito — Aula 208: Defesa de Agentes e Capstone AI Security

> Consulte somente após tentar a atividade de transferência.

## Oráculos locais e interpretação

1. **`APPROVAL_REQUIRED`:** Agente não aprova seu próprio efeito.

2. **`TOOL_ALLOWED com aprovação específica`:** Aprovação amarrada ao recurso.

3. **`UNKNOWN_TOOL`:** Ferramenta não autorizada.

4. **`doc2 ausente do trace`:** ACL antes de construir contexto.

**Causa raiz:** A ferramenta tenta editar n1 sem aprovação, ler doc privado de outro tenant ou usar tool `delete-all`.

**Resposta defensiva:** Policy enforcement point fora do modelo, origem não confiável preservada, allowlist de tools, autorização de tenant, aprovação independente e log sem prompt ou segredo.

## Perguntas resolvidas

1. **Qual componente define a autoridade?** Orquestrador seguro e backend de políticas, não texto gerado.

2. **Por que o doc recuperado não executa tool?** O roteamento nunca promove dado RAG a intenção autenticada.

3. **O que é preservado na trace?** Ator, IDs de documentos, tool e decisão sem texto sensível.

4. **Qual controle evita delete-all?** Allowlist de ferramentas e política, com recusa UNKNOWN_TOOL.

5. **Quais limites de uma fixture sem LLM real?** Não há inferência, token validado, side effect, DB, sandbox ou autorização humana real.

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

**Fonte:** https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/.
