# NET-25 — Gabarito da prova independente

**Abra somente após concluir e salvar a primeira tentativa.** Compare o resultado e registre onde errou; esta folha não é evidência de aprendizado por si só.

1. Políticas min/max são configuração, version() do SSLSocket reflete negociação real. 2. Primeiro cliente só 1.2 negocia 1.2; outro com ambos pode negociar 1.3 se servidor habilitar; client-only-1.3 com servidor-only-1.2 falha antes de HTTP. 3. Não; rejeição de cadeia/hostname no handshake do cliente. 4. Certificado autentica; ECDHE contribui para segredos efêmeros; keylog autorizado pode viabilizar análise de sessão específica, não pelo certificado privado isolado. 5. Captura TCP reconstruída não preserva proveniência/horários/flags originais, mesmo com payload TLS real. 6. Registrar Python/OpenSSL, allowlist de versões, versão/cifra da sessão, CA/nome e teste de incompatibilidade mais CA desconhecida; não registrar segredo no relatório. **Erro eliminatório:** declarar CA não confiável segura porque negociou cifra.

## Rubrica de correção

- **Aprovado:** seis respostas coerentes, justificadas com dados do novo cenário, sem o erro eliminatório; entregue a evidência ou artefato pedido.
- **Em revisão:** algum conceito correto sem demonstração reproduzível ou sem justificativa; refaça o caso indicado e registre a segunda tentativa separadamente.
- **Reprovado:** erro eliminatório, conclusão além da evidência ou ausência de resposta; retorne ao mecanismo e ao exemplo resolvido antes de nova tentativa.

A qualidade editorial da aula não equivale à proficiência demonstrada por cada estudante.
