# AULA-050 — Gabarito separado da prova de transferência

**Não abra antes de tentar.** A nota A é editorial assistida por IA, não desempenho comprovado de estudante.

**Caso:** Uma página recebe '<img src=x>' em fragmento de URL e uma mensagem postMessage de outra origem tentando alterar um aviso visual.

1. **Identifique source e sink no caso do fragmento '<img src=x>'.**

   **Resposta esperada:** Source é fragmento controlável; sink seguro é textContent, que interpreta valor como texto.

2. **Qual a diferença observável entre textContent e innerHTML nesse cenário?**

   **Resposta esperada:** textContent exibe caracteres literais; innerHTML trataria o valor como markup potencialmente perigoso.

3. **Por que origem 'https://portal.example.test.evil.test' deve falhar?**

   **Resposta esperada:** Comparação por substring não garante origin idêntica; a origem deve ser exatamente a permitida.

4. **Que formato de postMessage é permitido?**

   **Resposta esperada:** Objeto {type:'notice',text:string}, de https://portal.example.test; demais formatos e origens são rejeitados.

5. **Como evitar regressão da notificação legítima?**

   **Resposta esperada:** Mensagem autorizada atualiza campo de texto; mensagem de outro host e dados HTML ficam inertes.

6. **Qual limitação impede declarar ausência de XSS após esse teste?**

   **Resposta esperada:** Sem navegador e bibliotecas reais, outros sinks/transformações e DOM clobbering ainda podem existir.

## Rubrica de correção

- 6 questões × 15 pontos = 90 pontos (critério: decisão correta, mecanismo, evidência, teste positivo e negativo).
- 10 pontos: registrar execução local e explicar limite do modelo.
- **Aprovado editorialmente no exercício:** pelo menos 80/100, sem erro eliminatório.
- **Erro eliminatório:** recomendar somente desligar a funcionalidade válida ou alegar teste de produto real por ter executado um modelo isolado.
- **Limitação:** Modelo Node não executa DOM real, CSP ou event handlers; precisa de teste de navegador para afirmações de UI.
