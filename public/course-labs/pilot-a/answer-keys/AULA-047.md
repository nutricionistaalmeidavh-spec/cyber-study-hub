# AULA-047 — Gabarito da prova independente

**Abra somente após concluir e salvar a primeira tentativa.** Compare o resultado e registre onde errou; esta folha não é evidência de aprendizado por si só.

1. Roteador deveria recusar rota privada com sufixo inesperado; elegibilidade deve inspecionar rota/política/conteúdo e não só extensão; chave não pode colapsar variantes de usuários. 2. Alice vê privado apenas em requisição própria; Bob sem sessão deve receber negação, jamais corpo de Alice, independentemente de HIT/MISS. Registre IDs sintéticos/status sem dados. 3. Perfil privado: no-store e bypass de cache compartilhado; purgar entradas antigas; CSS público pode usar public/max-age conforme política e validar resposta. 4. Vary:Cookie não estabelece autorização por usuário/tenant e pode deixar risco operacional. 5. Deception revela resposta personalizada que foi armazenada como pública; poisoning altera o conteúdo que outros recebem ao explorar a chave ou interpretação. 6. Teste cruzado Alice/Bob em URL idêntica + reteste do CSS com HIT legítimo. **Erro eliminatório:** desabilitar todo cache como único teste de regressão, sem preservar asset público.

## Rubrica de correção

- **Aprovado:** seis respostas coerentes, justificadas com dados do novo cenário, sem o erro eliminatório; entregue a evidência ou artefato pedido.
- **Em revisão:** algum conceito correto sem demonstração reproduzível ou sem justificativa; refaça o caso indicado e registre a segunda tentativa separadamente.
- **Reprovado:** erro eliminatório, conclusão além da evidência ou ausência de resposta; retorne ao mecanismo e ao exemplo resolvido antes de nova tentativa.

A qualidade editorial da aula não equivale à proficiência demonstrada por cada estudante.
