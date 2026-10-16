# Rodada UI/UX — HubEstudos, 16/10/2026

Método: duas avaliações independentes, A (design_review) e B (design_detector), com Product Design, Intuitive Software Design e UXCritique. Alvo: aluno que procura um curso, retoma uma aula e reconhece seu progresso. A avaliação inicial foi por código; o navegador remoto não alcançou o servidor local (ERR_CONNECTION_REFUSED). Não houve teste com alunos. Consequências de usabilidade são hipóteses a validar.

| Prioridade | Evidência inicial | Correção |
|---|---|---|
| P1 | Cards brancos do catálogo herdavam texto claro do shell | Cor escura explícita em cards, sumário e estados; cabeçalho mantém contraste no fundo escuro |
| P1 | Atalhos da home com nomes distintos enviavam alunos ao mesmo catálogo sem contexto | Filtros por tipo com rotas próprias; prévias editoriais preservadas para administradores |
| P1 | Busca por assunto consultava apenas título/descrição dos cursos | Inclui módulo, aula e ID; mostra correspondência, contagem e recuperação do resultado vazio |
| P2 | Sumário não apresentava os estados já registrados na conta | Estados textuais de estudo/leitura/conclusão e retomada com rota e seção originais; nenhuma escrita nova |
| P2 | Cursos não ficava ativo na barra móvel das trilhas | Área ativa em todas as trilhas; cinco destinos móveis preservados |
| P2 | Sumário longo mostrava todos os módulos abertos | Disclosures nativos, primeiro módulo e módulo em andamento abertos, acionáveis por teclado |

Pontos fortes preservados: retomada real na home; progresso por conta; distinção entre leitura e prática; busca sem acentos; contratos de autorização no servidor. Não foram alterados API, autenticação, checkout, conteúdo, IDs ou formato de persistência.

O detector encontrou 1.255 ocorrências (1.238 advisories / 17 warnings). São majoritariamente divergências entre metadados navy/teal/Inter de DESIGN.md e as camadas editoriais violeta/papel/Outfit autorizadas no mesmo documento. Não representam 1.255 defeitos de UX. Metadados não foram reescritos nesta rodada. Transição de largura no progresso de lesson-v2 foi mantida fora do escopo.

| Heurística | Evidência e limite |
|---|---|
| Estado do sistema | Progresso existente agora visível no sumário; validar persistência por API e recarga |
| Linguagem | Cursos/trilhas correspondem aos destinos; detalhes de implementação removidos da contagem da home |
| Controle | Limpar busca, remover filtro, retornar ao catálogo, abrir/fechar módulo |
| Consistência | Catálogo adota os contrastes editoriais; mobile mantém área ativa |
| Prevenção de erros | Autorização existente mantida; não infere acesso a partir do histórico |
| Reconhecimento | Estado por aula e correspondência da busca visíveis |
| Eficiência | Retomada preserva a rota e a seção; busca encontra aulas internas |
| Hierarquia | Sumário progressivo; identidade vigente preservada |
| Recuperação | Busca vazia permite limpar termo/filtro sem alterar progresso |
| Ajuda | Instrução junto ao sumário distingue leitura de conclusão |

Não se atribui nota global: execução automatizada não estabelece descoberta, compreensão e confiança de pessoas reais. Nenhuma falha crítica foi confirmada pela inspeção estática.

Validação funcional: build integral, contratos existentes, busca contra todos os IDs/metadados do catálogo e seis testes de descoberta/renderização passaram localmente. QA de browser desktop/mobile preparado para GitHub Actions, ainda não executado: push bloqueado pela revisão automática de autorização. O QA usa contas e banco temporários, API real, autorização real, estado persistido/recarga, teclado, ausência de overflow e capturas. Um curso sem liberação continua bloqueado. Núcleo sem serviços pagos novos; Playwright é dependência apenas de desenvolvimento.

Validação humana pendente: pedir ao aluno “encontre a aula sobre [tema] e volte ao ponto em que parou”, sem indicar o controle. Observar escolha do curso, reconhecimento da correspondência, abertura do módulo e explicação correta do estado de leitura/conclusão. Não há resultados humanos nem metas de tempo inventadas.

Perguntas adicionais omitidas: o usuário já autorizou a rodada de melhorias; nenhuma decisão estrutural pendente impede estas correções.
