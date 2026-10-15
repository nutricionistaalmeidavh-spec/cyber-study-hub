# Gabarito — Aula 201: LLM Security Fundamentals

> Consulte somente após tentar a atividade de transferência.

## Oráculos locais e interpretação

1. **`ALLOW_READ`:** Mesmo tenant + ação + permissão.

2. **`TENANT_DENIED`:** Recurso em outro tenant.

3. **`ACTION_NOT_ALLOWED`:** Ação de escrita fora de allowlist.

4. **`IDENTITY_REQUIRED`:** Ausência de identidade autenticada.

**Causa raiz:** Um prompt afirma ser administrador e propõe deletar o relatório ou ler o mesmo ID em t2.

**Resposta defensiva:** Interpor policy enforcement point determinístico antes da execução; atrelar actor/tenant à sessão verificada fora do LLM e não ao texto gerado.

## Perguntas resolvidas

1. **De onde vêm actor e tenant confiáveis?** Sessão/token já validado por serviço confiável, nunca do prompt.

2. **Por que ação autorizada não equivale a recurso autorizado?** Uma permissão de ação não elimina a ACL do recurso e o isolamento entre tenants.

3. **Qual falha ocorreria se o LLM escolhesse o tenant?** Um texto adversarial poderia alegar outro tenant e ultrapassar a fronteira.

4. **Que recusa ocorre ao pedir delete?** ACTION_NOT_ALLOWED sem chamada real de escrita.

5. **Como verificar ausência de regressão na leitura?** Exigir ALLOW_READ em t1 e TENANT_DENIED em t2 no mesmo reteste.

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

**Fonte:** https://airc.nist.gov/AI_RMF_Knowledge_Base/AI_RMF.
