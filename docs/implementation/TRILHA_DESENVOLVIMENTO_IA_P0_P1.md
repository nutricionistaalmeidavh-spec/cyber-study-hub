# Trilha Desenvolvimento de Sistemas com IA — P0 e P1

**Estado:** módulo 01 disponível como piloto, módulos 02–08 planejados. Escopo da branch: conteúdo educacional, página da trilha, protótipo Meu Gestor e validações. Autenticação, contas, OAuth, APIs e deploy não são modificados.

## Regra canônica

A trilha é uma **sequência pedagógica** que referencia oito unidades existentes em `src/curriculum/catalog.json`. Não aumenta artificialmente as 543 unidades da biblioteca. São **16 microaulas novas + 8 referências canônicas + 8 laboratórios novos = 32 etapas**. A numeração `01–32` identifica etapas da nova trilha, nunca IDs `AULA-XXX`.

- Aulas originais permanecem em `public/course-library/parallel/*.md`.
- Apenas o módulo 1 está pronto para uso. Exibir os outros como *em breve*, sem links inexistentes.
- Sem bloqueio rígido por pré-requisito; permitir revisão livre.
- Cada laboratório entrega um incremento do mesmo projeto, nunca um exercício desconectado.
- Não capturar conversa de IA, chave de API, tokens ou dados pessoais. Apenas progresso local simples e texto de planejamento fictício podem ser armazenados no dispositivo.

## Matriz e validação do reaproveitamento

| Módulo | Aula canônica | Conteúdo real verificado | Por que se conecta | Ponte didática |
|---|---|---|---|---|
| 01 — Primeiros passos | LOG-01 | Algoritmos e decomposição de problemas | Entradas, decisões e invariantes | Criar regra de estado das ordens |
| 02 — Da ideia ao sistema | LOG-11 | Entrada → processamento → saída | Contratos de entradas e resultados | Converter requisitos de serviço em comportamento testável |
| 03 — Preparar projeto | ENG-01 | Git | Versionar mudanças | Primeiros commits do Meu Gestor |
| 04 — Interfaces | WEB-11 | HTML | Estrutura/semântica do documento | Base acessível para React e formulários |
| 05 — Funcionalidade | JS-02 | Objetos e arrays | Listas e dados no navegador | CRUD de clientes e ordens |
| 06 — Banco e backend | WEB-26 | Databases | Persistência, constraints e transações | Mapear tabelas e garantir integridade |
| 07 — Qualidade | ENG-16 | Testes | Evidenciar comportamento | Testar estados inválidos e regressão |
| 08 — Publicar | ENG-21 | Build | Gerar artefatos verificáveis | Preparar e instalar a versão local |

**Correção sobre a proposta inicial:** LOG-15 aborda validação de entrada e não definição de requisitos; fica como **aprofundamento** para os módulos 02/05, e LOG-11 ocupa a referência principal do módulo 02.

## Uso de IA: navegador primeiro, local opcional

1. **Caminho recomendado:** ChatGPT ou Claude pelo navegador, usando prompts copiáveis, sem instalar extensões e sem o site do curso enviar dados ao provedor. Recursos gratuitos podem ter limites ou indisponibilidade; não prometer acesso ilimitado.
2. **Caminho local (facultativo):** Ollama com modelo aberto que o computador comportar. Não estimar mínimos universais de RAM/VRAM nem presumir que o modelo edita um projeto inteiro. Nenhum requisito desse caminho para a conclusão.
3. **Caminho sem IA:** roteiro conceitual, exemplo de resposta, documento de planejamento e protótipo HTML. É uma alternativa para a gratuidade obrigatória quando serviços externos não estiverem disponíveis.
4. **Pagamento:** nenhuma API, assinatura, chave, crédito, chamada de serviço paga ou conta comercial obrigatória. Eventuais planos pagos de ChatGPT/Claude só podem aparecer como opção claramente identificada, fora do núcleo.
5. **Segurança:** dados 100% fictícios, sem segredos ou informações clínicas/comerciais reais. A verificação de código e comportamento é do aluno; IA não é fonte de verdade.

## Laboratório 01 — roteiro de QA pedagógico

- Um aluno sem ambiente de desenvolvimento abre o HTML e consegue observar três ordens e o contador.
- Avançar `pendente → em andamento → concluído` atualiza contador apenas uma vez.
- Serviço `concluído` não oferece ação para continuar.
- Trocar somente o texto fictício de um serviço preserva indicadores.
- A etapa 01 só pode ser registrada após resposta correta; a etapa 02 exige revisão de três itens; a etapa 03 exige declaração de estudo da referência; a etapa 04 exige texto e critérios de aceite marcados. Essas últimas são **autodeclarações**; não certificam aprendizado.
- A página funciona com teclado/mobile e respeita a autenticação preexistente. Nenhuma integração de IA automática está presente.
- O progresso do piloto é **local por identificador de conta**, sem sincronização entre dispositivos. Não alegar equivalência ao progresso sincronizado das aulas do currículo.
- A prévia é HTML/JS sem bibliotecas para reduzir fricção inicial; no módulo 03 o aluno migrará para React, TypeScript e Vite.
- **Pendente antes do lançamento geral:** estudo com iniciantes, acessibilidade assistiva, auditoria de contraste e confirmação de build/QA automatizada.

## Próximas fases

- P2: conteúdo completo dos módulos 02–08 e seus laboratórios.
- P3: versão sincronizada de progresso no modelo de contas existente, com migração e testes específicos de autorização; não incluída nesta branch para proteger o sistema de login.
- P4: testes com alunos, QA visual mobile e validação pedagógica das entregas.
