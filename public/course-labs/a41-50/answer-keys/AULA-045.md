# AULA-045 — Gabarito separado da prova de transferência

**Não abra antes de tentar.** A nota A é editorial assistida por IA, não desempenho comprovado de estudante.

**Caso:** Um gateway e um serviço interno discordam sobre o tamanho do corpo quando recebem Content-Length e Transfer-Encoding simultaneamente.

1. **Em qual fronteira CL e TE contraditórios viram risco?**

   **Resposta esperada:** Quando proxy e backend escolhem delimitadores diferentes para a mesma sequência de bytes.

2. **Qual é o resultado esperado para CL único e para CL+TE?**

   **Resposta esperada:** CL único dentro do limite aceita; combinação CL+TE é recusada sem encaminhar.

3. **Por que aceitar dois valores CL idênticos ainda pode ser arriscado?**

   **Resposta esperada:** Diferentes parsers podem tratar duplicação de modo distinto; rejeitar simplifica contrato entre camadas.

4. **Cite correção primária e uma barreira adicional.**

   **Resposta esperada:** Rejeição e consistência de framing em toda a cadeia são primárias; fechar conexões/monitorar discrepâncias são complementares.

5. **Como evitar falso positivo para requisição legítima com corpo?**

   **Resposta esperada:** CL numérico válido de tamanho permitido continua aceito, testado ao lado das negativas.

6. **Por que este teste não valida uma CDN ou proxy real?**

   **Resposta esperada:** Não há dois parsers nem reutilização de conexão; esses comportamentos requerem integração controlada específica.

## Rubrica de correção

- 6 questões × 15 pontos = 90 pontos (critério: decisão correta, mecanismo, evidência, teste positivo e negativo).
- 10 pontos: registrar execução local e explicar limite do modelo.
- **Aprovado editorialmente no exercício:** pelo menos 80/100, sem erro eliminatório.
- **Erro eliminatório:** recomendar somente desligar a funcionalidade válida ou alegar teste de produto real por ter executado um modelo isolado.
- **Limitação:** Somente valida headers isolados; não envia payloads smuggling nem simula dois servidores em TCP.
