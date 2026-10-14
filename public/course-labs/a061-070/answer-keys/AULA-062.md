# Respostas e rubrica — AULA-062: Enumeração Windows

**Abra só depois da sua tentativa.** Esta prova usa um caso de transferência independente, não é relatório de teste com alunos.

## Cenário contextualizado

Um servidor Windows de homologação possui tarefa agendada executada como SYSTEM às 03h. O binário fica em `C:\Ops\Tasks\export.exe`, com ACL do arquivo de Read para Users, mas a pasta `C:\Ops\Tasks` dá Modify a Authenticated Users.

## Questões comentadas

### Questão 1

**Resposta esperada:** A identidade SYSTEM executa artefato de caminho possivelmente mutável por sujeitos menos privilegiados.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 2

**Resposta esperada:** Permissão de diretório pode permitir substituir/remover entrada ou afetar resolução do caminho; depende de ACL efetiva.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 3

**Resposta esperada:** Principal de execução, Triggers/Actions, path, owner, ACEs de pasta e arquivo, herança e integridade.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 4

**Resposta esperada:** Remover Modify não necessário, restringir artefato e usar conta de menor privilégio quando viável.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 5

**Resposta esperada:** Usuário comum não altera entrada executada; exportação aprovada continua ocorrendo.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 6

**Resposta esperada:** ACL efetiva, direitos específicos, flags e política da tarefa precisam ser validados na máquina autorizada.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

## Rubrica independente

| Critério | Peso | Aceite |
|---|---:|---|
| Conceitos e fronteiras de confiança (Q1–2) | 30 | Causa específica, não só nome de ferramenta |
| Evidência e controle causal (Q3–4) | 30 | Variável pertinente, correção verificada |
| Caso positivo, negativo, limites (Q5–6) | 30 | Risco reduzido sem quebrar função legítima |
| Comunicação, autorização e minimização de dados | 10 | Sem credenciais, sem saída de escopo |
 
**Erro eliminatório:** Modificar binário de serviço real ou chamar toda tarefa SYSTEM de vulnerável sem evidências.

**Referência de aprovação editorial da atividade:** 80/100 sem erro eliminatório. A rubrica não afirma que estudantes tenham executado a prova.
