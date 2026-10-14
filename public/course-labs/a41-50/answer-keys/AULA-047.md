# AULA-047 — Gabarito separado da prova de transferência

**Não abra antes de tentar.** A nota A é editorial assistida por IA, não desempenho comprovado de estudante.

**Caso:** Uma rota autenticada /account/profile.css é entregue dinamicamente a Alice, mas uma regra de CDN baseada apenas em .css tenta tratá-la como asset.

1. **Por que '/account/profile.css' não pode ser classificada só pela extensão?**

   **Resposta esperada:** A origem trata /account como rota autenticada; decisão do cache precisa considerar contrato da rota e contexto.

2. **Como garantir que Bob não encontre corpo de Alice mesmo com a URL idêntica?**

   **Resposta esperada:** Não admitir cache lookup nem storage de resposta privada e invalidar eventual objeto compartilhado antigo.

3. **O que acontece com '/assets/app.css' com Cache-Control public?**

   **Resposta esperada:** Permanece elegível, mantendo o controle positivo de performance.

4. **Por que Vary:Cookie não substitui política de private/no-store?**

   **Resposta esperada:** Vary separa variantes de chave, não define se conteúdo privado pode ficar num cache compartilhado.

5. **Qual evidência diferencia deception de poisoning?**

   **Resposta esperada:** Deception armazena resposta privada legítima; poisoning armazena representação influenciada e indevida.

6. **Como ampliar o teste unitário para integração?**

   **Resposta esperada:** Duas sessões isoladas, proxy real local, invalidar cache antigo, observar MISS/BYPASS para perfil e HIT permitido para asset.

## Rubrica de correção

- 6 questões × 15 pontos = 90 pontos (critério: decisão correta, mecanismo, evidência, teste positivo e negativo).
- 10 pontos: registrar execução local e explicar limite do modelo.
- **Aprovado editorialmente no exercício:** pelo menos 80/100, sem erro eliminatório.
- **Erro eliminatório:** recomendar somente desligar a funcionalidade válida ou alegar teste de produto real por ter executado um modelo isolado.
- **Limitação:** Modelo complementar ao lab existente da aula 047; não simula uma CDN real e não substitui teste Alice/Bob.
