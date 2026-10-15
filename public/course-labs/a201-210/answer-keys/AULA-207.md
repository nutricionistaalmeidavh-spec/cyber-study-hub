# Gabarito — Aula 207: OWASP GenAI / LLM Top 10 2026

> Consulte somente após tentar a atividade de transferência.

## Oráculos locais e interpretação

1. **`CONTROL_MAPPED`:** Controle e prova declarados na fronteira certa.

2. **`EVIDENCE_MISSING`:** Sem teste negativo não existe prova de mitigação.

3. **`BOUNDARY_MISMATCH`:** Controle está no componente errado.

4. **`REQUIRES_MANUAL_MODELING`:** Risco novo pede modelagem manual.

**Causa raiz:** Uma planilha marca injection como mitigado por prompt, mas não apresenta teste negativo nem ponto de enforcement.

**Resposta defensiva:** Criar registro de risco com responsável, fronteira, impacto, mitigação causal, teste negativo e evidência. Risco sem prova continua aberto.

## Perguntas resolvidas

1. **Qual versão de OWASP consultar?** Edição GenAI LLM 2026 e Agentic Applications 2026.

2. **Uma taxonomia substitui ameaça específica?** Não, há arquitetura e impacto próprios da aplicação.

3. **Prompt sozinho impede tool abuse?** Não; a tool precisa de autorização independente.

4. **O que significa EVIDENCE_MISSING?** Controle declarado não tem teste negativo associado.

5. **Como priorizar riscos distintos?** Pelo dano potencial, probabilidade e eficácia do controle em seu contexto, não só ranking.

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
