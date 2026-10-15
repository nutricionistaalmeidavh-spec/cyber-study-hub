# Gabarito — Aula 209: Definição do laboratório final

> Consulte somente após tentar a atividade de transferência.

## Oráculos locais e interpretação

1. **`SCOPE_APPROVED_FIXTURE`:** Escopo próprio, local e reversível.

2. **`OUT_OF_SCOPE`:** Alvo externo fora do permitido.

3. **`AUTHORIZATION_MISSING`:** Não há correspondência entre dono e autorizador.

4. **`SAFETY_PLAN_MISSING`:** Sem parada/reset não executar.

**Causa raiz:** Uma URL externa entra por engano no escopo, ou um aluno usa dados reais sem permissão e sem mecanismo de reset.

**Resposta defensiva:** Declarar ambiente próprio, alvos localhost/fixture, owner autorizador, dados 100% sintéticos, stop condition e reset repetível.

## Perguntas resolvidas

1. **Quais entregáveis exatos?** SCOPE.md e LAB_ARCHITECTURE.md.

2. **O que torna o alvo permitido?** Estar enumerado no ambiente próprio autorizado com dados fictícios.

3. **Por que stop condition vem antes do teste?** Impede expansão do impacto e decisão retrospectiva enviesada.

4. **O que fica fora do relatório?** Credenciais reais e dados pessoais de terceiros.

5. **O que prova resetabilidade?** Comando/procedimento de restauração e reteste da baseline.

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

**Fonte:** https://csrc.nist.gov/pubs/sp/800/115/final.
