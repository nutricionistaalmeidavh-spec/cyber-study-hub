# Meu Gestor — contratos de laboratório aplicados (8 etapas)

Este roteiro é **complementar à aula**, não um substituto. O laboratório é a ação comprovável: o projeto cresce de HTML fictício para React, CRUD, SQLite, QA e backup. **Kit funcional** é uma extensão opcional, com implementação externa separada. **Experimento** é um teste limitado para aprender um mecanismo; não prova segurança de produção.

## Como escolher

1. Abra a aula e leia o **Contrato do laboratório**: entrega, arquivos, ambiente e verificação.
2. Abra os arquivos em `/course-labs/ai-dev-meu-gestor/` ou no repositório: https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/tree/main/public/course-labs/ai-dev-meu-gestor . Para checkpoints React, baixe a **pasta completa** do repositório (ZIP do GitHub ou git clone); um `index.html` isolado não basta.
3. Não coloque secrets, chaves, dados de clientes, pacientes ou transações reais. Não execute servidor de estudo na internet.
4. Escreva previsão, execute caso válido + inválido, anote resultado e correção, e rode o teste final.
5. Prossiga sem instalar nenhum kit opcional. O projeto completo do núcleo funciona com Node 24+, React, SQLite e ferramentas gratuitas.

| Laboratório | O que receber | Comprovação mínima | Extensão opcional |
| --- | --- | --- | --- |
| 01 — Módulo 1 | `starter.html` | avançar OS, prevenir duplicação, alterar um texto | nenhuma |
| 02 — Módulo 2 | `module-02/spec-template.md` | cinco critérios e rejeições de cliente sem vínculo | nenhuma |
| 03 — Módulo 3 | `checkpoints/v0.1/` | rodar React, build, diff e commit | nenhuma |
| 04 — Módulo 4 | `checkpoints/v0.2/` | telas em 360px, teclado, fonte única de indicadores | interface |
| 05 — Módulo 5 | `checkpoints/v0.3/` | testes CRUD, ID estável, regra negativa | CSV/relatórios |
| 06 — Módulo 6 | `checkpoints/v0.4/` | POST/GET, reiniciar, confirmar SQLite e erro inválido | financeiro |
| 07 — Módulo 7 | `checkpoints/v0.5/` | teste vermelho → correção → suíte verde | scanner / QA |
| 08 — Módulo 8 | `checkpoints/v1.0/` | build, API local, backup e restore verificado | PDF, financeiro, balança, relatório, UI, scan |

**Verificação executada pelo Hub:** nenhuma. Checklists e anotações da conta são autodeclarações. Testes locais e logs precisam ser executados e guardados pelo próprio aluno. Avaliação editorial por IA não é ensaio com alunos nem homologação de sistema comercial.

## Diferença entre projeto-base e produto pronto

O `v1.0` é um **projeto didático local**, sem autenticação, TLS e autorização. Não use dados reais nem publique a API. Módulos opcionais não alteram essa restrição e não são promessa de ERP pronto. Para disponibilização externa seriam necessárias autenticação e isolamento de dados, validação de entrada, backup, monitoramento e testes próprios.

## Kits práticos que o aluno pode levar para outros sistemas

Abra [Biblioteca de kits](./kits/README.md) e [catálogo técnico JSON](./kits/catalog.json). Cada extensão declara o módulo de origem, versão/maturidade, SKU DevKitTools quando existe, instalação, exemplo, caso negativo e limite. O repositório `frontEnds` é privado; a biblioteca pública disponibiliza **componente educacional original**, não uma cópia das fontes restritas. O DevKitTools é um catálogo de empacotamento comercial em preparação, não um download ZIP disponível nesta trilha.

## Entrega A — rubrica para cada laboratório

A avaliação é **editorial e verificável**, não certificação automática. Cada critério vale 0, 1 ou 2: (1) objetivo e escopo, (2) execução e erro interpretado, (3) caso positivo e negativo, (4) artefatos rastreáveis, (5) transferência e limites. Meta sugerida: 8/10, sem falha crítica de segurança. **Status A só após validação das referências, testes locais de funcionamento e revisão editorial; aprovação em CI não comprova o nível de um aluno.**
