# AULA-042 — Gabarito separado da prova de transferência

**Não abra antes de tentar.** A nota A é editorial assistida por IA, não desempenho comprovado de estudante.

**Caso:** Um serviço recebe preferências JSON de um usuário e tenta aplicar um campo inesperado role=admin como se fosse configuração autorizada.

1. **Em qual etapa o campo role deixa de ser dado e se torna decisão de privilégio?**

   **Resposta esperada:** No consumo do objeto reconstruído; JSON.parse isolado não concede papéis, mas aceitar role do cliente como autorização concederia.

2. **Compare JSON válido de theme/locale com JSON contendo role. Quais saídas documentar?**

   **Resposta esperada:** Primeiro retorna exatamente theme e locale; segundo levanta erro por chave não permitida.

3. **O que distingue rejeitar __proto__ na entrada de confiar apenas em JSON.parse?**

   **Resposta esperada:** JSON.parse pode conter a chave como dado próprio; operações posteriores de merge podem torná-la perigosa.

4. **O que deve ficar sob controle do servidor?**

   **Resposta esperada:** Papéis, identidade e autorização; nenhuma propriedade sensível pode ser derivada de preferências editáveis pelo cliente.

5. **Especifique testes positivos e negativos para a correção.**

   **Resposta esperada:** Preferências válidas passam; campos novos, tipos errados e chaves especiais falham, sem mutar o estado de autenticação.

6. **Que perigo não foi reproduzido no laboratório e exige teste próprio?**

   **Resposta esperada:** RCE e gadget chains de desserializadores não JSON; dependem da linguagem, bibliotecas e classes reais.

## Rubrica de correção

- 6 questões × 15 pontos = 90 pontos (critério: decisão correta, mecanismo, evidência, teste positivo e negativo).
- 10 pontos: registrar execução local e explicar limite do modelo.
- **Aprovado editorialmente no exercício:** pelo menos 80/100, sem erro eliminatório.
- **Erro eliminatório:** recomendar somente desligar a funcionalidade válida ou alegar teste de produto real por ter executado um modelo isolado.
- **Limitação:** JSON estrito não reproduz gadget chains nem RCE de serializadores nativos; não tratar este teste como auditoria de bibliotecas.
