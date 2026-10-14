# Gabarito AULA-147: C2 e Beaconing — análise defensiva

Responda sem consultar esta referência. As saídas são exclusivamente sintéticas.

### Questão 1: Quais intervalos produz [0,60,120,180]?

**Resposta comentada:** [60,60,60] segundos.

### Questão 2: Por que periodicCandidate não confirma C2?

**Resposta comentada:** Monitoramento legítimo também é periódico.

### Questão 3: Como usar approvedHeartbeat?

**Resposta comentada:** Relacionar a cadência a configuração previamente autorizada.

### Questão 4: Uma série irregular exclui atividade suspeita?

**Resposta comentada:** Não; jitter pode existir tanto em rede normal quanto em tráfego suspeito.

### Questão 5: Qual controle protege o agente legítimo?

**Resposta comentada:** Verificação de processo, destino e política antes de bloquear.

### Questão 6: O que está fora do escopo do modelo?

**Resposta comentada:** Não há rede, hosts reais ou análise de malware.

## Rubrica de correção

- 20 pontos — mecanismo e causa.
- 20 pontos — hipótese e resultado positivo.
- 20 pontos — contraprova e falso positivo.
- 20 pontos — defesa, continuidade legítima e reteste.
- 20 pontos — escopo seguro, evidência e limites.

**Erro eliminatório:** afirmar malware ou C2 real a partir de simulação, executar amostras desconhecidas, habilitar rede indevida ou omitir autorização.

**Nota:** sem teste com estudante ou revisor humano independente.
