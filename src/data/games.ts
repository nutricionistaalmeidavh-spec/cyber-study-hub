import type { ReviewPack, Scenario } from '../types';

export const scenarios: Scenario[] = [
  {
    "id": "sc01",
    "track": "Web",
    "relatedLessons": [
      56
    ],
    "title": "Objeto trocado",
    "evidence": "GET /api/users/22 funciona para user 22. Alterar para /23 retorna dados completos do user 23.",
    "question": "Qual falha é mais provável?",
    "options": [
      "CORS",
      "BOLA/IDOR",
      "CSP",
      "Rate limit"
    ],
    "answer": 1,
    "explanation": "Autenticação existe, mas a autorização por objeto está ausente ou incorreta.",
    "difficulty": "Fácil"
  },
  {
    "id": "sc02",
    "track": "Web",
    "relatedLessons": [
      44
    ],
    "title": "Socket órfão",
    "evidence": "Sessão web expira às 14:00, mas o WebSocket aberto às 13:55 continua aceitando ação administrativa às 14:20.",
    "question": "Qual controle está faltando?",
    "options": [
      "Compressão do socket",
      "Revalidação/revogação de autorização",
      "Cache-Control",
      "DNSSEC"
    ],
    "answer": 1,
    "explanation": "Conexões persistentes precisam refletir expiração/revogação e autorizar cada ação.",
    "difficulty": "Médio"
  },
  {
    "id": "sc03",
    "track": "Web",
    "relatedLessons": [
      46
    ],
    "title": "HIT inesperado",
    "evidence": "Uma resposta muda quando X-Forwarded-Host muda. O cache continua usando apenas URL como chave e depois responde HIT para outros clientes.",
    "question": "Qual risco está presente?",
    "options": [
      "Cache poisoning",
      "Path traversal",
      "Race condition",
      "JWT confusion"
    ],
    "answer": 0,
    "explanation": "Uma entrada fora da cache key influencia o conteúdo compartilhado.",
    "difficulty": "Médio"
  },
  {
    "id": "sc04",
    "track": "Web",
    "relatedLessons": [
      47
    ],
    "title": "Perfil com .css",
    "evidence": "/account/profile/anything.css retorna a mesma página autenticada de perfil. Após primeira visita, a CDN responde HIT.",
    "question": "Qual hipótese merece prioridade?",
    "options": [
      "Web cache deception",
      "GraphQL introspection",
      "Command injection",
      "CORS"
    ],
    "answer": 0,
    "explanation": "A CDN trata o caminho como estático enquanto a aplicação retorna conteúdo privado.",
    "difficulty": "Médio"
  },
  {
    "id": "sc05",
    "track": "Web",
    "relatedLessons": [
      48
    ],
    "title": "Merge perigoso",
    "evidence": "API faz deepMerge(config, req.body). Após enviar uma chave especial, objetos novos passam a herdar admin=true.",
    "question": "Qual classe de falha explica isso?",
    "options": [
      "Prototype pollution",
      "BFLA",
      "SSRF",
      "Request smuggling"
    ],
    "answer": 0,
    "explanation": "A cadeia de protótipos foi contaminada por merge inseguro.",
    "difficulty": "Médio"
  },
  {
    "id": "sc06",
    "track": "Web",
    "relatedLessons": [
      54
    ],
    "title": "Token aceito demais",
    "evidence": "API aceita JWT com issuer diferente do esperado porque verifica apenas se a assinatura é válida.",
    "question": "Qual melhoria é essencial?",
    "options": [
      "Validar iss/aud/exp",
      "Desabilitar HTTPS",
      "Remover assinatura",
      "Cachear todos os tokens"
    ],
    "answer": 0,
    "explanation": "Assinatura não basta; claims de contexto precisam ser validados.",
    "difficulty": "Médio"
  },
  {
    "id": "sc07",
    "track": "Web",
    "relatedLessons": [
      55
    ],
    "title": "Redirect amplo",
    "evidence": "Cliente OAuth aceita qualquer redirect_uri que comece com https://app.exemplo/.",
    "question": "Qual risco principal?",
    "options": [
      "Redirect URI validation fraca",
      "ASLR",
      "Kerberos delegation",
      "YARA false positive"
    ],
    "answer": 0,
    "explanation": "Prefix matching pode aceitar destinos não pretendidos; redirects devem ser exatos/estritos.",
    "difficulty": "Médio"
  },
  {
    "id": "sc08",
    "track": "Web",
    "relatedLessons": [
      57
    ],
    "title": "Cupom duplicado",
    "evidence": "Duas requisições simultâneas usam o mesmo cupom antes de o banco marcar como consumido.",
    "question": "Qual controle técnico ajuda mais?",
    "options": [
      "Transação/atomicidade",
      "CSP",
      "HSTS",
      "DNS cache"
    ],
    "answer": 0,
    "explanation": "O problema é concorrência sobre uma regra de uso único.",
    "difficulty": "Médio"
  },
  {
    "id": "sc09",
    "track": "Sistemas",
    "relatedLessons": [
      61,
      63
    ],
    "title": "SUID incomum",
    "evidence": "find / -perm -4000 mostra /opt/tools/backup-helper, gravável pelo grupo do usuário atual.",
    "question": "O que investigar primeiro?",
    "options": [
      "Se o binário/script influenciado roda com privilégio",
      "Cor do terminal",
      "Versão do navegador",
      "Configuração CORS"
    ],
    "answer": 0,
    "explanation": "SUID + caminho gravável pode criar escalada por configuração insegura.",
    "difficulty": "Médio"
  },
  {
    "id": "sc10",
    "track": "Sistemas",
    "relatedLessons": [
      62,
      64
    ],
    "title": "Serviço modificável",
    "evidence": "Usuário padrão possui SERVICE_CHANGE_CONFIG em serviço que roda como LocalSystem.",
    "question": "Qual categoria de risco?",
    "options": [
      "Weak service ACL / privilege escalation",
      "CSP bypass",
      "Cache deception",
      "LDAP injection"
    ],
    "answer": 0,
    "explanation": "Permissão para reconfigurar serviço privilegiado pode criar caminho de elevação.",
    "difficulty": "Médio"
  },
  {
    "id": "sc11",
    "track": "Sistemas",
    "relatedLessons": [
      66
    ],
    "title": "Mapa de portas",
    "evidence": "Host de laboratório tem 22, 80 e 5432 expostas. PostgreSQL deveria aceitar apenas rede interna.",
    "question": "Qual ação defensiva é prioritária?",
    "options": [
      "Restringir exposição de 5432 por firewall/segmentação",
      "Desativar logs",
      "Trocar porta do SSH apenas",
      "Adicionar CSP"
    ],
    "answer": 0,
    "explanation": "A superfície deve refletir necessidade real de comunicação.",
    "difficulty": "Médio"
  },
  {
    "id": "sc12",
    "track": "Sistemas",
    "relatedLessons": [
      67,
      68
    ],
    "title": "Scanner diz crítico",
    "evidence": "Scanner marca CVSS 9.8, mas o serviço vulnerável está desativado e a versão foi backport-patched pelo fornecedor.",
    "question": "Qual próximo passo?",
    "options": [
      "Validar advisory/estado real antes de priorizar",
      "Explorar em produção",
      "Ignorar todos os scanners",
      "Apagar o ativo"
    ],
    "answer": 0,
    "explanation": "CVSS e banner precisam ser contextualizados e validados.",
    "difficulty": "Médio"
  },
  {
    "id": "sc13",
    "track": "Sistemas",
    "relatedLessons": [
      69
    ],
    "title": "PoC pública",
    "evidence": "Você encontrou uma PoC para a versão do seu app. O sistema real contém dados de clientes.",
    "question": "Onde validar primeiro?",
    "options": [
      "Laboratório isolado com snapshot e dados fictícios",
      "Produção em horário de baixo uso",
      "Notebook de um colega",
      "Servidor de terceiros"
    ],
    "answer": 0,
    "explanation": "Validação segura preserva escopo, reversibilidade e dados reais.",
    "difficulty": "Médio"
  },
  {
    "id": "sc14",
    "track": "Sistemas",
    "relatedLessons": [
      65
    ],
    "title": "Configuração default",
    "evidence": "Painel interno recém-instalado ainda usa admin/admin e está acessível em toda a VLAN.",
    "question": "Qual correção é mais imediata?",
    "options": [
      "Trocar credencial padrão e restringir acesso",
      "Adicionar animação no login",
      "Aumentar retenção de cache",
      "Desligar NTP"
    ],
    "answer": 0,
    "explanation": "Credencial default + exposição ampla é risco direto e facilmente corrigível.",
    "difficulty": "Médio"
  },
  {
    "id": "sc15",
    "track": "Active Directory",
    "relatedLessons": [
      71
    ],
    "title": "NTLM fora do padrão",
    "evidence": "Após política de redução de NTLM, um servidor de administração começa a gerar muitos eventos NTLM para vários hosts.",
    "question": "O que investigar?",
    "options": [
      "Aplicação/credencial legada e origem das autenticações",
      "CSP do navegador",
      "Cache-Control",
      "Assinatura YARA"
    ],
    "answer": 0,
    "explanation": "Uso inesperado de NTLM pode indicar dependência legada ou atividade lateral.",
    "difficulty": "Médio"
  },
  {
    "id": "sc16",
    "track": "Active Directory",
    "relatedLessons": [
      73,
      74
    ],
    "title": "Grupo privilegiado",
    "evidence": "Usuário comum possui WriteDACL em grupo de operadores e consegue alterar sua ACL.",
    "question": "Qual problema central?",
    "options": [
      "Permissão/delegação excessiva",
      "Falta de HSTS",
      "Rate limit baixo",
      "MIME incorreto"
    ],
    "answer": 0,
    "explanation": "WriteDACL cria um caminho de privilégio por controle de permissões.",
    "difficulty": "Médio"
  },
  {
    "id": "sc17",
    "track": "Active Directory",
    "relatedLessons": [
      76
    ],
    "title": "GPO alterada",
    "evidence": "Uma GPO ligada à OU de servidores recebe novo script de logon fora da janela de mudança.",
    "question": "Qual evidência priorizar?",
    "options": [
      "Quem editou a GPO e quais arquivos SYSVOL mudaram",
      "DNS público do site",
      "Headers CORS",
      "Hash de favicon"
    ],
    "answer": 0,
    "explanation": "Mudanças de GPO podem impactar muitos hosts e exigem atribuição/timeline.",
    "difficulty": "Médio"
  },
  {
    "id": "sc18",
    "track": "Active Directory",
    "relatedLessons": [
      77
    ],
    "title": "Senha local repetida",
    "evidence": "Mesma senha de administrador local está presente em centenas de estações.",
    "question": "Qual controle reduz melhor o risco?",
    "options": [
      "LAPS",
      "CSP",
      "Suricata SID",
      "JWT rotation"
    ],
    "answer": 0,
    "explanation": "LAPS fornece senhas locais únicas e gerenciadas.",
    "difficulty": "Médio"
  },
  {
    "id": "sc19",
    "track": "Active Directory",
    "relatedLessons": [
      75,
      78
    ],
    "title": "Saltos rápidos",
    "evidence": "Conta administrativa autentica em 18 workstations diferentes em 4 minutos, algo nunca visto.",
    "question": "Qual hipótese investigar?",
    "options": [
      "Movimento lateral ou automação administrativa incomum",
      "Cache poisoning",
      "Prototype pollution",
      "Upload inseguro"
    ],
    "answer": 0,
    "explanation": "Padrão de logon lateral rápido merece correlação e validação.",
    "difficulty": "Médio"
  },
  {
    "id": "sc20",
    "track": "Active Directory",
    "relatedLessons": [
      70
    ],
    "title": "OU mal desenhada",
    "evidence": "Equipe de suporte recebeu controle total na OU que também contém contas administrativas.",
    "question": "Qual princípio foi violado?",
    "options": [
      "Menor privilégio e separação de tiers",
      "HSTS",
      "Idempotência",
      "Hashing"
    ],
    "answer": 0,
    "explanation": "Delegação deve respeitar criticidade e limitar alcance.",
    "difficulty": "Médio"
  },
  {
    "id": "sc21",
    "track": "Blue Team",
    "relatedLessons": [
      80,
      98
    ],
    "title": "Árvore anômala",
    "evidence": "WINWORD.EXE\n  └─ powershell.exe -enc ...\n       ├─ conexão externa\n       └─ schtasks.exe /create ...",
    "question": "Qual comportamento exige investigação prioritária?",
    "options": [
      "Office iniciando PowerShell com rede e persistência",
      "Explorer abrindo Notepad",
      "Browser abrindo PDF",
      "Serviço do Windows iniciando svchost"
    ],
    "answer": 0,
    "explanation": "A combinação de parent-child raro, script, rede e tarefa agendada é altamente suspeita.",
    "difficulty": "Fácil"
  },
  {
    "id": "sc22",
    "track": "Blue Team",
    "relatedLessons": [
      81
    ],
    "title": "DNS repetitivo",
    "evidence": "PCAP mostra consultas a subdomínios aleatórios do mesmo domínio a cada 60 segundos, com respostas pequenas.",
    "question": "Qual hipótese faz sentido?",
    "options": [
      "Beaconing/túnel ou comunicação automatizada",
      "Erro de CSS",
      "GPO inheritance",
      "JWT audience"
    ],
    "answer": 0,
    "explanation": "Periodicidade e nomes de alta entropia são sinais úteis para hunting, embora precisem de contexto.",
    "difficulty": "Médio"
  },
  {
    "id": "sc23",
    "track": "Blue Team",
    "relatedLessons": [
      82
    ],
    "title": "Alerta Suricata",
    "evidence": "Uma regra dispara milhares de vezes para scanner de vulnerabilidade autorizado.",
    "question": "Qual ajuste é melhor?",
    "options": [
      "Criar exceção/threshold específico e documentado",
      "Desabilitar toda a categoria",
      "Apagar logs",
      "Bloquear o scanner permanentemente"
    ],
    "answer": 0,
    "explanation": "Tuning deve reduzir ruído sem remover cobertura geral.",
    "difficulty": "Médio"
  },
  {
    "id": "sc24",
    "track": "Blue Team",
    "relatedLessons": [
      83
    ],
    "title": "Fonte silenciosa",
    "evidence": "SIEM para de receber eventos de um Domain Controller há 3 horas, mas dashboard continua verde.",
    "question": "Qual problema vem antes de novas regras?",
    "options": [
      "Saúde/monitoramento de ingestão",
      "Nova regra YARA",
      "Trocar firewall",
      "Aumentar cache"
    ],
    "answer": 0,
    "explanation": "Sem dados confiáveis, a detecção perde cobertura silenciosamente.",
    "difficulty": "Médio"
  },
  {
    "id": "sc25",
    "track": "Blue Team",
    "relatedLessons": [
      84,
      85
    ],
    "title": "Hash muda",
    "evidence": "Família de malware muda hash a cada build, mas mantém a mesma sequência de processo e persistência.",
    "question": "Qual estratégia é mais resiliente?",
    "options": [
      "Detecção por comportamento/TTP",
      "Bloquear um único hash",
      "Usar apenas reputação",
      "Ignorar novos hashes"
    ],
    "answer": 0,
    "explanation": "TTPs e IOAs tendem a sobreviver melhor a mudanças triviais de conteúdo.",
    "difficulty": "Médio"
  },
  {
    "id": "sc26",
    "track": "Blue Team",
    "relatedLessons": [
      86
    ],
    "title": "Sigma ampla",
    "evidence": "Regra Sigma alerta qualquer powershell.exe, gerando milhares de eventos legítimos.",
    "question": "Como melhorar?",
    "options": [
      "Adicionar contexto como parent, command line e comportamento raro",
      "Desabilitar PowerShell em todos os hosts",
      "Remover logsource",
      "Transformar em regra YARA"
    ],
    "answer": 0,
    "explanation": "Detecções precisam de contexto para ganhar precisão.",
    "difficulty": "Médio"
  },
  {
    "id": "sc27",
    "track": "Blue Team",
    "relatedLessons": [
      87
    ],
    "title": "YARA ruidosa",
    "evidence": "Regra procura apenas a string \"password\" e corresponde a muitos documentos legítimos.",
    "question": "Qual princípio de melhoria?",
    "options": [
      "Adicionar múltiplos sinais e condição mais específica",
      "Usar menos contexto",
      "Marcar todo match como malware",
      "Remover metadata"
    ],
    "answer": 0,
    "explanation": "Uma única string comum tem baixa especificidade.",
    "difficulty": "Médio"
  },
  {
    "id": "sc28",
    "track": "Blue Team",
    "relatedLessons": [
      89,
      90
    ],
    "title": "Host comprometido",
    "evidence": "EDR alerta persistência e conexão externa confirmada. O host contém dados importantes.",
    "question": "Qual sequência geral é mais coerente?",
    "options": [
      "Preservar evidências essenciais, conter, erradicar, recuperar",
      "Formatar imediatamente sem registrar nada",
      "Desligar SIEM",
      "Publicar o incidente antes de validar"
    ],
    "answer": 0,
    "explanation": "Resposta deve equilibrar preservação, contenção e recuperação controlada.",
    "difficulty": "Médio"
  },
  {
    "id": "sc29",
    "track": "Antivírus/EDR",
    "relatedLessons": [
      92,
      94
    ],
    "title": "Hash desconhecido",
    "evidence": "Arquivo sem reputação cria child process incomum, altera Run key e abre conexão externa.",
    "question": "Por que assinatura isolada é insuficiente?",
    "options": [
      "O comportamento fornece sinais mesmo sem hash conhecido",
      "Hash desconhecido é sempre benigno",
      "Run key é irrelevante",
      "EDR só olha nomes de arquivo"
    ],
    "answer": 0,
    "explanation": "Comportamento e telemetria detectam atividade que ainda não possui assinatura.",
    "difficulty": "Fácil"
  },
  {
    "id": "sc30",
    "track": "Antivírus/EDR",
    "relatedLessons": [
      99,
      100
    ],
    "title": "Regra nova",
    "evidence": "Detecção pega 95% dos testes maliciosos, mas alerta em 40% das execuções administrativas legítimas.",
    "question": "Qual próximo passo?",
    "options": [
      "Tuning com contexto e testes de regressão",
      "Publicar sem ajustes",
      "Desligar telemetria",
      "Trocar hash por MD5"
    ],
    "answer": 0,
    "explanation": "A cobertura é boa, mas a precisão é insuficiente; tuning deve preservar recall enquanto reduz ruído.",
    "difficulty": "Médio"
  },
  {
    "id": "sc31",
    "track": "Antivírus/EDR",
    "relatedLessons": [
      96,
      97
    ],
    "title": "Mitigação bloqueou execução",
    "evidence": "Aplicativo vulnerável sofre crash. O log de Exploit Protection registra bloqueio de execução em região não executável, e o EDR correlaciona o evento ao processo afetado.",
    "question": "Qual interpretação é mais adequada?",
    "options": [
      "Uma mitigação como DEP/NX pode ter interrompido uma tentativa de exploração",
      "O antivírus removeu um cookie",
      "CORS bloqueou o processo",
      "Kerberos expirou"
    ],
    "answer": 0,
    "explanation": "Exploit Protection e EDR se complementam: a mitigação bloqueia uma técnica e a telemetria ajuda a investigar contexto e causa.",
    "difficulty": "Médio"
  },
  {
    "id": "sc32",
    "track": "Antivírus/EDR",
    "relatedLessons": [
      98,
      99,
      100
    ],
    "title": "Parent-child raro",
    "evidence": "browser.exe\n  └─ cmd.exe /c script.bat\n       └─ rundll32.exe arquivo.dll\nO comportamento ocorre em 2 de 4.000 endpoints e a regra atual alerta todo uso de rundll32.",
    "question": "Qual ajuste melhora a detecção sem perder o sinal importante?",
    "options": [
      "Adicionar contexto de ancestry, command line e raridade",
      "Ignorar todos os usos de rundll32",
      "Bloquear qualquer browser.exe",
      "Usar somente o hash do DLL"
    ],
    "answer": 0,
    "explanation": "Contexto causal e prevalência reduzem falsos positivos melhor do que uma regra baseada apenas no nome do processo.",
    "difficulty": "Avançado"
  }
];

export const reviewPacks: ReviewPack[] = [
  {
    "id": 1,
    "title": "Revisão Web #1",
    "lessons": [
      43,
      47
    ],
    "track": "Web",
    "crosswordPool": [
      {
        "id": "w01",
        "answer": "GRAPHQL",
        "clue": "API com schema tipado e operações em um endpoint."
      },
      {
        "id": "w02",
        "answer": "MUTATION",
        "clue": "Operação GraphQL usada para alterar dados."
      },
      {
        "id": "w03",
        "answer": "INTROSPECTION",
        "clue": "Consulta que revela o schema GraphQL."
      },
      {
        "id": "w04",
        "answer": "WEBSOCKET",
        "clue": "Canal persistente iniciado por upgrade HTTP."
      },
      {
        "id": "w05",
        "answer": "HANDSHAKE",
        "clue": "Negociação inicial de uma conexão/protocolo."
      },
      {
        "id": "w06",
        "answer": "SMUGGLING",
        "clue": "Desincronização causada por parsing HTTP divergente."
      },
      {
        "id": "w07",
        "answer": "CACHE",
        "clue": "Camada que reutiliza respostas para reduzir latência."
      },
      {
        "id": "w08",
        "answer": "POISONING",
        "clue": "Contaminação de uma resposta compartilhada em cache."
      },
      {
        "id": "w09",
        "answer": "DECEPTION",
        "clue": "Cache de conteúdo privado por confusão de caminho."
      },
      {
        "id": "w10",
        "answer": "PROTOTYPE",
        "clue": "Objeto-base na cadeia de herança do JavaScript."
      },
      {
        "id": "w11",
        "answer": "HOST",
        "clue": "Cabeçalho HTTP que identifica o domínio solicitado."
      },
      {
        "id": "w12",
        "answer": "DOM",
        "clue": "Modelo de objetos da página no navegador."
      },
      {
        "id": "w13",
        "answer": "SINK",
        "clue": "Destino perigoso onde dados não confiáveis são interpretados."
      },
      {
        "id": "w14",
        "answer": "SHELL",
        "clue": "Interpretador que aumenta risco de command injection."
      },
      {
        "id": "w15",
        "answer": "TRAVERSAL",
        "clue": "Navegação indevida por diretórios usando caminhos manipulados."
      },
      {
        "id": "w16",
        "answer": "UPLOAD",
        "clue": "Entrada de arquivo que exige validação e isolamento."
      },
      {
        "id": "w17",
        "answer": "JWT",
        "clue": "Formato compacto de token assinado."
      },
      {
        "id": "w18",
        "answer": "OAUTH",
        "clue": "Protocolo de autorização delegada."
      }
    ],
    "matchingPool": [
      {
        "id": "wm01",
        "left": "SSRF",
        "right": "Servidor faz uma requisição controlada pelo usuário",
        "explanation": "A falha muda quem origina a requisição: o servidor passa a acessar o destino."
      },
      {
        "id": "wm02",
        "left": "IDOR/BOLA",
        "right": "Autorização por objeto falha",
        "explanation": "O identificador muda, mas o servidor não confirma se aquele usuário pode acessar o objeto."
      },
      {
        "id": "wm03",
        "left": "SQLi",
        "right": "Entrada altera a consulta SQL",
        "explanation": "Dados do usuário interferem na estrutura da consulta."
      },
      {
        "id": "wm04",
        "left": "XSS",
        "right": "Conteúdo executa no contexto do navegador",
        "explanation": "O risco está na interpretação de conteúdo não confiável como script/HTML."
      },
      {
        "id": "wm05",
        "left": "CORS",
        "right": "Política de compartilhamento entre origens",
        "explanation": "Define quais origens podem ler respostas via navegador."
      },
      {
        "id": "wm06",
        "left": "JWT",
        "right": "Token assinado com claims",
        "explanation": "Integridade depende de assinatura e validação correta dos claims."
      },
      {
        "id": "wm07",
        "left": "OAuth",
        "right": "Autorização delegada",
        "explanation": "Permite que uma aplicação obtenha autorização sem receber a senha do usuário."
      },
      {
        "id": "wm08",
        "left": "CSP",
        "right": "Restringe fontes de conteúdo",
        "explanation": "Reduz caminhos de execução/inclusão de recursos no navegador."
      },
      {
        "id": "wm09",
        "left": "Cache poisoning",
        "right": "Resposta contaminada é compartilhada",
        "explanation": "Uma entrada não-keyed altera o objeto armazenado."
      }
    ],
    "orderingPool": [
      {
        "id": "o05",
        "title": "Request Smuggling conceitual",
        "steps": [
          "Cliente envia requisição",
          "Frontend/proxy recebe",
          "Frontend interpreta limites",
          "Backend interpreta limites",
          "Ocorre divergência",
          "Fila fica desincronizada",
          "Impacto aparece em requisições seguintes"
        ],
        "explanation": "O problema central é a diferença de parsing entre componentes em cadeia."
      },
      {
        "id": "o06",
        "title": "Cache Poisoning conceitual",
        "steps": [
          "Entrada controlável chega à origem",
          "Entrada influencia a resposta",
          "Cache key ignora essa entrada",
          "Resposta alterada é armazenada",
          "Outros usuários recebem o objeto"
        ],
        "explanation": "Poisoning exige influência na resposta e compartilhamento do objeto cacheado."
      }
    ],
    "scenarioIds": [
      "sc01",
      "sc02",
      "sc03",
      "sc04"
    ]
  },
  {
    "id": 2,
    "title": "Revisão Web #2",
    "lessons": [
      48,
      52
    ],
    "track": "Web",
    "crosswordPool": [
      {
        "id": "w09",
        "answer": "DECEPTION",
        "clue": "Cache de conteúdo privado por confusão de caminho."
      },
      {
        "id": "w10",
        "answer": "PROTOTYPE",
        "clue": "Objeto-base na cadeia de herança do JavaScript."
      },
      {
        "id": "w11",
        "answer": "HOST",
        "clue": "Cabeçalho HTTP que identifica o domínio solicitado."
      },
      {
        "id": "w12",
        "answer": "DOM",
        "clue": "Modelo de objetos da página no navegador."
      },
      {
        "id": "w13",
        "answer": "SINK",
        "clue": "Destino perigoso onde dados não confiáveis são interpretados."
      },
      {
        "id": "w14",
        "answer": "SHELL",
        "clue": "Interpretador que aumenta risco de command injection."
      },
      {
        "id": "w15",
        "answer": "TRAVERSAL",
        "clue": "Navegação indevida por diretórios usando caminhos manipulados."
      },
      {
        "id": "w16",
        "answer": "UPLOAD",
        "clue": "Entrada de arquivo que exige validação e isolamento."
      },
      {
        "id": "w17",
        "answer": "JWT",
        "clue": "Formato compacto de token assinado."
      },
      {
        "id": "w18",
        "answer": "OAUTH",
        "clue": "Protocolo de autorização delegada."
      },
      {
        "id": "w19",
        "answer": "PKCE",
        "clue": "Proteção que vincula cliente ao resgate do authorization code."
      },
      {
        "id": "w20",
        "answer": "BOLA",
        "clue": "Falha de autorização por objeto em APIs."
      },
      {
        "id": "w21",
        "answer": "BFLA",
        "clue": "Falha de autorização por função em APIs."
      },
      {
        "id": "w22",
        "answer": "RACE",
        "clue": "Condição em que concorrência quebra uma regra de estado."
      },
      {
        "id": "w23",
        "answer": "CORS",
        "clue": "Mecanismo que controla acesso entre origens."
      },
      {
        "id": "w24",
        "answer": "ORIGIN",
        "clue": "Esquema, host e porta que definem uma origem web."
      }
    ],
    "matchingPool": [
      {
        "id": "wm04",
        "left": "XSS",
        "right": "Conteúdo executa no contexto do navegador",
        "explanation": "O risco está na interpretação de conteúdo não confiável como script/HTML."
      },
      {
        "id": "wm09",
        "left": "Cache poisoning",
        "right": "Resposta contaminada é compartilhada",
        "explanation": "Uma entrada não-keyed altera o objeto armazenado."
      },
      {
        "id": "wm10",
        "left": "Cache deception",
        "right": "Conteúdo privado vira cacheável",
        "explanation": "A CDN confunde uma rota privada com recurso público/estático."
      },
      {
        "id": "wm14",
        "left": "Path Traversal",
        "right": "Caminho sai da raiz permitida",
        "explanation": "Sequências de path manipulam resolução de diretórios."
      },
      {
        "id": "wm15",
        "left": "Host Header",
        "right": "Host controlado influencia URL/roteamento",
        "explanation": "Aplicação confia em cabeçalhos de host sem validação."
      },
      {
        "id": "wm01",
        "left": "SSRF",
        "right": "Servidor faz uma requisição controlada pelo usuário",
        "explanation": "A falha muda quem origina a requisição: o servidor passa a acessar o destino."
      },
      {
        "id": "wm02",
        "left": "IDOR/BOLA",
        "right": "Autorização por objeto falha",
        "explanation": "O identificador muda, mas o servidor não confirma se aquele usuário pode acessar o objeto."
      },
      {
        "id": "wm03",
        "left": "SQLi",
        "right": "Entrada altera a consulta SQL",
        "explanation": "Dados do usuário interferem na estrutura da consulta."
      },
      {
        "id": "wm08",
        "left": "CSP",
        "right": "Restringe fontes de conteúdo",
        "explanation": "Reduz caminhos de execução/inclusão de recursos no navegador."
      }
    ],
    "orderingPool": [
      {
        "id": "o01",
        "title": "Fluxo de pentest autorizado",
        "steps": [
          "Escopo/autorização",
          "Reconhecimento",
          "Enumeração",
          "Validação da vulnerabilidade",
          "Exploração controlada",
          "Evidências",
          "Correção",
          "Reteste",
          "Relatório"
        ],
        "explanation": "A autorização e o escopo vêm antes de qualquer atividade técnica; o reteste confirma a correção."
      },
      {
        "id": "o06",
        "title": "Cache Poisoning conceitual",
        "steps": [
          "Entrada controlável chega à origem",
          "Entrada influencia a resposta",
          "Cache key ignora essa entrada",
          "Resposta alterada é armazenada",
          "Outros usuários recebem o objeto"
        ],
        "explanation": "Poisoning exige influência na resposta e compartilhamento do objeto cacheado."
      }
    ],
    "scenarioIds": [
      "sc05",
      "sc01",
      "sc03",
      "sc04"
    ]
  },
  {
    "id": 3,
    "title": "Revisão Web #3",
    "lessons": [
      53,
      60
    ],
    "track": "Web",
    "crosswordPool": [
      {
        "id": "w15",
        "answer": "TRAVERSAL",
        "clue": "Navegação indevida por diretórios usando caminhos manipulados."
      },
      {
        "id": "w16",
        "answer": "UPLOAD",
        "clue": "Entrada de arquivo que exige validação e isolamento."
      },
      {
        "id": "w17",
        "answer": "JWT",
        "clue": "Formato compacto de token assinado."
      },
      {
        "id": "w18",
        "answer": "OAUTH",
        "clue": "Protocolo de autorização delegada."
      },
      {
        "id": "w19",
        "answer": "PKCE",
        "clue": "Proteção que vincula cliente ao resgate do authorization code."
      },
      {
        "id": "w20",
        "answer": "BOLA",
        "clue": "Falha de autorização por objeto em APIs."
      },
      {
        "id": "w21",
        "answer": "BFLA",
        "clue": "Falha de autorização por função em APIs."
      },
      {
        "id": "w22",
        "answer": "RACE",
        "clue": "Condição em que concorrência quebra uma regra de estado."
      },
      {
        "id": "w23",
        "answer": "CORS",
        "clue": "Mecanismo que controla acesso entre origens."
      },
      {
        "id": "w24",
        "answer": "ORIGIN",
        "clue": "Esquema, host e porta que definem uma origem web."
      },
      {
        "id": "w25",
        "answer": "CSP",
        "clue": "Política do navegador que restringe fontes de conteúdo."
      },
      {
        "id": "w26",
        "answer": "HSTS",
        "clue": "Header que força uso de HTTPS."
      },
      {
        "id": "w27",
        "answer": "CHAIN",
        "clue": "Sequência de falhas que aumenta impacto."
      },
      {
        "id": "w28",
        "answer": "ALLOWLIST",
        "clue": "Conjunto explícito de valores aceitos."
      },
      {
        "id": "w29",
        "answer": "IDEMPOTENCY",
        "clue": "Propriedade que evita efeito duplicado de uma mesma operação."
      },
      {
        "id": "w30",
        "answer": "NORMALIZATION",
        "clue": "Padronização para reduzir interpretações divergentes."
      },
      {
        "id": "w01",
        "answer": "GRAPHQL",
        "clue": "API com schema tipado e operações em um endpoint."
      },
      {
        "id": "w02",
        "answer": "MUTATION",
        "clue": "Operação GraphQL usada para alterar dados."
      },
      {
        "id": "w03",
        "answer": "INTROSPECTION",
        "clue": "Consulta que revela o schema GraphQL."
      },
      {
        "id": "w04",
        "answer": "WEBSOCKET",
        "clue": "Canal persistente iniciado por upgrade HTTP."
      },
      {
        "id": "w05",
        "answer": "HANDSHAKE",
        "clue": "Negociação inicial de uma conexão/protocolo."
      }
    ],
    "matchingPool": [
      {
        "id": "wm06",
        "left": "JWT",
        "right": "Token assinado com claims",
        "explanation": "Integridade depende de assinatura e validação correta dos claims."
      },
      {
        "id": "wm07",
        "left": "OAuth",
        "right": "Autorização delegada",
        "explanation": "Permite que uma aplicação obtenha autorização sem receber a senha do usuário."
      },
      {
        "id": "wm08",
        "left": "CSP",
        "right": "Restringe fontes de conteúdo",
        "explanation": "Reduz caminhos de execução/inclusão de recursos no navegador."
      },
      {
        "id": "wm09",
        "left": "Cache poisoning",
        "right": "Resposta contaminada é compartilhada",
        "explanation": "Uma entrada não-keyed altera o objeto armazenado."
      },
      {
        "id": "wm10",
        "left": "Cache deception",
        "right": "Conteúdo privado vira cacheável",
        "explanation": "A CDN confunde uma rota privada com recurso público/estático."
      },
      {
        "id": "wm11",
        "left": "PKCE",
        "right": "Vincula o cliente ao authorization code",
        "explanation": "Reduz risco de code interception em OAuth."
      },
      {
        "id": "wm12",
        "left": "Mass Assignment",
        "right": "Campos não permitidos são vinculados automaticamente",
        "explanation": "O servidor aceita propriedades que deveriam ser controladas internamente."
      },
      {
        "id": "wm13",
        "left": "Race Condition",
        "right": "Concorrência quebra uma regra de estado",
        "explanation": "Requisições simultâneas exploram janela de tempo/atomicidade."
      },
      {
        "id": "wm14",
        "left": "Path Traversal",
        "right": "Caminho sai da raiz permitida",
        "explanation": "Sequências de path manipulam resolução de diretórios."
      },
      {
        "id": "wm15",
        "left": "Host Header",
        "right": "Host controlado influencia URL/roteamento",
        "explanation": "Aplicação confia em cabeçalhos de host sem validação."
      },
      {
        "id": "wm01",
        "left": "SSRF",
        "right": "Servidor faz uma requisição controlada pelo usuário",
        "explanation": "A falha muda quem origina a requisição: o servidor passa a acessar o destino."
      },
      {
        "id": "wm02",
        "left": "IDOR/BOLA",
        "right": "Autorização por objeto falha",
        "explanation": "O identificador muda, mas o servidor não confirma se aquele usuário pode acessar o objeto."
      },
      {
        "id": "wm03",
        "left": "SQLi",
        "right": "Entrada altera a consulta SQL",
        "explanation": "Dados do usuário interferem na estrutura da consulta."
      },
      {
        "id": "wm04",
        "left": "XSS",
        "right": "Conteúdo executa no contexto do navegador",
        "explanation": "O risco está na interpretação de conteúdo não confiável como script/HTML."
      }
    ],
    "orderingPool": [
      {
        "id": "o01",
        "title": "Fluxo de pentest autorizado",
        "steps": [
          "Escopo/autorização",
          "Reconhecimento",
          "Enumeração",
          "Validação da vulnerabilidade",
          "Exploração controlada",
          "Evidências",
          "Correção",
          "Reteste",
          "Relatório"
        ],
        "explanation": "A autorização e o escopo vêm antes de qualquer atividade técnica; o reteste confirma a correção."
      },
      {
        "id": "o06",
        "title": "Cache Poisoning conceitual",
        "steps": [
          "Entrada controlável chega à origem",
          "Entrada influencia a resposta",
          "Cache key ignora essa entrada",
          "Resposta alterada é armazenada",
          "Outros usuários recebem o objeto"
        ],
        "explanation": "Poisoning exige influência na resposta e compartilhamento do objeto cacheado."
      }
    ],
    "scenarioIds": [
      "sc06",
      "sc07",
      "sc08",
      "sc02"
    ]
  },
  {
    "id": 4,
    "title": "Sistemas e Vulnerabilidades",
    "lessons": [
      61,
      69
    ],
    "track": "Sistemas",
    "crosswordPool": [
      {
        "id": "s01",
        "answer": "NMAP",
        "clue": "Ferramenta de descoberta de hosts, portas e serviços."
      },
      {
        "id": "s02",
        "answer": "ENUMERATION",
        "clue": "Coleta estruturada de informações sobre um sistema."
      },
      {
        "id": "s03",
        "answer": "SUID",
        "clue": "Bit Unix que executa com UID do proprietário."
      },
      {
        "id": "s04",
        "answer": "CAPABILITY",
        "clue": "Privilégio granular associado a um binário Linux."
      },
      {
        "id": "s05",
        "answer": "TOKEN",
        "clue": "Estrutura Windows que carrega identidade e privilégios."
      },
      {
        "id": "s06",
        "answer": "SERVICE",
        "clue": "Processo de longa duração gerenciado pelo sistema."
      },
      {
        "id": "s07",
        "answer": "PERMISSION",
        "clue": "Regra que determina quem pode ler, escrever ou executar."
      },
      {
        "id": "s08",
        "answer": "PRIVILEGE",
        "clue": "Capacidade especial concedida a usuário/processo."
      },
      {
        "id": "s09",
        "answer": "NSE",
        "clue": "Mecanismo de scripts do Nmap."
      },
      {
        "id": "s10",
        "answer": "FINGERPRINT",
        "clue": "Conjunto de sinais usado para inferir software/versão."
      },
      {
        "id": "s11",
        "answer": "NESSUS",
        "clue": "Scanner comercial de vulnerabilidades."
      },
      {
        "id": "s12",
        "answer": "OPENVAS",
        "clue": "Scanner de vulnerabilidades open source."
      },
      {
        "id": "s13",
        "answer": "NUCLEI",
        "clue": "Scanner orientado a templates."
      },
      {
        "id": "s14",
        "answer": "CVE",
        "clue": "Identificador público de vulnerabilidade."
      },
      {
        "id": "s15",
        "answer": "CWE",
        "clue": "Categoria de fraqueza de software."
      },
      {
        "id": "s16",
        "answer": "CVSS",
        "clue": "Métrica de severidade técnica."
      },
      {
        "id": "s17",
        "answer": "ADVISORY",
        "clue": "Comunicado do fornecedor sobre impacto e correção."
      },
      {
        "id": "s18",
        "answer": "POC",
        "clue": "Demonstração mínima de uma condição vulnerável."
      },
      {
        "id": "s19",
        "answer": "SNAPSHOT",
        "clue": "Ponto de restauração usado em laboratório."
      },
      {
        "id": "s20",
        "answer": "ISOLATION",
        "clue": "Separação do laboratório de ambientes reais."
      }
    ],
    "matchingPool": [
      {
        "id": "sm01",
        "left": "Nmap",
        "right": "Descoberta de portas e serviços",
        "explanation": "Ferramenta usada para mapear superfície de rede em escopo autorizado."
      },
      {
        "id": "sm02",
        "left": "Nuclei",
        "right": "Scanner orientado a templates",
        "explanation": "Executa verificações declarativas e reproduzíveis."
      },
      {
        "id": "sm03",
        "left": "Nessus",
        "right": "Scanner de vulnerabilidades",
        "explanation": "Correlaciona versões/configurações com checks conhecidos."
      },
      {
        "id": "sm04",
        "left": "CVE",
        "right": "Identificador de vulnerabilidade",
        "explanation": "Nomeia uma vulnerabilidade publicada."
      },
      {
        "id": "sm05",
        "left": "CWE",
        "right": "Classe de fraqueza",
        "explanation": "Agrupa padrões de erro de software."
      },
      {
        "id": "sm06",
        "left": "CVSS",
        "right": "Severidade técnica",
        "explanation": "Pontua características técnicas de impacto/exploitability."
      },
      {
        "id": "sm07",
        "left": "SUID",
        "right": "Execução com UID do proprietário",
        "explanation": "Bit Unix que exige revisão cuidadosa em binários."
      },
      {
        "id": "sm08",
        "left": "Capabilities",
        "right": "Privilégios granulares Linux",
        "explanation": "Permitem separar capacidades que antes exigiam root."
      },
      {
        "id": "sm09",
        "left": "Service ACL",
        "right": "Permissões de serviço Windows",
        "explanation": "Define quem pode alterar/iniciar/configurar serviço."
      },
      {
        "id": "sm10",
        "left": "Snapshot",
        "right": "Ponto de restauração de laboratório",
        "explanation": "Facilita testes reversíveis e reproduzíveis."
      }
    ],
    "orderingPool": [
      {
        "id": "o01",
        "title": "Fluxo de pentest autorizado",
        "steps": [
          "Escopo/autorização",
          "Reconhecimento",
          "Enumeração",
          "Validação da vulnerabilidade",
          "Exploração controlada",
          "Evidências",
          "Correção",
          "Reteste",
          "Relatório"
        ],
        "explanation": "A autorização e o escopo vêm antes de qualquer atividade técnica; o reteste confirma a correção."
      },
      {
        "id": "o04",
        "title": "Vulnerability Management",
        "steps": [
          "Inventário",
          "Descoberta",
          "Validação",
          "Priorização",
          "Correção",
          "Reteste",
          "Fechamento"
        ],
        "explanation": "Sem inventário e validação, a priorização perde contexto e pode desperdiçar esforço."
      },
      {
        "id": "o02",
        "title": "Análise defensiva de malware",
        "steps": [
          "Calcular hash",
          "Identificar tipo de arquivo",
          "Análise estática",
          "Executar em sandbox controlada",
          "Observar processos/registro/rede",
          "Extrair IOCs",
          "Criar regra YARA/Sigma",
          "Validar detecção",
          "Documentar"
        ],
        "explanation": "Comece com coleta de baixo risco e só depois execute em ambiente isolado."
      }
    ],
    "scenarioIds": [
      "sc09",
      "sc10",
      "sc11",
      "sc12",
      "sc13",
      "sc14"
    ]
  },
  {
    "id": 5,
    "title": "Active Directory",
    "lessons": [
      70,
      78
    ],
    "track": "Active Directory",
    "crosswordPool": [
      {
        "id": "a01",
        "answer": "DOMAIN",
        "clue": "Limite lógico de identidade e administração no AD."
      },
      {
        "id": "a02",
        "answer": "KERBEROS",
        "clue": "Protocolo de autenticação baseado em tickets."
      },
      {
        "id": "a03",
        "answer": "LDAP",
        "clue": "Protocolo de consulta ao diretório."
      },
      {
        "id": "a04",
        "answer": "NTLM",
        "clue": "Protocolo legado de autenticação Windows."
      },
      {
        "id": "a05",
        "answer": "GPO",
        "clue": "Objeto de política aplicado em escala no domínio."
      },
      {
        "id": "a06",
        "answer": "TICKET",
        "clue": "Credencial temporária usada pelo Kerberos."
      },
      {
        "id": "a07",
        "answer": "TGT",
        "clue": "Ticket inicial usado para pedir tickets de serviço."
      },
      {
        "id": "a08",
        "answer": "GROUP",
        "clue": "Objeto que agrupa identidades e permissões."
      },
      {
        "id": "a09",
        "answer": "OU",
        "clue": "Contêiner organizacional usado para delegação/política."
      },
      {
        "id": "a10",
        "answer": "SPN",
        "clue": "Identificador de serviço associado a uma conta."
      },
      {
        "id": "a11",
        "answer": "ACL",
        "clue": "Lista de permissões sobre um objeto."
      },
      {
        "id": "a12",
        "answer": "TRUST",
        "clue": "Relação de confiança entre domínios."
      },
      {
        "id": "a13",
        "answer": "DELEGATION",
        "clue": "Concessão de administração sobre parte do diretório."
      },
      {
        "id": "a14",
        "answer": "GENERICALL",
        "clue": "Permissão ampla sobre um objeto do AD."
      },
      {
        "id": "a15",
        "answer": "WRITEDACL",
        "clue": "Direito de alterar a ACL de um objeto."
      },
      {
        "id": "a16",
        "answer": "LAPS",
        "clue": "Gestão de senhas administrativas locais únicas."
      },
      {
        "id": "a17",
        "answer": "GMSA",
        "clue": "Conta de serviço gerenciada com rotação automática."
      },
      {
        "id": "a18",
        "answer": "TIERING",
        "clue": "Separação de administração por níveis de criticidade."
      },
      {
        "id": "a19",
        "answer": "SYSVOL",
        "clue": "Compartilhamento que contém arquivos de políticas."
      },
      {
        "id": "a20",
        "answer": "CORRELATION",
        "clue": "Combinação de eventos para aumentar confiança de detecção."
      }
    ],
    "matchingPool": [
      {
        "id": "am01",
        "left": "Kerberos",
        "right": "Autenticação baseada em tickets",
        "explanation": "TGT e tickets de serviço evitam enviar a senha a cada serviço."
      },
      {
        "id": "am02",
        "left": "LDAP",
        "right": "Consulta ao diretório",
        "explanation": "Protocolo usado para ler/alterar objetos do AD."
      },
      {
        "id": "am03",
        "left": "GPO",
        "right": "Políticas de domínio",
        "explanation": "Aplica configurações em escala."
      },
      {
        "id": "am04",
        "left": "NTLM",
        "right": "Autenticação legada",
        "explanation": "Deve ser reduzida quando possível por limitações de segurança."
      },
      {
        "id": "am05",
        "left": "Domain Controller",
        "right": "Serviço central do domínio",
        "explanation": "Hospeda AD DS e autenticação crítica."
      },
      {
        "id": "am06",
        "left": "SPN",
        "right": "Identificador de serviço",
        "explanation": "Associa um serviço a uma conta."
      },
      {
        "id": "am07",
        "left": "ACL",
        "right": "Permissões sobre objetos",
        "explanation": "Controla quem pode ler/modificar atributos/objetos."
      },
      {
        "id": "am08",
        "left": "LAPS",
        "right": "Senha local única gerenciada",
        "explanation": "Reduz reutilização de senha administrativa local."
      },
      {
        "id": "am09",
        "left": "gMSA",
        "right": "Conta de serviço gerenciada",
        "explanation": "Automatiza rotação de senha para serviços."
      },
      {
        "id": "am10",
        "left": "Tiering",
        "right": "Separação de privilégios administrativos",
        "explanation": "Evita usar credenciais de alto privilégio em camadas menos confiáveis."
      }
    ],
    "orderingPool": [
      {
        "id": "o07",
        "title": "Kerberos simplificado",
        "steps": [
          "Usuário autentica no KDC",
          "Recebe TGT",
          "Solicita ticket para um serviço",
          "Recebe service ticket",
          "Apresenta ticket ao serviço"
        ],
        "explanation": "O TGT é intermediário; o serviço recebe um ticket específico."
      },
      {
        "id": "o01",
        "title": "Fluxo de pentest autorizado",
        "steps": [
          "Escopo/autorização",
          "Reconhecimento",
          "Enumeração",
          "Validação da vulnerabilidade",
          "Exploração controlada",
          "Evidências",
          "Correção",
          "Reteste",
          "Relatório"
        ],
        "explanation": "A autorização e o escopo vêm antes de qualquer atividade técnica; o reteste confirma a correção."
      }
    ],
    "scenarioIds": [
      "sc15",
      "sc16",
      "sc17",
      "sc18",
      "sc19",
      "sc20"
    ]
  },
  {
    "id": 6,
    "title": "Blue Team #1",
    "lessons": [
      79,
      84
    ],
    "track": "Blue Team",
    "crosswordPool": [
      {
        "id": "b01",
        "answer": "SYSMON",
        "clue": "Telemetria detalhada de processos e outros eventos Windows."
      },
      {
        "id": "b02",
        "answer": "WIRESHARK",
        "clue": "Analisador gráfico de pacotes."
      },
      {
        "id": "b03",
        "answer": "SURICATA",
        "clue": "IDS/IPS e mecanismo de inspeção de rede."
      },
      {
        "id": "b04",
        "answer": "SIEM",
        "clue": "Plataforma de centralização e correlação de eventos."
      },
      {
        "id": "b05",
        "answer": "MITRE",
        "clue": "Base conhecida por mapear táticas e técnicas adversárias."
      },
      {
        "id": "b06",
        "answer": "IOC",
        "clue": "Indicador concreto como hash, IP ou domínio."
      },
      {
        "id": "b07",
        "answer": "IOA",
        "clue": "Indicador baseado em ação/comportamento."
      },
      {
        "id": "b08",
        "answer": "TTP",
        "clue": "Tática, técnica e procedimento."
      },
      {
        "id": "b09",
        "answer": "SIGMA",
        "clue": "Formato genérico de regras para logs."
      },
      {
        "id": "b10",
        "answer": "YARA",
        "clue": "Linguagem de regras para padrões em arquivos/memória."
      },
      {
        "id": "b11",
        "answer": "HUNTING",
        "clue": "Busca proativa guiada por hipótese."
      },
      {
        "id": "b12",
        "answer": "DFIR",
        "clue": "Resposta a incidentes e forense digital."
      },
      {
        "id": "b13",
        "answer": "PCAP",
        "clue": "Arquivo de captura de pacotes."
      },
      {
        "id": "b14",
        "answer": "TIMELINE",
        "clue": "Sequência temporal reconstruída de um incidente."
      },
      {
        "id": "b15",
        "answer": "ARTIFACT",
        "clue": "Vestígio técnico deixado por sistema/atividade."
      },
      {
        "id": "b16",
        "answer": "CONTAINMENT",
        "clue": "Ação para limitar propagação do incidente."
      },
      {
        "id": "b17",
        "answer": "ERADICATION",
        "clue": "Remoção da causa e artefatos do incidente."
      },
      {
        "id": "b18",
        "answer": "RECOVERY",
        "clue": "Retorno controlado à operação."
      },
      {
        "id": "b19",
        "answer": "BASELINE",
        "clue": "Padrão normal usado para detectar desvios."
      },
      {
        "id": "b20",
        "answer": "HYPOTHESIS",
        "clue": "Pergunta testável que orienta um hunt."
      }
    ],
    "matchingPool": [
      {
        "id": "bm01",
        "left": "YARA",
        "right": "Padrões em arquivos/memória",
        "explanation": "Útil para triagem e hunting de conteúdo."
      },
      {
        "id": "bm02",
        "left": "Sigma",
        "right": "Regra genérica para eventos/logs",
        "explanation": "Pode ser convertida para diferentes backends/SIEMs."
      },
      {
        "id": "bm03",
        "left": "Suricata",
        "right": "IDS/IPS de rede",
        "explanation": "Inspeciona protocolos e aplica regras."
      },
      {
        "id": "bm04",
        "left": "Sysmon",
        "right": "Telemetria detalhada do Windows",
        "explanation": "Registra processo, rede, hash e outros sinais."
      },
      {
        "id": "bm05",
        "left": "Wireshark",
        "right": "Análise de pacotes",
        "explanation": "Permite examinar PCAPs e reconstruir conversas."
      },
      {
        "id": "bm06",
        "left": "SIEM",
        "right": "Correlação centralizada",
        "explanation": "Agrega logs de múltiplas fontes."
      },
      {
        "id": "bm07",
        "left": "MITRE ATT&CK",
        "right": "Base de TTPs",
        "explanation": "Ajuda a mapear comportamento e cobertura."
      },
      {
        "id": "bm08",
        "left": "IOC",
        "right": "Indicador concreto",
        "explanation": "Hash, domínio, IP e outros artefatos."
      }
    ],
    "orderingPool": [
      {
        "id": "o03",
        "title": "Incident Response",
        "steps": [
          "Preparação",
          "Identificação",
          "Contenção",
          "Erradicação",
          "Recuperação",
          "Lições aprendidas"
        ],
        "explanation": "A ordem evita recuperar antes de remover a causa e garante aprendizado após o incidente."
      },
      {
        "id": "o08",
        "title": "Threat Hunting",
        "steps": [
          "Definir hipótese",
          "Escolher fontes de dados",
          "Consultar baseline",
          "Buscar desvios",
          "Pivotar em evidências",
          "Validar achado",
          "Transformar padrão recorrente em detecção"
        ],
        "explanation": "Um hunt útil começa com hipótese testável e termina gerando conhecimento/detecção."
      }
    ],
    "scenarioIds": [
      "sc21",
      "sc22",
      "sc23",
      "sc24",
      "sc25"
    ]
  },
  {
    "id": 7,
    "title": "Blue Team #2",
    "lessons": [
      85,
      90
    ],
    "track": "Blue Team",
    "crosswordPool": [
      {
        "id": "b06",
        "answer": "IOC",
        "clue": "Indicador concreto como hash, IP ou domínio."
      },
      {
        "id": "b07",
        "answer": "IOA",
        "clue": "Indicador baseado em ação/comportamento."
      },
      {
        "id": "b08",
        "answer": "TTP",
        "clue": "Tática, técnica e procedimento."
      },
      {
        "id": "b09",
        "answer": "SIGMA",
        "clue": "Formato genérico de regras para logs."
      },
      {
        "id": "b10",
        "answer": "YARA",
        "clue": "Linguagem de regras para padrões em arquivos/memória."
      },
      {
        "id": "b11",
        "answer": "HUNTING",
        "clue": "Busca proativa guiada por hipótese."
      },
      {
        "id": "b12",
        "answer": "DFIR",
        "clue": "Resposta a incidentes e forense digital."
      },
      {
        "id": "b13",
        "answer": "PCAP",
        "clue": "Arquivo de captura de pacotes."
      },
      {
        "id": "b14",
        "answer": "TIMELINE",
        "clue": "Sequência temporal reconstruída de um incidente."
      },
      {
        "id": "b15",
        "answer": "ARTIFACT",
        "clue": "Vestígio técnico deixado por sistema/atividade."
      },
      {
        "id": "b16",
        "answer": "CONTAINMENT",
        "clue": "Ação para limitar propagação do incidente."
      },
      {
        "id": "b17",
        "answer": "ERADICATION",
        "clue": "Remoção da causa e artefatos do incidente."
      },
      {
        "id": "b18",
        "answer": "RECOVERY",
        "clue": "Retorno controlado à operação."
      },
      {
        "id": "b19",
        "answer": "BASELINE",
        "clue": "Padrão normal usado para detectar desvios."
      },
      {
        "id": "b20",
        "answer": "HYPOTHESIS",
        "clue": "Pergunta testável que orienta um hunt."
      },
      {
        "id": "b21",
        "answer": "INGESTION",
        "clue": "Entrada de dados no SIEM."
      },
      {
        "id": "b22",
        "answer": "NORMALIZATION",
        "clue": "Conversão de logs para campos consistentes."
      },
      {
        "id": "b23",
        "answer": "TACTIC",
        "clue": "Objetivo de alto nível no ATT&CK."
      },
      {
        "id": "b24",
        "answer": "TECHNIQUE",
        "clue": "Forma de executar uma ação no ATT&CK."
      },
      {
        "id": "b25",
        "answer": "RETENTION",
        "clue": "Período pelo qual os logs são mantidos."
      }
    ],
    "matchingPool": [
      {
        "id": "bm06",
        "left": "SIEM",
        "right": "Correlação centralizada",
        "explanation": "Agrega logs de múltiplas fontes."
      },
      {
        "id": "bm07",
        "left": "MITRE ATT&CK",
        "right": "Base de TTPs",
        "explanation": "Ajuda a mapear comportamento e cobertura."
      },
      {
        "id": "bm08",
        "left": "IOC",
        "right": "Indicador concreto",
        "explanation": "Hash, domínio, IP e outros artefatos."
      },
      {
        "id": "bm09",
        "left": "IOA",
        "right": "Indicador de comportamento",
        "explanation": "Foca ação em vez de artefato fixo."
      },
      {
        "id": "bm10",
        "left": "Threat Hunting",
        "right": "Busca proativa por hipótese",
        "explanation": "Procura atividade que pode não ter alertado."
      },
      {
        "id": "bm11",
        "left": "Containment",
        "right": "Limitar propagação",
        "explanation": "Etapa de resposta a incidentes."
      },
      {
        "id": "bm12",
        "left": "Timeline",
        "right": "Reconstrução temporal",
        "explanation": "Ajuda a entender sequência e causalidade."
      }
    ],
    "orderingPool": [
      {
        "id": "o08",
        "title": "Threat Hunting",
        "steps": [
          "Definir hipótese",
          "Escolher fontes de dados",
          "Consultar baseline",
          "Buscar desvios",
          "Pivotar em evidências",
          "Validar achado",
          "Transformar padrão recorrente em detecção"
        ],
        "explanation": "Um hunt útil começa com hipótese testável e termina gerando conhecimento/detecção."
      },
      {
        "id": "o03",
        "title": "Incident Response",
        "steps": [
          "Preparação",
          "Identificação",
          "Contenção",
          "Erradicação",
          "Recuperação",
          "Lições aprendidas"
        ],
        "explanation": "A ordem evita recuperar antes de remover a causa e garante aprendizado após o incidente."
      }
    ],
    "scenarioIds": [
      "sc25",
      "sc26",
      "sc27",
      "sc28",
      "sc22"
    ]
  },
  {
    "id": 8,
    "title": "Antivírus e EDR #1",
    "lessons": [
      91,
      95
    ],
    "track": "Antivírus/EDR",
    "crosswordPool": [
      {
        "id": "e01",
        "answer": "SIGNATURE",
        "clue": "Padrão conhecido usado em detecção tradicional."
      },
      {
        "id": "e02",
        "answer": "HASH",
        "clue": "Resumo determinístico do conteúdo."
      },
      {
        "id": "e03",
        "answer": "REPUTATION",
        "clue": "Avaliação baseada em histórico e prevalência."
      },
      {
        "id": "e04",
        "answer": "HEURISTIC",
        "clue": "Detecção por características suspeitas."
      },
      {
        "id": "e05",
        "answer": "SANDBOX",
        "clue": "Ambiente controlado para observar execução."
      },
      {
        "id": "e06",
        "answer": "TELEMETRY",
        "clue": "Eventos coletados do endpoint."
      },
      {
        "id": "e07",
        "answer": "PROCESS",
        "clue": "Instância em execução de um programa."
      },
      {
        "id": "e08",
        "answer": "QUARANTINE",
        "clue": "Isolamento de conteúdo suspeito."
      },
      {
        "id": "e09",
        "answer": "DETECTION",
        "clue": "Lógica que transforma sinais em alerta."
      },
      {
        "id": "e10",
        "answer": "FALSEPOSITIVE",
        "clue": "Alerta que corresponde a atividade legítima."
      },
      {
        "id": "e11",
        "answer": "FALSENEGATIVE",
        "clue": "Ameaça real que não foi detectada."
      },
      {
        "id": "e12",
        "answer": "PREVALENCE",
        "clue": "Frequência de um arquivo no ambiente/base."
      },
      {
        "id": "e13",
        "answer": "BEHAVIOR",
        "clue": "Conjunto de ações observadas em execução."
      },
      {
        "id": "e14",
        "answer": "ANCESTRY",
        "clue": "Cadeia de processos predecessores."
      },
      {
        "id": "e15",
        "answer": "COMMANDLINE",
        "clue": "Argumentos usados na execução de um processo."
      }
    ],
    "matchingPool": [
      {
        "id": "em01",
        "left": "Signature",
        "right": "Padrão conhecido",
        "explanation": "Rápido para ameaças previamente catalogadas."
      },
      {
        "id": "em02",
        "left": "Heuristic",
        "right": "Características suspeitas",
        "explanation": "Generaliza além de uma amostra exata."
      },
      {
        "id": "em03",
        "left": "Sandbox",
        "right": "Execução isolada",
        "explanation": "Observa comportamento em ambiente controlado."
      },
      {
        "id": "em04",
        "left": "EDR",
        "right": "Telemetria + detecção + resposta",
        "explanation": "Vai além de classificar apenas arquivos."
      },
      {
        "id": "em05",
        "left": "Quarantine",
        "right": "Isolamento de arquivo",
        "explanation": "Impede uso enquanto preserva objeto para análise."
      },
      {
        "id": "em06",
        "left": "Hash",
        "right": "Identificador do conteúdo",
        "explanation": "Útil para comparação exata e reputação."
      },
      {
        "id": "em07",
        "left": "Process tree",
        "right": "Relação causal de processos",
        "explanation": "Mostra parent, child e ancestry."
      }
    ],
    "orderingPool": [
      {
        "id": "o02",
        "title": "Análise defensiva de malware",
        "steps": [
          "Calcular hash",
          "Identificar tipo de arquivo",
          "Análise estática",
          "Executar em sandbox controlada",
          "Observar processos/registro/rede",
          "Extrair IOCs",
          "Criar regra YARA/Sigma",
          "Validar detecção",
          "Documentar"
        ],
        "explanation": "Comece com coleta de baixo risco e só depois execute em ambiente isolado."
      },
      {
        "id": "o09",
        "title": "Detection Engineering",
        "steps": [
          "Definir hipótese de detecção",
          "Listar dados necessários",
          "Criar lógica/regra",
          "Gerar casos de teste",
          "Validar precisão e cobertura",
          "Ajustar falsos positivos",
          "Versionar e documentar",
          "Monitorar desempenho"
        ],
        "explanation": "Detecção é um ciclo de engenharia, não apenas escrever uma query."
      }
    ],
    "scenarioIds": [
      "sc29",
      "sc31",
      "sc30"
    ]
  },
  {
    "id": 9,
    "title": "Antivírus e EDR #2",
    "lessons": [
      96,
      100
    ],
    "track": "Antivírus/EDR",
    "crosswordPool": [
      {
        "id": "e06",
        "answer": "TELEMETRY",
        "clue": "Eventos coletados do endpoint."
      },
      {
        "id": "e07",
        "answer": "PROCESS",
        "clue": "Instância em execução de um programa."
      },
      {
        "id": "e08",
        "answer": "QUARANTINE",
        "clue": "Isolamento de conteúdo suspeito."
      },
      {
        "id": "e09",
        "answer": "DETECTION",
        "clue": "Lógica que transforma sinais em alerta."
      },
      {
        "id": "e10",
        "answer": "FALSEPOSITIVE",
        "clue": "Alerta que corresponde a atividade legítima."
      },
      {
        "id": "e11",
        "answer": "FALSENEGATIVE",
        "clue": "Ameaça real que não foi detectada."
      },
      {
        "id": "e12",
        "answer": "PREVALENCE",
        "clue": "Frequência de um arquivo no ambiente/base."
      },
      {
        "id": "e13",
        "answer": "BEHAVIOR",
        "clue": "Conjunto de ações observadas em execução."
      },
      {
        "id": "e14",
        "answer": "ANCESTRY",
        "clue": "Cadeia de processos predecessores."
      },
      {
        "id": "e15",
        "answer": "COMMANDLINE",
        "clue": "Argumentos usados na execução de um processo."
      },
      {
        "id": "e16",
        "answer": "ASLR",
        "clue": "Randomização de endereços de memória."
      },
      {
        "id": "e17",
        "answer": "DEP",
        "clue": "Proteção contra execução em regiões de dados."
      },
      {
        "id": "e18",
        "answer": "SENSOR",
        "clue": "Agente que coleta telemetria do endpoint."
      },
      {
        "id": "e19",
        "answer": "PRECISION",
        "clue": "Proporção de alertas realmente relevantes."
      },
      {
        "id": "e20",
        "answer": "RECALL",
        "clue": "Proporção de casos relevantes capturados pela detecção."
      },
      {
        "id": "e01",
        "answer": "SIGNATURE",
        "clue": "Padrão conhecido usado em detecção tradicional."
      },
      {
        "id": "e02",
        "answer": "HASH",
        "clue": "Resumo determinístico do conteúdo."
      },
      {
        "id": "e03",
        "answer": "REPUTATION",
        "clue": "Avaliação baseada em histórico e prevalência."
      },
      {
        "id": "e04",
        "answer": "HEURISTIC",
        "clue": "Detecção por características suspeitas."
      },
      {
        "id": "e05",
        "answer": "SANDBOX",
        "clue": "Ambiente controlado para observar execução."
      }
    ],
    "matchingPool": [
      {
        "id": "em04",
        "left": "EDR",
        "right": "Telemetria + detecção + resposta",
        "explanation": "Vai além de classificar apenas arquivos."
      },
      {
        "id": "em05",
        "left": "Quarantine",
        "right": "Isolamento de arquivo",
        "explanation": "Impede uso enquanto preserva objeto para análise."
      },
      {
        "id": "em06",
        "left": "Hash",
        "right": "Identificador do conteúdo",
        "explanation": "Útil para comparação exata e reputação."
      },
      {
        "id": "em07",
        "left": "Process tree",
        "right": "Relação causal de processos",
        "explanation": "Mostra parent, child e ancestry."
      },
      {
        "id": "em08",
        "left": "ASLR",
        "right": "Randomização de memória",
        "explanation": "Mitigação contra previsibilidade de endereços."
      },
      {
        "id": "em09",
        "left": "False positive",
        "right": "Alerta sobre atividade legítima",
        "explanation": "Gera ruído e exige tuning."
      },
      {
        "id": "em10",
        "left": "False negative",
        "right": "Ameaça não detectada",
        "explanation": "Representa lacuna de cobertura."
      },
      {
        "id": "em01",
        "left": "Signature",
        "right": "Padrão conhecido",
        "explanation": "Rápido para ameaças previamente catalogadas."
      },
      {
        "id": "em02",
        "left": "Heuristic",
        "right": "Características suspeitas",
        "explanation": "Generaliza além de uma amostra exata."
      },
      {
        "id": "em03",
        "left": "Sandbox",
        "right": "Execução isolada",
        "explanation": "Observa comportamento em ambiente controlado."
      }
    ],
    "orderingPool": [
      {
        "id": "o09",
        "title": "Detection Engineering",
        "steps": [
          "Definir hipótese de detecção",
          "Listar dados necessários",
          "Criar lógica/regra",
          "Gerar casos de teste",
          "Validar precisão e cobertura",
          "Ajustar falsos positivos",
          "Versionar e documentar",
          "Monitorar desempenho"
        ],
        "explanation": "Detecção é um ciclo de engenharia, não apenas escrever uma query."
      },
      {
        "id": "o02",
        "title": "Análise defensiva de malware",
        "steps": [
          "Calcular hash",
          "Identificar tipo de arquivo",
          "Análise estática",
          "Executar em sandbox controlada",
          "Observar processos/registro/rede",
          "Extrair IOCs",
          "Criar regra YARA/Sigma",
          "Validar detecção",
          "Documentar"
        ],
        "explanation": "Comece com coleta de baixo risco e só depois execute em ambiente isolado."
      }
    ],
    "scenarioIds": [
      "sc30",
      "sc32",
      "sc31",
      "sc29"
    ]
  }
];
