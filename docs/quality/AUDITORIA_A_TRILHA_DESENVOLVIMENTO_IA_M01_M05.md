# Auditoria A editorial IA — Trilha de Desenvolvimento de Sistemas com IA, módulos 01–05

**Data:** 14/10/2026. **Escopo:** `DEV-IA-M01` a `DEV-IA-M05`, 20 etapas, 3 checkpoints e 5 avaliações independentes. **Método:** autoria e segunda passagem crítica editorial por IA; **não** é revisão humana externa nem avaliação observacional com estudantes.

## Resultado

| Módulo | Técnica | Didática | Prática | Defesa | Avaliação | Especificidade | Parecer |
|---|---:|---:|---:|---:|---:|---:|---|
| M01 — Primeiros passos com IA | 94 | 94 | 93 | 92 | 92 | 96 | A editorial IA |
| M02 — Da ideia ao sistema | 94 | 93 | 92 | 92 | 93 | 94 | A editorial IA |
| M03 — Preparando e criando o projeto | 93 | 93 | 93 | 92 | 92 | 95 | A editorial IA |
| M04 — Criando as telas com IA | 94 | 94 | 92 | 93 | 93 | 95 | A editorial IA |
| M05 — Fazendo o sistema funcionar | 94 | 92 | 94 | 93 | 94 | 96 | A editorial IA |

As seis notas são pareceres editoriais assistidos por IA, não resultados de teste com estudantes. O hash SHA-256 de `JSON.stringify(module)` fixa cada parecer ao módulo registrado em `src/trails/ai-dev/modules.json`; uma alteração posterior exige nova auditoria.

## Evidências de laboratório e transferência

- **M01:** protótipo HTML sem dependências; avanço pendente → em andamento → concluído; contador derivado e avanço terminal sem duplicação; testes automatizados com DOM simulado em `public/course-labs/ai-dev-meu-gestor/tests/starter.test.mjs`.
- **M02:** requisitos RF-01–RF-05, contrato Cliente/Ordem, política explícita de vínculo; testes de cliente inexistente, serviço vazio e exclusão bloqueada em `module-02/spec-rules.test.mjs`.
- **M03:** VSCodium/Node/Git, React/TypeScript/Vite, build completo do checkpoint `v0.1` e roteiro de diff, erro controlado e primeiro commit.
- **M04:** checkpoint `v0.2` com navegação entre três seções, dados fictícios, contadores derivados, foco por teclado e testes manuais descritos para 360px/zoom. O build é automático; a observação manual ainda deve ser realizada.
- **M05:** checkpoint `v0.3` com CRUD em memória, integridade entre cliente e OS, busca/filtros não destrutivos, operações por id e transições permitidas; suíte de testes Node com casos válidos, inválidos e repetidos e build TypeScript/Vite.

Cada módulo possui **seis questões de transferência** não idênticas aos exemplos, em `/course-labs/ai-dev-meu-gestor/assessments/module-0X.md`; gabaritos separados em `answer-keys/module-0X.md`, com rubrica e erro eliminatório. A conclusão do aluno no aplicativo é autodeclarada e não certifica correção da prova.

### Execução de QA registrada

Workflow [Trilha IA — Módulos 01 a 05, execução 38588586334](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/actions/runs/38588586334): **sucesso**, incluindo `verify:ai-dev`, testes M01/M02, `npm run build` dos checkpoints v0.1, v0.2 e v0.3, `npm test` de v0.3, build do HubEstudos e testes da plataforma de contas/autenticação.

Para reproduzir, instalar dependências do projeto e executar a verificação automatizada da trilha. Dependências npm de software aberto exigem internet apenas no primeiro download; o resultado executável não usa chave de API nem serviço pago obrigatório.

## Critérios que permanecem explicitamente pendentes

1. Não foi realizado teste com alunos reais, observação de ganho de aprendizagem ou avaliação humana externa. O gate `didaticaInicianteValidada` significa apenas walkthrough editorial simulado de iniciante.
2. A navegação por teclado e o viewport 360 px são **tarefas manuais de QA descritas**; a passagem de build não demonstra acessibilidade com tecnologias assistivas nem análise real de telas em dispositivos.
3. Os checkpoints v0.1/v0.2/v0.3 são **protótipos de aprendizagem**, não versões comerciais. v0.3 usa dados em memória; SQLite, backend e preservação entre recargas pertencem ao módulo 06.
4. A classificação A atual contempla qualidade editorial e execução local dos laboratórios, sem afirmar qualidade de produção, segurança formal, auditoria humana ou disponibilidade ilimitada de ChatGPT/Claude gratuito.
5. O progresso dos novos módulos é salvo somente no dispositivo e não é sincronizado com a plataforma de contas. Esta limitação é exibida ao aluno.

## Canonicidade e compatibilidade

O catálogo principal continua com 218 unidades e o paralelo com 325, totalizando **543 IDs**. A trilha referencia, sem duplicar, `LOG-01`, `LOG-11`, `ENG-01`, `WEB-11` e `JS-02` para os módulos atuais. M06–M08 permanecem planejados, com `WEB-26`, `ENG-16`, `ENG-21`. Não há necessidade de API paga nem de executar IA local para concluir o curso.

**Fonte das evidências por dimensão, seis notas e hashes:** `src/trails/ai-dev/quality-reviews.json`. **Verificador canônico da trilha:** `scripts/verify-ai-dev.mjs`.
