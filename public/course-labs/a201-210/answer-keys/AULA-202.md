# Gabarito — Aula 202: Prompt Injection

> Consulte somente após tentar a atividade de transferência.

## Oráculos locais e interpretação

1. **`UNTRUSTED_INSTRUCTION`:** Um documento não propõe execução.

2. **`ALLOW_READ`:** Pedido real permitido.

3. **`ACTION_NOT_ALLOWED`:** Mesmo origem confiável não autoriza ação não permitida.

**Causa raiz:** A frase maliciosa tenta transformar dado de terceiro em tool call autorizada; variantes parafraseadas não alteram o canal de origem.

**Resposta defensiva:** Separar dado e instrução no orquestrador e autorizar ferramentas conforme identidade e política. Filtro por palavras e pedido ao LLM para ignorar comandos são medidas auxiliares.

## Perguntas resolvidas

1. **O que faz a tentativa ser indireta?** A instrução chega por material recuperado, não por pedido de usuário autenticado.

2. **Quem atribui a origem?** O código confiável do orquestrador na recepção, não o conteúdo.

3. **Por que detector por palavras-chave falha?** Mudança de frase ou idioma contorna padrões textuais; fronteiras de autorização continuam válidas.

4. **Qual é a recusa esperada do documento?** UNTRUSTED_INSTRUCTION antes da tool.

5. **O pedido trusted-user consegue delete?** Não: ACTION_NOT_ALLOWED por allowlist, independentemente da origem.

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
