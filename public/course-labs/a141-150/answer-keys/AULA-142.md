# Gabarito AULA-142: Registry e File System Artifacts

Responda a prova antes de consultar. Todas as atividades são simulações em memória.

### Questão 1: O que identifica um artefato?

**Resposta comentada:** Tipo e caminho canônico; digest permite comparar o valor.

### Questão 2: Como interpretar digest modificado?

**Resposta comentada:** Houve alteração de conteúdo, não necessariamente comprometimento.

### Questão 3: Uma chave Run recém-criada é prova de malware?

**Resposta comentada:** Não; origem, configuração e autorização ainda devem ser examinadas.

### Questão 4: Qual cenário legítimo parece suspeito?

**Resposta comentada:** Um instalador assinado cria entradas de inicialização e arquivos.

### Questão 5: Que dado permitiria ligar mudança a processo?

**Resposta comentada:** ProcessGuid, operação, tempo, usuário e telemetria da máquina.

### Questão 6: Qual reteste preserva a atualização aprovada?

**Resposta comentada:** Verificar o mesmo cenário autorizado e alertar somente mudança não explicada.

## Rubrica de correção

- 20 pontos — mecanismo e causa.
- 20 pontos — hipótese e resultado positivo.
- 20 pontos — contraprova e falso positivo.
- 20 pontos — defesa, continuidade legítima e reteste.
- 20 pontos — escopo seguro, evidência e limites.

**Erro eliminatório:** atribuir malware real ou C2 a uma fixture, executar amostras desconhecidas, habilitar rede indevida ou omitir autorização.

**Nota:** não foi realizado teste com aluno ou revisor humano independente.
