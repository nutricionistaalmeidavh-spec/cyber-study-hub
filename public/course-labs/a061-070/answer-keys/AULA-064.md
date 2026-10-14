# Respostas e rubrica — AULA-064: Privilege Escalation Windows

**Abra só depois da sua tentativa.** Esta prova usa um caso de transferência independente, não é relatório de teste com alunos.

## Cenário contextualizado

O suporte encontra `C:\Tools Suite\Agent\start.exe` sem aspas e LocalSystem. A pasta `C:\Tools Suite\Agent` está restrita, mas o diretório raiz `C:\` também não concede escrita a usuários comuns.

## Questões comentadas

### Questão 1

**Resposta esperada:** Permissões efetivas de prefixos candidatos e detalhes de resolução do serviço.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 2

**Resposta esperada:** Se menor privilégio controlar executável escolhido por serviço privilegiado, cruza-se fronteira de execução.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 3

**Resposta esperada:** Sem escrita, a simples formatação ambígua não confirma exploração.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 4

**Resposta esperada:** Colocar aspas corretas, restringir escrita e avaliar conta de serviço mínima.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 5

**Resposta esperada:** Verificar path literal/citado e ACL negando escrita, e serviço legítimo iniciando normalmente.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 6

**Resposta esperada:** Registrar escopo do teste, arquivos reais e ancestrais, identidade e hipóteses fora da cobertura.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

## Rubrica independente

| Critério | Peso | Aceite |
|---|---:|---|
| Conceitos e fronteiras de confiança (Q1–2) | 30 | Causa específica, não só nome de ferramenta |
| Evidência e controle causal (Q3–4) | 30 | Variável pertinente, correção verificada |
| Caso positivo, negativo, limites (Q5–6) | 30 | Risco reduzido sem quebrar função legítima |
| Comunicação, autorização e minimização de dados | 10 | Sem credenciais, sem saída de escopo |
 
**Erro eliminatório:** Chamar a configuração de falha confirmada apenas porque o texto do path contém espaços.

**Referência de aprovação editorial da atividade:** 80/100 sem erro eliminatório. A rubrica não afirma que estudantes tenham executado a prova.
