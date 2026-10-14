# Gabarito AULA-144: FakeNet-NG

Responda a prova antes de consultar. Todas as atividades são simulações em memória.

### Questão 1: Quais controles mínimos compõem ready=true?

**Resposta comentada:** Bloquear egress, conter DNS, usar fixture, não expor listener nem credenciais.

### Questão 2: Por que rota externa desqualifica o lab?

**Resposta comentada:** Evita que requisições escapem do escopo de testes.

### Questão 3: DNS redirecionado é suficiente?

**Resposta comentada:** Não, listeners, NAT, clipboard e pastas também podem expor recursos.

### Questão 4: Qual o papel de fixture inerte?

**Resposta comentada:** Aprender o fluxo sem código malicioso ou rede externa.

### Questão 5: Que limitação tem o checklist?

**Resposta comentada:** Não verifica firewall nem hipervisor real.

### Questão 6: O que fazer antes de usar VM real?

**Resposta comentada:** Ter autorização, topologia validada e revisão de isolamento.

## Rubrica de correção

- 20 pontos — mecanismo e causa.
- 20 pontos — hipótese e resultado positivo.
- 20 pontos — contraprova e falso positivo.
- 20 pontos — defesa, continuidade legítima e reteste.
- 20 pontos — escopo seguro, evidência e limites.

**Erro eliminatório:** atribuir malware real ou C2 a uma fixture, executar amostras desconhecidas, habilitar rede indevida ou omitir autorização.

**Nota:** não foi realizado teste com aluno ou revisor humano independente.
