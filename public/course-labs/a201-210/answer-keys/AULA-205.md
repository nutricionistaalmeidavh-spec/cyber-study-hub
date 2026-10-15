# Gabarito — Aula 205: Tool / Agent Abuse

> Consulte somente após tentar a atividade de transferência.

## Oráculos locais e interpretação

1. **`APPROVAL_REQUIRED`:** Escrita requer gate adicional.

2. **`TOOL_ALLOWED`:** Leitura permitida.

3. **`UNKNOWN_TOOL`:** Ferramenta destrutiva não está cadastrada.

4. **`APPROVAL_REQUIRED para alvo distinto`:** Aprovação é vinculada ao recurso.

**Causa raiz:** O agente pede `delete-all` ou reaproveita aprovação de n1 mudando apenas o identificador do alvo.

**Resposta defensiva:** Tool registry mínimo, escopo/tenant e aprovação específica. Em produção usar também expiração, nonce, idempotência e registro server-side.

## Perguntas resolvidas

1. **Por que ter tool não concede autorização?** O runtime ainda valida identidade, capability, tenant e schema.

2. **O que vincula aprovação?** Ator, recurso, tenant e ação; produção exige nonce/expiração.

3. **Como impedir replay real?** Nonce consumível, expiração, canal independente e transação server-side.

4. **Qual retorno de delete-all?** UNKNOWN_TOOL, sem execução.

5. **Como preservar leitura legítima?** read-note permitido retorna TOOL_ALLOWED sem aprovação de escrita.

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
