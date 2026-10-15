# P2/P3 — estado técnico e escopo da entrega

## P2: laboratórios práticos acessíveis por aula

- A171–A180: permanecem as 10 oficinas de pesquisa, com `research-models.mjs`, roteiro por ID e suítes.
- A181–A190: novas oficinas de Purple Team, emulação em metadados inertes, runner e casos negativos.
- A191–A200: oficinas distintas de Docker/K8s/IAM/CI/SCA/Supply Chain/IPC com 10 validações determinísticas; não executam ferramentas de nuvem reais.
- A201–A208: autorizações de RAG, agentes, tool approval, redact, hashes e auditoria com runner local e 8 oficinas.
- A209–A218: 10 relatórios de uma única aplicação EscolaLab, com template por etapa, HTTP real local e regressões.
- LAB-01–LAB-30: os 30 roteiros e fixtures específicos previamente existentes foram preservados e cobertos por testes. Exercícios são orientados por dados fictícios, não executam todas as ferramentas profissionais.
- Aulas e códigos são localizados pela função `getMainLabGuide` com o ID da aula. `answer-keys` não é vinculado no card do aluno.

**Definição de A técnico nesta entrega:** disponibilidade do roteiro, código, comando, positivo, negativo, limite explícito e teste automatizado. A efetividade em laboratório profissional e aprendizado humano exigem avaliação externa. Não alteramos nenhuma nota editorial ou os IDs.

## P3: kits funcionais no Meu Gestor

O checkpoint `public/course-labs/ai-dev-meu-gestor/checkpoints/v1.0` ganhou uma página **Extensões (kits)** na UI do próprio sistema.

1. PDF: documento A4 de OS gerado pela API localhost com strings escapadas, impressora do navegador / Salvar como PDF. Geração binária de PDF via `artisys-pdf` e pdfme continua em kit opcional documentado e testado.
2. Relatórios: CSV real da tabela fictícia de ordens, vínculo por cliente e neutralização de fórmula.
3. Financeiro: transação demonstrativa validada em centavos, categorizada e explicitamente **não persistida** para não inventar liquidação nem dados financeiros.
4. Serial: interpretador de leituras simuladas de peso; instalação real da `artisys-serialport`, driver e protocolo físico continua opt-in.
5. Frontend: card de métricas reais com uma fonte canônica (OS/clientes), sem copiar código de `frontEnds` privado.
6. QA: rota localhost que executa `PRAGMA integrity_check` e valida relações no SQLite. O `artisysScan` permanece ferramenta externa autorizada, não é executado dentro do navegador.

**Invariantes:** nenhum secret ou dado real; Node 24+, sem serviços pagos, API no loopback, projeto sem autenticação não pode ser exposto à internet; gabaritos preservados; os 607 IDs/progresso/autenticação do Hub não são modificados.

## Validação

`.github/workflows/p2-p3-complete.yml` verifica testes de cada conjunto, v1.0 com testes HTTP e TypeScript/build, aplicação Hub, contagem canônica e mapeamento entre aula e oficina. Aprovação em CI não é homologação de ambiente externo, pagamento real, scanner real ou balança conectada.
