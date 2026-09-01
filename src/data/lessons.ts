import type { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    "id": 43,
    "title": "GraphQL Security",
    "track": "Web",
    "level": "Base",
    "pcPractice": false,
    "summary": "GraphQL concentra múltiplas operações em um único endpoint; a segurança depende de autorização por resolver, limites de complexidade e exposição controlada do schema.",
    "objectives": [
      "Entender o papel de graphql security no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Resolver.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Resolver",
        "definition": "Função que busca ou altera dados para um campo do schema."
      },
      {
        "term": "Introspection",
        "definition": "Consulta do próprio schema, útil no desenvolvimento e sensível quando exposta sem necessidade."
      },
      {
        "term": "BOLA",
        "definition": "Falha de autorização em objetos acessados por identificadores."
      },
      {
        "term": "Complexity limit",
        "definition": "Controle que restringe custo de queries profundas ou muito amplas."
      }
    ],
    "defend": "Autorizar por objeto e por operação, limitar profundidade/complexidade e desabilitar introspection onde não for necessária.",
    "detect": "Observe queries anormalmente profundas, aliases em massa, erros de autorização e picos de custo por requisição.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Resolver de Introspection e qual evidência usaria primeiro.",
    "tags": [
      "Resolver",
      "Introspection",
      "BOLA"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "GraphQL concentra múltiplas operações em um único endpoint; a segurança depende de autorização por resolver, limites de complexidade e exposição controlada do schema.",
          "WebSockets mantêm um canal persistente após o handshake HTTP. Autorização deve ser revalidada por conexão e por ação, sem assumir que a sessão inicial permanecerá válida.",
          "WebSockets mantêm um canal persistente após o handshake HTTP. Autorização deve ser revalidada por conexão e por ação, sem assumir que a sessão inicial permanecerá válida."
        ],
        "answer": 1,
        "why": "GraphQL concentra múltiplas operações em um único endpoint; a segurança depende de autorização por resolver, limites de complexidade e exposição controlada do schema."
      },
      {
        "q": "O que melhor descreve Resolver?",
        "options": [
          "Função que busca ou altera dados para um campo do schema.",
          "Consulta do próprio schema, útil no desenvolvimento e sensível quando exposta sem necessidade.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Função que busca ou altera dados para um campo do schema."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Autorizar por objeto e por operação, limitar profundidade/complexidade e desabilitar introspection onde não for necessária."
        ],
        "answer": 3,
        "why": "Autorizar por objeto e por operação, limitar profundidade/complexidade e desabilitar introspection onde não for necessária."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Observe queries anormalmente profundas, aliases em massa, erros de autorização e picos de custo por requisição.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Observe queries anormalmente profundas, aliases em massa, erros de autorização e picos de custo por requisição."
      }
    ],
    "flashcards": [
      {
        "front": "Resolver",
        "back": "Função que busca ou altera dados para um campo do schema."
      },
      {
        "front": "Introspection",
        "back": "Consulta do próprio schema, útil no desenvolvimento e sensível quando exposta sem necessidade."
      },
      {
        "front": "BOLA",
        "back": "Falha de autorização em objetos acessados por identificadores."
      },
      {
        "front": "Complexity limit",
        "back": "Controle que restringe custo de queries profundas ou muito amplas."
      }
    ]
  },
  {
    "id": 44,
    "title": "WebSocket Security",
    "track": "Web",
    "level": "Base",
    "pcPractice": false,
    "summary": "WebSockets mantêm um canal persistente após o handshake HTTP. Autorização deve ser revalidada por conexão e por ação, sem assumir que a sessão inicial permanecerá válida.",
    "objectives": [
      "Entender o papel de websocket security no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Upgrade.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Upgrade",
        "definition": "Mudança da conexão HTTP para WebSocket durante o handshake."
      },
      {
        "term": "Origin",
        "definition": "Cabeçalho útil para restringir origens no handshake."
      },
      {
        "term": "CSWSH",
        "definition": "Uso indevido de credenciais do navegador para abrir WebSocket de outra origem."
      },
      {
        "term": "Revalidation",
        "definition": "Checagem contínua de autorização em operações sensíveis."
      }
    ],
    "defend": "Valide Origin, autentique no handshake, autorize cada operação e encerre conexões quando sessão/tokens forem revogados.",
    "detect": "Registre abertura/fechamento de sockets, ações privilegiadas e conexões mantidas após expiração de sessão.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Upgrade de Origin e qual evidência usaria primeiro.",
    "tags": [
      "Upgrade",
      "Origin",
      "CSWSH"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "WebSockets mantêm um canal persistente após o handshake HTTP. Autorização deve ser revalidada por conexão e por ação, sem assumir que a sessão inicial permanecerá válida.",
          "GraphQL concentra múltiplas operações em um único endpoint; a segurança depende de autorização por resolver, limites de complexidade e exposição controlada do schema.",
          "Request smuggling ocorre quando componentes HTTP interpretam limites de requisição de forma diferente, criando desincronização entre frontend e backend.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "WebSockets mantêm um canal persistente após o handshake HTTP. Autorização deve ser revalidada por conexão e por ação, sem assumir que a sessão inicial permanecerá válida."
      },
      {
        "q": "O que melhor descreve Upgrade?",
        "options": [
          "Cabeçalho útil para restringir origens no handshake.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Mudança da conexão HTTP para WebSocket durante o handshake."
        ],
        "answer": 3,
        "why": "Mudança da conexão HTTP para WebSocket durante o handshake."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Valide Origin, autentique no handshake, autorize cada operação e encerre conexões quando sessão/tokens forem revogados.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Valide Origin, autentique no handshake, autorize cada operação e encerre conexões quando sessão/tokens forem revogados."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Registre abertura/fechamento de sockets, ações privilegiadas e conexões mantidas após expiração de sessão.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Registre abertura/fechamento de sockets, ações privilegiadas e conexões mantidas após expiração de sessão."
      }
    ],
    "flashcards": [
      {
        "front": "Upgrade",
        "back": "Mudança da conexão HTTP para WebSocket durante o handshake."
      },
      {
        "front": "Origin",
        "back": "Cabeçalho útil para restringir origens no handshake."
      },
      {
        "front": "CSWSH",
        "back": "Uso indevido de credenciais do navegador para abrir WebSocket de outra origem."
      },
      {
        "front": "Revalidation",
        "back": "Checagem contínua de autorização em operações sensíveis."
      }
    ]
  },
  {
    "id": 45,
    "title": "HTTP Request Smuggling",
    "track": "Web",
    "level": "Base",
    "pcPractice": false,
    "summary": "Request smuggling ocorre quando componentes HTTP interpretam limites de requisição de forma diferente, criando desincronização entre frontend e backend.",
    "objectives": [
      "Entender o papel de http request smuggling no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Content-Length.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Content-Length",
        "definition": "Cabeçalho que informa o tamanho do corpo HTTP."
      },
      {
        "term": "Transfer-Encoding",
        "definition": "Mecanismo alternativo de delimitação do corpo, como chunked."
      },
      {
        "term": "Desync",
        "definition": "Divergência de parsing que desalinha a fronteira entre requisições."
      },
      {
        "term": "Normalization",
        "definition": "Padronização consistente de mensagens entre proxies e backends."
      }
    ],
    "defend": "Use parsers consistentes, normalize requests, rejeite combinações ambíguas e reduza traduções HTTP/2→HTTP/1 desnecessárias.",
    "detect": "Procure respostas trocadas, erros intermitentes de parsing, filas desalinhadas e padrões anômalos nos proxies.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Content-Length de Transfer-Encoding e qual evidência usaria primeiro.",
    "tags": [
      "Content-Length",
      "Transfer-Encoding",
      "Desync"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "WebSockets mantêm um canal persistente após o handshake HTTP. Autorização deve ser revalidada por conexão e por ação, sem assumir que a sessão inicial permanecerá válida.",
          "Cache poisoning explora entradas não incluídas na cache key que influenciam a resposta armazenada e depois compartilhada com outros usuários.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Request smuggling ocorre quando componentes HTTP interpretam limites de requisição de forma diferente, criando desincronização entre frontend e backend."
        ],
        "answer": 3,
        "why": "Request smuggling ocorre quando componentes HTTP interpretam limites de requisição de forma diferente, criando desincronização entre frontend e backend."
      },
      {
        "q": "O que melhor descreve Content-Length?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Cabeçalho que informa o tamanho do corpo HTTP.",
          "Mecanismo alternativo de delimitação do corpo, como chunked."
        ],
        "answer": 2,
        "why": "Cabeçalho que informa o tamanho do corpo HTTP."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Use parsers consistentes, normalize requests, rejeite combinações ambíguas e reduza traduções HTTP/2→HTTP/1 desnecessárias.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Use parsers consistentes, normalize requests, rejeite combinações ambíguas e reduza traduções HTTP/2→HTTP/1 desnecessárias."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Procure respostas trocadas, erros intermitentes de parsing, filas desalinhadas e padrões anômalos nos proxies.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Procure respostas trocadas, erros intermitentes de parsing, filas desalinhadas e padrões anômalos nos proxies."
      }
    ],
    "flashcards": [
      {
        "front": "Content-Length",
        "back": "Cabeçalho que informa o tamanho do corpo HTTP."
      },
      {
        "front": "Transfer-Encoding",
        "back": "Mecanismo alternativo de delimitação do corpo, como chunked."
      },
      {
        "front": "Desync",
        "back": "Divergência de parsing que desalinha a fronteira entre requisições."
      },
      {
        "front": "Normalization",
        "back": "Padronização consistente de mensagens entre proxies e backends."
      }
    ]
  },
  {
    "id": 46,
    "title": "Web Cache Poisoning",
    "track": "Web",
    "level": "Base",
    "pcPractice": false,
    "summary": "Cache poisoning explora entradas não incluídas na cache key que influenciam a resposta armazenada e depois compartilhada com outros usuários.",
    "objectives": [
      "Entender o papel de web cache poisoning no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Cache key.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Cache key",
        "definition": "Conjunto de atributos usados para distinguir objetos no cache."
      },
      {
        "term": "Unkeyed input",
        "definition": "Entrada que altera a resposta sem participar da cache key."
      },
      {
        "term": "HIT/MISS",
        "definition": "Indicadores de resposta servida do cache ou gerada na origem."
      },
      {
        "term": "Vary",
        "definition": "Cabeçalho que pode ampliar os elementos considerados pelo cache."
      }
    ],
    "defend": "Garanta cache keys corretas, normalize headers, não cache respostas personalizadas e controle entradas refletidas.",
    "detect": "Compare respostas HIT/MISS, headers de cache e variações inesperadas da mesma URL entre usuários.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Cache key de Unkeyed input e qual evidência usaria primeiro.",
    "tags": [
      "Cache key",
      "Unkeyed input",
      "HIT/MISS"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Cache deception faz conteúdo privado ser armazenado como se fosse público, normalmente por diferenças de roteamento e interpretação de extensões/caminhos.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Cache poisoning explora entradas não incluídas na cache key que influenciam a resposta armazenada e depois compartilhada com outros usuários.",
          "Request smuggling ocorre quando componentes HTTP interpretam limites de requisição de forma diferente, criando desincronização entre frontend e backend."
        ],
        "answer": 2,
        "why": "Cache poisoning explora entradas não incluídas na cache key que influenciam a resposta armazenada e depois compartilhada com outros usuários."
      },
      {
        "q": "O que melhor descreve Cache key?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Conjunto de atributos usados para distinguir objetos no cache.",
          "Entrada que altera a resposta sem participar da cache key.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Conjunto de atributos usados para distinguir objetos no cache."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Garanta cache keys corretas, normalize headers, não cache respostas personalizadas e controle entradas refletidas.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Garanta cache keys corretas, normalize headers, não cache respostas personalizadas e controle entradas refletidas."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Compare respostas HIT/MISS, headers de cache e variações inesperadas da mesma URL entre usuários."
        ],
        "answer": 3,
        "why": "Compare respostas HIT/MISS, headers de cache e variações inesperadas da mesma URL entre usuários."
      }
    ],
    "flashcards": [
      {
        "front": "Cache key",
        "back": "Conjunto de atributos usados para distinguir objetos no cache."
      },
      {
        "front": "Unkeyed input",
        "back": "Entrada que altera a resposta sem participar da cache key."
      },
      {
        "front": "HIT/MISS",
        "back": "Indicadores de resposta servida do cache ou gerada na origem."
      },
      {
        "front": "Vary",
        "back": "Cabeçalho que pode ampliar os elementos considerados pelo cache."
      }
    ]
  },
  {
    "id": 47,
    "title": "Web Cache Deception",
    "track": "Web",
    "level": "Base",
    "pcPractice": false,
    "summary": "Cache deception faz conteúdo privado ser armazenado como se fosse público, normalmente por diferenças de roteamento e interpretação de extensões/caminhos.",
    "objectives": [
      "Entender o papel de web cache deception no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Cacheable path.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Cacheable path",
        "definition": "Caminho que a CDN considera elegível para cache."
      },
      {
        "term": "Private content",
        "definition": "Resposta específica de usuário que não deve ser compartilhada."
      },
      {
        "term": "Path confusion",
        "definition": "Divergência entre como CDN e aplicação entendem a URL."
      },
      {
        "term": "Cache-Control",
        "definition": "Cabeçalho que define políticas de armazenamento e compartilhamento."
      }
    ],
    "defend": "Marque conteúdo privado como no-store/private, alinhe roteamento com a CDN e não use apenas extensão para decidir cacheabilidade.",
    "detect": "Teste rotas equivalentes, acompanhe HIT em endpoints autenticados e procure objetos privados aparecendo na CDN.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Cacheable path de Private content e qual evidência usaria primeiro.",
    "tags": [
      "Cacheable path",
      "Private content",
      "Path confusion"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Cache deception faz conteúdo privado ser armazenado como se fosse público, normalmente por diferenças de roteamento e interpretação de extensões/caminhos.",
          "Cache poisoning explora entradas não incluídas na cache key que influenciam a resposta armazenada e depois compartilhada com outros usuários.",
          "Prototype pollution altera propriedades herdadas em JavaScript e pode modificar comportamento de objetos em toda a aplicação."
        ],
        "answer": 1,
        "why": "Cache deception faz conteúdo privado ser armazenado como se fosse público, normalmente por diferenças de roteamento e interpretação de extensões/caminhos."
      },
      {
        "q": "O que melhor descreve Cacheable path?",
        "options": [
          "Caminho que a CDN considera elegível para cache.",
          "Resposta específica de usuário que não deve ser compartilhada.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Caminho que a CDN considera elegível para cache."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Marque conteúdo privado como no-store/private, alinhe roteamento com a CDN e não use apenas extensão para decidir cacheabilidade."
        ],
        "answer": 3,
        "why": "Marque conteúdo privado como no-store/private, alinhe roteamento com a CDN e não use apenas extensão para decidir cacheabilidade."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Teste rotas equivalentes, acompanhe HIT em endpoints autenticados e procure objetos privados aparecendo na CDN.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Teste rotas equivalentes, acompanhe HIT em endpoints autenticados e procure objetos privados aparecendo na CDN."
      }
    ],
    "flashcards": [
      {
        "front": "Cacheable path",
        "back": "Caminho que a CDN considera elegível para cache."
      },
      {
        "front": "Private content",
        "back": "Resposta específica de usuário que não deve ser compartilhada."
      },
      {
        "front": "Path confusion",
        "back": "Divergência entre como CDN e aplicação entendem a URL."
      },
      {
        "front": "Cache-Control",
        "back": "Cabeçalho que define políticas de armazenamento e compartilhamento."
      }
    ]
  },
  {
    "id": 48,
    "title": "Prototype Pollution",
    "track": "Web",
    "level": "Base",
    "pcPractice": false,
    "summary": "Prototype pollution altera propriedades herdadas em JavaScript e pode modificar comportamento de objetos em toda a aplicação.",
    "objectives": [
      "Entender o papel de prototype pollution no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a __proto__.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "__proto__",
        "definition": "Acesso histórico ao protótipo que pode ser abusado em merges inseguros."
      },
      {
        "term": "Prototype chain",
        "definition": "Cadeia de herança usada para resolver propriedades."
      },
      {
        "term": "Deep merge",
        "definition": "Combinação recursiva de objetos que precisa filtrar chaves perigosas."
      },
      {
        "term": "Own property",
        "definition": "Propriedade que pertence diretamente ao objeto, sem herança."
      }
    ],
    "defend": "Bloqueie chaves especiais em merges, use Object.create(null) quando apropriado e atualize bibliotecas vulneráveis.",
    "detect": "Procure propriedades inesperadas em objetos, erros após merges de input e CVEs em utilitários de merge.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria __proto__ de Prototype chain e qual evidência usaria primeiro.",
    "tags": [
      "__proto__",
      "Prototype chain",
      "Deep merge"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Prototype pollution altera propriedades herdadas em JavaScript e pode modificar comportamento de objetos em toda a aplicação.",
          "Cache deception faz conteúdo privado ser armazenado como se fosse público, normalmente por diferenças de roteamento e interpretação de extensões/caminhos.",
          "Aplicações que confiam no Host podem gerar links, redirects ou decisões de roteamento controláveis pelo cliente.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "Prototype pollution altera propriedades herdadas em JavaScript e pode modificar comportamento de objetos em toda a aplicação."
      },
      {
        "q": "O que melhor descreve __proto__?",
        "options": [
          "Cadeia de herança usada para resolver propriedades.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Acesso histórico ao protótipo que pode ser abusado em merges inseguros."
        ],
        "answer": 3,
        "why": "Acesso histórico ao protótipo que pode ser abusado em merges inseguros."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Bloqueie chaves especiais em merges, use Object.create(null) quando apropriado e atualize bibliotecas vulneráveis.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Bloqueie chaves especiais em merges, use Object.create(null) quando apropriado e atualize bibliotecas vulneráveis."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Procure propriedades inesperadas em objetos, erros após merges de input e CVEs em utilitários de merge.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Procure propriedades inesperadas em objetos, erros após merges de input e CVEs em utilitários de merge."
      }
    ],
    "flashcards": [
      {
        "front": "__proto__",
        "back": "Acesso histórico ao protótipo que pode ser abusado em merges inseguros."
      },
      {
        "front": "Prototype chain",
        "back": "Cadeia de herança usada para resolver propriedades."
      },
      {
        "front": "Deep merge",
        "back": "Combinação recursiva de objetos que precisa filtrar chaves perigosas."
      },
      {
        "front": "Own property",
        "back": "Propriedade que pertence diretamente ao objeto, sem herança."
      }
    ]
  },
  {
    "id": 49,
    "title": "Host Header Attacks",
    "track": "Web",
    "level": "Base",
    "pcPractice": false,
    "summary": "Aplicações que confiam no Host podem gerar links, redirects ou decisões de roteamento controláveis pelo cliente.",
    "objectives": [
      "Entender o papel de host header attacks no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Host.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Host",
        "definition": "Cabeçalho HTTP que identifica o host solicitado."
      },
      {
        "term": "X-Forwarded-Host",
        "definition": "Cabeçalho de proxy que pode influenciar host percebido pela aplicação."
      },
      {
        "term": "Password reset poisoning",
        "definition": "Geração de link de redefinição usando host controlado."
      },
      {
        "term": "Allowlist",
        "definition": "Lista explícita de hosts aceitos."
      }
    ],
    "defend": "Use host canônico configurado, valide hosts permitidos e trate headers de proxy apenas de infraestrutura confiável.",
    "detect": "Observe hosts desconhecidos, redirects externos e geração de URLs absolutas com domínios não autorizados.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Host de X-Forwarded-Host e qual evidência usaria primeiro.",
    "tags": [
      "Host",
      "X-Forwarded-Host",
      "Password reset poisoning"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Prototype pollution altera propriedades herdadas em JavaScript e pode modificar comportamento de objetos em toda a aplicação.",
          "Falhas DOM surgem quando código cliente move dados não confiáveis de fontes para sinks perigosos sem validação ou encoding adequado.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Aplicações que confiam no Host podem gerar links, redirects ou decisões de roteamento controláveis pelo cliente."
        ],
        "answer": 3,
        "why": "Aplicações que confiam no Host podem gerar links, redirects ou decisões de roteamento controláveis pelo cliente."
      },
      {
        "q": "O que melhor descreve Host?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Cabeçalho HTTP que identifica o host solicitado.",
          "Cabeçalho de proxy que pode influenciar host percebido pela aplicação."
        ],
        "answer": 2,
        "why": "Cabeçalho HTTP que identifica o host solicitado."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Use host canônico configurado, valide hosts permitidos e trate headers de proxy apenas de infraestrutura confiável.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Use host canônico configurado, valide hosts permitidos e trate headers de proxy apenas de infraestrutura confiável."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Observe hosts desconhecidos, redirects externos e geração de URLs absolutas com domínios não autorizados.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Observe hosts desconhecidos, redirects externos e geração de URLs absolutas com domínios não autorizados."
      }
    ],
    "flashcards": [
      {
        "front": "Host",
        "back": "Cabeçalho HTTP que identifica o host solicitado."
      },
      {
        "front": "X-Forwarded-Host",
        "back": "Cabeçalho de proxy que pode influenciar host percebido pela aplicação."
      },
      {
        "front": "Password reset poisoning",
        "back": "Geração de link de redefinição usando host controlado."
      },
      {
        "front": "Allowlist",
        "back": "Lista explícita de hosts aceitos."
      }
    ]
  },
  {
    "id": 50,
    "title": "DOM-based Vulnerabilities",
    "track": "Web",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "Falhas DOM surgem quando código cliente move dados não confiáveis de fontes para sinks perigosos sem validação ou encoding adequado.",
    "objectives": [
      "Entender o papel de dom-based vulnerabilities no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Source.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Source",
        "definition": "Origem de dados, como location, postMessage ou storage."
      },
      {
        "term": "Sink",
        "definition": "API que interpreta dados de forma perigosa, como innerHTML."
      },
      {
        "term": "Taint flow",
        "definition": "Caminho do dado não confiável até um sink."
      },
      {
        "term": "postMessage",
        "definition": "Canal entre janelas que exige validação de origin e payload."
      }
    ],
    "defend": "Prefira APIs seguras como textContent, valide origin em postMessage e aplique sanitização contextual.",
    "detect": "Use análise estática/dinâmica do fluxo source→sink e monitore erros/DOM mutations inesperadas.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Source de Sink e qual evidência usaria primeiro.",
    "tags": [
      "Source",
      "Sink",
      "Taint flow"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Command injection ocorre quando input influencia comandos do sistema operacional executados pela aplicação.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Falhas DOM surgem quando código cliente move dados não confiáveis de fontes para sinks perigosos sem validação ou encoding adequado.",
          "Aplicações que confiam no Host podem gerar links, redirects ou decisões de roteamento controláveis pelo cliente."
        ],
        "answer": 2,
        "why": "Falhas DOM surgem quando código cliente move dados não confiáveis de fontes para sinks perigosos sem validação ou encoding adequado."
      },
      {
        "q": "O que melhor descreve Source?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Origem de dados, como location, postMessage ou storage.",
          "API que interpreta dados de forma perigosa, como innerHTML.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Origem de dados, como location, postMessage ou storage."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Prefira APIs seguras como textContent, valide origin em postMessage e aplique sanitização contextual.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Prefira APIs seguras como textContent, valide origin em postMessage e aplique sanitização contextual."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Use análise estática/dinâmica do fluxo source→sink e monitore erros/DOM mutations inesperadas."
        ],
        "answer": 3,
        "why": "Use análise estática/dinâmica do fluxo source→sink e monitore erros/DOM mutations inesperadas."
      }
    ],
    "flashcards": [
      {
        "front": "Source",
        "back": "Origem de dados, como location, postMessage ou storage."
      },
      {
        "front": "Sink",
        "back": "API que interpreta dados de forma perigosa, como innerHTML."
      },
      {
        "front": "Taint flow",
        "back": "Caminho do dado não confiável até um sink."
      },
      {
        "front": "postMessage",
        "back": "Canal entre janelas que exige validação de origin e payload."
      }
    ]
  },
  {
    "id": 51,
    "title": "Command Injection",
    "track": "Web",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "Command injection ocorre quando input influencia comandos do sistema operacional executados pela aplicação.",
    "objectives": [
      "Entender o papel de command injection no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Shell.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Shell",
        "definition": "Interpretador de comandos que amplia risco quando recebe strings concatenadas."
      },
      {
        "term": "Argument injection",
        "definition": "Abuso de parâmetros mesmo sem metacaracteres de shell."
      },
      {
        "term": "Allowlist",
        "definition": "Validação por conjunto fechado de valores permitidos."
      },
      {
        "term": "Process API",
        "definition": "API que executa binário e argumentos separadamente, reduzindo interpretação pelo shell."
      }
    ],
    "defend": "Evite shell, use APIs com argumentos separados, allowlists estritas e princípio do menor privilégio.",
    "detect": "Procure processos filhos inesperados, argumentos anômalos, erros de shell e execuções originadas por serviços web.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Shell de Argument injection e qual evidência usaria primeiro.",
    "tags": [
      "Shell",
      "Argument injection",
      "Allowlist"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Command injection ocorre quando input influencia comandos do sistema operacional executados pela aplicação.",
          "Falhas DOM surgem quando código cliente move dados não confiáveis de fontes para sinks perigosos sem validação ou encoding adequado.",
          "Traversal e inclusão de arquivos exploram caminhos controláveis para acessar ou carregar recursos fora do diretório esperado."
        ],
        "answer": 1,
        "why": "Command injection ocorre quando input influencia comandos do sistema operacional executados pela aplicação."
      },
      {
        "q": "O que melhor descreve Shell?",
        "options": [
          "Interpretador de comandos que amplia risco quando recebe strings concatenadas.",
          "Abuso de parâmetros mesmo sem metacaracteres de shell.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Interpretador de comandos que amplia risco quando recebe strings concatenadas."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Evite shell, use APIs com argumentos separados, allowlists estritas e princípio do menor privilégio."
        ],
        "answer": 3,
        "why": "Evite shell, use APIs com argumentos separados, allowlists estritas e princípio do menor privilégio."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Procure processos filhos inesperados, argumentos anômalos, erros de shell e execuções originadas por serviços web.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Procure processos filhos inesperados, argumentos anômalos, erros de shell e execuções originadas por serviços web."
      }
    ],
    "flashcards": [
      {
        "front": "Shell",
        "back": "Interpretador de comandos que amplia risco quando recebe strings concatenadas."
      },
      {
        "front": "Argument injection",
        "back": "Abuso de parâmetros mesmo sem metacaracteres de shell."
      },
      {
        "front": "Allowlist",
        "back": "Validação por conjunto fechado de valores permitidos."
      },
      {
        "front": "Process API",
        "back": "API que executa binário e argumentos separadamente, reduzindo interpretação pelo shell."
      }
    ]
  },
  {
    "id": 52,
    "title": "Path Traversal e LFI/RFI",
    "track": "Web",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "Traversal e inclusão de arquivos exploram caminhos controláveis para acessar ou carregar recursos fora do diretório esperado.",
    "objectives": [
      "Entender o papel de path traversal e lfi/rfi no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a ../.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "../",
        "definition": "Sequência clássica de navegação para diretório pai."
      },
      {
        "term": "Canonical path",
        "definition": "Caminho normalizado usado para validar se o destino permanece na raiz permitida."
      },
      {
        "term": "LFI",
        "definition": "Inclusão de arquivo local."
      },
      {
        "term": "RFI",
        "definition": "Inclusão remota quando a plataforma permite carregar recursos externos."
      }
    ],
    "defend": "Normalize caminhos, valide a raiz final, use IDs em vez de paths do usuário e desabilite inclusão remota.",
    "detect": "Monitore tentativas com traversal, acessos a arquivos sensíveis e erros de resolução de caminho.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria ../ de Canonical path e qual evidência usaria primeiro.",
    "tags": [
      "../",
      "Canonical path",
      "LFI"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Traversal e inclusão de arquivos exploram caminhos controláveis para acessar ou carregar recursos fora do diretório esperado.",
          "Command injection ocorre quando input influencia comandos do sistema operacional executados pela aplicação.",
          "Uploads exigem validação de conteúdo, extensão, armazenamento e execução; confiar só no nome do arquivo é insuficiente.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "Traversal e inclusão de arquivos exploram caminhos controláveis para acessar ou carregar recursos fora do diretório esperado."
      },
      {
        "q": "O que melhor descreve ../?",
        "options": [
          "Caminho normalizado usado para validar se o destino permanece na raiz permitida.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Sequência clássica de navegação para diretório pai."
        ],
        "answer": 3,
        "why": "Sequência clássica de navegação para diretório pai."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Normalize caminhos, valide a raiz final, use IDs em vez de paths do usuário e desabilite inclusão remota.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Normalize caminhos, valide a raiz final, use IDs em vez de paths do usuário e desabilite inclusão remota."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Monitore tentativas com traversal, acessos a arquivos sensíveis e erros de resolução de caminho.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Monitore tentativas com traversal, acessos a arquivos sensíveis e erros de resolução de caminho."
      }
    ],
    "flashcards": [
      {
        "front": "../",
        "back": "Sequência clássica de navegação para diretório pai."
      },
      {
        "front": "Canonical path",
        "back": "Caminho normalizado usado para validar se o destino permanece na raiz permitida."
      },
      {
        "front": "LFI",
        "back": "Inclusão de arquivo local."
      },
      {
        "front": "RFI",
        "back": "Inclusão remota quando a plataforma permite carregar recursos externos."
      }
    ]
  },
  {
    "id": 53,
    "title": "File Upload Vulnerabilities",
    "track": "Web",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "Uploads exigem validação de conteúdo, extensão, armazenamento e execução; confiar só no nome do arquivo é insuficiente.",
    "objectives": [
      "Entender o papel de file upload vulnerabilities no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a MIME type.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "MIME type",
        "definition": "Tipo declarado/identificado do conteúdo."
      },
      {
        "term": "Magic bytes",
        "definition": "Assinaturas iniciais usadas para reconhecer formatos."
      },
      {
        "term": "Storage isolation",
        "definition": "Guardar upload fora de área executável e, idealmente, em serviço isolado."
      },
      {
        "term": "Renaming",
        "definition": "Gerar nome interno em vez de confiar no nome enviado."
      }
    ],
    "defend": "Valide conteúdo e tamanho, renomeie, armazene fora do webroot e sirva com headers seguros.",
    "detect": "Observe uploads executáveis, dupla extensão, MIME divergente e acessos diretos a caminhos de upload.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria MIME type de Magic bytes e qual evidência usaria primeiro.",
    "tags": [
      "MIME type",
      "Magic bytes",
      "Storage isolation"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Traversal e inclusão de arquivos exploram caminhos controláveis para acessar ou carregar recursos fora do diretório esperado.",
          "JWT é um formato de token assinado; segurança depende de validação de assinatura, algoritmo, claims, expiração e armazenamento.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Uploads exigem validação de conteúdo, extensão, armazenamento e execução; confiar só no nome do arquivo é insuficiente."
        ],
        "answer": 3,
        "why": "Uploads exigem validação de conteúdo, extensão, armazenamento e execução; confiar só no nome do arquivo é insuficiente."
      },
      {
        "q": "O que melhor descreve MIME type?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Tipo declarado/identificado do conteúdo.",
          "Assinaturas iniciais usadas para reconhecer formatos."
        ],
        "answer": 2,
        "why": "Tipo declarado/identificado do conteúdo."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Valide conteúdo e tamanho, renomeie, armazene fora do webroot e sirva com headers seguros.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Valide conteúdo e tamanho, renomeie, armazene fora do webroot e sirva com headers seguros."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Observe uploads executáveis, dupla extensão, MIME divergente e acessos diretos a caminhos de upload.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Observe uploads executáveis, dupla extensão, MIME divergente e acessos diretos a caminhos de upload."
      }
    ],
    "flashcards": [
      {
        "front": "MIME type",
        "back": "Tipo declarado/identificado do conteúdo."
      },
      {
        "front": "Magic bytes",
        "back": "Assinaturas iniciais usadas para reconhecer formatos."
      },
      {
        "front": "Storage isolation",
        "back": "Guardar upload fora de área executável e, idealmente, em serviço isolado."
      },
      {
        "front": "Renaming",
        "back": "Gerar nome interno em vez de confiar no nome enviado."
      }
    ]
  },
  {
    "id": 54,
    "title": "JWT Security",
    "track": "Web",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "JWT é um formato de token assinado; segurança depende de validação de assinatura, algoritmo, claims, expiração e armazenamento.",
    "objectives": [
      "Entender o papel de jwt security no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Header.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Header",
        "definition": "Parte do JWT que declara tipo e algoritmo."
      },
      {
        "term": "Claims",
        "definition": "Dados como sub, aud, iss e exp."
      },
      {
        "term": "Signature",
        "definition": "Prova de integridade/autenticidade do token."
      },
      {
        "term": "Key rotation",
        "definition": "Troca planejada de chaves com suporte a múltiplos kid válidos."
      }
    ],
    "defend": "Fixe algoritmos aceitos, valide iss/aud/exp, proteja chaves e implemente rotação/revogação conforme o risco.",
    "detect": "Monitore tokens expirados, kid desconhecido, falhas de assinatura e uso simultâneo anômalo.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Header de Claims e qual evidência usaria primeiro.",
    "tags": [
      "Header",
      "Claims",
      "Signature"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "OAuth delega autorização; OIDC adiciona identidade. A segurança está em redirect URIs, state/nonce, PKCE e validação correta dos tokens.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "JWT é um formato de token assinado; segurança depende de validação de assinatura, algoritmo, claims, expiração e armazenamento.",
          "Uploads exigem validação de conteúdo, extensão, armazenamento e execução; confiar só no nome do arquivo é insuficiente."
        ],
        "answer": 2,
        "why": "JWT é um formato de token assinado; segurança depende de validação de assinatura, algoritmo, claims, expiração e armazenamento."
      },
      {
        "q": "O que melhor descreve Header?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Parte do JWT que declara tipo e algoritmo.",
          "Dados como sub, aud, iss e exp.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Parte do JWT que declara tipo e algoritmo."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Fixe algoritmos aceitos, valide iss/aud/exp, proteja chaves e implemente rotação/revogação conforme o risco.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Fixe algoritmos aceitos, valide iss/aud/exp, proteja chaves e implemente rotação/revogação conforme o risco."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Monitore tokens expirados, kid desconhecido, falhas de assinatura e uso simultâneo anômalo."
        ],
        "answer": 3,
        "why": "Monitore tokens expirados, kid desconhecido, falhas de assinatura e uso simultâneo anômalo."
      }
    ],
    "flashcards": [
      {
        "front": "Header",
        "back": "Parte do JWT que declara tipo e algoritmo."
      },
      {
        "front": "Claims",
        "back": "Dados como sub, aud, iss e exp."
      },
      {
        "front": "Signature",
        "back": "Prova de integridade/autenticidade do token."
      },
      {
        "front": "Key rotation",
        "back": "Troca planejada de chaves com suporte a múltiplos kid válidos."
      }
    ]
  },
  {
    "id": 55,
    "title": "OAuth e OIDC Security",
    "track": "Web",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "OAuth delega autorização; OIDC adiciona identidade. A segurança está em redirect URIs, state/nonce, PKCE e validação correta dos tokens.",
    "objectives": [
      "Entender o papel de oauth e oidc security no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Authorization Code.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Authorization Code",
        "definition": "Código temporário trocado por tokens."
      },
      {
        "term": "PKCE",
        "definition": "Prova que vincula o cliente que iniciou o fluxo ao resgate do code."
      },
      {
        "term": "State",
        "definition": "Valor usado para relacionar resposta ao fluxo iniciado e mitigar CSRF."
      },
      {
        "term": "Nonce",
        "definition": "Valor usado no OIDC para vincular o ID token ao fluxo."
      }
    ],
    "defend": "Use redirect URIs exatas, PKCE, state/nonce fortes e valide issuer, audience e assinatura.",
    "detect": "Procure redirects fora da allowlist, reutilização de code, tokens para audiência errada e falhas de state/nonce.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Authorization Code de PKCE e qual evidência usaria primeiro.",
    "tags": [
      "Authorization Code",
      "PKCE",
      "State"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "OAuth delega autorização; OIDC adiciona identidade. A segurança está em redirect URIs, state/nonce, PKCE e validação correta dos tokens.",
          "JWT é um formato de token assinado; segurança depende de validação de assinatura, algoritmo, claims, expiração e armazenamento.",
          "APIs falham quando autorizam objetos, funções ou campos de forma implícita. BOLA, BFLA e mass assignment exigem controles explícitos."
        ],
        "answer": 1,
        "why": "OAuth delega autorização; OIDC adiciona identidade. A segurança está em redirect URIs, state/nonce, PKCE e validação correta dos tokens."
      },
      {
        "q": "O que melhor descreve Authorization Code?",
        "options": [
          "Código temporário trocado por tokens.",
          "Prova que vincula o cliente que iniciou o fluxo ao resgate do code.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Código temporário trocado por tokens."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Use redirect URIs exatas, PKCE, state/nonce fortes e valide issuer, audience e assinatura."
        ],
        "answer": 3,
        "why": "Use redirect URIs exatas, PKCE, state/nonce fortes e valide issuer, audience e assinatura."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Procure redirects fora da allowlist, reutilização de code, tokens para audiência errada e falhas de state/nonce.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Procure redirects fora da allowlist, reutilização de code, tokens para audiência errada e falhas de state/nonce."
      }
    ],
    "flashcards": [
      {
        "front": "Authorization Code",
        "back": "Código temporário trocado por tokens."
      },
      {
        "front": "PKCE",
        "back": "Prova que vincula o cliente que iniciou o fluxo ao resgate do code."
      },
      {
        "front": "State",
        "back": "Valor usado para relacionar resposta ao fluxo iniciado e mitigar CSRF."
      },
      {
        "front": "Nonce",
        "back": "Valor usado no OIDC para vincular o ID token ao fluxo."
      }
    ]
  },
  {
    "id": 56,
    "title": "API Security avançada — BOLA, BFLA, Mass Assignment",
    "track": "Web",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "APIs falham quando autorizam objetos, funções ou campos de forma implícita. BOLA, BFLA e mass assignment exigem controles explícitos.",
    "objectives": [
      "Entender o papel de api security avançada — bola, bfla, mass assignment no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a BOLA.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "BOLA",
        "definition": "Acesso indevido a objetos por falha de autorização no recurso."
      },
      {
        "term": "BFLA",
        "definition": "Acesso indevido a funções/ações por falha de autorização funcional."
      },
      {
        "term": "Mass Assignment",
        "definition": "Binding automático de campos que não deveriam ser alteráveis."
      },
      {
        "term": "DTO",
        "definition": "Estrutura explícita que limita campos aceitos na entrada."
      }
    ],
    "defend": "Autorize objeto e função, use DTOs/allowlists de campos e testes negativos de permissão.",
    "detect": "Correlacione usuário, objeto, ação e campos alterados; alerte para mudanças de papel ou propriedade indevidas.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria BOLA de BFLA e qual evidência usaria primeiro.",
    "tags": [
      "BOLA",
      "BFLA",
      "Mass Assignment"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "APIs falham quando autorizam objetos, funções ou campos de forma implícita. BOLA, BFLA e mass assignment exigem controles explícitos.",
          "OAuth delega autorização; OIDC adiciona identidade. A segurança está em redirect URIs, state/nonce, PKCE e validação correta dos tokens.",
          "Controles de frequência, atomicidade e regras de negócio evitam abuso de fluxos válidos em combinações não previstas.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "APIs falham quando autorizam objetos, funções ou campos de forma implícita. BOLA, BFLA e mass assignment exigem controles explícitos."
      },
      {
        "q": "O que melhor descreve BOLA?",
        "options": [
          "Acesso indevido a funções/ações por falha de autorização funcional.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Acesso indevido a objetos por falha de autorização no recurso."
        ],
        "answer": 3,
        "why": "Acesso indevido a objetos por falha de autorização no recurso."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Autorize objeto e função, use DTOs/allowlists de campos e testes negativos de permissão.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Autorize objeto e função, use DTOs/allowlists de campos e testes negativos de permissão."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Correlacione usuário, objeto, ação e campos alterados; alerte para mudanças de papel ou propriedade indevidas.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Correlacione usuário, objeto, ação e campos alterados; alerte para mudanças de papel ou propriedade indevidas."
      }
    ],
    "flashcards": [
      {
        "front": "BOLA",
        "back": "Acesso indevido a objetos por falha de autorização no recurso."
      },
      {
        "front": "BFLA",
        "back": "Acesso indevido a funções/ações por falha de autorização funcional."
      },
      {
        "front": "Mass Assignment",
        "back": "Binding automático de campos que não deveriam ser alteráveis."
      },
      {
        "front": "DTO",
        "back": "Estrutura explícita que limita campos aceitos na entrada."
      }
    ]
  },
  {
    "id": 57,
    "title": "Rate Limit, Race Conditions e Business Logic Flaws",
    "track": "Web",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "Controles de frequência, atomicidade e regras de negócio evitam abuso de fluxos válidos em combinações não previstas.",
    "objectives": [
      "Entender o papel de rate limit, race conditions e business logic flaws no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Rate limit.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Rate limit",
        "definition": "Restrição de frequência por identidade, recurso ou operação."
      },
      {
        "term": "Race condition",
        "definition": "Falha quando operações concorrentes quebram uma suposição de ordem/atomicidade."
      },
      {
        "term": "Idempotency key",
        "definition": "Chave para evitar processamento duplicado de uma mesma operação."
      },
      {
        "term": "Invariant",
        "definition": "Regra de negócio que deve permanecer verdadeira em todas as transições."
      }
    ],
    "defend": "Use transações/locks quando necessário, idempotência, limites contextuais e valide invariantes no servidor.",
    "detect": "Procure bursts, duplicidades, saldos impossíveis, estados intermediários e múltiplas requisições simultâneas.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Rate limit de Race condition e qual evidência usaria primeiro.",
    "tags": [
      "Rate limit",
      "Race condition",
      "Idempotency key"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "APIs falham quando autorizam objetos, funções ou campos de forma implícita. BOLA, BFLA e mass assignment exigem controles explícitos.",
          "Same-Origin Policy restringe interações entre origens; CORS é o mecanismo controlado para relaxar parte dessas restrições.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Controles de frequência, atomicidade e regras de negócio evitam abuso de fluxos válidos em combinações não previstas."
        ],
        "answer": 3,
        "why": "Controles de frequência, atomicidade e regras de negócio evitam abuso de fluxos válidos em combinações não previstas."
      },
      {
        "q": "O que melhor descreve Rate limit?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Restrição de frequência por identidade, recurso ou operação.",
          "Falha quando operações concorrentes quebram uma suposição de ordem/atomicidade."
        ],
        "answer": 2,
        "why": "Restrição de frequência por identidade, recurso ou operação."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Use transações/locks quando necessário, idempotência, limites contextuais e valide invariantes no servidor.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Use transações/locks quando necessário, idempotência, limites contextuais e valide invariantes no servidor."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Procure bursts, duplicidades, saldos impossíveis, estados intermediários e múltiplas requisições simultâneas.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Procure bursts, duplicidades, saldos impossíveis, estados intermediários e múltiplas requisições simultâneas."
      }
    ],
    "flashcards": [
      {
        "front": "Rate limit",
        "back": "Restrição de frequência por identidade, recurso ou operação."
      },
      {
        "front": "Race condition",
        "back": "Falha quando operações concorrentes quebram uma suposição de ordem/atomicidade."
      },
      {
        "front": "Idempotency key",
        "back": "Chave para evitar processamento duplicado de uma mesma operação."
      },
      {
        "front": "Invariant",
        "back": "Regra de negócio que deve permanecer verdadeira em todas as transições."
      }
    ]
  },
  {
    "id": 58,
    "title": "CORS e Same-Origin Policy",
    "track": "Web",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "Same-Origin Policy restringe interações entre origens; CORS é o mecanismo controlado para relaxar parte dessas restrições.",
    "objectives": [
      "Entender o papel de cors e same-origin policy no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Origin.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Origin",
        "definition": "Combinação de esquema, host e porta."
      },
      {
        "term": "Preflight",
        "definition": "Requisição OPTIONS usada para verificar permissões CORS."
      },
      {
        "term": "Access-Control-Allow-Origin",
        "definition": "Header que declara origens permitidas."
      },
      {
        "term": "Credentials",
        "definition": "Cookies/autenticação que exigem política CORS mais cuidadosa."
      }
    ],
    "defend": "Use allowlist explícita, não reflita Origin indiscriminadamente e evite credenciais com políticas amplas.",
    "detect": "Audite respostas CORS, origens refletidas e combinações de ACAO/credentials inseguras.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Origin de Preflight e qual evidência usaria primeiro.",
    "tags": [
      "Origin",
      "Preflight",
      "Access-Control-Allow-Origin"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Security headers reduzem superfície no navegador ao controlar execução, framing, transporte e interpretação de conteúdo.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Same-Origin Policy restringe interações entre origens; CORS é o mecanismo controlado para relaxar parte dessas restrições.",
          "Controles de frequência, atomicidade e regras de negócio evitam abuso de fluxos válidos em combinações não previstas."
        ],
        "answer": 2,
        "why": "Same-Origin Policy restringe interações entre origens; CORS é o mecanismo controlado para relaxar parte dessas restrições."
      },
      {
        "q": "O que melhor descreve Origin?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Combinação de esquema, host e porta.",
          "Requisição OPTIONS usada para verificar permissões CORS.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Combinação de esquema, host e porta."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Use allowlist explícita, não reflita Origin indiscriminadamente e evite credenciais com políticas amplas.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Use allowlist explícita, não reflita Origin indiscriminadamente e evite credenciais com políticas amplas."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Audite respostas CORS, origens refletidas e combinações de ACAO/credentials inseguras."
        ],
        "answer": 3,
        "why": "Audite respostas CORS, origens refletidas e combinações de ACAO/credentials inseguras."
      }
    ],
    "flashcards": [
      {
        "front": "Origin",
        "back": "Combinação de esquema, host e porta."
      },
      {
        "front": "Preflight",
        "back": "Requisição OPTIONS usada para verificar permissões CORS."
      },
      {
        "front": "Access-Control-Allow-Origin",
        "back": "Header que declara origens permitidas."
      },
      {
        "front": "Credentials",
        "back": "Cookies/autenticação que exigem política CORS mais cuidadosa."
      }
    ]
  },
  {
    "id": 59,
    "title": "CSP, Security Headers e Browser Protections",
    "track": "Web",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "Security headers reduzem superfície no navegador ao controlar execução, framing, transporte e interpretação de conteúdo.",
    "objectives": [
      "Entender o papel de csp, security headers e browser protections no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a CSP.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "CSP",
        "definition": "Política que restringe fontes de scripts, estilos e outros recursos."
      },
      {
        "term": "HSTS",
        "definition": "Força uso de HTTPS após primeira política válida."
      },
      {
        "term": "frame-ancestors",
        "definition": "Diretiva CSP para controlar incorporação em frames."
      },
      {
        "term": "nosniff",
        "definition": "Evita interpretação MIME especulativa."
      }
    ],
    "defend": "Adote CSP progressivamente, HSTS, headers de framing e MIME, com testes de compatibilidade.",
    "detect": "Use relatórios CSP, scanners de headers e inventário de páginas sem políticas mínimas.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria CSP de HSTS e qual evidência usaria primeiro.",
    "tags": [
      "CSP",
      "HSTS",
      "frame-ancestors"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Security headers reduzem superfície no navegador ao controlar execução, framing, transporte e interpretação de conteúdo.",
          "Same-Origin Policy restringe interações entre origens; CORS é o mecanismo controlado para relaxar parte dessas restrições.",
          "Risco real frequentemente surge da combinação de falhas menores. Encadear exige entender pré-condições, impacto acumulado e onde quebrar a cadeia."
        ],
        "answer": 1,
        "why": "Security headers reduzem superfície no navegador ao controlar execução, framing, transporte e interpretação de conteúdo."
      },
      {
        "q": "O que melhor descreve CSP?",
        "options": [
          "Política que restringe fontes de scripts, estilos e outros recursos.",
          "Força uso de HTTPS após primeira política válida.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Política que restringe fontes de scripts, estilos e outros recursos."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Adote CSP progressivamente, HSTS, headers de framing e MIME, com testes de compatibilidade."
        ],
        "answer": 3,
        "why": "Adote CSP progressivamente, HSTS, headers de framing e MIME, com testes de compatibilidade."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Use relatórios CSP, scanners de headers e inventário de páginas sem políticas mínimas.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Use relatórios CSP, scanners de headers e inventário de páginas sem políticas mínimas."
      }
    ],
    "flashcards": [
      {
        "front": "CSP",
        "back": "Política que restringe fontes de scripts, estilos e outros recursos."
      },
      {
        "front": "HSTS",
        "back": "Força uso de HTTPS após primeira política válida."
      },
      {
        "front": "frame-ancestors",
        "back": "Diretiva CSP para controlar incorporação em frames."
      },
      {
        "front": "nosniff",
        "back": "Evita interpretação MIME especulativa."
      }
    ]
  },
  {
    "id": 60,
    "title": "Encadeamento de Vulnerabilidades Web",
    "track": "Web",
    "level": "Avançado",
    "pcPractice": false,
    "summary": "Risco real frequentemente surge da combinação de falhas menores. Encadear exige entender pré-condições, impacto acumulado e onde quebrar a cadeia.",
    "objectives": [
      "Entender o papel de encadeamento de vulnerabilidades web no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Precondition.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Precondition",
        "definition": "Estado necessário antes de uma etapa funcionar."
      },
      {
        "term": "Exploit chain",
        "definition": "Sequência de falhas/ações que aumenta impacto."
      },
      {
        "term": "Pivot point",
        "definition": "Etapa em que o atacante muda de privilégio, contexto ou camada."
      },
      {
        "term": "Break the chain",
        "definition": "Controle que interrompe uma etapa e reduz impacto total."
      }
    ],
    "defend": "Corrija controles estruturais de autenticação/autorização, reduza exposição e priorize pontos que quebram cadeias inteiras.",
    "detect": "Correlacione eventos entre camadas e investigue sequências incomuns, não apenas alertas isolados.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Precondition de Exploit chain e qual evidência usaria primeiro.",
    "tags": [
      "Precondition",
      "Exploit chain",
      "Pivot point"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Risco real frequentemente surge da combinação de falhas menores. Encadear exige entender pré-condições, impacto acumulado e onde quebrar a cadeia.",
          "Security headers reduzem superfície no navegador ao controlar execução, framing, transporte e interpretação de conteúdo.",
          "Enumeração Linux organiza evidências sobre usuário, kernel, serviços, permissões, rede e software para entender a superfície local.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "Risco real frequentemente surge da combinação de falhas menores. Encadear exige entender pré-condições, impacto acumulado e onde quebrar a cadeia."
      },
      {
        "q": "O que melhor descreve Precondition?",
        "options": [
          "Sequência de falhas/ações que aumenta impacto.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Estado necessário antes de uma etapa funcionar."
        ],
        "answer": 3,
        "why": "Estado necessário antes de uma etapa funcionar."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Corrija controles estruturais de autenticação/autorização, reduza exposição e priorize pontos que quebram cadeias inteiras.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Corrija controles estruturais de autenticação/autorização, reduza exposição e priorize pontos que quebram cadeias inteiras."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Correlacione eventos entre camadas e investigue sequências incomuns, não apenas alertas isolados.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Correlacione eventos entre camadas e investigue sequências incomuns, não apenas alertas isolados."
      }
    ],
    "flashcards": [
      {
        "front": "Precondition",
        "back": "Estado necessário antes de uma etapa funcionar."
      },
      {
        "front": "Exploit chain",
        "back": "Sequência de falhas/ações que aumenta impacto."
      },
      {
        "front": "Pivot point",
        "back": "Etapa em que o atacante muda de privilégio, contexto ou camada."
      },
      {
        "front": "Break the chain",
        "back": "Controle que interrompe uma etapa e reduz impacto total."
      }
    ]
  },
  {
    "id": 61,
    "title": "Enumeração Linux",
    "track": "Sistemas",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "Enumeração Linux organiza evidências sobre usuário, kernel, serviços, permissões, rede e software para entender a superfície local.",
    "objectives": [
      "Entender o papel de enumeração linux no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a UID/GID.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "UID/GID",
        "definition": "Identificadores de usuário e grupo usados em permissões."
      },
      {
        "term": "sudoers",
        "definition": "Política que define comandos executáveis com privilégios elevados."
      },
      {
        "term": "Capabilities",
        "definition": "Privilégios granulares atribuídos a binários."
      },
      {
        "term": "SUID",
        "definition": "Bit que executa um binário com o UID do proprietário."
      }
    ],
    "defend": "Remova permissões desnecessárias, mantenha pacotes atualizados e aplique menor privilégio.",
    "detect": "Inventarie SUID/capabilities, sudoers, serviços e mudanças de permissões.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria UID/GID de sudoers e qual evidência usaria primeiro.",
    "tags": [
      "UID/GID",
      "sudoers",
      "Capabilities"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Risco real frequentemente surge da combinação de falhas menores. Encadear exige entender pré-condições, impacto acumulado e onde quebrar a cadeia.",
          "Enumeração Windows cobre identidade, grupos, serviços, tarefas, permissões, patches e configurações de segurança.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Enumeração Linux organiza evidências sobre usuário, kernel, serviços, permissões, rede e software para entender a superfície local."
        ],
        "answer": 3,
        "why": "Enumeração Linux organiza evidências sobre usuário, kernel, serviços, permissões, rede e software para entender a superfície local."
      },
      {
        "q": "O que melhor descreve UID/GID?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Identificadores de usuário e grupo usados em permissões.",
          "Política que define comandos executáveis com privilégios elevados."
        ],
        "answer": 2,
        "why": "Identificadores de usuário e grupo usados em permissões."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Remova permissões desnecessárias, mantenha pacotes atualizados e aplique menor privilégio.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Remova permissões desnecessárias, mantenha pacotes atualizados e aplique menor privilégio."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Inventarie SUID/capabilities, sudoers, serviços e mudanças de permissões.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Inventarie SUID/capabilities, sudoers, serviços e mudanças de permissões."
      }
    ],
    "flashcards": [
      {
        "front": "UID/GID",
        "back": "Identificadores de usuário e grupo usados em permissões."
      },
      {
        "front": "sudoers",
        "back": "Política que define comandos executáveis com privilégios elevados."
      },
      {
        "front": "Capabilities",
        "back": "Privilégios granulares atribuídos a binários."
      },
      {
        "front": "SUID",
        "back": "Bit que executa um binário com o UID do proprietário."
      }
    ]
  },
  {
    "id": 62,
    "title": "Enumeração Windows",
    "track": "Sistemas",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Enumeração Windows cobre identidade, grupos, serviços, tarefas, permissões, patches e configurações de segurança.",
    "objectives": [
      "Entender o papel de enumeração windows no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Token.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Token",
        "definition": "Estrutura que carrega identidade e privilégios do processo."
      },
      {
        "term": "Service ACL",
        "definition": "Permissões que controlam quem pode modificar ou iniciar um serviço."
      },
      {
        "term": "Scheduled Task",
        "definition": "Execução agendada que pode operar com contexto privilegiado."
      },
      {
        "term": "UAC",
        "definition": "Mecanismo que separa contexto padrão de elevação administrativa."
      }
    ],
    "defend": "Revise ACLs, serviços e tarefas; retire privilégios locais desnecessários e mantenha patching.",
    "detect": "Use inventário de serviços/tarefas, eventos de criação e mudanças de ACL/privilégio.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Token de Service ACL e qual evidência usaria primeiro.",
    "tags": [
      "Token",
      "Service ACL",
      "Scheduled Task"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Escalada em Linux normalmente explora permissões, configurações, credenciais ou vulnerabilidades locais para obter contexto mais privilegiado.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Enumeração Windows cobre identidade, grupos, serviços, tarefas, permissões, patches e configurações de segurança.",
          "Enumeração Linux organiza evidências sobre usuário, kernel, serviços, permissões, rede e software para entender a superfície local."
        ],
        "answer": 2,
        "why": "Enumeração Windows cobre identidade, grupos, serviços, tarefas, permissões, patches e configurações de segurança."
      },
      {
        "q": "O que melhor descreve Token?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Estrutura que carrega identidade e privilégios do processo.",
          "Permissões que controlam quem pode modificar ou iniciar um serviço.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Estrutura que carrega identidade e privilégios do processo."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Revise ACLs, serviços e tarefas; retire privilégios locais desnecessários e mantenha patching.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Revise ACLs, serviços e tarefas; retire privilégios locais desnecessários e mantenha patching."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Use inventário de serviços/tarefas, eventos de criação e mudanças de ACL/privilégio."
        ],
        "answer": 3,
        "why": "Use inventário de serviços/tarefas, eventos de criação e mudanças de ACL/privilégio."
      }
    ],
    "flashcards": [
      {
        "front": "Token",
        "back": "Estrutura que carrega identidade e privilégios do processo."
      },
      {
        "front": "Service ACL",
        "back": "Permissões que controlam quem pode modificar ou iniciar um serviço."
      },
      {
        "front": "Scheduled Task",
        "back": "Execução agendada que pode operar com contexto privilegiado."
      },
      {
        "front": "UAC",
        "back": "Mecanismo que separa contexto padrão de elevação administrativa."
      }
    ]
  },
  {
    "id": 63,
    "title": "Privilege Escalation Linux",
    "track": "Sistemas",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Escalada em Linux normalmente explora permissões, configurações, credenciais ou vulnerabilidades locais para obter contexto mais privilegiado.",
    "objectives": [
      "Entender o papel de privilege escalation linux no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a SUID/SGID.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "SUID/SGID",
        "definition": "Bits especiais que mudam identidade efetiva durante execução."
      },
      {
        "term": "Writable path",
        "definition": "Arquivo/diretório modificável que influencia execução privilegiada."
      },
      {
        "term": "Cron",
        "definition": "Agendamento que pode executar scripts em contexto elevado."
      },
      {
        "term": "Kernel exploit",
        "definition": "Falha local no kernel, dependente de versão e mitigação."
      }
    ],
    "defend": "Corrija permissões, proteja paths/scripts, reduza sudo/SUID e atualize kernel.",
    "detect": "Procure alterações em arquivos privilegiados, shells elevadas e execução incomum por cron/sudo.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria SUID/SGID de Writable path e qual evidência usaria primeiro.",
    "tags": [
      "SUID/SGID",
      "Writable path",
      "Cron"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Escalada em Linux normalmente explora permissões, configurações, credenciais ou vulnerabilidades locais para obter contexto mais privilegiado.",
          "Enumeração Windows cobre identidade, grupos, serviços, tarefas, permissões, patches e configurações de segurança.",
          "Escalada no Windows envolve serviços, tokens, tarefas, instaladores, ACLs e vulnerabilidades locais."
        ],
        "answer": 1,
        "why": "Escalada em Linux normalmente explora permissões, configurações, credenciais ou vulnerabilidades locais para obter contexto mais privilegiado."
      },
      {
        "q": "O que melhor descreve SUID/SGID?",
        "options": [
          "Bits especiais que mudam identidade efetiva durante execução.",
          "Arquivo/diretório modificável que influencia execução privilegiada.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Bits especiais que mudam identidade efetiva durante execução."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Corrija permissões, proteja paths/scripts, reduza sudo/SUID e atualize kernel."
        ],
        "answer": 3,
        "why": "Corrija permissões, proteja paths/scripts, reduza sudo/SUID e atualize kernel."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Procure alterações em arquivos privilegiados, shells elevadas e execução incomum por cron/sudo.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Procure alterações em arquivos privilegiados, shells elevadas e execução incomum por cron/sudo."
      }
    ],
    "flashcards": [
      {
        "front": "SUID/SGID",
        "back": "Bits especiais que mudam identidade efetiva durante execução."
      },
      {
        "front": "Writable path",
        "back": "Arquivo/diretório modificável que influencia execução privilegiada."
      },
      {
        "front": "Cron",
        "back": "Agendamento que pode executar scripts em contexto elevado."
      },
      {
        "front": "Kernel exploit",
        "back": "Falha local no kernel, dependente de versão e mitigação."
      }
    ]
  },
  {
    "id": 64,
    "title": "Privilege Escalation Windows",
    "track": "Sistemas",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Escalada no Windows envolve serviços, tokens, tarefas, instaladores, ACLs e vulnerabilidades locais.",
    "objectives": [
      "Entender o papel de privilege escalation windows no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a SeImpersonatePrivilege.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "SeImpersonatePrivilege",
        "definition": "Privilégio que permite assumir tokens em cenários específicos."
      },
      {
        "term": "Unquoted service path",
        "definition": "Configuração ambígua de caminho de serviço sem aspas."
      },
      {
        "term": "Weak service ACL",
        "definition": "Permissão que permite alterar binário/configuração de serviço."
      },
      {
        "term": "Token impersonation",
        "definition": "Uso de token de outro contexto para executar ações."
      }
    ],
    "defend": "Endureça serviços/ACLs, retire privilégios desnecessários e mantenha sistema atualizado.",
    "detect": "Monitore mudanças de serviço, novos binários em paths sensíveis e eventos de elevação.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria SeImpersonatePrivilege de Unquoted service path e qual evidência usaria primeiro.",
    "tags": [
      "SeImpersonatePrivilege",
      "Unquoted service path",
      "Weak service ACL"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Escalada no Windows envolve serviços, tokens, tarefas, instaladores, ACLs e vulnerabilidades locais.",
          "Escalada em Linux normalmente explora permissões, configurações, credenciais ou vulnerabilidades locais para obter contexto mais privilegiado.",
          "Muitas falhas locais vêm de configuração: contas padrão, permissões amplas, serviços expostos e segredos acessíveis.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "Escalada no Windows envolve serviços, tokens, tarefas, instaladores, ACLs e vulnerabilidades locais."
      },
      {
        "q": "O que melhor descreve SeImpersonatePrivilege?",
        "options": [
          "Configuração ambígua de caminho de serviço sem aspas.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Privilégio que permite assumir tokens em cenários específicos."
        ],
        "answer": 3,
        "why": "Privilégio que permite assumir tokens em cenários específicos."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Endureça serviços/ACLs, retire privilégios desnecessários e mantenha sistema atualizado.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Endureça serviços/ACLs, retire privilégios desnecessários e mantenha sistema atualizado."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Monitore mudanças de serviço, novos binários em paths sensíveis e eventos de elevação.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Monitore mudanças de serviço, novos binários em paths sensíveis e eventos de elevação."
      }
    ],
    "flashcards": [
      {
        "front": "SeImpersonatePrivilege",
        "back": "Privilégio que permite assumir tokens em cenários específicos."
      },
      {
        "front": "Unquoted service path",
        "back": "Configuração ambígua de caminho de serviço sem aspas."
      },
      {
        "front": "Weak service ACL",
        "back": "Permissão que permite alterar binário/configuração de serviço."
      },
      {
        "front": "Token impersonation",
        "back": "Uso de token de outro contexto para executar ações."
      }
    ]
  },
  {
    "id": 65,
    "title": "Serviços, permissões e configurações inseguras",
    "track": "Sistemas",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "Muitas falhas locais vêm de configuração: contas padrão, permissões amplas, serviços expostos e segredos acessíveis.",
    "objectives": [
      "Entender o papel de serviços, permissões e configurações inseguras no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Least privilege.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Least privilege",
        "definition": "Conceder apenas o necessário para a função."
      },
      {
        "term": "Default credential",
        "definition": "Credencial padrão que precisa ser alterada antes de produção."
      },
      {
        "term": "World-writable",
        "definition": "Recurso modificável por qualquer usuário."
      },
      {
        "term": "Attack surface",
        "definition": "Conjunto de pontos que podem ser alcançados/abusados."
      }
    ],
    "defend": "Use baseline de hardening, remova defaults, restrinja permissões e desative serviços não usados.",
    "detect": "Faça auditorias de configuração e compare sistema com baseline versionada.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Least privilege de Default credential e qual evidência usaria primeiro.",
    "tags": [
      "Least privilege",
      "Default credential",
      "World-writable"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Escalada no Windows envolve serviços, tokens, tarefas, instaladores, ACLs e vulnerabilidades locais.",
          "Nmap combina descoberta, portas, versões e scripts para mapear serviços em ambientes autorizados.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Muitas falhas locais vêm de configuração: contas padrão, permissões amplas, serviços expostos e segredos acessíveis."
        ],
        "answer": 3,
        "why": "Muitas falhas locais vêm de configuração: contas padrão, permissões amplas, serviços expostos e segredos acessíveis."
      },
      {
        "q": "O que melhor descreve Least privilege?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Conceder apenas o necessário para a função.",
          "Credencial padrão que precisa ser alterada antes de produção."
        ],
        "answer": 2,
        "why": "Conceder apenas o necessário para a função."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Use baseline de hardening, remova defaults, restrinja permissões e desative serviços não usados.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Use baseline de hardening, remova defaults, restrinja permissões e desative serviços não usados."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Faça auditorias de configuração e compare sistema com baseline versionada.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Faça auditorias de configuração e compare sistema com baseline versionada."
      }
    ],
    "flashcards": [
      {
        "front": "Least privilege",
        "back": "Conceder apenas o necessário para a função."
      },
      {
        "front": "Default credential",
        "back": "Credencial padrão que precisa ser alterada antes de produção."
      },
      {
        "front": "World-writable",
        "back": "Recurso modificável por qualquer usuário."
      },
      {
        "front": "Attack surface",
        "back": "Conjunto de pontos que podem ser alcançados/abusados."
      }
    ]
  },
  {
    "id": 66,
    "title": "Nmap avançado e Service Fingerprinting",
    "track": "Sistemas",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Nmap combina descoberta, portas, versões e scripts para mapear serviços em ambientes autorizados.",
    "objectives": [
      "Entender o papel de nmap avançado e service fingerprinting no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a SYN scan.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "SYN scan",
        "definition": "Técnica de descoberta de portas baseada no handshake TCP parcial."
      },
      {
        "term": "Service detection",
        "definition": "Coleta de banners/probes para inferir serviço e versão."
      },
      {
        "term": "NSE",
        "definition": "Mecanismo de scripts do Nmap para enumeração e verificações."
      },
      {
        "term": "Fingerprint",
        "definition": "Conjunto de sinais usados para inferir software ou sistema."
      }
    ],
    "defend": "Reduza exposição de serviços, segmente rede e mantenha banners/configuração mínimos.",
    "detect": "Monitore varreduras, conexões sequenciais a portas e padrões de probes.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria SYN scan de Service detection e qual evidência usaria primeiro.",
    "tags": [
      "SYN scan",
      "Service detection",
      "NSE"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Scanners aceleram descoberta de exposições, mas resultados precisam de contexto, validação e priorização.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Nmap combina descoberta, portas, versões e scripts para mapear serviços em ambientes autorizados.",
          "Muitas falhas locais vêm de configuração: contas padrão, permissões amplas, serviços expostos e segredos acessíveis."
        ],
        "answer": 2,
        "why": "Nmap combina descoberta, portas, versões e scripts para mapear serviços em ambientes autorizados."
      },
      {
        "q": "O que melhor descreve SYN scan?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Técnica de descoberta de portas baseada no handshake TCP parcial.",
          "Coleta de banners/probes para inferir serviço e versão.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Técnica de descoberta de portas baseada no handshake TCP parcial."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Reduza exposição de serviços, segmente rede e mantenha banners/configuração mínimos.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Reduza exposição de serviços, segmente rede e mantenha banners/configuração mínimos."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Monitore varreduras, conexões sequenciais a portas e padrões de probes."
        ],
        "answer": 3,
        "why": "Monitore varreduras, conexões sequenciais a portas e padrões de probes."
      }
    ],
    "flashcards": [
      {
        "front": "SYN scan",
        "back": "Técnica de descoberta de portas baseada no handshake TCP parcial."
      },
      {
        "front": "Service detection",
        "back": "Coleta de banners/probes para inferir serviço e versão."
      },
      {
        "front": "NSE",
        "back": "Mecanismo de scripts do Nmap para enumeração e verificações."
      },
      {
        "front": "Fingerprint",
        "back": "Conjunto de sinais usados para inferir software ou sistema."
      }
    ]
  },
  {
    "id": 67,
    "title": "Vulnerability Scanning profissional — Nessus/OpenVAS/Nuclei",
    "track": "Sistemas",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Scanners aceleram descoberta de exposições, mas resultados precisam de contexto, validação e priorização.",
    "objectives": [
      "Entender o papel de vulnerability scanning profissional — nessus/openvas/nuclei no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Template.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Template",
        "definition": "Regra de detecção reutilizável, comum no Nuclei."
      },
      {
        "term": "Authenticated scan",
        "definition": "Varredura com credenciais que melhora visibilidade local."
      },
      {
        "term": "False positive",
        "definition": "Achado reportado que não representa vulnerabilidade real."
      },
      {
        "term": "Coverage",
        "definition": "Quanto da superfície e dos checks foi efetivamente analisado."
      }
    ],
    "defend": "Mantenha scanners atualizados, use credenciais de leitura quando seguro e integre resultados ao processo de correção.",
    "detect": "Compare achados entre ferramentas, valide amostras e acompanhe tendência por ativo.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Template de Authenticated scan e qual evidência usaria primeiro.",
    "tags": [
      "Template",
      "Authenticated scan",
      "False positive"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Scanners aceleram descoberta de exposições, mas resultados precisam de contexto, validação e priorização.",
          "Nmap combina descoberta, portas, versões e scripts para mapear serviços em ambientes autorizados.",
          "CVE identifica vulnerabilidades, CWE classifica fraquezas e CVSS ajuda a estimar severidade; contexto do ativo decide prioridade real."
        ],
        "answer": 1,
        "why": "Scanners aceleram descoberta de exposições, mas resultados precisam de contexto, validação e priorização."
      },
      {
        "q": "O que melhor descreve Template?",
        "options": [
          "Regra de detecção reutilizável, comum no Nuclei.",
          "Varredura com credenciais que melhora visibilidade local.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Regra de detecção reutilizável, comum no Nuclei."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Mantenha scanners atualizados, use credenciais de leitura quando seguro e integre resultados ao processo de correção."
        ],
        "answer": 3,
        "why": "Mantenha scanners atualizados, use credenciais de leitura quando seguro e integre resultados ao processo de correção."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Compare achados entre ferramentas, valide amostras e acompanhe tendência por ativo.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Compare achados entre ferramentas, valide amostras e acompanhe tendência por ativo."
      }
    ],
    "flashcards": [
      {
        "front": "Template",
        "back": "Regra de detecção reutilizável, comum no Nuclei."
      },
      {
        "front": "Authenticated scan",
        "back": "Varredura com credenciais que melhora visibilidade local."
      },
      {
        "front": "False positive",
        "back": "Achado reportado que não representa vulnerabilidade real."
      },
      {
        "front": "Coverage",
        "back": "Quanto da superfície e dos checks foi efetivamente analisado."
      }
    ]
  },
  {
    "id": 68,
    "title": "CVE, CWE, CVSS e advisories",
    "track": "Sistemas",
    "level": "Intermediário",
    "pcPractice": false,
    "summary": "CVE identifica vulnerabilidades, CWE classifica fraquezas e CVSS ajuda a estimar severidade; contexto do ativo decide prioridade real.",
    "objectives": [
      "Entender o papel de cve, cwe, cvss e advisories no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a CVE.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "CVE",
        "definition": "Identificador de vulnerabilidade publicada."
      },
      {
        "term": "CWE",
        "definition": "Categoria de fraqueza de software."
      },
      {
        "term": "CVSS",
        "definition": "Métrica de severidade técnica."
      },
      {
        "term": "Advisory",
        "definition": "Comunicado do fornecedor com impacto, versões e correção."
      }
    ],
    "defend": "Combine severidade com exposição, criticidade e exploitability; aplique patches/advisories verificados.",
    "detect": "Mantenha inventário de versões e correlacione com advisories/CVEs aplicáveis.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria CVE de CWE e qual evidência usaria primeiro.",
    "tags": [
      "CVE",
      "CWE",
      "CVSS"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "CVE identifica vulnerabilidades, CWE classifica fraquezas e CVSS ajuda a estimar severidade; contexto do ativo decide prioridade real.",
          "Scanners aceleram descoberta de exposições, mas resultados precisam de contexto, validação e priorização.",
          "PoCs devem ser validadas apenas em ambiente autorizado, reproduzível e isolado, registrando pré-condições e impacto sem causar dano.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "CVE identifica vulnerabilidades, CWE classifica fraquezas e CVSS ajuda a estimar severidade; contexto do ativo decide prioridade real."
      },
      {
        "q": "O que melhor descreve CVE?",
        "options": [
          "Categoria de fraqueza de software.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Identificador de vulnerabilidade publicada."
        ],
        "answer": 3,
        "why": "Identificador de vulnerabilidade publicada."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Combine severidade com exposição, criticidade e exploitability; aplique patches/advisories verificados.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Combine severidade com exposição, criticidade e exploitability; aplique patches/advisories verificados."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Mantenha inventário de versões e correlacione com advisories/CVEs aplicáveis.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Mantenha inventário de versões e correlacione com advisories/CVEs aplicáveis."
      }
    ],
    "flashcards": [
      {
        "front": "CVE",
        "back": "Identificador de vulnerabilidade publicada."
      },
      {
        "front": "CWE",
        "back": "Categoria de fraqueza de software."
      },
      {
        "front": "CVSS",
        "back": "Métrica de severidade técnica."
      },
      {
        "front": "Advisory",
        "back": "Comunicado do fornecedor com impacto, versões e correção."
      }
    ]
  },
  {
    "id": 69,
    "title": "Validação segura de PoCs em laboratório",
    "track": "Sistemas",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "PoCs devem ser validadas apenas em ambiente autorizado, reproduzível e isolado, registrando pré-condições e impacto sem causar dano.",
    "objectives": [
      "Entender o papel de validação segura de pocs em laboratório no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a PoC.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "PoC",
        "definition": "Demonstração mínima de que uma condição vulnerável existe."
      },
      {
        "term": "Isolation",
        "definition": "Separação do laboratório de sistemas e dados reais."
      },
      {
        "term": "Snapshot",
        "definition": "Ponto de restauração de VM/ambiente."
      },
      {
        "term": "Reproducibility",
        "definition": "Capacidade de repetir o teste com passos e versões conhecidos."
      }
    ],
    "defend": "Use laboratório próprio, snapshots, dados fictícios e limites claros de escopo.",
    "detect": "Registre comandos, versões, hashes, logs e resultados para permitir revisão e reteste.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria PoC de Isolation e qual evidência usaria primeiro.",
    "tags": [
      "PoC",
      "Isolation",
      "Snapshot"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "CVE identifica vulnerabilidades, CWE classifica fraquezas e CVSS ajuda a estimar severidade; contexto do ativo decide prioridade real.",
          "Active Directory organiza identidades, máquinas, grupos e políticas em domínios, com controladores que mantêm o diretório e serviços de autenticação.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "PoCs devem ser validadas apenas em ambiente autorizado, reproduzível e isolado, registrando pré-condições e impacto sem causar dano."
        ],
        "answer": 3,
        "why": "PoCs devem ser validadas apenas em ambiente autorizado, reproduzível e isolado, registrando pré-condições e impacto sem causar dano."
      },
      {
        "q": "O que melhor descreve PoC?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Demonstração mínima de que uma condição vulnerável existe.",
          "Separação do laboratório de sistemas e dados reais."
        ],
        "answer": 2,
        "why": "Demonstração mínima de que uma condição vulnerável existe."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Use laboratório próprio, snapshots, dados fictícios e limites claros de escopo.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Use laboratório próprio, snapshots, dados fictícios e limites claros de escopo."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Registre comandos, versões, hashes, logs e resultados para permitir revisão e reteste.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Registre comandos, versões, hashes, logs e resultados para permitir revisão e reteste."
      }
    ],
    "flashcards": [
      {
        "front": "PoC",
        "back": "Demonstração mínima de que uma condição vulnerável existe."
      },
      {
        "front": "Isolation",
        "back": "Separação do laboratório de sistemas e dados reais."
      },
      {
        "front": "Snapshot",
        "back": "Ponto de restauração de VM/ambiente."
      },
      {
        "front": "Reproducibility",
        "back": "Capacidade de repetir o teste com passos e versões conhecidos."
      }
    ]
  },
  {
    "id": 70,
    "title": "Active Directory fundamentals",
    "track": "Active Directory",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Active Directory organiza identidades, máquinas, grupos e políticas em domínios, com controladores que mantêm o diretório e serviços de autenticação.",
    "objectives": [
      "Entender o papel de active directory fundamentals no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Domain.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Domain",
        "definition": "Limite lógico de administração e identidade."
      },
      {
        "term": "Domain Controller",
        "definition": "Servidor que hospeda serviços centrais do AD."
      },
      {
        "term": "OU",
        "definition": "Contêiner organizacional usado para delegação e políticas."
      },
      {
        "term": "Group",
        "definition": "Objeto usado para agrupar identidades e conceder acesso."
      }
    ],
    "defend": "Designe OUs/grupos com menor privilégio, proteja DCs e administre contas privilegiadas separadamente.",
    "detect": "Audite mudanças de grupos, criação de contas e eventos críticos nos controladores.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Domain de Domain Controller e qual evidência usaria primeiro.",
    "tags": [
      "Domain",
      "Domain Controller",
      "OU"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "LDAP consulta o diretório; Kerberos usa tickets para autenticação; NTLM é legado e deve ser reduzido quando possível.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Active Directory organiza identidades, máquinas, grupos e políticas em domínios, com controladores que mantêm o diretório e serviços de autenticação.",
          "PoCs devem ser validadas apenas em ambiente autorizado, reproduzível e isolado, registrando pré-condições e impacto sem causar dano."
        ],
        "answer": 2,
        "why": "Active Directory organiza identidades, máquinas, grupos e políticas em domínios, com controladores que mantêm o diretório e serviços de autenticação."
      },
      {
        "q": "O que melhor descreve Domain?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Limite lógico de administração e identidade.",
          "Servidor que hospeda serviços centrais do AD.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Limite lógico de administração e identidade."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Designe OUs/grupos com menor privilégio, proteja DCs e administre contas privilegiadas separadamente.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Designe OUs/grupos com menor privilégio, proteja DCs e administre contas privilegiadas separadamente."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Audite mudanças de grupos, criação de contas e eventos críticos nos controladores."
        ],
        "answer": 3,
        "why": "Audite mudanças de grupos, criação de contas e eventos críticos nos controladores."
      }
    ],
    "flashcards": [
      {
        "front": "Domain",
        "back": "Limite lógico de administração e identidade."
      },
      {
        "front": "Domain Controller",
        "back": "Servidor que hospeda serviços centrais do AD."
      },
      {
        "front": "OU",
        "back": "Contêiner organizacional usado para delegação e políticas."
      },
      {
        "front": "Group",
        "back": "Objeto usado para agrupar identidades e conceder acesso."
      }
    ]
  },
  {
    "id": 71,
    "title": "LDAP, Kerberos, NTLM",
    "track": "Active Directory",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "LDAP consulta o diretório; Kerberos usa tickets para autenticação; NTLM é legado e deve ser reduzido quando possível.",
    "objectives": [
      "Entender o papel de ldap, kerberos, ntlm no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a LDAP.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "LDAP",
        "definition": "Protocolo de consulta e alteração de diretórios."
      },
      {
        "term": "TGT",
        "definition": "Ticket inicial do Kerberos usado para solicitar serviços."
      },
      {
        "term": "Service ticket",
        "definition": "Ticket apresentado a um serviço específico."
      },
      {
        "term": "NTLM",
        "definition": "Protocolo de autenticação legado baseado em desafio-resposta."
      }
    ],
    "defend": "Prefira Kerberos, proteja LDAP com TLS/assinatura quando aplicável e reduza NTLM.",
    "detect": "Monitore falhas de ticket, uso inesperado de NTLM e consultas LDAP em massa.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria LDAP de TGT e qual evidência usaria primeiro.",
    "tags": [
      "LDAP",
      "TGT",
      "Service ticket"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "LDAP consulta o diretório; Kerberos usa tickets para autenticação; NTLM é legado e deve ser reduzido quando possível.",
          "Active Directory organiza identidades, máquinas, grupos e políticas em domínios, com controladores que mantêm o diretório e serviços de autenticação.",
          "Enumeração de AD mapeia usuários, grupos, computadores, SPNs, trusts e ACLs para entender relações de acesso."
        ],
        "answer": 1,
        "why": "LDAP consulta o diretório; Kerberos usa tickets para autenticação; NTLM é legado e deve ser reduzido quando possível."
      },
      {
        "q": "O que melhor descreve LDAP?",
        "options": [
          "Protocolo de consulta e alteração de diretórios.",
          "Ticket inicial do Kerberos usado para solicitar serviços.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Protocolo de consulta e alteração de diretórios."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Prefira Kerberos, proteja LDAP com TLS/assinatura quando aplicável e reduza NTLM."
        ],
        "answer": 3,
        "why": "Prefira Kerberos, proteja LDAP com TLS/assinatura quando aplicável e reduza NTLM."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Monitore falhas de ticket, uso inesperado de NTLM e consultas LDAP em massa.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Monitore falhas de ticket, uso inesperado de NTLM e consultas LDAP em massa."
      }
    ],
    "flashcards": [
      {
        "front": "LDAP",
        "back": "Protocolo de consulta e alteração de diretórios."
      },
      {
        "front": "TGT",
        "back": "Ticket inicial do Kerberos usado para solicitar serviços."
      },
      {
        "front": "Service ticket",
        "back": "Ticket apresentado a um serviço específico."
      },
      {
        "front": "NTLM",
        "back": "Protocolo de autenticação legado baseado em desafio-resposta."
      }
    ]
  },
  {
    "id": 72,
    "title": "Enumeração AD",
    "track": "Active Directory",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Enumeração de AD mapeia usuários, grupos, computadores, SPNs, trusts e ACLs para entender relações de acesso.",
    "objectives": [
      "Entender o papel de enumeração ad no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a SPN.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "SPN",
        "definition": "Identificador de serviço associado a uma conta."
      },
      {
        "term": "ACL",
        "definition": "Lista de permissões sobre um objeto do diretório."
      },
      {
        "term": "Trust",
        "definition": "Relação de confiança entre domínios/florestas."
      },
      {
        "term": "LDAP query",
        "definition": "Consulta estruturada ao diretório."
      }
    ],
    "defend": "Reduza leitura excessiva quando possível, proteja contas de serviço e revise ACLs delegadas.",
    "detect": "Observe consultas incomuns, enumeração ampla e acesso a objetos administrativos fora do padrão.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria SPN de ACL e qual evidência usaria primeiro.",
    "tags": [
      "SPN",
      "ACL",
      "Trust"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Enumeração de AD mapeia usuários, grupos, computadores, SPNs, trusts e ACLs para entender relações de acesso.",
          "LDAP consulta o diretório; Kerberos usa tickets para autenticação; NTLM é legado e deve ser reduzido quando possível.",
          "Configurações fracas de AD podem criar caminhos de privilégio sem depender de uma vulnerabilidade de software.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "Enumeração de AD mapeia usuários, grupos, computadores, SPNs, trusts e ACLs para entender relações de acesso."
      },
      {
        "q": "O que melhor descreve SPN?",
        "options": [
          "Lista de permissões sobre um objeto do diretório.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Identificador de serviço associado a uma conta."
        ],
        "answer": 3,
        "why": "Identificador de serviço associado a uma conta."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Reduza leitura excessiva quando possível, proteja contas de serviço e revise ACLs delegadas.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Reduza leitura excessiva quando possível, proteja contas de serviço e revise ACLs delegadas."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Observe consultas incomuns, enumeração ampla e acesso a objetos administrativos fora do padrão.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Observe consultas incomuns, enumeração ampla e acesso a objetos administrativos fora do padrão."
      }
    ],
    "flashcards": [
      {
        "front": "SPN",
        "back": "Identificador de serviço associado a uma conta."
      },
      {
        "front": "ACL",
        "back": "Lista de permissões sobre um objeto do diretório."
      },
      {
        "front": "Trust",
        "back": "Relação de confiança entre domínios/florestas."
      },
      {
        "front": "LDAP query",
        "back": "Consulta estruturada ao diretório."
      }
    ]
  },
  {
    "id": 73,
    "title": "Misconfigurations em AD",
    "track": "Active Directory",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Configurações fracas de AD podem criar caminhos de privilégio sem depender de uma vulnerabilidade de software.",
    "objectives": [
      "Entender o papel de misconfigurations em ad no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Delegation.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Delegation",
        "definition": "Permissão concedida a usuário/grupo para administrar parte do diretório."
      },
      {
        "term": "Stale account",
        "definition": "Conta antiga/inativa que permanece habilitada."
      },
      {
        "term": "Weak ACL",
        "definition": "Permissão excessiva em objeto sensível."
      },
      {
        "term": "Service account",
        "definition": "Conta usada por aplicações/serviços, frequentemente de alto impacto."
      }
    ],
    "defend": "Revise delegações, desative contas antigas, use gMSA quando adequado e aplique tiering de privilégios.",
    "detect": "Faça análise periódica de ACLs, contas inativas e membership de grupos privilegiados.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Delegation de Stale account e qual evidência usaria primeiro.",
    "tags": [
      "Delegation",
      "Stale account",
      "Weak ACL"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Enumeração de AD mapeia usuários, grupos, computadores, SPNs, trusts e ACLs para entender relações de acesso.",
          "Escalada em AD usa relações de permissão, grupos, credenciais e configurações para alcançar papéis mais privilegiados.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Configurações fracas de AD podem criar caminhos de privilégio sem depender de uma vulnerabilidade de software."
        ],
        "answer": 3,
        "why": "Configurações fracas de AD podem criar caminhos de privilégio sem depender de uma vulnerabilidade de software."
      },
      {
        "q": "O que melhor descreve Delegation?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Permissão concedida a usuário/grupo para administrar parte do diretório.",
          "Conta antiga/inativa que permanece habilitada."
        ],
        "answer": 2,
        "why": "Permissão concedida a usuário/grupo para administrar parte do diretório."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Revise delegações, desative contas antigas, use gMSA quando adequado e aplique tiering de privilégios.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Revise delegações, desative contas antigas, use gMSA quando adequado e aplique tiering de privilégios."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Faça análise periódica de ACLs, contas inativas e membership de grupos privilegiados.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Faça análise periódica de ACLs, contas inativas e membership de grupos privilegiados."
      }
    ],
    "flashcards": [
      {
        "front": "Delegation",
        "back": "Permissão concedida a usuário/grupo para administrar parte do diretório."
      },
      {
        "front": "Stale account",
        "back": "Conta antiga/inativa que permanece habilitada."
      },
      {
        "front": "Weak ACL",
        "back": "Permissão excessiva em objeto sensível."
      },
      {
        "front": "Service account",
        "back": "Conta usada por aplicações/serviços, frequentemente de alto impacto."
      }
    ]
  },
  {
    "id": 74,
    "title": "Privilege Escalation AD",
    "track": "Active Directory",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Escalada em AD usa relações de permissão, grupos, credenciais e configurações para alcançar papéis mais privilegiados.",
    "objectives": [
      "Entender o papel de privilege escalation ad no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Privilege path.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Privilege path",
        "definition": "Cadeia de relações que leva de uma identidade a outra mais privilegiada."
      },
      {
        "term": "GenericAll",
        "definition": "Permissão ampla sobre um objeto do AD."
      },
      {
        "term": "WriteDACL",
        "definition": "Capacidade de alterar ACL de um objeto."
      },
      {
        "term": "Admin tier",
        "definition": "Separação operacional de níveis de privilégio."
      }
    ],
    "defend": "Quebre caminhos de privilégio, revise ACLs e separe contas administrativas por tier.",
    "detect": "Monitore alterações de ACL, grupos privilegiados e mudanças de credenciais/atributos sensíveis.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Privilege path de GenericAll e qual evidência usaria primeiro.",
    "tags": [
      "Privilege path",
      "GenericAll",
      "WriteDACL"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Movimento lateral descreve uso de credenciais e protocolos legítimos para alcançar outros hosts dentro do escopo autorizado.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Escalada em AD usa relações de permissão, grupos, credenciais e configurações para alcançar papéis mais privilegiados.",
          "Configurações fracas de AD podem criar caminhos de privilégio sem depender de uma vulnerabilidade de software."
        ],
        "answer": 2,
        "why": "Escalada em AD usa relações de permissão, grupos, credenciais e configurações para alcançar papéis mais privilegiados."
      },
      {
        "q": "O que melhor descreve Privilege path?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Cadeia de relações que leva de uma identidade a outra mais privilegiada.",
          "Permissão ampla sobre um objeto do AD.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Cadeia de relações que leva de uma identidade a outra mais privilegiada."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Quebre caminhos de privilégio, revise ACLs e separe contas administrativas por tier.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Quebre caminhos de privilégio, revise ACLs e separe contas administrativas por tier."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Monitore alterações de ACL, grupos privilegiados e mudanças de credenciais/atributos sensíveis."
        ],
        "answer": 3,
        "why": "Monitore alterações de ACL, grupos privilegiados e mudanças de credenciais/atributos sensíveis."
      }
    ],
    "flashcards": [
      {
        "front": "Privilege path",
        "back": "Cadeia de relações que leva de uma identidade a outra mais privilegiada."
      },
      {
        "front": "GenericAll",
        "back": "Permissão ampla sobre um objeto do AD."
      },
      {
        "front": "WriteDACL",
        "back": "Capacidade de alterar ACL de um objeto."
      },
      {
        "front": "Admin tier",
        "back": "Separação operacional de níveis de privilégio."
      }
    ]
  },
  {
    "id": 75,
    "title": "Lateral Movement em laboratório",
    "track": "Active Directory",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Movimento lateral descreve uso de credenciais e protocolos legítimos para alcançar outros hosts dentro do escopo autorizado.",
    "objectives": [
      "Entender o papel de lateral movement em laboratório no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Remote service.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Remote service",
        "definition": "Serviço usado para administração remota."
      },
      {
        "term": "Credential reuse",
        "definition": "Mesma credencial válida em múltiplos hosts."
      },
      {
        "term": "Pivot",
        "definition": "Uso de um host como ponto para alcançar outro segmento."
      },
      {
        "term": "Segmentation",
        "definition": "Controle que limita quais hosts/serviços podem se comunicar."
      }
    ],
    "defend": "Segmente rede, use credenciais únicas, restrinja administração remota e aplique MFA onde suportado.",
    "detect": "Correlacione logons remotos, origem incomum, criação de serviços e salto rápido entre hosts.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Remote service de Credential reuse e qual evidência usaria primeiro.",
    "tags": [
      "Remote service",
      "Credential reuse",
      "Pivot"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Movimento lateral descreve uso de credenciais e protocolos legítimos para alcançar outros hosts dentro do escopo autorizado.",
          "Escalada em AD usa relações de permissão, grupos, credenciais e configurações para alcançar papéis mais privilegiados.",
          "Group Policy aplica configurações em escala; permissões inadequadas em GPOs ou links podem alterar muitos hosts."
        ],
        "answer": 1,
        "why": "Movimento lateral descreve uso de credenciais e protocolos legítimos para alcançar outros hosts dentro do escopo autorizado."
      },
      {
        "q": "O que melhor descreve Remote service?",
        "options": [
          "Serviço usado para administração remota.",
          "Mesma credencial válida em múltiplos hosts.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Serviço usado para administração remota."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Segmente rede, use credenciais únicas, restrinja administração remota e aplique MFA onde suportado."
        ],
        "answer": 3,
        "why": "Segmente rede, use credenciais únicas, restrinja administração remota e aplique MFA onde suportado."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Correlacione logons remotos, origem incomum, criação de serviços e salto rápido entre hosts.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Correlacione logons remotos, origem incomum, criação de serviços e salto rápido entre hosts."
      }
    ],
    "flashcards": [
      {
        "front": "Remote service",
        "back": "Serviço usado para administração remota."
      },
      {
        "front": "Credential reuse",
        "back": "Mesma credencial válida em múltiplos hosts."
      },
      {
        "front": "Pivot",
        "back": "Uso de um host como ponto para alcançar outro segmento."
      },
      {
        "front": "Segmentation",
        "back": "Controle que limita quais hosts/serviços podem se comunicar."
      }
    ]
  },
  {
    "id": 76,
    "title": "GPO e permissões",
    "track": "Active Directory",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Group Policy aplica configurações em escala; permissões inadequadas em GPOs ou links podem alterar muitos hosts.",
    "objectives": [
      "Entender o papel de gpo e permissões no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a GPO.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "GPO",
        "definition": "Objeto que contém políticas de configuração."
      },
      {
        "term": "Link",
        "definition": "Associação de uma GPO a site, domínio ou OU."
      },
      {
        "term": "Inheritance",
        "definition": "Propagação de políticas pela hierarquia."
      },
      {
        "term": "Delegation",
        "definition": "Permissão para editar, ler ou aplicar uma GPO."
      }
    ],
    "defend": "Restrinja edição de GPO, proteja SYSVOL e revise links/delegações.",
    "detect": "Monitore criação/edição de GPO, mudanças de links e alterações em arquivos de política.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria GPO de Link e qual evidência usaria primeiro.",
    "tags": [
      "GPO",
      "Link",
      "Inheritance"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Group Policy aplica configurações em escala; permissões inadequadas em GPOs ou links podem alterar muitos hosts.",
          "Movimento lateral descreve uso de credenciais e protocolos legítimos para alcançar outros hosts dentro do escopo autorizado.",
          "Hardening de AD combina arquitetura de privilégios, patching, políticas, redução de protocolos legados e monitoração.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "Group Policy aplica configurações em escala; permissões inadequadas em GPOs ou links podem alterar muitos hosts."
      },
      {
        "q": "O que melhor descreve GPO?",
        "options": [
          "Associação de uma GPO a site, domínio ou OU.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Objeto que contém políticas de configuração."
        ],
        "answer": 3,
        "why": "Objeto que contém políticas de configuração."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Restrinja edição de GPO, proteja SYSVOL e revise links/delegações.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Restrinja edição de GPO, proteja SYSVOL e revise links/delegações."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Monitore criação/edição de GPO, mudanças de links e alterações em arquivos de política.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Monitore criação/edição de GPO, mudanças de links e alterações em arquivos de política."
      }
    ],
    "flashcards": [
      {
        "front": "GPO",
        "back": "Objeto que contém políticas de configuração."
      },
      {
        "front": "Link",
        "back": "Associação de uma GPO a site, domínio ou OU."
      },
      {
        "front": "Inheritance",
        "back": "Propagação de políticas pela hierarquia."
      },
      {
        "front": "Delegation",
        "back": "Permissão para editar, ler ou aplicar uma GPO."
      }
    ]
  },
  {
    "id": 77,
    "title": "AD Hardening",
    "track": "Active Directory",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Hardening de AD combina arquitetura de privilégios, patching, políticas, redução de protocolos legados e monitoração.",
    "objectives": [
      "Entender o papel de ad hardening no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Tiering.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Tiering",
        "definition": "Separação de administração por níveis de criticidade."
      },
      {
        "term": "LAPS",
        "definition": "Gestão de senhas administrativas locais únicas."
      },
      {
        "term": "gMSA",
        "definition": "Conta de serviço gerenciada com rotação automática."
      },
      {
        "term": "Protected Users",
        "definition": "Grupo com restrições adicionais para contas sensíveis."
      }
    ],
    "defend": "Implemente tiering, LAPS/gMSA, MFA administrativo, patching e redução de NTLM.",
    "detect": "Acompanhe compliance de políticas, contas privilegiadas e exceções ao baseline.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Tiering de LAPS e qual evidência usaria primeiro.",
    "tags": [
      "Tiering",
      "LAPS",
      "gMSA"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Group Policy aplica configurações em escala; permissões inadequadas em GPOs ou links podem alterar muitos hosts.",
          "Detecção em AD depende de eventos de autenticação, mudanças de objetos e correlação de relações incomuns.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Hardening de AD combina arquitetura de privilégios, patching, políticas, redução de protocolos legados e monitoração."
        ],
        "answer": 3,
        "why": "Hardening de AD combina arquitetura de privilégios, patching, políticas, redução de protocolos legados e monitoração."
      },
      {
        "q": "O que melhor descreve Tiering?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Separação de administração por níveis de criticidade.",
          "Gestão de senhas administrativas locais únicas."
        ],
        "answer": 2,
        "why": "Separação de administração por níveis de criticidade."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Implemente tiering, LAPS/gMSA, MFA administrativo, patching e redução de NTLM.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Implemente tiering, LAPS/gMSA, MFA administrativo, patching e redução de NTLM."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Acompanhe compliance de políticas, contas privilegiadas e exceções ao baseline.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Acompanhe compliance de políticas, contas privilegiadas e exceções ao baseline."
      }
    ],
    "flashcards": [
      {
        "front": "Tiering",
        "back": "Separação de administração por níveis de criticidade."
      },
      {
        "front": "LAPS",
        "back": "Gestão de senhas administrativas locais únicas."
      },
      {
        "front": "gMSA",
        "back": "Conta de serviço gerenciada com rotação automática."
      },
      {
        "front": "Protected Users",
        "back": "Grupo com restrições adicionais para contas sensíveis."
      }
    ]
  },
  {
    "id": 78,
    "title": "Detection in Active Directory",
    "track": "Active Directory",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Detecção em AD depende de eventos de autenticação, mudanças de objetos e correlação de relações incomuns.",
    "objectives": [
      "Entender o papel de detection in active directory no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Event ID.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Event ID",
        "definition": "Identificador de evento do Windows usado na investigação."
      },
      {
        "term": "Directory change",
        "definition": "Alteração em objeto, atributo ou ACL."
      },
      {
        "term": "Logon pattern",
        "definition": "Padrão temporal e geográfico de autenticações."
      },
      {
        "term": "Correlation",
        "definition": "Combinação de múltiplos sinais para aumentar confiança."
      }
    ],
    "defend": "Centralize logs de DCs, habilite auditoria adequada e mantenha regras para mudanças sensíveis.",
    "detect": "Procure alterações de grupo/ACL, falhas de ticket, NTLM anômalo e logons administrativos fora do padrão.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Event ID de Directory change e qual evidência usaria primeiro.",
    "tags": [
      "Event ID",
      "Directory change",
      "Logon pattern"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Logs são a base da investigação: precisam de cobertura, sincronização de horário, retenção e contexto de identidade/processo/rede.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Detecção em AD depende de eventos de autenticação, mudanças de objetos e correlação de relações incomuns.",
          "Hardening de AD combina arquitetura de privilégios, patching, políticas, redução de protocolos legados e monitoração."
        ],
        "answer": 2,
        "why": "Detecção em AD depende de eventos de autenticação, mudanças de objetos e correlação de relações incomuns."
      },
      {
        "q": "O que melhor descreve Event ID?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Identificador de evento do Windows usado na investigação.",
          "Alteração em objeto, atributo ou ACL.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Identificador de evento do Windows usado na investigação."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Centralize logs de DCs, habilite auditoria adequada e mantenha regras para mudanças sensíveis.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Centralize logs de DCs, habilite auditoria adequada e mantenha regras para mudanças sensíveis."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Procure alterações de grupo/ACL, falhas de ticket, NTLM anômalo e logons administrativos fora do padrão."
        ],
        "answer": 3,
        "why": "Procure alterações de grupo/ACL, falhas de ticket, NTLM anômalo e logons administrativos fora do padrão."
      }
    ],
    "flashcards": [
      {
        "front": "Event ID",
        "back": "Identificador de evento do Windows usado na investigação."
      },
      {
        "front": "Directory change",
        "back": "Alteração em objeto, atributo ou ACL."
      },
      {
        "front": "Logon pattern",
        "back": "Padrão temporal e geográfico de autenticações."
      },
      {
        "front": "Correlation",
        "back": "Combinação de múltiplos sinais para aumentar confiança."
      }
    ]
  },
  {
    "id": 79,
    "title": "Logs Windows/Linux",
    "track": "Blue Team",
    "level": "Intermediário",
    "pcPractice": true,
    "summary": "Logs são a base da investigação: precisam de cobertura, sincronização de horário, retenção e contexto de identidade/processo/rede.",
    "objectives": [
      "Entender o papel de logs windows/linux no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Event log.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Event log",
        "definition": "Registro estruturado de eventos no Windows."
      },
      {
        "term": "Syslog",
        "definition": "Padrão comum de logs em sistemas Unix/Linux."
      },
      {
        "term": "Timestamp",
        "definition": "Horário do evento; sincronização é crucial para correlação."
      },
      {
        "term": "Retention",
        "definition": "Período em que logs são mantidos."
      }
    ],
    "defend": "Defina política de logging, NTP, retenção e centralização conforme criticidade.",
    "detect": "Valide lacunas de coleta, atrasos e fontes sem timestamp confiável.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Event log de Syslog e qual evidência usaria primeiro.",
    "tags": [
      "Event log",
      "Syslog",
      "Timestamp"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Logs são a base da investigação: precisam de cobertura, sincronização de horário, retenção e contexto de identidade/processo/rede.",
          "Detecção em AD depende de eventos de autenticação, mudanças de objetos e correlação de relações incomuns.",
          "Sysmon amplia telemetria do Windows com criação de processos, rede, hashes e outras atividades úteis para detecção."
        ],
        "answer": 1,
        "why": "Logs são a base da investigação: precisam de cobertura, sincronização de horário, retenção e contexto de identidade/processo/rede."
      },
      {
        "q": "O que melhor descreve Event log?",
        "options": [
          "Registro estruturado de eventos no Windows.",
          "Padrão comum de logs em sistemas Unix/Linux.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Registro estruturado de eventos no Windows."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Defina política de logging, NTP, retenção e centralização conforme criticidade."
        ],
        "answer": 3,
        "why": "Defina política de logging, NTP, retenção e centralização conforme criticidade."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Valide lacunas de coleta, atrasos e fontes sem timestamp confiável.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Valide lacunas de coleta, atrasos e fontes sem timestamp confiável."
      }
    ],
    "flashcards": [
      {
        "front": "Event log",
        "back": "Registro estruturado de eventos no Windows."
      },
      {
        "front": "Syslog",
        "back": "Padrão comum de logs em sistemas Unix/Linux."
      },
      {
        "front": "Timestamp",
        "back": "Horário do evento; sincronização é crucial para correlação."
      },
      {
        "front": "Retention",
        "back": "Período em que logs são mantidos."
      }
    ]
  },
  {
    "id": 80,
    "title": "Sysmon",
    "track": "Blue Team",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "Sysmon amplia telemetria do Windows com criação de processos, rede, hashes e outras atividades úteis para detecção.",
    "objectives": [
      "Entender o papel de sysmon no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Process Create.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Process Create",
        "definition": "Evento de criação de processo com command line e parent."
      },
      {
        "term": "Image Load",
        "definition": "Carregamento de módulos/bibliotecas."
      },
      {
        "term": "Network Connect",
        "definition": "Conexão de rede associada a processo."
      },
      {
        "term": "Configuration",
        "definition": "Regras que controlam quais eventos o Sysmon registra."
      }
    ],
    "defend": "Use configuração versionada e calibrada para reduzir ruído sem perder eventos importantes.",
    "detect": "Correlacione parent-child, command lines, hashes e conexões de processos raros.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Process Create de Image Load e qual evidência usaria primeiro.",
    "tags": [
      "Process Create",
      "Image Load",
      "Network Connect"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Sysmon amplia telemetria do Windows com criação de processos, rede, hashes e outras atividades úteis para detecção.",
          "Logs são a base da investigação: precisam de cobertura, sincronização de horário, retenção e contexto de identidade/processo/rede.",
          "Wireshark permite inspecionar pacotes e reconstruir conversas para entender protocolos, erros e comportamento suspeito.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "Sysmon amplia telemetria do Windows com criação de processos, rede, hashes e outras atividades úteis para detecção."
      },
      {
        "q": "O que melhor descreve Process Create?",
        "options": [
          "Carregamento de módulos/bibliotecas.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Evento de criação de processo com command line e parent."
        ],
        "answer": 3,
        "why": "Evento de criação de processo com command line e parent."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Use configuração versionada e calibrada para reduzir ruído sem perder eventos importantes.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Use configuração versionada e calibrada para reduzir ruído sem perder eventos importantes."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Correlacione parent-child, command lines, hashes e conexões de processos raros.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Correlacione parent-child, command lines, hashes e conexões de processos raros."
      }
    ],
    "flashcards": [
      {
        "front": "Process Create",
        "back": "Evento de criação de processo com command line e parent."
      },
      {
        "front": "Image Load",
        "back": "Carregamento de módulos/bibliotecas."
      },
      {
        "front": "Network Connect",
        "back": "Conexão de rede associada a processo."
      },
      {
        "front": "Configuration",
        "back": "Regras que controlam quais eventos o Sysmon registra."
      }
    ]
  },
  {
    "id": 81,
    "title": "Wireshark",
    "track": "Blue Team",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "Wireshark permite inspecionar pacotes e reconstruir conversas para entender protocolos, erros e comportamento suspeito.",
    "objectives": [
      "Entender o papel de wireshark no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Display filter.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Display filter",
        "definition": "Filtro aplicado à visualização de pacotes já capturados."
      },
      {
        "term": "TCP stream",
        "definition": "Conversa TCP reconstruída entre endpoints."
      },
      {
        "term": "PCAP",
        "definition": "Arquivo que armazena pacotes capturados."
      },
      {
        "term": "DNS query",
        "definition": "Consulta usada para resolver nomes e útil em investigação."
      }
    ],
    "defend": "Capture somente em escopo autorizado e proteja PCAPs, que podem conter dados sensíveis.",
    "detect": "Analise protocolos, destinos, frequência, tamanhos e sequências temporais anômalas.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Display filter de TCP stream e qual evidência usaria primeiro.",
    "tags": [
      "Display filter",
      "TCP stream",
      "PCAP"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Sysmon amplia telemetria do Windows com criação de processos, rede, hashes e outras atividades úteis para detecção.",
          "Suricata analisa tráfego e pode gerar alertas por assinaturas/protocolos; em modo IPS também pode bloquear conforme política.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Wireshark permite inspecionar pacotes e reconstruir conversas para entender protocolos, erros e comportamento suspeito."
        ],
        "answer": 3,
        "why": "Wireshark permite inspecionar pacotes e reconstruir conversas para entender protocolos, erros e comportamento suspeito."
      },
      {
        "q": "O que melhor descreve Display filter?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Filtro aplicado à visualização de pacotes já capturados.",
          "Conversa TCP reconstruída entre endpoints."
        ],
        "answer": 2,
        "why": "Filtro aplicado à visualização de pacotes já capturados."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Capture somente em escopo autorizado e proteja PCAPs, que podem conter dados sensíveis.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Capture somente em escopo autorizado e proteja PCAPs, que podem conter dados sensíveis."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analise protocolos, destinos, frequência, tamanhos e sequências temporais anômalas.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Analise protocolos, destinos, frequência, tamanhos e sequências temporais anômalas."
      }
    ],
    "flashcards": [
      {
        "front": "Display filter",
        "back": "Filtro aplicado à visualização de pacotes já capturados."
      },
      {
        "front": "TCP stream",
        "back": "Conversa TCP reconstruída entre endpoints."
      },
      {
        "front": "PCAP",
        "back": "Arquivo que armazena pacotes capturados."
      },
      {
        "front": "DNS query",
        "back": "Consulta usada para resolver nomes e útil em investigação."
      }
    ]
  },
  {
    "id": 82,
    "title": "IDS/IPS com Suricata",
    "track": "Blue Team",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "Suricata analisa tráfego e pode gerar alertas por assinaturas/protocolos; em modo IPS também pode bloquear conforme política.",
    "objectives": [
      "Entender o papel de ids/ips com suricata no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Rule.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Rule",
        "definition": "Expressão que define condição de detecção."
      },
      {
        "term": "SID",
        "definition": "Identificador da regra."
      },
      {
        "term": "Flow",
        "definition": "Estado/direção da conexão usado em regras."
      },
      {
        "term": "EVE JSON",
        "definition": "Formato de saída estruturada do Suricata."
      }
    ],
    "defend": "Mantenha regras atualizadas, teste impacto e ajuste thresholds/exceções.",
    "detect": "Centralize EVE JSON e correlacione alertas com ativos, DNS e processos.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Rule de SID e qual evidência usaria primeiro.",
    "tags": [
      "Rule",
      "SID",
      "Flow"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "SIEM centraliza eventos, normaliza dados e executa correlações para priorizar sinais de múltiplas fontes.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Suricata analisa tráfego e pode gerar alertas por assinaturas/protocolos; em modo IPS também pode bloquear conforme política.",
          "Wireshark permite inspecionar pacotes e reconstruir conversas para entender protocolos, erros e comportamento suspeito."
        ],
        "answer": 2,
        "why": "Suricata analisa tráfego e pode gerar alertas por assinaturas/protocolos; em modo IPS também pode bloquear conforme política."
      },
      {
        "q": "O que melhor descreve Rule?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Expressão que define condição de detecção.",
          "Identificador da regra.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Expressão que define condição de detecção."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Mantenha regras atualizadas, teste impacto e ajuste thresholds/exceções.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Mantenha regras atualizadas, teste impacto e ajuste thresholds/exceções."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Centralize EVE JSON e correlacione alertas com ativos, DNS e processos."
        ],
        "answer": 3,
        "why": "Centralize EVE JSON e correlacione alertas com ativos, DNS e processos."
      }
    ],
    "flashcards": [
      {
        "front": "Rule",
        "back": "Expressão que define condição de detecção."
      },
      {
        "front": "SID",
        "back": "Identificador da regra."
      },
      {
        "front": "Flow",
        "back": "Estado/direção da conexão usado em regras."
      },
      {
        "front": "EVE JSON",
        "back": "Formato de saída estruturada do Suricata."
      }
    ]
  },
  {
    "id": 83,
    "title": "SIEM",
    "track": "Blue Team",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "SIEM centraliza eventos, normaliza dados e executa correlações para priorizar sinais de múltiplas fontes.",
    "objectives": [
      "Entender o papel de siem no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Ingestion.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Ingestion",
        "definition": "Entrada de logs no SIEM."
      },
      {
        "term": "Normalization",
        "definition": "Conversão de formatos diferentes para campos consistentes."
      },
      {
        "term": "Correlation rule",
        "definition": "Regra que combina eventos e contexto."
      },
      {
        "term": "Use case",
        "definition": "Hipótese de detecção implementada e mensurável."
      }
    ],
    "defend": "Priorize fontes de alto valor, documente casos de uso e mantenha qualidade dos dados.",
    "detect": "Monitore saúde de ingestão, cobertura de regras e taxa de falsos positivos.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Ingestion de Normalization e qual evidência usaria primeiro.",
    "tags": [
      "Ingestion",
      "Normalization",
      "Correlation rule"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "SIEM centraliza eventos, normaliza dados e executa correlações para priorizar sinais de múltiplas fontes.",
          "Suricata analisa tráfego e pode gerar alertas por assinaturas/protocolos; em modo IPS também pode bloquear conforme política.",
          "MITRE ATT&CK organiza táticas e técnicas observadas em adversários e ajuda a mapear cobertura de detecção."
        ],
        "answer": 1,
        "why": "SIEM centraliza eventos, normaliza dados e executa correlações para priorizar sinais de múltiplas fontes."
      },
      {
        "q": "O que melhor descreve Ingestion?",
        "options": [
          "Entrada de logs no SIEM.",
          "Conversão de formatos diferentes para campos consistentes.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Entrada de logs no SIEM."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Priorize fontes de alto valor, documente casos de uso e mantenha qualidade dos dados."
        ],
        "answer": 3,
        "why": "Priorize fontes de alto valor, documente casos de uso e mantenha qualidade dos dados."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Monitore saúde de ingestão, cobertura de regras e taxa de falsos positivos.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Monitore saúde de ingestão, cobertura de regras e taxa de falsos positivos."
      }
    ],
    "flashcards": [
      {
        "front": "Ingestion",
        "back": "Entrada de logs no SIEM."
      },
      {
        "front": "Normalization",
        "back": "Conversão de formatos diferentes para campos consistentes."
      },
      {
        "front": "Correlation rule",
        "back": "Regra que combina eventos e contexto."
      },
      {
        "front": "Use case",
        "back": "Hipótese de detecção implementada e mensurável."
      }
    ]
  },
  {
    "id": 84,
    "title": "MITRE ATT&CK",
    "track": "Blue Team",
    "level": "Avançado",
    "pcPractice": false,
    "summary": "MITRE ATT&CK organiza táticas e técnicas observadas em adversários e ajuda a mapear cobertura de detecção.",
    "objectives": [
      "Entender o papel de mitre att&ck no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Tactic.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Tactic",
        "definition": "Objetivo de alto nível, como Credential Access."
      },
      {
        "term": "Technique",
        "definition": "Como uma ação é realizada."
      },
      {
        "term": "Sub-technique",
        "definition": "Detalhamento de uma técnica."
      },
      {
        "term": "Data source",
        "definition": "Telemetria necessária para observar determinada atividade."
      }
    ],
    "defend": "Use ATT&CK para lacunas de cobertura, não como checklist cego.",
    "detect": "Mapeie regras e investigações a técnicas e valide se as fontes de dados necessárias existem.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Tactic de Technique e qual evidência usaria primeiro.",
    "tags": [
      "Tactic",
      "Technique",
      "Sub-technique"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "MITRE ATT&CK organiza táticas e técnicas observadas em adversários e ajuda a mapear cobertura de detecção.",
          "SIEM centraliza eventos, normaliza dados e executa correlações para priorizar sinais de múltiplas fontes.",
          "IOCs apontam artefatos observados; IOAs indicam comportamento; TTPs descrevem padrões mais estáveis de operação.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "MITRE ATT&CK organiza táticas e técnicas observadas em adversários e ajuda a mapear cobertura de detecção."
      },
      {
        "q": "O que melhor descreve Tactic?",
        "options": [
          "Como uma ação é realizada.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Objetivo de alto nível, como Credential Access."
        ],
        "answer": 3,
        "why": "Objetivo de alto nível, como Credential Access."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Use ATT&CK para lacunas de cobertura, não como checklist cego.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Use ATT&CK para lacunas de cobertura, não como checklist cego."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Mapeie regras e investigações a técnicas e valide se as fontes de dados necessárias existem.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Mapeie regras e investigações a técnicas e valide se as fontes de dados necessárias existem."
      }
    ],
    "flashcards": [
      {
        "front": "Tactic",
        "back": "Objetivo de alto nível, como Credential Access."
      },
      {
        "front": "Technique",
        "back": "Como uma ação é realizada."
      },
      {
        "front": "Sub-technique",
        "back": "Detalhamento de uma técnica."
      },
      {
        "front": "Data source",
        "back": "Telemetria necessária para observar determinada atividade."
      }
    ]
  },
  {
    "id": 85,
    "title": "IOC, IOA e TTP",
    "track": "Blue Team",
    "level": "Avançado",
    "pcPractice": false,
    "summary": "IOCs apontam artefatos observados; IOAs indicam comportamento; TTPs descrevem padrões mais estáveis de operação.",
    "objectives": [
      "Entender o papel de ioc, ioa e ttp no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a IOC.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "IOC",
        "definition": "Indicador concreto, como hash, domínio ou IP."
      },
      {
        "term": "IOA",
        "definition": "Indicador de ação/comportamento suspeito."
      },
      {
        "term": "TTP",
        "definition": "Tática, técnica e procedimento usado por um ator."
      },
      {
        "term": "Context",
        "definition": "Informação que determina relevância e confiança do indicador."
      }
    ],
    "defend": "Use IOCs com expiração/contexto e complemente com detecções comportamentais.",
    "detect": "Correlacione indicadores com processo, usuário, host e sequência de eventos.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria IOC de IOA e qual evidência usaria primeiro.",
    "tags": [
      "IOC",
      "IOA",
      "TTP"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "MITRE ATT&CK organiza táticas e técnicas observadas em adversários e ajuda a mapear cobertura de detecção.",
          "Sigma descreve detecções de logs em formato genérico e pode ser convertido para diferentes SIEMs.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "IOCs apontam artefatos observados; IOAs indicam comportamento; TTPs descrevem padrões mais estáveis de operação."
        ],
        "answer": 3,
        "why": "IOCs apontam artefatos observados; IOAs indicam comportamento; TTPs descrevem padrões mais estáveis de operação."
      },
      {
        "q": "O que melhor descreve IOC?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Indicador concreto, como hash, domínio ou IP.",
          "Indicador de ação/comportamento suspeito."
        ],
        "answer": 2,
        "why": "Indicador concreto, como hash, domínio ou IP."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Use IOCs com expiração/contexto e complemente com detecções comportamentais.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Use IOCs com expiração/contexto e complemente com detecções comportamentais."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Correlacione indicadores com processo, usuário, host e sequência de eventos.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Correlacione indicadores com processo, usuário, host e sequência de eventos."
      }
    ],
    "flashcards": [
      {
        "front": "IOC",
        "back": "Indicador concreto, como hash, domínio ou IP."
      },
      {
        "front": "IOA",
        "back": "Indicador de ação/comportamento suspeito."
      },
      {
        "front": "TTP",
        "back": "Tática, técnica e procedimento usado por um ator."
      },
      {
        "front": "Context",
        "back": "Informação que determina relevância e confiança do indicador."
      }
    ]
  },
  {
    "id": 86,
    "title": "Sigma",
    "track": "Blue Team",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "Sigma descreve detecções de logs em formato genérico e pode ser convertido para diferentes SIEMs.",
    "objectives": [
      "Entender o papel de sigma no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Selection.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Selection",
        "definition": "Conjunto de campos/valores procurados."
      },
      {
        "term": "Condition",
        "definition": "Expressão que combina seleções."
      },
      {
        "term": "Logsource",
        "definition": "Fonte de log esperada pela regra."
      },
      {
        "term": "False positives",
        "definition": "Cenários legítimos conhecidos que podem disparar a regra."
      }
    ],
    "defend": "Versione regras, teste contra dados reais e documente falsos positivos.",
    "detect": "Acompanhe cobertura por fonte e desempenho das conversões no SIEM.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Selection de Condition e qual evidência usaria primeiro.",
    "tags": [
      "Selection",
      "Condition",
      "Logsource"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "YARA identifica arquivos/memória por padrões de bytes, strings e condições lógicas, útil em triagem e hunting.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Sigma descreve detecções de logs em formato genérico e pode ser convertido para diferentes SIEMs.",
          "IOCs apontam artefatos observados; IOAs indicam comportamento; TTPs descrevem padrões mais estáveis de operação."
        ],
        "answer": 2,
        "why": "Sigma descreve detecções de logs em formato genérico e pode ser convertido para diferentes SIEMs."
      },
      {
        "q": "O que melhor descreve Selection?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Conjunto de campos/valores procurados.",
          "Expressão que combina seleções.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Conjunto de campos/valores procurados."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Versione regras, teste contra dados reais e documente falsos positivos.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Versione regras, teste contra dados reais e documente falsos positivos."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Acompanhe cobertura por fonte e desempenho das conversões no SIEM."
        ],
        "answer": 3,
        "why": "Acompanhe cobertura por fonte e desempenho das conversões no SIEM."
      }
    ],
    "flashcards": [
      {
        "front": "Selection",
        "back": "Conjunto de campos/valores procurados."
      },
      {
        "front": "Condition",
        "back": "Expressão que combina seleções."
      },
      {
        "front": "Logsource",
        "back": "Fonte de log esperada pela regra."
      },
      {
        "front": "False positives",
        "back": "Cenários legítimos conhecidos que podem disparar a regra."
      }
    ]
  },
  {
    "id": 87,
    "title": "YARA",
    "track": "Blue Team",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "YARA identifica arquivos/memória por padrões de bytes, strings e condições lógicas, útil em triagem e hunting.",
    "objectives": [
      "Entender o papel de yara no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a String.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "String",
        "definition": "Padrão textual/hexadecimal procurado."
      },
      {
        "term": "Condition",
        "definition": "Lógica que decide se a regra corresponde."
      },
      {
        "term": "Metadata",
        "definition": "Contexto da regra, autor, referência e versão."
      },
      {
        "term": "False positive",
        "definition": "Arquivo legítimo que corresponde por regra ampla demais."
      }
    ],
    "defend": "Escreva regras específicas, teste em corpus benigno e malicioso e versione alterações.",
    "detect": "Meça precisão, frequência de matches e contexto dos arquivos detectados.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria String de Condition e qual evidência usaria primeiro.",
    "tags": [
      "String",
      "Condition",
      "Metadata"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "YARA identifica arquivos/memória por padrões de bytes, strings e condições lógicas, útil em triagem e hunting.",
          "Sigma descreve detecções de logs em formato genérico e pode ser convertido para diferentes SIEMs.",
          "Threat hunting parte de hipótese e telemetria para procurar sinais que talvez não tenham gerado alerta."
        ],
        "answer": 1,
        "why": "YARA identifica arquivos/memória por padrões de bytes, strings e condições lógicas, útil em triagem e hunting."
      },
      {
        "q": "O que melhor descreve String?",
        "options": [
          "Padrão textual/hexadecimal procurado.",
          "Lógica que decide se a regra corresponde.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Padrão textual/hexadecimal procurado."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Escreva regras específicas, teste em corpus benigno e malicioso e versione alterações."
        ],
        "answer": 3,
        "why": "Escreva regras específicas, teste em corpus benigno e malicioso e versione alterações."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Meça precisão, frequência de matches e contexto dos arquivos detectados.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Meça precisão, frequência de matches e contexto dos arquivos detectados."
      }
    ],
    "flashcards": [
      {
        "front": "String",
        "back": "Padrão textual/hexadecimal procurado."
      },
      {
        "front": "Condition",
        "back": "Lógica que decide se a regra corresponde."
      },
      {
        "front": "Metadata",
        "back": "Contexto da regra, autor, referência e versão."
      },
      {
        "front": "False positive",
        "back": "Arquivo legítimo que corresponde por regra ampla demais."
      }
    ]
  },
  {
    "id": 88,
    "title": "Threat Hunting",
    "track": "Blue Team",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "Threat hunting parte de hipótese e telemetria para procurar sinais que talvez não tenham gerado alerta.",
    "objectives": [
      "Entender o papel de threat hunting no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Hypothesis.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Hypothesis",
        "definition": "Pergunta testável baseada em risco/comportamento."
      },
      {
        "term": "Baseline",
        "definition": "Padrão normal usado para identificar desvios."
      },
      {
        "term": "Pivot",
        "definition": "Mudança de consulta a partir de uma evidência encontrada."
      },
      {
        "term": "Finding",
        "definition": "Evidência validada que merece investigação ou melhoria de detecção."
      }
    ],
    "defend": "Documente hipóteses e critérios, preserve evidências e transforme achados recorrentes em detecções.",
    "detect": "Meça hunts por cobertura, achados úteis e regras criadas, não apenas volume de consultas.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Hypothesis de Baseline e qual evidência usaria primeiro.",
    "tags": [
      "Hypothesis",
      "Baseline",
      "Pivot"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Threat hunting parte de hipótese e telemetria para procurar sinais que talvez não tenham gerado alerta.",
          "YARA identifica arquivos/memória por padrões de bytes, strings e condições lógicas, útil em triagem e hunting.",
          "Resposta a incidentes organiza preparação, identificação, contenção, erradicação, recuperação e lições aprendidas.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "Threat hunting parte de hipótese e telemetria para procurar sinais que talvez não tenham gerado alerta."
      },
      {
        "q": "O que melhor descreve Hypothesis?",
        "options": [
          "Padrão normal usado para identificar desvios.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Pergunta testável baseada em risco/comportamento."
        ],
        "answer": 3,
        "why": "Pergunta testável baseada em risco/comportamento."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Documente hipóteses e critérios, preserve evidências e transforme achados recorrentes em detecções.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Documente hipóteses e critérios, preserve evidências e transforme achados recorrentes em detecções."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Meça hunts por cobertura, achados úteis e regras criadas, não apenas volume de consultas.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Meça hunts por cobertura, achados úteis e regras criadas, não apenas volume de consultas."
      }
    ],
    "flashcards": [
      {
        "front": "Hypothesis",
        "back": "Pergunta testável baseada em risco/comportamento."
      },
      {
        "front": "Baseline",
        "back": "Padrão normal usado para identificar desvios."
      },
      {
        "front": "Pivot",
        "back": "Mudança de consulta a partir de uma evidência encontrada."
      },
      {
        "front": "Finding",
        "back": "Evidência validada que merece investigação ou melhoria de detecção."
      }
    ]
  },
  {
    "id": 89,
    "title": "Incident Response",
    "track": "Blue Team",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "Resposta a incidentes organiza preparação, identificação, contenção, erradicação, recuperação e lições aprendidas.",
    "objectives": [
      "Entender o papel de incident response no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Containment.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Containment",
        "definition": "Ação para limitar propagação/impacto."
      },
      {
        "term": "Eradication",
        "definition": "Remoção da causa e artefatos do incidente."
      },
      {
        "term": "Recovery",
        "definition": "Retorno controlado à operação."
      },
      {
        "term": "Lessons learned",
        "definition": "Revisão que gera melhorias técnicas/processuais."
      }
    ],
    "defend": "Mantenha playbooks, contatos, backups e critérios de decisão previamente definidos.",
    "detect": "Registre timeline, ações, responsáveis e evidências para garantir rastreabilidade.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Containment de Eradication e qual evidência usaria primeiro.",
    "tags": [
      "Containment",
      "Eradication",
      "Recovery"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Threat hunting parte de hipótese e telemetria para procurar sinais que talvez não tenham gerado alerta.",
          "DFIR combina resposta e análise forense para preservar evidências, reconstruir timeline e entender causa/impacto.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Resposta a incidentes organiza preparação, identificação, contenção, erradicação, recuperação e lições aprendidas."
        ],
        "answer": 3,
        "why": "Resposta a incidentes organiza preparação, identificação, contenção, erradicação, recuperação e lições aprendidas."
      },
      {
        "q": "O que melhor descreve Containment?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Ação para limitar propagação/impacto.",
          "Remoção da causa e artefatos do incidente."
        ],
        "answer": 2,
        "why": "Ação para limitar propagação/impacto."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Mantenha playbooks, contatos, backups e critérios de decisão previamente definidos.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Mantenha playbooks, contatos, backups e critérios de decisão previamente definidos."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Registre timeline, ações, responsáveis e evidências para garantir rastreabilidade.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Registre timeline, ações, responsáveis e evidências para garantir rastreabilidade."
      }
    ],
    "flashcards": [
      {
        "front": "Containment",
        "back": "Ação para limitar propagação/impacto."
      },
      {
        "front": "Eradication",
        "back": "Remoção da causa e artefatos do incidente."
      },
      {
        "front": "Recovery",
        "back": "Retorno controlado à operação."
      },
      {
        "front": "Lessons learned",
        "back": "Revisão que gera melhorias técnicas/processuais."
      }
    ]
  },
  {
    "id": 90,
    "title": "DFIR básico",
    "track": "Blue Team",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "DFIR combina resposta e análise forense para preservar evidências, reconstruir timeline e entender causa/impacto.",
    "objectives": [
      "Entender o papel de dfir básico no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Acquisition.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Acquisition",
        "definition": "Coleta de evidência de forma controlada."
      },
      {
        "term": "Chain of custody",
        "definition": "Registro de quem manipulou a evidência e quando."
      },
      {
        "term": "Timeline",
        "definition": "Sequência temporal reconstruída a partir de múltiplas fontes."
      },
      {
        "term": "Artifact",
        "definition": "Vestígio técnico deixado por sistema ou atividade."
      }
    ],
    "defend": "Use procedimentos de coleta, hashing e documentação; trabalhe em cópias sempre que possível.",
    "detect": "Correlacione filesystem, logs, memória e rede preservando integridade da evidência.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Acquisition de Chain of custody e qual evidência usaria primeiro.",
    "tags": [
      "Acquisition",
      "Chain of custody",
      "Timeline"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Antivírus combina motores locais e serviços de reputação/análise para decidir se conteúdo deve ser bloqueado, permitido ou isolado.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "DFIR combina resposta e análise forense para preservar evidências, reconstruir timeline e entender causa/impacto.",
          "Resposta a incidentes organiza preparação, identificação, contenção, erradicação, recuperação e lições aprendidas."
        ],
        "answer": 2,
        "why": "DFIR combina resposta e análise forense para preservar evidências, reconstruir timeline e entender causa/impacto."
      },
      {
        "q": "O que melhor descreve Acquisition?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Coleta de evidência de forma controlada.",
          "Registro de quem manipulou a evidência e quando.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Coleta de evidência de forma controlada."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Use procedimentos de coleta, hashing e documentação; trabalhe em cópias sempre que possível.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Use procedimentos de coleta, hashing e documentação; trabalhe em cópias sempre que possível."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Correlacione filesystem, logs, memória e rede preservando integridade da evidência."
        ],
        "answer": 3,
        "why": "Correlacione filesystem, logs, memória e rede preservando integridade da evidência."
      }
    ],
    "flashcards": [
      {
        "front": "Acquisition",
        "back": "Coleta de evidência de forma controlada."
      },
      {
        "front": "Chain of custody",
        "back": "Registro de quem manipulou a evidência e quando."
      },
      {
        "front": "Timeline",
        "back": "Sequência temporal reconstruída a partir de múltiplas fontes."
      },
      {
        "front": "Artifact",
        "back": "Vestígio técnico deixado por sistema ou atividade."
      }
    ]
  },
  {
    "id": 91,
    "title": "Arquitetura de antivírus",
    "track": "Antivírus/EDR",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "Antivírus combina motores locais e serviços de reputação/análise para decidir se conteúdo deve ser bloqueado, permitido ou isolado.",
    "objectives": [
      "Entender o papel de arquitetura de antivírus no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Scan engine.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Scan engine",
        "definition": "Componente que avalia arquivos/objetos."
      },
      {
        "term": "Real-time protection",
        "definition": "Inspeção durante criação, abertura ou execução."
      },
      {
        "term": "Cloud reputation",
        "definition": "Consulta a inteligência remota para enriquecer decisão."
      },
      {
        "term": "Quarantine",
        "definition": "Área isolada para impedir uso de objeto suspeito."
      }
    ],
    "defend": "Mantenha mecanismos atualizados, habilite proteção em tempo real e proteja configuração contra alteração não autorizada.",
    "detect": "Acompanhe detecções, falhas do agente, itens em quarentena e desativação de proteção.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Scan engine de Real-time protection e qual evidência usaria primeiro.",
    "tags": [
      "Scan engine",
      "Real-time protection",
      "Cloud reputation"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Antivírus combina motores locais e serviços de reputação/análise para decidir se conteúdo deve ser bloqueado, permitido ou isolado.",
          "DFIR combina resposta e análise forense para preservar evidências, reconstruir timeline e entender causa/impacto.",
          "Detecções por assinatura e reputação são rápidas para ameaças conhecidas, mas dependem de indicadores previamente observados."
        ],
        "answer": 1,
        "why": "Antivírus combina motores locais e serviços de reputação/análise para decidir se conteúdo deve ser bloqueado, permitido ou isolado."
      },
      {
        "q": "O que melhor descreve Scan engine?",
        "options": [
          "Componente que avalia arquivos/objetos.",
          "Inspeção durante criação, abertura ou execução.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Componente que avalia arquivos/objetos."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Mantenha mecanismos atualizados, habilite proteção em tempo real e proteja configuração contra alteração não autorizada."
        ],
        "answer": 3,
        "why": "Mantenha mecanismos atualizados, habilite proteção em tempo real e proteja configuração contra alteração não autorizada."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Acompanhe detecções, falhas do agente, itens em quarentena e desativação de proteção.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Acompanhe detecções, falhas do agente, itens em quarentena e desativação de proteção."
      }
    ],
    "flashcards": [
      {
        "front": "Scan engine",
        "back": "Componente que avalia arquivos/objetos."
      },
      {
        "front": "Real-time protection",
        "back": "Inspeção durante criação, abertura ou execução."
      },
      {
        "front": "Cloud reputation",
        "back": "Consulta a inteligência remota para enriquecer decisão."
      },
      {
        "front": "Quarantine",
        "back": "Área isolada para impedir uso de objeto suspeito."
      }
    ]
  },
  {
    "id": 92,
    "title": "Assinaturas, hashes e reputação",
    "track": "Antivírus/EDR",
    "level": "Avançado",
    "pcPractice": false,
    "summary": "Detecções por assinatura e reputação são rápidas para ameaças conhecidas, mas dependem de indicadores previamente observados.",
    "objectives": [
      "Entender o papel de assinaturas, hashes e reputação no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Signature.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Signature",
        "definition": "Padrão associado a conteúdo malicioso conhecido."
      },
      {
        "term": "Hash",
        "definition": "Resumo determinístico do conteúdo de um arquivo."
      },
      {
        "term": "Reputation",
        "definition": "Avaliação baseada em histórico/prevalência/confiança."
      },
      {
        "term": "Prevalence",
        "definition": "Quão comum um arquivo é no ambiente ou na base do fornecedor."
      }
    ],
    "defend": "Combine assinaturas com comportamento e mantenha feeds/engines atualizados.",
    "detect": "Investigue arquivos raros, reputação baixa e divergências entre hash conhecido e comportamento observado.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Signature de Hash e qual evidência usaria primeiro.",
    "tags": [
      "Signature",
      "Hash",
      "Reputation"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Detecções por assinatura e reputação são rápidas para ameaças conhecidas, mas dependem de indicadores previamente observados.",
          "Antivírus combina motores locais e serviços de reputação/análise para decidir se conteúdo deve ser bloqueado, permitido ou isolado.",
          "Heurística procura características suspeitas mesmo sem assinatura exata, aceitando maior necessidade de contexto e tuning.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "Detecções por assinatura e reputação são rápidas para ameaças conhecidas, mas dependem de indicadores previamente observados."
      },
      {
        "q": "O que melhor descreve Signature?",
        "options": [
          "Resumo determinístico do conteúdo de um arquivo.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Padrão associado a conteúdo malicioso conhecido."
        ],
        "answer": 3,
        "why": "Padrão associado a conteúdo malicioso conhecido."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Combine assinaturas com comportamento e mantenha feeds/engines atualizados.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Combine assinaturas com comportamento e mantenha feeds/engines atualizados."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Investigue arquivos raros, reputação baixa e divergências entre hash conhecido e comportamento observado.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Investigue arquivos raros, reputação baixa e divergências entre hash conhecido e comportamento observado."
      }
    ],
    "flashcards": [
      {
        "front": "Signature",
        "back": "Padrão associado a conteúdo malicioso conhecido."
      },
      {
        "front": "Hash",
        "back": "Resumo determinístico do conteúdo de um arquivo."
      },
      {
        "front": "Reputation",
        "back": "Avaliação baseada em histórico/prevalência/confiança."
      },
      {
        "front": "Prevalence",
        "back": "Quão comum um arquivo é no ambiente ou na base do fornecedor."
      }
    ]
  },
  {
    "id": 93,
    "title": "Heurística",
    "track": "Antivírus/EDR",
    "level": "Avançado",
    "pcPractice": false,
    "summary": "Heurística procura características suspeitas mesmo sem assinatura exata, aceitando maior necessidade de contexto e tuning.",
    "objectives": [
      "Entender o papel de heurística no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Heuristic rule.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Heuristic rule",
        "definition": "Regra baseada em características e padrões suspeitos."
      },
      {
        "term": "Suspicion score",
        "definition": "Pontuação acumulada por múltiplos sinais."
      },
      {
        "term": "Generic detection",
        "definition": "Detecção de uma família/comportamento em vez de amostra exata."
      },
      {
        "term": "Tuning",
        "definition": "Ajuste para equilibrar cobertura e falsos positivos."
      }
    ],
    "defend": "Use múltiplos sinais, valide impacto antes de bloquear e mantenha exceções mínimas.",
    "detect": "Acompanhe quais heurísticas mais disparam e quais geram falsos positivos recorrentes.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Heuristic rule de Suspicion score e qual evidência usaria primeiro.",
    "tags": [
      "Heuristic rule",
      "Suspicion score",
      "Generic detection"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Detecções por assinatura e reputação são rápidas para ameaças conhecidas, mas dependem de indicadores previamente observados.",
          "Análise comportamental avalia ações em execução, como processos filhos, persistência, acesso a credenciais e rede.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Heurística procura características suspeitas mesmo sem assinatura exata, aceitando maior necessidade de contexto e tuning."
        ],
        "answer": 3,
        "why": "Heurística procura características suspeitas mesmo sem assinatura exata, aceitando maior necessidade de contexto e tuning."
      },
      {
        "q": "O que melhor descreve Heuristic rule?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Regra baseada em características e padrões suspeitos.",
          "Pontuação acumulada por múltiplos sinais."
        ],
        "answer": 2,
        "why": "Regra baseada em características e padrões suspeitos."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Use múltiplos sinais, valide impacto antes de bloquear e mantenha exceções mínimas.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Use múltiplos sinais, valide impacto antes de bloquear e mantenha exceções mínimas."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Acompanhe quais heurísticas mais disparam e quais geram falsos positivos recorrentes.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Acompanhe quais heurísticas mais disparam e quais geram falsos positivos recorrentes."
      }
    ],
    "flashcards": [
      {
        "front": "Heuristic rule",
        "back": "Regra baseada em características e padrões suspeitos."
      },
      {
        "front": "Suspicion score",
        "back": "Pontuação acumulada por múltiplos sinais."
      },
      {
        "front": "Generic detection",
        "back": "Detecção de uma família/comportamento em vez de amostra exata."
      },
      {
        "front": "Tuning",
        "back": "Ajuste para equilibrar cobertura e falsos positivos."
      }
    ]
  },
  {
    "id": 94,
    "title": "Análise comportamental",
    "track": "Antivírus/EDR",
    "level": "Avançado",
    "pcPractice": false,
    "summary": "Análise comportamental avalia ações em execução, como processos filhos, persistência, acesso a credenciais e rede.",
    "objectives": [
      "Entender o papel de análise comportamental no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Behavior chain.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Behavior chain",
        "definition": "Sequência de ações relacionadas que aumenta confiança."
      },
      {
        "term": "Parent-child",
        "definition": "Relação entre processo criador e processo filho."
      },
      {
        "term": "Persistence",
        "definition": "Mecanismo que busca manter execução após reinício/logon."
      },
      {
        "term": "Credential access",
        "definition": "Comportamentos relacionados à obtenção de segredos/autenticação."
      }
    ],
    "defend": "Use políticas que correlacionem sequência e contexto, não um evento isolado.",
    "detect": "Procure árvores de processo raras, persistência inesperada e combinações de rede + alteração de sistema.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Behavior chain de Parent-child e qual evidência usaria primeiro.",
    "tags": [
      "Behavior chain",
      "Parent-child",
      "Persistence"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Sandbox executa objetos em ambiente controlado para observar comportamento sem expor sistemas reais.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Análise comportamental avalia ações em execução, como processos filhos, persistência, acesso a credenciais e rede.",
          "Heurística procura características suspeitas mesmo sem assinatura exata, aceitando maior necessidade de contexto e tuning."
        ],
        "answer": 2,
        "why": "Análise comportamental avalia ações em execução, como processos filhos, persistência, acesso a credenciais e rede."
      },
      {
        "q": "O que melhor descreve Behavior chain?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Sequência de ações relacionadas que aumenta confiança.",
          "Relação entre processo criador e processo filho.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Sequência de ações relacionadas que aumenta confiança."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Use políticas que correlacionem sequência e contexto, não um evento isolado.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Use políticas que correlacionem sequência e contexto, não um evento isolado."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Procure árvores de processo raras, persistência inesperada e combinações de rede + alteração de sistema."
        ],
        "answer": 3,
        "why": "Procure árvores de processo raras, persistência inesperada e combinações de rede + alteração de sistema."
      }
    ],
    "flashcards": [
      {
        "front": "Behavior chain",
        "back": "Sequência de ações relacionadas que aumenta confiança."
      },
      {
        "front": "Parent-child",
        "back": "Relação entre processo criador e processo filho."
      },
      {
        "front": "Persistence",
        "back": "Mecanismo que busca manter execução após reinício/logon."
      },
      {
        "front": "Credential access",
        "back": "Comportamentos relacionados à obtenção de segredos/autenticação."
      }
    ]
  },
  {
    "id": 95,
    "title": "Sandboxing",
    "track": "Antivírus/EDR",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "Sandbox executa objetos em ambiente controlado para observar comportamento sem expor sistemas reais.",
    "objectives": [
      "Entender o papel de sandboxing no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Detonation.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Detonation",
        "definition": "Execução controlada de uma amostra."
      },
      {
        "term": "Instrumentation",
        "definition": "Coleta de processos, filesystem, registro e rede durante execução."
      },
      {
        "term": "Snapshot",
        "definition": "Estado restaurável do ambiente de análise."
      },
      {
        "term": "Evasion signal",
        "definition": "Comportamento que muda quando a amostra detecta ambiente de análise."
      }
    ],
    "defend": "Isole rede, use snapshots e dados fictícios; trate amostras como não confiáveis.",
    "detect": "Compare comportamento estático/dinâmico e observe sinais de espera, checagens de ambiente e atividade condicionada.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Detonation de Instrumentation e qual evidência usaria primeiro.",
    "tags": [
      "Detonation",
      "Instrumentation",
      "Snapshot"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Sandbox executa objetos em ambiente controlado para observar comportamento sem expor sistemas reais.",
          "Análise comportamental avalia ações em execução, como processos filhos, persistência, acesso a credenciais e rede.",
          "Exploit protection aplica mitigações que dificultam transformar corrupção de memória e outras falhas em execução de código."
        ],
        "answer": 1,
        "why": "Sandbox executa objetos em ambiente controlado para observar comportamento sem expor sistemas reais."
      },
      {
        "q": "O que melhor descreve Detonation?",
        "options": [
          "Execução controlada de uma amostra.",
          "Coleta de processos, filesystem, registro e rede durante execução.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Execução controlada de uma amostra."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Isole rede, use snapshots e dados fictícios; trate amostras como não confiáveis."
        ],
        "answer": 3,
        "why": "Isole rede, use snapshots e dados fictícios; trate amostras como não confiáveis."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Compare comportamento estático/dinâmico e observe sinais de espera, checagens de ambiente e atividade condicionada.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Compare comportamento estático/dinâmico e observe sinais de espera, checagens de ambiente e atividade condicionada."
      }
    ],
    "flashcards": [
      {
        "front": "Detonation",
        "back": "Execução controlada de uma amostra."
      },
      {
        "front": "Instrumentation",
        "back": "Coleta de processos, filesystem, registro e rede durante execução."
      },
      {
        "front": "Snapshot",
        "back": "Estado restaurável do ambiente de análise."
      },
      {
        "front": "Evasion signal",
        "back": "Comportamento que muda quando a amostra detecta ambiente de análise."
      }
    ]
  },
  {
    "id": 96,
    "title": "Exploit Protection",
    "track": "Antivírus/EDR",
    "level": "Avançado",
    "pcPractice": false,
    "summary": "Exploit protection aplica mitigações que dificultam transformar corrupção de memória e outras falhas em execução de código.",
    "objectives": [
      "Entender o papel de exploit protection no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a DEP/NX.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "DEP/NX",
        "definition": "Impede execução em regiões de memória marcadas como dados."
      },
      {
        "term": "ASLR",
        "definition": "Randomiza endereços para reduzir previsibilidade."
      },
      {
        "term": "CFG",
        "definition": "Valida destinos de chamadas indiretas em plataformas compatíveis."
      },
      {
        "term": "Mitigation policy",
        "definition": "Conjunto de proteções aplicadas por sistema ou processo."
      }
    ],
    "defend": "Mantenha mitigações habilitadas, teste compatibilidade e atualize software vulnerável.",
    "detect": "Monitore bloqueios de mitigação, crashes anômalos e processos que desabilitam proteções.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria DEP/NX de ASLR e qual evidência usaria primeiro.",
    "tags": [
      "DEP/NX",
      "ASLR",
      "CFG"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Exploit protection aplica mitigações que dificultam transformar corrupção de memória e outras falhas em execução de código.",
          "Sandbox executa objetos em ambiente controlado para observar comportamento sem expor sistemas reais.",
          "EDR coleta telemetria de endpoint e a usa para detecção, investigação e resposta, indo além de decisão arquivo bom/mal.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "Exploit protection aplica mitigações que dificultam transformar corrupção de memória e outras falhas em execução de código."
      },
      {
        "q": "O que melhor descreve DEP/NX?",
        "options": [
          "Randomiza endereços para reduzir previsibilidade.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Impede execução em regiões de memória marcadas como dados."
        ],
        "answer": 3,
        "why": "Impede execução em regiões de memória marcadas como dados."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Mantenha mitigações habilitadas, teste compatibilidade e atualize software vulnerável.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Mantenha mitigações habilitadas, teste compatibilidade e atualize software vulnerável."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Monitore bloqueios de mitigação, crashes anômalos e processos que desabilitam proteções.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Monitore bloqueios de mitigação, crashes anômalos e processos que desabilitam proteções."
      }
    ],
    "flashcards": [
      {
        "front": "DEP/NX",
        "back": "Impede execução em regiões de memória marcadas como dados."
      },
      {
        "front": "ASLR",
        "back": "Randomiza endereços para reduzir previsibilidade."
      },
      {
        "front": "CFG",
        "back": "Valida destinos de chamadas indiretas em plataformas compatíveis."
      },
      {
        "front": "Mitigation policy",
        "back": "Conjunto de proteções aplicadas por sistema ou processo."
      }
    ]
  },
  {
    "id": 97,
    "title": "EDR e telemetria",
    "track": "Antivírus/EDR",
    "level": "Avançado",
    "pcPractice": false,
    "summary": "EDR coleta telemetria de endpoint e a usa para detecção, investigação e resposta, indo além de decisão arquivo bom/mal.",
    "objectives": [
      "Entender o papel de edr e telemetria no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Sensor.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Sensor",
        "definition": "Agente que coleta eventos no endpoint."
      },
      {
        "term": "Telemetry",
        "definition": "Eventos de processo, arquivo, registro, rede e identidade."
      },
      {
        "term": "Detection",
        "definition": "Regra/modelo que transforma sinais em alerta."
      },
      {
        "term": "Response action",
        "definition": "Ação como isolar host, matar processo ou coletar artefato."
      }
    ],
    "defend": "Garanta cobertura de agentes, proteção contra tampering e políticas de resposta com controle de acesso.",
    "detect": "Monitore gaps de sensor, hosts sem check-in, alertas correlacionados e ações de resposta.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Sensor de Telemetry e qual evidência usaria primeiro.",
    "tags": [
      "Sensor",
      "Telemetry",
      "Detection"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Exploit protection aplica mitigações que dificultam transformar corrupção de memória e outras falhas em execução de código.",
          "Árvores de processo ajudam a entender causalidade: quem iniciou quem, com quais argumentos e em que contexto.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "EDR coleta telemetria de endpoint e a usa para detecção, investigação e resposta, indo além de decisão arquivo bom/mal."
        ],
        "answer": 3,
        "why": "EDR coleta telemetria de endpoint e a usa para detecção, investigação e resposta, indo além de decisão arquivo bom/mal."
      },
      {
        "q": "O que melhor descreve Sensor?",
        "options": [
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Agente que coleta eventos no endpoint.",
          "Eventos de processo, arquivo, registro, rede e identidade."
        ],
        "answer": 2,
        "why": "Agente que coleta eventos no endpoint."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Adiar correções até existir exploração pública confirmada.",
          "Garanta cobertura de agentes, proteção contra tampering e políticas de resposta com controle de acesso.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS."
        ],
        "answer": 1,
        "why": "Garanta cobertura de agentes, proteção contra tampering e políticas de resposta com controle de acesso."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Monitore gaps de sensor, hosts sem check-in, alertas correlacionados e ações de resposta.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação."
        ],
        "answer": 0,
        "why": "Monitore gaps de sensor, hosts sem check-in, alertas correlacionados e ações de resposta."
      }
    ],
    "flashcards": [
      {
        "front": "Sensor",
        "back": "Agente que coleta eventos no endpoint."
      },
      {
        "front": "Telemetry",
        "back": "Eventos de processo, arquivo, registro, rede e identidade."
      },
      {
        "front": "Detection",
        "back": "Regra/modelo que transforma sinais em alerta."
      },
      {
        "front": "Response action",
        "back": "Ação como isolar host, matar processo ou coletar artefato."
      }
    ]
  },
  {
    "id": 98,
    "title": "Process Trees",
    "track": "Antivírus/EDR",
    "level": "Avançado",
    "pcPractice": false,
    "summary": "Árvores de processo ajudam a entender causalidade: quem iniciou quem, com quais argumentos e em que contexto.",
    "objectives": [
      "Entender o papel de process trees no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Parent process.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Parent process",
        "definition": "Processo que criou outro."
      },
      {
        "term": "Child process",
        "definition": "Processo criado pelo parent."
      },
      {
        "term": "Command line",
        "definition": "Argumentos usados na execução, importantes para contexto."
      },
      {
        "term": "Ancestry",
        "definition": "Cadeia de processos predecessores."
      }
    ],
    "defend": "Use allowlists comportamentais com contexto e restrinja macros/scripts onde o risco justificar.",
    "detect": "Procure parent-child improvável, office→script, navegador→shell e ferramentas administrativas fora do padrão.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Parent process de Child process e qual evidência usaria primeiro.",
    "tags": [
      "Parent process",
      "Child process",
      "Command line"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Toda detecção tem trade-offs. Falso positivo gera ruído; falso negativo deixa atividade maliciosa passar.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Árvores de processo ajudam a entender causalidade: quem iniciou quem, com quais argumentos e em que contexto.",
          "EDR coleta telemetria de endpoint e a usa para detecção, investigação e resposta, indo além de decisão arquivo bom/mal."
        ],
        "answer": 2,
        "why": "Árvores de processo ajudam a entender causalidade: quem iniciou quem, com quais argumentos e em que contexto."
      },
      {
        "q": "O que melhor descreve Parent process?",
        "options": [
          "Processo que substitui autenticação por criptografia simétrica.",
          "Processo que criou outro.",
          "Processo criado pelo parent.",
          "Mecanismo usado apenas para estética da interface."
        ],
        "answer": 1,
        "why": "Processo que criou outro."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Use allowlists comportamentais com contexto e restrinja macros/scripts onde o risco justificar.",
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada."
        ],
        "answer": 0,
        "why": "Use allowlists comportamentais com contexto e restrinja macros/scripts onde o risco justificar."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Procure parent-child improvável, office→script, navegador→shell e ferramentas administrativas fora do padrão."
        ],
        "answer": 3,
        "why": "Procure parent-child improvável, office→script, navegador→shell e ferramentas administrativas fora do padrão."
      }
    ],
    "flashcards": [
      {
        "front": "Parent process",
        "back": "Processo que criou outro."
      },
      {
        "front": "Child process",
        "back": "Processo criado pelo parent."
      },
      {
        "front": "Command line",
        "back": "Argumentos usados na execução, importantes para contexto."
      },
      {
        "front": "Ancestry",
        "back": "Cadeia de processos predecessores."
      }
    ]
  },
  {
    "id": 99,
    "title": "Falsos positivos e falsos negativos",
    "track": "Antivírus/EDR",
    "level": "Avançado",
    "pcPractice": false,
    "summary": "Toda detecção tem trade-offs. Falso positivo gera ruído; falso negativo deixa atividade maliciosa passar.",
    "objectives": [
      "Entender o papel de falsos positivos e falsos negativos no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a False positive.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "False positive",
        "definition": "Alerta para atividade legítima."
      },
      {
        "term": "False negative",
        "definition": "Falha em alertar sobre atividade maliciosa."
      },
      {
        "term": "Precision",
        "definition": "Proporção de alertas que realmente são relevantes."
      },
      {
        "term": "Recall",
        "definition": "Proporção de casos relevantes que a detecção consegue capturar."
      }
    ],
    "defend": "Ajuste com evidências, use exceções específicas e mantenha testes de regressão de detecção.",
    "detect": "Meça qualidade por precisão/recall e reveja regras após incidentes ou mudanças de ambiente.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria False positive de False negative e qual evidência usaria primeiro.",
    "tags": [
      "False positive",
      "False negative",
      "Precision"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Segurança depende apenas de ocultar detalhes técnicos do sistema.",
          "Toda detecção tem trade-offs. Falso positivo gera ruído; falso negativo deixa atividade maliciosa passar.",
          "Árvores de processo ajudam a entender causalidade: quem iniciou quem, com quais argumentos e em que contexto.",
          "Detection engineering transforma hipótese de ameaça em regra testável, com dados, lógica, validação, documentação e manutenção."
        ],
        "answer": 1,
        "why": "Toda detecção tem trade-offs. Falso positivo gera ruído; falso negativo deixa atividade maliciosa passar."
      },
      {
        "q": "O que melhor descreve False positive?",
        "options": [
          "Alerta para atividade legítima.",
          "Falha em alertar sobre atividade maliciosa.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica."
        ],
        "answer": 0,
        "why": "Alerta para atividade legítima."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Desabilitar logs para reduzir ruído.",
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Ajuste com evidências, use exceções específicas e mantenha testes de regressão de detecção."
        ],
        "answer": 3,
        "why": "Ajuste com evidências, use exceções específicas e mantenha testes de regressão de detecção."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Analisar apenas o nome do arquivo, sem contexto.",
          "Considerar somente métricas de desempenho da aplicação.",
          "Meça qualidade por precisão/recall e reveja regras após incidentes ou mudanças de ambiente.",
          "Ignorar eventos raros porque normalmente são falsos positivos."
        ],
        "answer": 2,
        "why": "Meça qualidade por precisão/recall e reveja regras após incidentes ou mudanças de ambiente."
      }
    ],
    "flashcards": [
      {
        "front": "False positive",
        "back": "Alerta para atividade legítima."
      },
      {
        "front": "False negative",
        "back": "Falha em alertar sobre atividade maliciosa."
      },
      {
        "front": "Precision",
        "back": "Proporção de alertas que realmente são relevantes."
      },
      {
        "front": "Recall",
        "back": "Proporção de casos relevantes que a detecção consegue capturar."
      }
    ]
  },
  {
    "id": 100,
    "title": "Detection Engineering aplicado",
    "track": "Antivírus/EDR",
    "level": "Avançado",
    "pcPractice": true,
    "summary": "Detection engineering transforma hipótese de ameaça em regra testável, com dados, lógica, validação, documentação e manutenção.",
    "objectives": [
      "Entender o papel de detection engineering aplicado no contexto de segurança.",
      "Reconhecer sinais, riscos e decisões defensivas relacionados a Detection hypothesis.",
      "Conectar o conceito com detecção, mitigação e validação em ambiente autorizado."
    ],
    "concepts": [
      {
        "term": "Detection hypothesis",
        "definition": "Comportamento que se espera observar em uma ameaça."
      },
      {
        "term": "Data requirement",
        "definition": "Campos/fontes necessários para testar a hipótese."
      },
      {
        "term": "Test case",
        "definition": "Evento benigno/malicioso controlado usado para validar regra."
      },
      {
        "term": "Lifecycle",
        "definition": "Criação, validação, tuning, versionamento e aposentadoria de uma detecção."
      }
    ],
    "defend": "Defina hipóteses, teste com casos controlados, versione regras e mantenha critérios de qualidade.",
    "detect": "Meça cobertura, precisão, tempo de detecção e regressões após mudanças de regra.",
    "challenge": "Explique, em poucas linhas, como você diferenciaria Detection hypothesis de Data requirement e qual evidência usaria primeiro.",
    "tags": [
      "Detection hypothesis",
      "Data requirement",
      "Test case"
    ],
    "quiz": [
      {
        "q": "Qual afirmação melhor resume o foco desta aula?",
        "options": [
          "Detection engineering transforma hipótese de ameaça em regra testável, com dados, lógica, validação, documentação e manutenção.",
          "Toda detecção tem trade-offs. Falso positivo gera ruído; falso negativo deixa atividade maliciosa passar.",
          "Toda detecção tem trade-offs. Falso positivo gera ruído; falso negativo deixa atividade maliciosa passar.",
          "Segurança depende apenas de ocultar detalhes técnicos do sistema."
        ],
        "answer": 0,
        "why": "Detection engineering transforma hipótese de ameaça em regra testável, com dados, lógica, validação, documentação e manutenção."
      },
      {
        "q": "O que melhor descreve Detection hypothesis?",
        "options": [
          "Campos/fontes necessários para testar a hipótese.",
          "Mecanismo usado apenas para estética da interface.",
          "Processo que substitui autenticação por criptografia simétrica.",
          "Comportamento que se espera observar em uma ameaça."
        ],
        "answer": 3,
        "why": "Comportamento que se espera observar em uma ameaça."
      },
      {
        "q": "Qual ação defensiva é mais coerente com o risco estudado?",
        "options": [
          "Confiar na entrada do cliente quando houver HTTPS.",
          "Adiar correções até existir exploração pública confirmada.",
          "Defina hipóteses, teste com casos controlados, versione regras e mantenha critérios de qualidade.",
          "Desabilitar logs para reduzir ruído."
        ],
        "answer": 2,
        "why": "Defina hipóteses, teste com casos controlados, versione regras e mantenha critérios de qualidade."
      },
      {
        "q": "Qual abordagem de detecção faz mais sentido?",
        "options": [
          "Considerar somente métricas de desempenho da aplicação.",
          "Meça cobertura, precisão, tempo de detecção e regressões após mudanças de regra.",
          "Ignorar eventos raros porque normalmente são falsos positivos.",
          "Analisar apenas o nome do arquivo, sem contexto."
        ],
        "answer": 1,
        "why": "Meça cobertura, precisão, tempo de detecção e regressões após mudanças de regra."
      }
    ],
    "flashcards": [
      {
        "front": "Detection hypothesis",
        "back": "Comportamento que se espera observar em uma ameaça."
      },
      {
        "front": "Data requirement",
        "back": "Campos/fontes necessários para testar a hipótese."
      },
      {
        "front": "Test case",
        "back": "Evento benigno/malicioso controlado usado para validar regra."
      },
      {
        "front": "Lifecycle",
        "back": "Criação, validação, tuning, versionamento e aposentadoria de uma detecção."
      }
    ]
  }
];
