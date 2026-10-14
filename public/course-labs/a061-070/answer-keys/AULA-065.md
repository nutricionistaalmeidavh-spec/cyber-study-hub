# Respostas e rubrica — AULA-065: Serviços, permissões e configurações inseguras

**Abra só depois da sua tentativa.** Esta prova usa um caso de transferência independente, não é relatório de teste com alunos.

## Cenário contextualizado

Após incidente, um time retira a permissão `Everyone:Write` de pasta de uploads, mas retira também `Uploader:Write`, que era a conta exclusiva da aplicação. O endpoint passa a falhar com 500.

## Questões comentadas

### Questão 1

**Resposta esperada:** Remover escrita de principal genérico que não deveria modificar uploads.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 2

**Resposta esperada:** A identidade legítima não consegue escrever, interrompendo fluxo essencial.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 3

**Resposta esperada:** Definir principais Uploader, Admin e Everyone e ações Read/Write necessárias no diretório.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 4

**Resposta esperada:** Usuário não associado ao serviço tenta gravar fixture e recebe acesso negado.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 5

**Resposta esperada:** Conta Uploader autenticada e autorizada grava arquivo sintético e o sistema responde com sucesso.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 6

**Resposta esperada:** Backup de ACL, versão/data, aprovador, testes pré/pós e reversão controlada das permissões.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

## Rubrica independente

| Critério | Peso | Aceite |
|---|---:|---|
| Conceitos e fronteiras de confiança (Q1–2) | 30 | Causa específica, não só nome de ferramenta |
| Evidência e controle causal (Q3–4) | 30 | Variável pertinente, correção verificada |
| Caso positivo, negativo, limites (Q5–6) | 30 | Risco reduzido sem quebrar função legítima |
| Comunicação, autorização e minimização de dados | 10 | Sem credenciais, sem saída de escopo |
 
**Erro eliminatório:** Declarar hardening concluído sem testar o uso legítimo após remover ACLs.

**Referência de aprovação editorial da atividade:** 80/100 sem erro eliminatório. A rubrica não afirma que estudantes tenham executado a prova.
