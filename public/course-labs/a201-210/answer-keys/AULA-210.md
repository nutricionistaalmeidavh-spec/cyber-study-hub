# Gabarito — Aula 210: Threat Modeling do laboratório

> Consulte somente após tentar a atividade de transferência.

## Oráculos locais e interpretação

1. **`MODEL_READY_FOR_REVIEW`:** Ativos, fluxos e provas mapeados.

2. **`FLOW_UNMODELED`:** Fluxo sem fronteira declarada.

3. **`UNCOVERED_ASSET`:** Componente sem ameaça/controle.

4. **`CONTROL_WITHOUT_EVIDENCE`:** Mitigação declarada sem teste negativo.

**Causa raiz:** Fluxo user→retriever sem rótulo de autenticação, tool sem hipótese de ameaça ou mitigação sem teste negativo.

**Resposta defensiva:** THREAT_MODEL.md com DFD, matriz de risco/controle, dono e teste por destino; revisão estrutural é apenas gate preliminar.

## Perguntas resolvidas

1. **Ativo e fronteira são a mesma coisa?** Não: ativo é bem protegido, fronteira marca mudança de confiança/autoridade.

2. **O que o DFD registra?** Origem, destino, dados, identidades, confiança e controles.

3. **Qual teste negativo protege a tool?** Tentar editar sem aprovação e verificar ausência de efeito.

4. **Quando a matriz está incompleta?** Ao faltar ativo, fluxo, fronteira, ameaça, responsável ou evidência.

5. **Qual a conexão com 209?** 209 define onde é autorizado atuar; 210 define o que pode falhar e qual teste comprova.

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

**Fonte:** https://owasp.org/www-community/Threat_Modeling_Process.
