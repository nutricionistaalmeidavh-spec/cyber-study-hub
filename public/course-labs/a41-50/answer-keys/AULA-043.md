# AULA-043 — Gabarito separado da prova de transferência

**Não abra antes de tentar.** A nota A é editorial assistida por IA, não desempenho comprovado de estudante.

**Caso:** Em /graphql, Bia solicita o perfil id=ana no mesmo tenant; um administrador de outro tenant tenta a mesma consulta.

1. **O endpoint validou a sessão de Bia. Por que o resolver ainda deve negar id=ana?**

   **Resposta esperada:** Autenticação comprova identidade, não autorização para o objeto de outra pessoa.

2. **Descreva duas consultas: Ana→Ana e Bia→Ana, incluindo retorno observável.**

   **Resposta esperada:** Ana recebe somente id e displayName; Bia recebe erro de acesso negado sem dados de Ana.

3. **Qual regra impede tenant-admin de um tenant de ler dados de outro?**

   **Resposta esperada:** A checagem do tenant ocorre antes de conceder permissão administrativa de objeto.

4. **Por que limite de profundidade não resolve autorização por objeto?**

   **Resposta esperada:** Limitar custo protege disponibilidade, enquanto autorização protege confidencialidade/integridade; são controles independentes.

5. **Defina teste de regressão que não bloqueie acesso legítimo.**

   **Resposta esperada:** Permitir consulta própria e negar outro id, outro tenant e segredo não previsto, com asserts separados.

6. **Que parte exigiria integração antes de afirmar segurança GraphQL completa?**

   **Resposta esperada:** Schema/field resolvers reais, mutações, aliases, batching, introspection conforme política e complexidade de query.

## Rubrica de correção

- 6 questões × 15 pontos = 90 pontos (critério: decisão correta, mecanismo, evidência, teste positivo e negativo).
- 10 pontos: registrar execução local e explicar limite do modelo.
- **Aprovado editorialmente no exercício:** pelo menos 80/100, sem erro eliminatório.
- **Erro eliminatório:** recomendar somente desligar a funcionalidade válida ou alegar teste de produto real por ter executado um modelo isolado.
- **Limitação:** É modelo de função de domínio, sem servidor GraphQL, introspection ou medição de custo real.
