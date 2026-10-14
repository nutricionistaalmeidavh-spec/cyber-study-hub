# AULA-044 — Gabarito separado da prova de transferência

**Não abra antes de tentar.** A nota A é editorial assistida por IA, não desempenho comprovado de estudante.

**Caso:** Uma sessão foi válida no handshake, mas expirou enquanto a conexão para sala 7 permaneceu aberta; chega nova mensagem subscribe.

1. **Por que o HTTP 101 do handshake não prova autorização do subscribe recebido depois?**

   **Resposta esperada:** 101 apenas estabelece canal; privilégios podem expirar, revogar ou não cobrir a mensagem.

2. **Que diferença deve existir entre tempo 50 e 100 para sala 7?**

   **Resposta esperada:** 50 aceita assinatura para sessão válida; 100 recusa por expiração mesmo com o mesmo canal.

3. **O que ocorre se a sessão válida tenta assinar sala 8?**

   **Resposta esperada:** Negação por falta de permissão naquela sala; autenticar não dá acesso a qualquer sala.

4. **Que regra evita confundir tenant e roomId?**

   **Resposta esperada:** Checar ambos os atributos contra a sessão e nunca confiar em tenant enviado pelo cliente.

5. **Especifique controle positivo e negativos independentes.**

   **Resposta esperada:** Sala autorizada e sessão vigente passa; sala diferente, expirada ou revogada falham.

6. **Quais riscos estão fora deste simulador?**

   **Resposta esperada:** Autorização de handshake/origin, autenticação em cookies, transporte TLS, flooding de mensagens e backpressure.

## Rubrica de correção

- 6 questões × 15 pontos = 90 pontos (critério: decisão correta, mecanismo, evidência, teste positivo e negativo).
- 10 pontos: registrar execução local e explicar limite do modelo.
- **Aprovado editorialmente no exercício:** pelo menos 80/100, sem erro eliminatório.
- **Erro eliminatório:** recomendar somente desligar a funcionalidade válida ou alegar teste de produto real por ter executado um modelo isolado.
- **Limitação:** Modelo local de autorização, não cria socket real nem testa TLS, origin ou backpressure.
