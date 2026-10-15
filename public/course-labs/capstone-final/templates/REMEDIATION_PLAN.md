# Plano de correção

- Causa raiz: acesso baseado no ID do objeto sem verificar propriedade
- Mudança: atribuir decisão a `target.owner===actor` no domínio
- Resultado esperado: Alice200, Bob403, não autorizado404
- Evidência de regressão: `lab.test.mjs`
- Limitações e revisão: [preencher]
