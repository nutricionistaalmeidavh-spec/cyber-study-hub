# AULA-151 — gabarito e critérios: YARA aplicado

**Não consultar antes de concluir a própria investigação.** Compare seus dados com o contrato de `yaraFixtureMatch` e com o controle negativo.

### Questão 1

O modelo busca substring no JavaScript; YARA interpreta strings, modificadores e condição booleana com semântica própria.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 2

O marcador é benigno e pode ser copiado; match apenas comprova presença do padrão sob condições definidas.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 3

Objetos acima do limite não casam mesmo contendo marcador; é uma restrição deliberada de escopo que precisa ser documentada.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 4

Tornar o marcador mais exclusivo, combinar condições e medir FP em arquivos legítimos representativos.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 5

A fixture CYBERLAB-SAFE não deve casar e o objeto grande continua fora do limite se o contrato for mantido.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

### Questão 6

Versionar regra e corpus, anotar resultados TP/FP/FN, hashes das fixtures, ambiente, motivações de ajuste e retestes.

**Evidência exigida:** informe dados de entrada, resultado observado e uma limitação.

## Rubrica de correção (100 pontos)

- **Mecanismo técnico e precisão:** 20 pontos.
- **Reprodução positiva:** 20 pontos.
- **Contraexemplo e interpretação prudente:** 20 pontos.
- **Controle defensivo e reteste:** 20 pontos.
- **Rastreabilidade, limitações e apresentação:** 20 pontos.

**Erro eliminatório:** alegar comprometimento só com um indicador sintético, omitir o negativo ou confundir exercício local com prova sobre ambiente real.

**Fonte:** https://yara.readthedocs.io/en/stable/writing_yara_rules.html
