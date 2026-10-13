# AULA-009 — Gabarito da prova independente

**Abra somente após concluir e salvar a primeira tentativa.** Compare o resultado e registre onde errou; esta folha não é evidência de aprendizado por si só.

1. O cookie identifica sessão, não a vontade da pessoa em disparar a alteração. 2. Alice/Alice permite atualização 200; Alice/Bob, Alice/ausente recusam 403 sem mudança; sem sessão recusa 401. 3. Validar sessão e token vinculado antes de payload e mutação; salvar antes da checagem produziria 403 com estado já alterado. 4. HttpOnly impede leitura via JS mas não envio; SameSite tem exceções e escopo site≠origem. 5. Fetch do Node com Cookie explícito não executa as políticas reais de envio de cookie por navegadores nem modela origem atacante. 6. Controlar o parâmetro da URL em teste local e verificar se a aplicação dispara ação autenticada inesperada, mesmo com token automático; documentar contexto real de navegador, risco e limites. **Erro eliminatório:** usar CORS como única defesa CSRF, ou considerar 403 com mutação como aprovação.

## Rubrica de correção

- **Aprovado:** seis respostas coerentes, justificadas com dados do novo cenário, sem o erro eliminatório; entregue a evidência ou artefato pedido.
- **Em revisão:** algum conceito correto sem demonstração reproduzível ou sem justificativa; refaça o caso indicado e registre a segunda tentativa separadamente.
- **Reprovado:** erro eliminatório, conclusão além da evidência ou ausência de resposta; retorne ao mecanismo e ao exemplo resolvido antes de nova tentativa.

A qualidade editorial da aula não equivale à proficiência demonstrada por cada estudante.
