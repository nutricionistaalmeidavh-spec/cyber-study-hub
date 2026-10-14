# AULA-049 — Gabarito separado da prova de transferência

**Não abra antes de tentar.** A nota A é editorial assistida por IA, não desempenho comprovado de estudante.

**Caso:** Um portal monta o link de redefinição e recebe Host: external.example.test; o domínio público correto é configurado como accounts.example.test.

1. **Onde o cabeçalho Host deixa de ser mero metadado e se torna risco?**

   **Resposta esperada:** Na geração da URL absoluta do reset quando o servidor o usa como origem confiável.

2. **Compare Host legítimo e Host externo. Que domínio deve aparecer nos dois links?**

   **Resposta esperada:** accounts.example.test em ambos, obtido de configuração canônica.

3. **Por que verificar somente regex de Host não basta se X-Forwarded-Host é aceito?**

   **Resposta esperada:** Há múltiplas origens de host; headers de proxy só são confiáveis com cadeia de proxies controlada.

4. **Qual política primária deve controlar links sensíveis?**

   **Resposta esperada:** Origem estática configurada mais validação de host de entrada na borda; jamais concatenar Host do usuário.

5. **Como manter o fluxo legítimo de redefinição após correção?**

   **Resposta esperada:** id simples e host legítimo geram URL correta, host falso não altera, id inválido é recusado.

6. **Que evidência adicional precisa existir para um sistema de produção?**

   **Resposta esperada:** Teste de mailer, geração/expiração do token, redirects, proxy, allowlist de hosts e logs sanitizados.

## Rubrica de correção

- 6 questões × 15 pontos = 90 pontos (critério: decisão correta, mecanismo, evidência, teste positivo e negativo).
- 10 pontos: registrar execução local e explicar limite do modelo.
- **Aprovado editorialmente no exercício:** pelo menos 80/100, sem erro eliminatório.
- **Erro eliminatório:** recomendar somente desligar a funcionalidade válida ou alegar teste de produto real por ter executado um modelo isolado.
- **Limitação:** Não envia e-mail nem prova fluxo de recuperação real, tokens, cache, intermediários ou reverse proxies.
