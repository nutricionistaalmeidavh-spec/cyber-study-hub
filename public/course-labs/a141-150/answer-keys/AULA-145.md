# Gabarito AULA-145: Malware Traffic

Responda a prova antes de consultar. Todas as atividades são simulações em memória.

### Questão 1: Como calcular os dois intervalos do caso positivo?

**Resposta comentada:** 100−0=100 e 200−100=100 no mesmo host.

### Questão 2: Por que ordenar por timestamp?

**Resposta comentada:** Eventos podem chegar fora de ordem, gerando cadência falsa.

### Questão 3: Padrão de 100s significa C2?

**Resposta comentada:** Não, aplicações legítimas podem ter heartbeats.

### Questão 4: Qual caso benigno imita periodicidade?

**Resposta comentada:** Telemetria de monitoramento e agentes de inventário.

### Questão 5: Que contexto reduziria falso positivo?

**Resposta comentada:** Assinatura, autorização, usuário, destino e políticas de atualização.

### Questão 6: Qual afirmação excede evidências?

**Resposta comentada:** Afirmar execução de malware ou tráfego real observado.

## Rubrica de correção

- 20 pontos — mecanismo e causa.
- 20 pontos — hipótese e resultado positivo.
- 20 pontos — contraprova e falso positivo.
- 20 pontos — defesa, continuidade legítima e reteste.
- 20 pontos — escopo seguro, evidência e limites.

**Erro eliminatório:** atribuir malware real ou C2 a uma fixture, executar amostras desconhecidas, habilitar rede indevida ou omitir autorização.

**Nota:** não foi realizado teste com aluno ou revisor humano independente.
