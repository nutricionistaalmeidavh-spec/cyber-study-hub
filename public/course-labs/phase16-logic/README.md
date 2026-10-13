# Laboratório de Lógica — fase 16

Exemplos autorais executáveis das unidades LOG-03, LOG-06 e LOG-08 a LOG-20. Python 3.10+; verificado com Python 3.12.13. Apenas biblioteca padrão, sem rede, arquivos de dados externos ou instalação de pacotes.

Na raiz do projeto:

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-03
python3 -m unittest discover -s public/course-labs/phase16-logic -p 'test_*.py' -v
```

Troque LOG-03 por uma das unidades cobertas. Cada demo imprime JSON; `None`, `True` e `False` de Python aparecem como `null`, `true` e `false`. As aulas trazem previsões e gabaritos para comparar antes de executar.

`logic_lab.py` contém funções pequenas com dados fixos fictícios e domínios explícitos. `test_logic.py` verifica casos normais, fronteiras, exceções, preservação de entradas e invariantes; LOG-19 também compara duas implementações. A saída esperada da suíte é 15 testes aprovados. Não use `python -O` como substituto de validação: os testes usam unittest.

As versões com defeito `maximum_bug` e a versão anterior `old_delivery` existem para comparação pedagógica. O projeto de reservas é sequencial em memória e não modela persistência ou concorrência. As funções não são bibliotecas genéricas para tipos arbitrários.
