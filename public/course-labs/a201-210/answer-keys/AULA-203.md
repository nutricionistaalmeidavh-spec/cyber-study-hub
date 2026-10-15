# Gabarito — Aula 203: Sensitive Information Disclosure

> Consulte somente após tentar a atividade de transferência.

## Oráculos locais e interpretação

1. **`ALLOW + false`:** Resumo é permitido, mas segredo não integra contexto.

2. **`OWNER_DENIED`:** Owner/tenant errados.

3. **`IDENTITY_REQUIRED`:** Sessão não autenticada.

**Causa raiz:** Usuário Bob pergunta pelo registro de Alice, ou o código envia o objeto completo por spread antes de ocultar secret.

**Resposta defensiva:** Verificar autorização antes da composição do contexto; incluir só `title` e `summary`; segredos fora do prompt e observabilidade sem corpo sensível.

## Perguntas resolvidas

1. **Por que a ACL precisa preceder o prompt?** Uma vez entregue ao modelo, dado pode influenciar geração, logs e retenção.

2. **Qual vantagem de projeção positiva?** Novos campos não entram automaticamente no contexto.

3. **Quem precisa da credencial?** A aplicação que chama a API, não a camada linguística.

4. **Um redactor de output resolve sozinho?** Não; é defesa suplementar e pode falhar.

5. **O que prova o booleano false?** Somente que a projeção local não contém o token fake; não prova proteção de PII real.

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

**Fonte:** https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence.
