# Trilha Desenvolvimento de Sistemas com IA — estado M01–M08

**Implementação nesta branch (não publicada em produção):**
- 8 módulos completos no roadmap, com 32 etapas disponíveis e revisadas editorialmente.
- **M01–M08 completos:** 32 etapas disponíveis, 16 microaulas novas, 8 referências canônicas e 8 laboratórios incrementais.
- **M06–M08 implementados nesta branch**, com SQLite/API v0.4, testes v0.5 e entrega/backup v1.0.
- As 543 unidades da biblioteca permanecem com os mesmos IDs e arquivos originais.
- Classificação A é **editorial assistida por IA**, com evidências e limites em `docs/quality/AUDITORIA_A_TRILHA_IA_M01_M05.md`, `docs/quality/AUDITORIA_A_TRILHA_IA_M06_M08.md` e `quality/trails/ai-dev/reviews.json`.

## Ferramentas e acesso

O caminho principal ensina a usar **ChatGPT ou Claude pelo navegador**, sem chave de API nem integração invisível ao HubEstudos. Disponibilidade dos planos gratuitos sujeita a limites e mudanças do fornecedor. IA local com Ollama é **opção** de quem possui hardware adequado. Todo laboratório e material de avaliação funciona **sem IA obrigatória**, com ferramentas abertas e sem serviços pagos essenciais.

## Matriz A editorial

| Módulo | Unidade referenciada | Artefato incremental |
|---|---|---|
| M01 | LOG-01 | protótipo HTML e regras observáveis |
| M02 | LOG-11 | documento de requisitos e contrato da OS |
| M03 | ENG-01 | React+TS+Vite v0.1 local |
| M04 | WEB-11 | React v0.2, interface e responsividade |
| M05 | JS-02 | React v0.3, CRUD e testes unitários |
| M06 | WEB-26 | React v0.4 + SQLite + API REST local |
| M07 | ENG-16 | React v0.5, regressão de domínio e API |
| M08 | ENG-21 | React v1.0, build, backup e restore em arquivo novo |

As provas e gabaritos independentes estão em `public/course-labs/ai-dev-meu-gestor/assessments/` e `answer-keys/`.

## Garantias técnicas e limitações

O pipeline `npm run verify:ai-dev` confere 8 pareceres A, seis dimensões, hash SHA-256 por módulo, integridade de provas e respostas, referências canônicas, 32 etapas e testes locais. O workflow compila os seis checkpoints React e executa o build do HubEstudos mais testes de autenticação.

**O registro de progresso da nova trilha permanece local**, separado do sistema sincronizado original. A etapa registrada não significa que a resposta foi aprovada por professor, e o parecer A da aula não significa resultado de aprendizagem observado. Nenhum conteúdo usa dados reais de clientes ou pacientes.

**Autenticação, OAuth, permissões, secrets e deploy não são modificados.** O PR continua em rascunho para QA de UI e revisão pedagógica antes de merge.

## Pendências futuras

Estudo com aprendizes reais, avaliação de acessibilidade assistiva e sincronização de progresso com migração explicitamente testada.
