# AULA-046 — Gabarito separado da prova de transferência

**Não abra antes de tentar.** A nota A é editorial assistida por IA, não desempenho comprovado de estudante.

**Caso:** Um site armazena /assets/help.css com versão de idioma pt-BR e en-US; uma implementação que omite idioma da chave entregaria representação errada.

1. **Em qual situação a mesma URL pode legitimamente ter duas representações?**

   **Resposta esperada:** Idioma pt-BR/en-US da folha pública; diferenças precisam integrar a chave de cache se mudam corpo.

2. **Quais são as chaves observadas para pt-BR e en-US?**

   **Resposta esperada:** As duas incluem locale distinto em /assets:/assets/help.css:locale=..., logo não colidem.

3. **Por que Cookie em /account não deve criar variante de um cache público?**

   **Resposta esperada:** Resposta privada deve fazer BYPASS, não ser cacheada indefinidamente sob chaves com cookies.

4. **Diferencie poisoned content de cache deception usando o cenário.**

   **Resposta esperada:** Poisoning altera representação que chega a terceiros; deception compartilha resposta privada legítima.

5. **Como provar defesa e utilidade ao mesmo tempo?**

   **Resposta esperada:** Duas variantes públicas isoladas e acesso privado fora do cache, sem desligar o cache globalmente.

6. **Que prova faltaria em uma CDN real?**

   **Resposta esperada:** Mapear Vary, canonicalização de URL/host, headers unkeyed, TTL, invalidation e HIT/MISS do provedor.

## Rubrica de correção

- 6 questões × 15 pontos = 90 pontos (critério: decisão correta, mecanismo, evidência, teste positivo e negativo).
- 10 pontos: registrar execução local e explicar limite do modelo.
- **Aprovado editorialmente no exercício:** pelo menos 80/100, sem erro eliminatório.
- **Erro eliminatório:** recomendar somente desligar a funcionalidade válida ou alegar teste de produto real por ter executado um modelo isolado.
- **Limitação:** Simulador de chave e elegibilidade sem CDN, cache HIT real ou inspeção de header de resposta.
