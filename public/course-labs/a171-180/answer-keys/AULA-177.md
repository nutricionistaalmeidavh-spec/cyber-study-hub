# Gabarito independente — AULA-177 (Safe PoC)

### Questão 1

**Pergunta:** A solicitação original é aprovada?

**Resposta fundamentada:** Não: inclui rede e dados pessoais reais.

### Questão 2

**Pergunta:** Como reduzir escopo mantendo prova útil?

**Resposta fundamentada:** Repetir na fixture local com dados sintéticos.

### Questão 3

**Pergunta:** Que metadado sozinho não concede permissão?

**Resposta fundamentada:** authorization=true do exercício.

### Questão 4

**Pergunta:** Que controle positivo deve existir?

**Resposta fundamentada:** Entrada legítima sintética preservada após patch.

### Questão 5

**Pergunta:** Por que não publicar logs reais?

**Resposta fundamentada:** Podem conter dados pessoais/segredos e excedem evidência mínima.

### Questão 6

**Pergunta:** Qual evidência registrar?

**Resposta fundamentada:** Entrada e saída fictícias, regra violada, correção e reteste.

## Rubrica

6×15 pontos pela resposta e justificativa, 10 pela evidência de entrada/saída e contraprova. **Erro eliminatório:** extrapolar o modelo local para sistemas reais sem autorização ou inventar sucesso de exploit. Não há validação com estudantes humanos.
