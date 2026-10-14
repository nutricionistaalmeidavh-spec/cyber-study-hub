# Trilha Desenvolvimento com IA — Módulos 01 a 05 A editorial (IA)

**Data:** 14/10/2026. **Tipo:** auditoria editorial assistida por IA com segunda passagem crítica distinta da autoria. **Estudo com alunos reais:** não realizado. **Avaliação humana externa:** não realizada.

## Escopo e integridade

Esta classificação se aplica à **nova trilha pedagógica** e **não** altera as notas nem os arquivos canônicos de `AULA-XXX`, `LOG-XX`, `ENG-XX`, `WEB-XX` e `JS-XX`. O inventário original permanece em 218 aulas principais + 325 paralelas = **543 unidades**. As 20 etapas de M01–M05 não são novos IDs dessas unidades.

| Módulo | Base existente | Entrega do aluno | Conteúdo técnico | Didática | Prática | Defesa | Avaliação | Especificidade | Parecer |
|---|---|---|---:|---:|---:|---:|---:|---:|---|
| M01 — Primeiros passos | LOG-01 | Protótipo HTML, regras e mudanças observadas | 91 | 91 | 89 | 91 | 89 | 93 | **A editorial IA** |
| M02 — Da ideia ao sistema | LOG-11 | Especificação e critérios Given/When/Then | 90 | 90 | 88 | 88 | 90 | 92 | **A editorial IA** |
| M03 — Preparando projeto | ENG-01 | React v0.1, build e primeiro Git commit | 90 | 88 | 90 | 89 | 90 | 91 | **A editorial IA** |
| M04 — Criando telas | WEB-11 | React v0.2, navegação, semântica e responsividade | 89 | 90 | 88 | 90 | 90 | 91 | **A editorial IA** |
| M05 — Sistema funcional | JS-02 | React v0.3, CRUD em memória e testes negativos | 92 | 91 | 93 | 91 | 91 | 94 | **A editorial IA** |

Os pareceres individualizados, métodos, resultados, seis dimensões, gates e os **SHA-256 de conteúdo, prova, gabarito e laboratório** encontram-se em `quality/trails/ai-dev/reviews.json`. O build falha se o conteúdo alterado divergir do hash revisado.

## Correções do primeiro módulo

- Conceitos de entrada, estado, regra e saída reescritos com previsão e contraexemplos.
- Prompt de ChatGPT/Claude delimitado por escopo, privacidade, casos válidos e inválidos; IA local opcional.
- Laboratório HTML com teste da conclusão repetida, alteração isolada de texto e observação dos indicadores.
- Prova independente de **seis questões** e gabarito separado, rubrica 0–2 e erro eliminatório.
- Continuidade da referência `LOG-01` sem duplicar material.

## Módulos 02–05

- Cada módulo: duas microaulas novas com exemplos e erros, uma referência canônica, um laboratório incremental.
- M02 fornece especificação com cinco requisitos e contrato de integridade da OS, com modelo testável e casos inválidos.
- M03 fornece projeto real React/TypeScript/Vite v0.1 com instruções de build e Git.
- M04 fornece projeto real React v0.2 com três telas, dados derivados da fonte e navegação por teclado.
- M05 fornece projeto real React v0.3 com CRUD, filtros, IDs estáveis, regras de estado e **15 testes Node**.
- Cada módulo fornece **seis questões independentes** com prova e gabarito em arquivos separados, total 30 questões.
- A página da trilha permite navegar 20 etapas, registrar reflexão, consultar a prova e abrir gabarito após registrar tentativa.

## Validação automatizada

```sh
npm run verify:ai-dev
npm run build
npm run test:platform
```

Os laboratórios de M01, M02 e M05 executam com Node 24; o QA também instala dependências **open source** e compila os três checkpoints React separadamente. GitHub Actions executa tudo em PR, sem deploy.

## Limites da nota

- **A editorial IA não significa que o aluno passou na avaliação.** Seu registro de progresso é autodeclarado e local.
- A segunda passagem editorial foi feita por IA; **não** houve professor independente, aluno real ou teste de leitor de tela.
- Não houve auditoria de segurança de aplicação de produção. Dados fictícios, React em memória e laboratório de requisitos não devem ser usados para guardar dados reais.
- Gratuidade obrigatória: conteúdo e checkpoints podem ser executados sem API paga, e sem login em ChatGPT/Claude para os exercícios. IA local só se houver hardware.
- Projeto não usa serviços pagos como dependência silenciosa; planos pagos de assistentes, se desejados, são alternativas externas explícitas.

## Próximo passo

Somente após o PR ser revisado e homologado: aprofundar módulos 06–08 em outra fase. Nesta branch a `main` e o deploy de produção não são alterados.
