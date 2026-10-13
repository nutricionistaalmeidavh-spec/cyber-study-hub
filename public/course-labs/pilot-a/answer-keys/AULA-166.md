# AULA-166 — Gabarito da prova independente

**Abra somente após concluir e salvar a primeira tentativa.** Compare o resultado e registre onde errou; esta folha não é evidência de aprendizado por si só.

1. `main` mudou no programa PIE observado; não conclua que toda a memória muda. 2. Exemplo: base 0x100000 + offset 0x200 = endereço 0x100200; outra execução base 0x200000 + mesmo offset 0x200 = 0x200200. 3. Stack/heap/bibliotecas podem continuar randomizados, ainda que texto não-PIE esteja em endereço fixo. 4. Não: 12 amostras observam variação, não estimam de forma confiável entropia real; políticas e arquitetura importam. 5. Corrigir validação de índices no código e retestar input inválido/limítrofe e fluxo válido; ASLR não remove a falha. 6. Relatar comandos, flags, erro/versão e ausência de evidência, sem inventar execução. **Erro eliminatório:** afirmar que PIE corrige buffer overflow ou que endereço não-PIE prova ASLR global desligado.

## Rubrica de correção

- **Aprovado:** seis respostas coerentes, justificadas com dados do novo cenário, sem o erro eliminatório; entregue a evidência ou artefato pedido.
- **Em revisão:** algum conceito correto sem demonstração reproduzível ou sem justificativa; refaça o caso indicado e registre a segunda tentativa separadamente.
- **Reprovado:** erro eliminatório, conclusão além da evidência ou ausência de resposta; retorne ao mecanismo e ao exemplo resolvido antes de nova tentativa.

A qualidade editorial da aula não equivale à proficiência demonstrada por cada estudante.
