# Respostas e rubrica — AULA-061: Enumeração Linux

**Abra só depois da sua tentativa.** Esta prova usa um caso de transferência independente, não é relatório de teste com alunos.

## Cenário contextualizado

Em um servidor de relatórios da empresa Beta, uma unidade systemd com `User=root` chama `/srv/app/rotate.sh`, modo 0755, dono `root`. Entretanto `/srv/app` pertence ao grupo `devs` e é gravável por esse grupo. Outro executável SUID pertence a pacote verificado do sistema.

## Questões comentadas

### Questão 1

**Resposta esperada:** A conta devs pode afetar o diretório que contém código que será selecionado para execução por root.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 2

**Resposta esperada:** Escrita no diretório pode permitir troca/remoção de entrada mesmo que o próprio arquivo não seja gravável, dependendo das permissões e flags.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 3

**Resposta esperada:** Owner, grupo, modo e ACL de cada diretório ancestral, service unit, binário/versão e histórico de mudanças.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 4

**Resposta esperada:** Restringir escrita em diretórios executados por principal privilegiado, separar identidade do job e testar funcionamento.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 5

**Resposta esperada:** Negativo: devs não altera arquivo ou diretório sensível; positivo: a tarefa legítima roda com privilégios mínimos.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 6

**Resposta esperada:** SUID é mecanismo comum e sua segurança depende de origem, necessidade, código e controles; não é exploit por si só.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

## Rubrica independente

| Critério | Peso | Aceite |
|---|---:|---|
| Conceitos e fronteiras de confiança (Q1–2) | 30 | Causa específica, não só nome de ferramenta |
| Evidência e controle causal (Q3–4) | 30 | Variável pertinente, correção verificada |
| Caso positivo, negativo, limites (Q5–6) | 30 | Risco reduzido sem quebrar função legítima |
| Comunicação, autorização e minimização de dados | 10 | Sem credenciais, sem saída de escopo |
 
**Erro eliminatório:** Executar o script suspeito como root para demonstrar risco, ou remover todos os SUID sem análise.

**Referência de aprovação editorial da atividade:** 80/100 sem erro eliminatório. A rubrica não afirma que estudantes tenham executado a prova.
