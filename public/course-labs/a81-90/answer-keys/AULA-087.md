# Gabarito independente — AULA-087: YARA

> Consulte somente depois de executar a oficina. Parecer automatizado/assistido por IA; não certificado de competência de estudantes.

## Respostas e evidência mínima

### Questão 1 (15 pontos)

Somente arquivo com LAB_MARKER_742 e training.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 2 (15 pontos)

Aumenta falso positivo por match amplo.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 3 (15 pontos)

Meta documenta, condition determina correspondência.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 4 (15 pontos)

Regra detecta bytes, não intenção ou execução.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 5 (20 pontos)

Arquivos legítimos de texto, relatórios e variantes sem segundo marcador.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 6 (20 pontos)

Guardar hashes de fixtures, versão da regra e resultados positivos/negativos.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

## Rubrica de correção

- Q1–Q4: 15 pontos por resposta com a relação correta entre entrada, decisão e evidência.
- Q5–Q6: 20 pontos por resposta com refutação, segurança operacional e reteste mensurável.
- Parcial: metade dos pontos se acertar a decisão mas omitir a explicação técnica.
- Zero: afirmação incompatível com o cenário ou sem justificativa.
- **Erro eliminatório:** Descrever uma regra que detecta palavras genéricas como veredito de malware.
- Avalie consistência e justificativa; não atribua nota de domínio humano sem prova independente.

## Limites da oficina

Não analisa PE, regex YARA, wide/ascii ou módulos; exemplifica apenas duas strings e AND.

Fonte técnica: https://yara.readthedocs.io/en/latest/writingrules.html
