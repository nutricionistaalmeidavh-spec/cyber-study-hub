# AULA-099 — gabarito: falsos positivos e falsos negativos

1. Precisão mede a fração de alertas que correspondem a positivos reais; afeta carga de triagem.
2. FP é alerta para evento benigno; FN é ausência de alerta para evento positivo real.
3. Com TP+FP=0, a fração está indefinida. Não inventar valor 1 nem concluir qualidade.
4. Baixa prevalência aumenta a proporção de alertas falsos entre todos os alertas, mantendo outros parâmetros constantes.
5. Conservar rótulos e fixtures, comparar métricas por versão e verificar tanto positivo quanto negativo.
6. Custo de triagem, criticidade de ativos, prioridade, dano de FN, capacidade da equipe e qualidade da coleta.

## Rubrica de correção (100 pontos)

- Matriz e definições: 20.
- Cálculo do caso positivo: 20.
- Controle sem alertas e denominador zero: 20.
- Tuning e reteste: 20.
- Interpretação de prevalência e limites: 20.

**Erro eliminatório:** apresentar taxa perfeita para denominador zero ou omitir falsos negativos.

Fonte de referência: https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics
