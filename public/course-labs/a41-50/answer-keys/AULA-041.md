# AULA-041 — Gabarito separado da prova de transferência

**Não abra antes de tentar.** A nota A é editorial assistida por IA, não desempenho comprovado de estudante.

**Caso:** Um portal usa a mesma saudação para Ana e para uma entrada '{{7*7}}'. A equipe recebeu a hipótese de que a expressão passou a ser interpretada como template.

1. **Marque a fronteira de confiança ao receber o nome '{{7*7}}'. Em que ponto ele poderia virar código?**

   **Resposta esperada:** O nome deve ser valor de campo, nunca fonte do template ou expressão avaliada; interpolá-lo como texto impede que vire instrução.

2. **Compare saudação para 'Ana', '{{7*7}}' e '<b>Ana</b>'. Quais três saídas você espera?**

   **Resposta esperada:** Ana aparece normalmente; '{{7*7}}' fica literal; tags são escapadas como &lt;b&gt;Ana&lt;/b&gt;.

3. **Por que observar '49' no resultado de um engine configurado incorretamente mudaria o diagnóstico?**

   **Resposta esperada:** Indica interpretação de expressão; a saída literal no modelo seguro não prova que qualquer engine real é imune.

4. **Qual correção ataca a causa e qual apenas reduz impacto?**

   **Resposta esperada:** Separar template confiável de dados é controle primário; escape do contexto HTML reduz XSS, não resolve sozinho SSTI se houver avaliação de template.

5. **Como demonstraria regressão sem quebrar a saudação legítima?**

   **Resposta esperada:** Teste as três entradas e garanta que nome comum funciona, expressão não é calculada e HTML não vira tag.

6. **Quais evidências adicionais seriam exigidas antes de generalizar para um produto real?**

   **Resposta esperada:** Configuração do engine, local de compilação, sintaxe própria, testes em ambiente autorizado e revisão de permissões/sandbox.

## Rubrica de correção

- 6 questões × 15 pontos = 90 pontos (critério: decisão correta, mecanismo, evidência, teste positivo e negativo).
- 10 pontos: registrar execução local e explicar limite do modelo.
- **Aprovado editorialmente no exercício:** pelo menos 80/100, sem erro eliminatório.
- **Erro eliminatório:** recomendar somente desligar a funcionalidade válida ou alegar teste de produto real por ter executado um modelo isolado.
- **Limitação:** Este modelo não executa Jinja, Twig nem qualquer engine real; mede apenas a fronteira template fixo/dado.
