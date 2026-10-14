# Gabarito independente — AULA-086: Sigma

> Consulte somente depois de executar a oficina. Parecer automatizado/assistido por IA; não certificado de competência de estudantes.

## Respostas e evidência mínima

### Questão 1 (15 pontos)

EventID de criação de processo, parent WINWORD e child PowerShell.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 2 (15 pontos)

Não: falha o contexto do processo pai.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 3 (15 pontos)

Fonte esperada: por exemplo Windows Sysmon EventID 1.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 4 (15 pontos)

Perda silenciosa de detecção por campo ausente/normalização incorreta.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 5 (20 pontos)

Analisar user, assinatura, CLI, contexto e ação autorizada.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 6 (20 pontos)

Reexecutar positivo e negativos, verificar mapeamento de campos e falsos positivos.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

## Rubrica de correção

- Q1–Q4: 15 pontos por resposta com a relação correta entre entrada, decisão e evidência.
- Q5–Q6: 20 pontos por resposta com refutação, segurança operacional e reteste mensurável.
- Parcial: metade dos pontos se acertar a decisão mas omitir a explicação técnica.
- Zero: afirmação incompatível com o cenário ou sem justificativa.
- **Erro eliminatório:** Confundir portabilidade de Sigma com execução direta por qualquer SIEM sem conversão.
- Avalie consistência e justificativa; não atribua nota de domínio humano sem prova independente.

## Limites da oficina

O modelo testa uma seleção isolada, não todos modificadores, YAML, correlações ou backend de produção.

Fonte técnica: https://github.com/SigmaHQ/sigma-specification
