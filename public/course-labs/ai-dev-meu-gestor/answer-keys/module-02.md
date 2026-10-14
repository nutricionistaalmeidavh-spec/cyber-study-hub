# Gabarito independente — módulo 02

**Abra somente após concluir e salvar a primeira tentativa.** Este documento é separado da prova e não valida aprendizagem automaticamente.

1. **Pergunta:** Dado cliente C-999 inexistente, escreva Given/When/Then para tentativa de criar OS.

   **Resposta esperada:** Dado C-999 ausente, quando enviar nova OS, então rejeita com erro, não cria registro e mantém lista.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

2. **Pergunta:** Joana pede buscar serviços pendentes. Escreva um requisito mensurável, com caso vazio.

   **Resposta esperada:** Ao filtrar estado pendente, mostrar só OS pendentes; se nenhuma, mensagem vazia; lista canônica inalterada.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

3. **Pergunta:** Cliente C-001 tem OS-003; descreva a política de exclusão e sua prova negativa.

   **Resposta esperada:** Bloquear exclusão (decisão v0.1) com erro e manter cliente e OS. Política em cascata só com requisito explícito; não criar órfãos.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

4. **Pergunta:** Um protótipo mostra 24 clientes, mas a fixture contém 2. Indique requisito violado e correção.

   **Resposta esperada:** Indicador deve refletir a mesma fonte de dados. Corrigir computação, não maquiar a fixture para alcançar o número desejado.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

5. **Pergunta:** Diferencie requisito RF, restrição RNF e hipótese não confirmada usando Meu Gestor.

   **Resposta esperada:** RF: cadastrar OS com estado pendente. RNF: executar sem custo obrigatório; hipótese: necessidade de autenticação, não confirmada.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

6. **Pergunta:** A IA propôs apagar toda OS quando o cliente muda de nome. O que você pergunta antes de aceitar?

   **Resposta esperada:** Questionar vínculo id/cliente e política de histórico; alterar nome não deve remover ordens nem trocar ids.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

## Rubrica de correção

- 2 pontos: resposta específica, demonstrável e completa, contendo previsão e teste adequado.
- 1 ponto: conceito correto, mas faltou condição, evidência ou cenário negativo.
- 0 pontos: resposta incorreta, impossível de verificar ou aceita comportamento perigoso.
- **Aprovação pedagógica sugerida:** pelo menos 10/12 e nenhuma falha eliminatória; é aferição do estudante, distinta da nota editorial A da aula.
- **Erro eliminatório:** criar uma OS para cliente inexistente ou apagar cliente mantendo referência órfã.
- **Reteste:** reescrever a decisão errada, executar cenário mínimo e registrar o resultado antes/depois.

## Método e limites

Revisão crítica editorial por IA sobre perguntas e respostas, separada do texto expositivo. Não houve teste com estudantes, correção por docente humano nem validação com leitor de tela. Essas evidências continuam pendentes.
