# Gabarito AULA-141: Process e Child Process Analysis

Responda a prova antes de consultar. Todas as atividades são simulações em memória.

### Questão 1: Por que PID isolado não é identidade durável?

**Resposta comentada:** PID pode ser reciclado; horário de criação ou ProcessGuid desambigua.

### Questão 2: Qual vínculo é confirmado no caso positivo?

**Resposta comentada:** 11@t1 referencia 10@t0 realmente presente no inventário.

### Questão 3: Por que o controle negativo fica órfão?

**Resposta comentada:** 10@t2 não foi registrado e não equivale ao pai de t0.

### Questão 4: Como reconhecer atualização autorizada?

**Resposta comentada:** Checar usuário, assinatura validada, janela, comando e baseline.

### Questão 5: Que evidência pedir antes de isolar processo?

**Resposta comentada:** Evento bruto, GUID, pai/filho, criação, política e contexto de ação.

### Questão 6: O que o modelo não prova?

**Resposta comentada:** Não valida processo real, malware, intenção ou origem de eventos.

## Rubrica de correção

- 20 pontos — mecanismo e causa.
- 20 pontos — hipótese e resultado positivo.
- 20 pontos — contraprova e falso positivo.
- 20 pontos — defesa, continuidade legítima e reteste.
- 20 pontos — escopo seguro, evidência e limites.

**Erro eliminatório:** atribuir malware real ou C2 a uma fixture, executar amostras desconhecidas, habilitar rede indevida ou omitir autorização.

**Nota:** não foi realizado teste com aluno ou revisor humano independente.
