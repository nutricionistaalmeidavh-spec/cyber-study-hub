# AULA-048 — Gabarito separado da prova de transferência

**Não abra antes de tentar.** A nota A é editorial assistida por IA, não desempenho comprovado de estudante.

**Caso:** Um configurador mescla preferências recebidas do cliente e encontra uma chave própria __proto__ junto de theme e density.

1. **Por que __proto__ vindo de JSON pode tornar um merge perigoso?**

   **Resposta esperada:** Ao ser consumido por atribuição/merge inseguro, pode afetar cadeia de protótipos e alterar leituras herdadas.

2. **O que deve ocorrer com theme=dark e density=compact legítimos?**

   **Resposta esperada:** Objeto com essas duas propriedades próprias e prototype nulo, sem perda de funcionalidade.

3. **Qual resposta para input que inclui __proto__ ou role?**

   **Resposta esperada:** Rejeição explícita da chave não permitida, sem modificar protótipos compartilhados.

4. **Por que somente checar Object.prototype depois da operação é insuficiente?**

   **Resposta esperada:** Pode haver alteração em outro alvo ou gadget; prevenir em entradas e merges é mais robusto.

5. **Qual diferença entre propriedade própria e herdada importa aqui?**

   **Resposta esperada:** Confiança deve depender de valores declarados/validados e não de valores herdados introduzidos externamente.

6. **Que testes seriam necessários em um deep merge real?**

   **Resposta esperada:** Chaves nested, constructor/prototype, arrays, polimorfismo de tipos e efeitos nas APIs consumidoras.

## Rubrica de correção

- 6 questões × 15 pontos = 90 pontos (critério: decisão correta, mecanismo, evidência, teste positivo e negativo).
- 10 pontos: registrar execução local e explicar limite do modelo.
- **Aprovado editorialmente no exercício:** pelo menos 80/100, sem erro eliminatório.
- **Erro eliminatório:** recomendar somente desligar a funcionalidade válida ou alegar teste de produto real por ter executado um modelo isolado.
- **Limitação:** Este teste não cobre todos os gadgets, bibliotecas deep merge, construtores nem efeitos em navegador.
