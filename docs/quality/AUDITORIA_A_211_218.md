# Auditoria técnico-editorial A — AULA-211..218 (15/10/2026)

## Escopo e canonicidade
Oito unidades canônicas da trilha **Projeto Final Integrado**, IDs AULA-211 até AULA-218, já existentes em src/curriculum/catalog.json. A trilha é **geral**, não específica de IA, e recebe artefatos das aulas 209 e 210 sem torná-los obrigatórios. O catálogo de 607 identidades permanece inalterado.

## Mudanças
- Oito páginas reescritas sem roteiro genérico repetido, com demonstração Node, aplicação causal, alternativa negativa, quatro etapas, artefato preenchível e critérios de avanço.
- Oito gabaritos separados e 48 perguntas específicas de transferência, com rubrica individual.
- Laboratório local EscolaLab já incorporado pela PR 47: F001 de Alice, Bob 200 somente no modo vulnerável intencional e 403 no modo corrigido; Alice preservada 200.
- Oito testes unitários adicionais por etapa, sem sair do processo Node, com falso positivo/negativo declarados. O detector é JS didático, não Sigma/YARA/EDR/SIEM real.
- Revisões editoriais com seis dimensões, fontes, SHA-256 exato dos arquivos, escopo e limitações; 221 registros A incluindo os 213 anteriores.
- Zero dependência paga, conta externa, Docker, GPU ou provedor de IA. Extensões só opcionais.
- Nada alterado em rotas, OAuth, APIs, Workers, Cloudflare, segredos, infraestrutura ou esquema de progresso.

## QA para reproduzir
```bash
npm run test:a-211-218
npm run test:grade-a-211-218
npm run verify:quality
npm run build
```

**Atenção:** classificação A é parecer editorial por IA. Os testes de conteúdo/modelo mostram apenas comportamento de fixture sintética. Não houve prova humana de didática, pentest de produção nem certificação de ferramentas. A execução da suite e do build deve ser confirmada pelos checks do PR.
