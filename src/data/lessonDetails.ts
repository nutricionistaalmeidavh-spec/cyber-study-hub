export type LessonDetail = {
  why: string;
  flow: string[];
  codeTitle: string;
  language: string;
  code: string;
  codeNote: string;
  labTitle: string;
  labMode: 'Celular' | 'PC' | 'Celular + PC';
  labSteps: string[];
  expected: string;
};

export const lessonDetails: Record<number, LessonDetail> = {
  "43": {
    "why": "O ponto crítico do GraphQL não é o endpoint único em si, mas o fato de cada resolver poder acessar objetos e operações diferentes. Autenticar o usuário uma vez não substitui autorizar cada objeto solicitado.",
    "flow": [
      "Cliente envia uma query ao endpoint /graphql",
      "O parser valida a estrutura da operação",
      "Resolvers executam buscas/mutações campo a campo",
      "A autorização precisa ser aplicada no resolver ou camada de domínio",
      "Limites de profundidade e custo evitam consultas abusivas"
    ],
    "codeTitle": "Resolver com autorização por objeto",
    "language": "ts",
    "code": "const userResolver = async (_: unknown, { id }: { id: string }, ctx: Context) => {\n  if (!ctx.user) throw new Error(\"Unauthenticated\");\n\n  const target = await db.user.findUnique({ where: { id } });\n  if (!target) return null;\n\n  if (target.id !== ctx.user.id && !ctx.user.roles.includes(\"admin\")) {\n    throw new Error(\"Forbidden\");\n  }\n\n  return target;\n};",
    "codeNote": "O exemplo mostra a decisão no objeto retornado, não apenas no fato de existir uma sessão.",
    "labTitle": "Inspecionar um schema GraphQL local",
    "labMode": "Celular + PC",
    "labSteps": [
      "No celular, revise query, mutation, resolver e introspection nesta aula.",
      "No PC, abra um projeto GraphQL local ou um laboratório autorizado.",
      "Faça duas operações válidas com usuários distintos e observe quais resolvers são executados.",
      "Confirme que trocar um identificador não permite acessar objeto de outro usuário.",
      "Registre a resposta esperada: sucesso para o próprio objeto e erro de autorização para outro."
    ],
    "expected": "Você deve conseguir explicar onde autenticação termina e onde autorização por objeto começa."
  },
  "44": {
    "why": "Uma conexão WebSocket pode continuar viva por muito tempo. Isso cria um risco diferente do HTTP tradicional: permissões, sessão e contexto precisam continuar válidos depois do handshake.",
    "flow": [
      "HTTP inicia o handshake",
      "Servidor responde 101 Switching Protocols",
      "Canal persistente é estabelecido",
      "Mensagens passam sem novo request HTTP completo",
      "Cada ação sensível deve revalidar autorização e sessão"
    ],
    "codeTitle": "Autorização por mensagem em WebSocket",
    "language": "ts",
    "code": "socket.on(\"message\", async raw => {\n  const msg = JSON.parse(raw.toString());\n  const session = await sessions.get(socket.sessionId);\n\n  if (!session?.active) {\n    socket.close(4001, \"Session expired\");\n    return;\n  }\n\n  if (!can(session.user, msg.action, msg.resourceId)) {\n    socket.send(JSON.stringify({ error: \"forbidden\" }));\n    return;\n  }\n\n  await handle(msg, session.user);\n});",
    "codeNote": "O handshake não vira um passe permanente. A operação continua sendo autorizada.",
    "labTitle": "Observar ciclo de vida de uma conexão",
    "labMode": "Celular + PC",
    "labSteps": [
      "No celular, memorize handshake, canal persistente e revalidação.",
      "No PC, abra DevTools > Network > WS em uma aplicação local.",
      "Observe o handshake e as mensagens enviadas.",
      "Expire a sessão local e verifique se o socket é encerrado ou rejeita novas ações.",
      "Anote quais eventos seriam úteis em logs: conexão, usuário, ação e encerramento."
    ],
    "expected": "A conexão não deve manter privilégios depois que a sessão correspondente deixa de ser válida."
  },
  "45": {
    "why": "Request smuggling nasce quando dois componentes discordam sobre onde uma requisição termina e a próxima começa. O estudo mais importante aqui é entender a cadeia de parsing, não decorar payloads.",
    "flow": [
      "Cliente envia HTTP",
      "Proxy/frontend interpreta os delimitadores",
      "Backend interpreta novamente a mensagem",
      "Uma divergência de parsing desalinha a fila",
      "Respostas ou requisições podem ser associadas ao contexto errado"
    ],
    "codeTitle": "Normalização defensiva antes do backend",
    "language": "js",
    "code": "function validateFraming(headers) {\n  const hasCL = headers[\"content-length\"] !== undefined;\n  const hasTE = headers[\"transfer-encoding\"] !== undefined;\n\n  if (hasCL && hasTE) {\n    throw new Error(\"Ambiguous HTTP message framing\");\n  }\n\n  if (hasTE && headers[\"transfer-encoding\"] !== \"chunked\") {\n    throw new Error(\"Unsupported transfer encoding\");\n  }\n}",
    "codeNote": "A defesa reduz ambiguidades entre camadas em vez de tentar adivinhar qual parser está certo.",
    "labTitle": "Comparar parsing sem payload ofensivo",
    "labMode": "PC",
    "labSteps": [
      "Monte dois pequenos parsers locais ou use logs de proxy/backend.",
      "Envie requests HTTP normais com Content-Length e, separadamente, Transfer-Encoding.",
      "Compare o que cada camada registra como início/fim da mensagem.",
      "Configure o frontend para rejeitar combinações ambíguas.",
      "Valide que respostas e request IDs permanecem alinhados."
    ],
    "expected": "Você deve enxergar o problema como uma divergência de framing entre componentes."
  },
  "46": {
    "why": "Cache poisoning ocorre quando uma entrada controlável altera a resposta, mas essa entrada não participa corretamente da cache key. O erro passa a ser compartilhado com outros usuários.",
    "flow": [
      "Request chega com entrada variável",
      "Backend usa essa entrada para montar a resposta",
      "Cache calcula uma chave incompleta",
      "Resposta alterada é armazenada",
      "Novos usuários recebem a mesma resposta cacheada"
    ],
    "codeTitle": "Cache key incluindo dimensões relevantes",
    "language": "ts",
    "code": "function cacheKey(req: RequestLike) {\n  const url = new URL(req.url);\n  const language = req.headers[\"accept-language\"] ?? \"default\";\n\n  return [\n    req.method,\n    url.host,\n    url.pathname,\n    url.search,\n    language\n  ].join(\"|\");\n}",
    "codeNote": "A cache key precisa refletir tudo que muda materialmente o conteúdo compartilhado.",
    "labTitle": "Inspecionar HIT, MISS e Vary",
    "labMode": "Celular + PC",
    "labSteps": [
      "No celular, revise cache key, unkeyed input e resposta compartilhada.",
      "No PC, use uma aplicação local com reverse proxy/cache ou um laboratório autorizado.",
      "Faça a primeira requisição e observe MISS; repita e observe HIT.",
      "Altere um cabeçalho que deveria variar o conteúdo e confira se Vary/cache key consideram isso.",
      "Limpe o cache após o teste."
    ],
    "expected": "Entradas que mudam a representação não devem contaminar uma resposta compartilhada."
  },
  "47": {
    "why": "Cache deception é diferente de poisoning: aqui o objetivo defensivo é impedir que conteúdo privado seja armazenado como se fosse um recurso público ou estático.",
    "flow": [
      "Usuário autenticado acessa conteúdo privado",
      "Uma URL ou regra de rota faz o cache considerar a resposta estática",
      "O cache armazena a resposta privada",
      "Outro request encontra a entrada cacheada",
      "Dados sensíveis podem ser expostos"
    ],
    "codeTitle": "Política simples de cacheabilidade",
    "language": "ts",
    "code": "function canCache(req: RequestLike, res: ResponseLike) {\n  if (req.user) return false;\n  if (res.headers[\"set-cookie\"]) return false;\n  if (res.headers[\"cache-control\"]?.includes(\"private\")) return false;\n\n  return /^\\/assets\\//.test(new URL(req.url).pathname);\n}",
    "codeNote": "Conteúdo autenticado deve ser privado por padrão. Extensão de arquivo não é prova de que uma rota é pública.",
    "labTitle": "Classificar respostas públicas e privadas",
    "labMode": "Celular + PC",
    "labSteps": [
      "Liste cinco rotas fictícias: perfil, dashboard, CSS, avatar público e API autenticada.",
      "Classifique quais poderiam ser cacheadas por um CDN compartilhado.",
      "No PC, verifique Cache-Control em uma aplicação local.",
      "Confirme que respostas autenticadas usam private/no-store quando apropriado.",
      "Teste novamente sem autenticação."
    ],
    "expected": "Você deve separar claramente cache de assets públicos e cache de respostas personalizadas."
  },
  "48": {
    "why": "Prototype pollution explora a forma como objetos JavaScript herdam propriedades. O risco aparece quando dados externos são mesclados sem bloquear chaves especiais.",
    "flow": [
      "Entrada externa vira objeto",
      "Função de merge percorre chaves recursivamente",
      "Chaves especiais alcançam prototype",
      "Novos objetos herdam valores inesperados",
      "A lógica da aplicação pode mudar sem alteração explícita do objeto"
    ],
    "codeTitle": "Merge defensivo",
    "language": "ts",
    "code": "const BLOCKED = new Set([\"__proto__\", \"prototype\", \"constructor\"]);\n\nfunction safeAssign(target: Record<string, unknown>, source: Record<string, unknown>) {\n  for (const [key, value] of Object.entries(source)) {\n    if (BLOCKED.has(key)) continue;\n    target[key] = value;\n  }\n  return target;\n}",
    "codeNote": "Além do bloqueio, prefira bibliotecas atualizadas e objetos com esquema validado.",
    "labTitle": "Ver herança sem explorar aplicações reais",
    "labMode": "Celular + PC",
    "labSteps": [
      "No console local, crie objetos simples e observe Object.getPrototypeOf().",
      "Compare atribuição direta com uma função de merge própria.",
      "Adicione validação de chaves e execute testes unitários com nomes bloqueados.",
      "Confirme que um objeto novo não recebe propriedades inesperadas.",
      "Documente por que validação de schema ajuda."
    ],
    "expected": "A propriedade de um objeto deve vir do próprio objeto/esquema, não de uma alteração indevida na cadeia de prototype."
  },
  "49": {
    "why": "Aplicações frequentemente usam Host para construir links, redirects ou decisões de roteamento. Se esse valor for confiado sem validação, infraestrutura e lógica de negócio podem discordar sobre o host legítimo.",
    "flow": [
      "Cliente envia Host",
      "Proxy encaminha ou normaliza",
      "Aplicação usa o valor em URL/redirect",
      "Links ou decisões podem refletir host não confiável",
      "Allowlist e configuração canônica quebram essa dependência"
    ],
    "codeTitle": "Host canônico por allowlist",
    "language": "ts",
    "code": "const TRUSTED_HOSTS = new Set([\"app.exemplo.local\", \"localhost:5173\"]);\n\nfunction assertTrustedHost(host = \"\") {\n  const normalized = host.toLowerCase().trim();\n  if (!TRUSTED_HOSTS.has(normalized)) {\n    throw new Error(\"Invalid Host header\");\n  }\n  return normalized;\n}",
    "codeNote": "Para links externos importantes, uma origem configurada no servidor costuma ser mais segura que reconstruir a URL a partir do request.",
    "labTitle": "Comparar host recebido e host configurado",
    "labMode": "PC",
    "labSteps": [
      "Crie uma aplicação local que registre Host e URL canônica configurada.",
      "Faça requests locais com nomes válidos de desenvolvimento.",
      "Implemente uma allowlist explícita.",
      "Verifique que hosts não reconhecidos geram erro antes de redirects ou geração de links.",
      "Registre o host rejeitado para detecção."
    ],
    "expected": "A aplicação não deve decidir sua origem pública apenas com base em um cabeçalho fornecido pelo cliente."
  },
  "50": {
    "why": "Vulnerabilidades DOM-based acontecem no navegador quando uma fonte controlável chega a um sink perigoso. A resposta do servidor pode estar correta e, ainda assim, o JavaScript do cliente criar o problema.",
    "flow": [
      "Fonte: URL, hash, postMessage ou storage",
      "JavaScript lê o valor",
      "O valor percorre transformações",
      "Sink altera DOM, URL ou código",
      "API segura ou sanitização interrompe o fluxo"
    ],
    "codeTitle": "textContent em vez de innerHTML",
    "language": "js",
    "code": "const params = new URLSearchParams(location.search);\nconst name = params.get(\"name\") ?? \"\";\n\nconst output = document.querySelector(\"#welcome\");\nif (output) {\n  output.textContent = `Olá, ${name}`;\n}",
    "codeNote": "Quando a intenção é exibir texto, textContent evita interpretar marcação HTML.",
    "labTitle": "Rastrear fonte → transformação → sink",
    "labMode": "Celular + PC",
    "labSteps": [
      "No celular, identifique exemplos de source e sink.",
      "No PC, crie uma página local que leia um parâmetro da URL.",
      "Renderize primeiro com textContent.",
      "Use DevTools para acompanhar o valor no código.",
      "Liste quais sinks do projeto merecem revisão: innerHTML, insertAdjacentHTML, eval e URLs dinâmicas."
    ],
    "expected": "Você deve conseguir desenhar o caminho de um dado controlável até o DOM e escolher uma API mais segura."
  },
  "51": {
    "why": "Command injection aparece quando texto do usuário é concatenado em uma string interpretada por um shell. A defesa mais forte é não passar pelo shell quando a tarefa pode ser feita por uma API específica.",
    "flow": [
      "Aplicação recebe uma entrada",
      "Código monta um comando de sistema",
      "Shell interpreta metacaracteres e argumentos",
      "Processo filho executa com os privilégios da aplicação",
      "APIs sem shell e allowlists reduzem o risco"
    ],
    "codeTitle": "execFile com argumentos separados",
    "language": "js",
    "code": "import { execFile } from \"node:child_process\";\n\nconst allowed = new Set([\"example.com\", \"localhost\"]);\n\nfunction pingHost(host) {\n  if (!allowed.has(host)) throw new Error(\"Host não permitido\");\n\n  execFile(\"ping\", [\"-c\", \"1\", host], { timeout: 3000 }, (err, stdout) => {\n    if (err) return;\n    console.log(stdout);\n  });\n}",
    "codeNote": "Não concatene a entrada em uma string de shell. Mesmo assim, valide o conjunto de valores aceitos.",
    "labTitle": "Refatorar uma chamada de processo local",
    "labMode": "PC",
    "labSteps": [
      "Crie uma função local que executa uma ferramenta inofensiva com argumentos fixos.",
      "Use execFile/spawn com array de argumentos.",
      "Adicione allowlist e timeout.",
      "Escreva testes para entrada válida e entrada fora da allowlist.",
      "Registre tentativa rejeitada sem executar o comando."
    ],
    "expected": "A entrada do usuário nunca deve virar sintaxe de shell."
  },
  "52": {
    "why": "Path traversal surge quando um caminho recebido do usuário consegue escapar do diretório pretendido. Normalização e verificação do diretório raiz precisam ocorrer antes da leitura.",
    "flow": [
      "Aplicação recebe caminho relativo",
      "Caminho é combinado com diretório base",
      "Normalização resolve segmentos especiais",
      "Aplicação verifica se o resultado continua dentro da raiz",
      "Somente então o arquivo é aberto"
    ],
    "codeTitle": "Restringir leitura ao diretório permitido",
    "language": "js",
    "code": "import path from \"node:path\";\n\nconst ROOT = path.resolve(\"./public-files\");\n\nfunction safePath(input) {\n  const candidate = path.resolve(ROOT, input);\n  if (!candidate.startsWith(ROOT + path.sep)) {\n    throw new Error(\"Path fora da raiz permitida\");\n  }\n  return candidate;\n}",
    "codeNote": "A checagem deve ocorrer no caminho já normalizado/canônico.",
    "labTitle": "Testar sandbox de arquivos local",
    "labMode": "PC",
    "labSteps": [
      "Crie uma pasta public-files com dois arquivos de teste.",
      "Implemente safePath e leia apenas arquivos dessa pasta.",
      "Teste nomes normais, subpastas permitidas e caminhos que sairiam da raiz.",
      "Confirme que a função rejeita antes de acessar o sistema de arquivos.",
      "Inclua testes automatizados."
    ],
    "expected": "Todo caminho aceito termina dentro da raiz previamente definida."
  },
  "53": {
    "why": "Upload seguro exige validar mais que extensão: tipo real, tamanho, nome, destino, permissões e forma como o arquivo será servido depois do armazenamento.",
    "flow": [
      "Cliente envia arquivo",
      "Servidor limita tamanho e quantidade",
      "Conteúdo e extensão são validados",
      "Nome é substituído por identificador seguro",
      "Arquivo vai para storage não executável",
      "Download usa Content-Type/Content-Disposition adequados"
    ],
    "codeTitle": "Metadados controlados no upload",
    "language": "ts",
    "code": "const ALLOWED = new Set([\"image/png\", \"image/jpeg\"]);\n\nfunction validateUpload(file: { size: number; mimetype: string }) {\n  if (file.size > 5 * 1024 * 1024) throw new Error(\"Arquivo muito grande\");\n  if (!ALLOWED.has(file.mimetype)) throw new Error(\"Tipo não permitido\");\n\n  return crypto.randomUUID();\n}",
    "codeNote": "Em produção, valide assinatura/magic bytes e mantenha o storage fora de diretórios executáveis.",
    "labTitle": "Pipeline de upload seguro",
    "labMode": "PC",
    "labSteps": [
      "Monte um endpoint local que aceite apenas PNG/JPEG pequenos.",
      "Troque o nome original por UUID.",
      "Armazene fora da pasta de código.",
      "Sirva o arquivo com cabeçalhos de conteúdo explícitos.",
      "Teste tamanho excedido e MIME não permitido."
    ],
    "expected": "O nome e a extensão fornecidos pelo usuário não controlam onde ou como o servidor executa o arquivo."
  },
  "54": {
    "why": "JWT é um formato de token assinado, não uma sessão mágica. Segurança depende de validação de assinatura, algoritmo, issuer, audience, expiração e estratégia de revogação.",
    "flow": [
      "Servidor emite claims",
      "Token é assinado",
      "Cliente apresenta o token",
      "Servidor valida assinatura e claims",
      "Autorização usa claims confiáveis, não dados não verificados"
    ],
    "codeTitle": "Validação explícita de claims",
    "language": "ts",
    "code": "const payload = await jwtVerify(token, publicKey, {\n  algorithms: [\"RS256\"],\n  issuer: \"https://auth.exemplo.local\",\n  audience: \"cyber-study-api\"\n});\n\nif (!payload.payload.sub) {\n  throw new Error(\"Token sem subject\");\n}",
    "codeNote": "Fixar algoritmo, issuer e audience reduz ambiguidades na validação.",
    "labTitle": "Decodificar não é validar",
    "labMode": "Celular + PC",
    "labSteps": [
      "No celular, identifique header, payload e signature.",
      "Use um token de laboratório/local e apenas decodifique o payload.",
      "Depois valide assinatura e claims com uma biblioteca.",
      "Altere um claim no token de teste e confirme que a validação falha.",
      "Anote diferença entre expiração e revogação."
    ],
    "expected": "Você deve explicar por que ler o payload não prova autenticidade."
  },
  "55": {
    "why": "OAuth delega autorização; OIDC adiciona identidade. Os erros mais comuns surgem em redirect URI, state, PKCE, armazenamento de tokens e confusão entre access token e ID token.",
    "flow": [
      "Cliente inicia autorização",
      "Authorization Server autentica usuário",
      "State/nonce vinculam a resposta à sessão",
      "PKCE protege troca do código",
      "Cliente recebe tokens com finalidade definida",
      "API valida access token; cliente valida ID token quando aplicável"
    ],
    "codeTitle": "Gerar challenge PKCE",
    "language": "js",
    "code": "const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));\nconst digest = await crypto.subtle.digest(\n  \"SHA-256\",\n  new TextEncoder().encode(verifier)\n);\nconst challenge = base64url(new Uint8Array(digest));\n\n// Salve verifier apenas para a troca do authorization code.\n",
    "codeNote": "PKCE reduz o valor de um authorization code interceptado sem o verifier correspondente.",
    "labTitle": "Desenhar um fluxo Authorization Code + PKCE",
    "labMode": "Celular",
    "labSteps": [
      "Desenhe cliente, Authorization Server e API.",
      "Marque onde entram state, nonce, code_challenge e code_verifier.",
      "Diferencie ID token de access token.",
      "Liste quais URLs de redirect seriam permitidas.",
      "Explique onde tokens não deveriam ser gravados."
    ],
    "expected": "Você deve conseguir narrar o fluxo sem confundir autenticação com autorização."
  },
  "56": {
    "why": "BOLA, BFLA e Mass Assignment são falhas de autorização em camadas diferentes: objeto, função e campos alteráveis. Uma API segura precisa controlar as três.",
    "flow": [
      "Request autenticado chega à API",
      "Rota define qual função pode ser usada",
      "Objeto solicitado é checado contra o usuário",
      "Campos recebidos são filtrados por esquema/allowlist",
      "Camada de domínio persiste somente alterações autorizadas"
    ],
    "codeTitle": "Ownership + allowlist de campos",
    "language": "ts",
    "code": "const allowedFields = [\"displayName\", \"timezone\"] as const;\n\nasync function updateProfile(userId: string, targetId: string, body: any) {\n  if (userId !== targetId) throw new Error(\"Forbidden\");\n\n  const patch = Object.fromEntries(\n    allowedFields.filter(k => k in body).map(k => [k, body[k]])\n  );\n\n  return db.user.update({ where: { id: targetId }, data: patch });\n}",
    "codeNote": "Autorização do objeto e controle de campos são decisões distintas.",
    "labTitle": "Matriz de autorização de uma API fictícia",
    "labMode": "Celular + PC",
    "labSteps": [
      "Crie três perfis: usuário, gerente e admin.",
      "Liste rotas e operações possíveis para cada perfil.",
      "Para cada rota, marque objeto permitido e campos alteráveis.",
      "No PC, escreva testes que tentam acessar objeto alheio ou campo privilegiado.",
      "Confirme retorno 403/404 conforme a política."
    ],
    "expected": "Cada endpoint deve responder a: quem pode executar, em qual objeto e quais campos pode alterar."
  },
  "57": {
    "why": "Rate limit reduz abuso repetitivo, mas race conditions e falhas de lógica podem acontecer dentro de requisições perfeitamente válidas. Operações críticas precisam ser atômicas e invariantes de negócio precisam ser testadas.",
    "flow": [
      "Usuário dispara operação de negócio",
      "Sistema valida pré-condições",
      "Mudança acontece em transação/controle de concorrência",
      "Invariante é revalidada no momento da escrita",
      "Rate limit e idempotência reduzem abuso/repetição"
    ],
    "codeTitle": "Operação atômica com condição",
    "language": "sql",
    "code": "UPDATE coupons\nSET remaining = remaining - 1\nWHERE id = :id\n  AND remaining > 0;\n\n-- Verifique rows_affected = 1 antes de confirmar a operação.\n",
    "codeNote": "A condição participa da própria escrita, evitando a janela entre 'ler' e 'atualizar'.",
    "labTitle": "Simular concorrência local",
    "labMode": "PC",
    "labSteps": [
      "Crie um contador/estoque simples em banco local.",
      "Implemente primeiro leitura + escrita separadas e observe o risco conceitualmente.",
      "Troque por update condicional ou transação.",
      "Dispare várias operações de teste em paralelo.",
      "Confirme que o valor nunca viola a invariante."
    ],
    "expected": "O sistema deve continuar correto mesmo quando duas requisições válidas chegam quase ao mesmo tempo."
  },
  "58": {
    "why": "Same-Origin Policy é a regra do navegador; CORS é um mecanismo controlado pelo servidor para relaxar parte dessa regra. CORS não substitui autenticação nem autorização.",
    "flow": [
      "Página possui uma origin",
      "JavaScript tenta acessar outra origin",
      "Navegador aplica SOP",
      "Servidor pode responder com política CORS",
      "Browser decide se expõe a resposta ao script"
    ],
    "codeTitle": "Allowlist CORS explícita",
    "language": "ts",
    "code": "const origins = new Set([\"https://app.exemplo.com\"]);\n\nfunction corsOrigin(origin?: string) {\n  if (!origin) return false;\n  if (!origins.has(origin)) throw new Error(\"Origin não permitida\");\n  return origin;\n}",
    "codeNote": "Evite refletir qualquer Origin automaticamente, especialmente com credenciais.",
    "labTitle": "Comparar same-origin e cross-origin",
    "labMode": "PC",
    "labSteps": [
      "Suba duas aplicações locais em portas diferentes.",
      "Faça uma requisição fetch entre elas.",
      "Observe o erro do navegador sem CORS.",
      "Adicione allowlist para uma origem específica.",
      "Confira headers de preflight e resposta."
    ],
    "expected": "Você deve distinguir 'servidor respondeu' de 'navegador permitiu o JavaScript ler a resposta'."
  },
  "59": {
    "why": "Security headers reduzem classes inteiras de risco no navegador. CSP é especialmente valiosa porque limita de onde scripts, estilos e outros recursos podem ser carregados.",
    "flow": [
      "Servidor entrega documento",
      "Headers definem políticas do navegador",
      "Browser aplica CSP, frame-ancestors e outras proteções",
      "Violações podem ser bloqueadas e reportadas",
      "Política é refinada com telemetria"
    ],
    "codeTitle": "Conjunto inicial de headers",
    "language": "http",
    "code": "Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'\nX-Content-Type-Options: nosniff\nReferrer-Policy: strict-origin-when-cross-origin\nPermissions-Policy: camera=(), microphone=()\n",
    "codeNote": "CSP deve ser adaptada à aplicação; começar em Report-Only ajuda a medir impacto antes de bloquear.",
    "labTitle": "Auditar headers no navegador",
    "labMode": "Celular + PC",
    "labSteps": [
      "Abra DevTools > Network em uma aplicação local.",
      "Selecione o documento principal e leia Response Headers.",
      "Liste headers ausentes.",
      "Adicione uma CSP simples em modo Report-Only.",
      "Observe violações e ajuste sem liberar origens desnecessárias."
    ],
    "expected": "A política do navegador deve ser explícita e verificável nos headers da resposta."
  },
  "60": {
    "why": "Falhas raramente vivem isoladas. Encadear vulnerabilidades significa entender como uma fraqueza aumenta o impacto ou a alcançabilidade de outra; defensivamente, isso orienta priorização.",
    "flow": [
      "Fraqueza inicial oferece uma capacidade limitada",
      "Essa capacidade expõe nova superfície ou contexto",
      "Uma segunda falha amplia privilégios/impacto",
      "Controles intermediários podem quebrar a cadeia",
      "Correção prioriza o caminho de maior risco"
    ],
    "codeTitle": "Representar uma cadeia de risco",
    "language": "json",
    "code": "{\n  \"steps\": [\n    {\"id\": \"A\", \"capability\": \"leitura de objeto\", \"control\": \"autorização por objeto\"},\n    {\"id\": \"B\", \"capability\": \"dados sensíveis\", \"control\": \"minimização de dados\"},\n    {\"id\": \"C\", \"capability\": \"ação privilegiada\", \"control\": \"BFLA\"}\n  ]\n}",
    "codeNote": "Modelar capacidades e controles ajuda a discutir impacto sem depender de um payload ofensivo.",
    "labTitle": "Threat chain em aplicação própria",
    "labMode": "Celular",
    "labSteps": [
      "Escolha uma aplicação sua ou fictícia.",
      "Liste três superfícies: autenticação, API e frontend.",
      "Imagine uma falha de baixo impacto em cada uma.",
      "Desenhe quais combinações poderiam aumentar o impacto.",
      "Adicione um controle entre cada etapa para quebrar a cadeia."
    ],
    "expected": "Você deve priorizar falhas considerando combinação, exposição e controles compensatórios."
  },
  "61": {
    "why": "Enumeração Linux é a coleta estruturada de contexto do host: usuário, kernel, serviços, rede, permissões e software. Em auditoria defensiva, o objetivo é comparar estado real com o esperado.",
    "flow": [
      "Identificar usuário e grupos",
      "Coletar versão do sistema/kernel",
      "Listar serviços e portas",
      "Revisar permissões/capabilities relevantes",
      "Comparar achados com baseline"
    ],
    "codeTitle": "Checklist de enumeração somente leitura",
    "language": "sh",
    "code": "id\nuname -a\ncat /etc/os-release\nss -lntup\nps aux --sort=-%cpu | head\nfind /etc -maxdepth 2 -type f -perm -0002 2>/dev/null | head\n",
    "codeNote": "Execute apenas em máquinas próprias/laboratórios. O objetivo aqui é inventário e baseline.",
    "labTitle": "Baseline de uma VM Linux",
    "labMode": "PC",
    "labSteps": [
      "Use WSL/VM própria.",
      "Execute o checklist de leitura.",
      "Salve saída em um arquivo de evidências.",
      "Marque itens esperados e inesperados.",
      "Repita após instalar/remover um serviço e compare."
    ],
    "expected": "Você deve produzir um inventário curto do host e justificar quais itens merecem investigação."
  },
  "62": {
    "why": "Enumeração Windows segue a mesma lógica de baseline: identidade, versão, privilégios, serviços, tarefas e conexões. PowerShell facilita transformar o inventário em dados estruturados.",
    "flow": [
      "Identidade e grupos",
      "Sistema e patches",
      "Serviços/processos",
      "Rede e tarefas agendadas",
      "Permissões e eventos relevantes"
    ],
    "codeTitle": "Inventário Windows read-only",
    "language": "powershell",
    "code": "whoami /all\nGet-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, OsBuildNumber\nGet-NetTCPConnection -State Listen\nGet-Service | Where-Object Status -eq 'Running'\nGet-ScheduledTask | Select-Object TaskName, State | Select-Object -First 20\n",
    "codeNote": "Colete contexto primeiro; não altere serviços durante a fase de enumeração.",
    "labTitle": "Snapshot de um Windows de laboratório",
    "labMode": "PC",
    "labSteps": [
      "Abra PowerShell em uma VM própria.",
      "Colete identidade, versão, listeners e serviços.",
      "Exporte os resultados para CSV ou texto.",
      "Escolha três itens e explique por que são esperados.",
      "Crie uma segunda coleta após uma mudança controlada."
    ],
    "expected": "Você deve diferenciar descoberta de estado de qualquer ação de exploração."
  },
  "63": {
    "why": "Privilege escalation Linux, do ponto de vista defensivo, começa identificando caminhos de privilégio excessivo: sudo, SUID, capabilities, serviços e arquivos graváveis. O aprendizado é reconhecer condições, não automatizar exploração.",
    "flow": [
      "Usuário atual e grupos",
      "Regras sudo",
      "Binários com SUID/capabilities",
      "Serviços e arquivos graváveis",
      "Correção: mínimo privilégio e ownership correto"
    ],
    "codeTitle": "Auditoria de caminhos de privilégio",
    "language": "sh",
    "code": "id\nsudo -l\nfind / -perm -4000 -type f 2>/dev/null\ngetcap -r / 2>/dev/null\nfind /etc /usr/local -type f -writable 2>/dev/null | head -50\n",
    "codeNote": "Use somente para auditar seu próprio laboratório e investigar configurações inesperadas.",
    "labTitle": "Hardening de permissões em VM",
    "labMode": "PC",
    "labSteps": [
      "Colete sudo -l e lista de SUID/capabilities em VM própria.",
      "Escolha um item intencionalmente configurado no laboratório.",
      "Explique qual privilégio ele concede e por quê.",
      "Corrija ownership/permissão ou remova capacidade desnecessária.",
      "Repita a coleta para comprovar a correção."
    ],
    "expected": "O resultado final deve demonstrar redução de caminhos de privilégio, não obtenção de acesso não autorizado."
  },
  "64": {
    "why": "No Windows, privilégios podem emergir de tokens, serviços, tarefas, ACLs e configurações. A análise defensiva procura permissões excessivas e contas de serviço mal dimensionadas.",
    "flow": [
      "Revisar token e privilégios",
      "Inventariar serviços",
      "Inspecionar tarefas agendadas",
      "Auditar ACLs relevantes",
      "Reduzir privilégios e validar novamente"
    ],
    "codeTitle": "Coleta defensiva de privilégios",
    "language": "powershell",
    "code": "whoami /priv\nGet-CimInstance Win32_Service |\n  Select-Object Name, StartName, State, PathName\nGet-ScheduledTask |\n  Select-Object TaskName, TaskPath, State\n",
    "codeNote": "O inventário ajuda a encontrar serviços executando com contas mais privilegiadas que o necessário.",
    "labTitle": "Auditar um serviço de laboratório",
    "labMode": "PC",
    "labSteps": [
      "Escolha uma VM Windows própria.",
      "Liste serviços e contas usadas.",
      "Selecione um serviço de teste.",
      "Leia ACLs da pasta/binário do serviço sem modificá-las.",
      "Documente como ficaria uma configuração de mínimo privilégio."
    ],
    "expected": "Você deve relacionar identidade do serviço, permissões no binário e impacto potencial."
  },
  "65": {
    "why": "Muitos incidentes começam em configurações simples: serviços desnecessários, arquivos graváveis, credenciais expostas ou permissões amplas. Segurança operacional depende de baseline e revisão contínua.",
    "flow": [
      "Inventário do serviço",
      "Identidade que executa",
      "Porta/interface exposta",
      "Arquivos/configs acessíveis",
      "Hardening e validação"
    ],
    "codeTitle": "Permissões mínimas em arquivo sensível",
    "language": "sh",
    "code": "# exemplo local\nchown root:app /etc/myapp/config.ini\nchmod 640 /etc/myapp/config.ini\n\n# verificar\nstat /etc/myapp/config.ini\n",
    "codeNote": "A permissão correta depende da necessidade real do processo; não copie números sem entender owner/group.",
    "labTitle": "Revisão de configuração",
    "labMode": "PC",
    "labSteps": [
      "Escolha um serviço local de teste.",
      "Registre porta, usuário e arquivos de configuração.",
      "Verifique se há escrita para usuários/grupos não necessários.",
      "Ajuste em um ambiente de laboratório.",
      "Reinicie e confirme que o serviço ainda funciona."
    ],
    "expected": "Hardening não deve apenas bloquear; deve preservar a função com o menor privilégio necessário."
  },
  "66": {
    "why": "Nmap avançado não significa escanear 'mais agressivamente'; significa escolher técnica e portas conforme a hipótese. Em laboratório, service fingerprinting ajuda a validar inventário de exposição.",
    "flow": [
      "Definir alvo autorizado",
      "Escolher portas/protocolo",
      "Descobrir serviço",
      "Comparar banner/fingerprint com inventário",
      "Investigar divergências"
    ],
    "codeTitle": "Fingerprinting em localhost",
    "language": "sh",
    "code": "# exemplo seguro para serviços locais conhecidos\nnmap -sV -p 3000,4000,5173 127.0.0.1\n\n# salvar resultado\nnmap -sV -p 3000,4000,5173 127.0.0.1 -oN nmap-local.txt\n",
    "codeNote": "Restrinja os exemplos ao seu host/lab. O valor está em interpretar o serviço identificado.",
    "labTitle": "Comparar listener vs fingerprint",
    "labMode": "PC",
    "labSteps": [
      "Suba uma aplicação local em uma porta conhecida.",
      "Use ss/netstat para confirmar o listener.",
      "Rode Nmap apenas contra localhost e as portas escolhidas.",
      "Compare nome/versão sugeridos pelo fingerprint.",
      "Feche o serviço e confirme mudança."
    ],
    "expected": "Você deve conseguir explicar a diferença entre 'porta aberta' e 'serviço identificado'."
  },
  "67": {
    "why": "Scanners profissionais automatizam descoberta, mas resultado de scanner não é prova final de vulnerabilidade. Prioridade depende de contexto, exposição e validação.",
    "flow": [
      "Descoberta de ativos",
      "Templates/plugins verificam condições",
      "Achado recebe severidade/evidência",
      "Analista valida contexto",
      "Correção e reteste encerram o ciclo"
    ],
    "codeTitle": "Nuclei em serviço local de laboratório",
    "language": "sh",
    "code": "# somente em serviço que você controla\nnuclei -u http://127.0.0.1:3000 -severity info,low,medium\n\n# salve o resultado para revisão\nnuclei -u http://127.0.0.1:3000 -jsonl -o nuclei-local.jsonl\n",
    "codeNote": "Scanner é um sensor. Trate falso positivo, escopo e impacto antes de agir.",
    "labTitle": "Do achado ao reteste",
    "labMode": "PC",
    "labSteps": [
      "Use um serviço local deliberadamente simples.",
      "Execute um scanner autorizado.",
      "Escolha um achado informativo/baixo risco.",
      "Leia a evidência, sem assumir que o título está correto.",
      "Corrija a configuração e rode novamente."
    ],
    "expected": "O relatório final deve registrar achado, evidência, decisão e resultado do reteste."
  },
  "68": {
    "why": "CVE identifica vulnerabilidades publicadas; CWE classifica tipos de fraqueza; CVSS ajuda a estimar severidade técnica. Nenhum deles substitui contexto de negócio.",
    "flow": [
      "Produto/versão é identificado",
      "Advisory/CVE descreve condição",
      "CWE explica a classe da fraqueza",
      "CVSS quantifica características técnicas",
      "Risco interno combina exposição e impacto"
    ],
    "codeTitle": "Registro local de triagem",
    "language": "json",
    "code": "{\n  \"asset\": \"lab-api\",\n  \"version\": \"1.2.3\",\n  \"cve\": \"CVE-XXXX-YYYY\",\n  \"cwe\": \"CWE-XXX\",\n  \"cvss\": 7.5,\n  \"internet_exposed\": false,\n  \"decision\": \"patch in maintenance window\"\n}",
    "codeNote": "Use identificadores reais apenas depois de confirmar produto e versão afetados no advisory.",
    "labTitle": "Ler um advisory como analista",
    "labMode": "Celular",
    "labSteps": [
      "Escolha um advisory público de software que você usa em laboratório.",
      "Anote produto, versões afetadas e pré-condições.",
      "Identifique CVE, CWE e CVSS quando existirem.",
      "Compare com seu ativo real.",
      "Escreva uma decisão de prioridade em uma frase."
    ],
    "expected": "Você deve justificar prioridade com evidência do ativo, e não somente com o número CVSS."
  },
  "69": {
    "why": "Uma PoC segura deve responder uma hipótese mínima em ambiente isolado. O objetivo é confirmar condição e impacto sem transformar a validação em exploração desnecessária.",
    "flow": [
      "Definir hipótese",
      "Reproduzir versão/configuração em laboratório",
      "Executar teste mínimo",
      "Coletar evidência",
      "Restaurar ambiente e documentar"
    ],
    "codeTitle": "Esqueleto de teste de regressão local",
    "language": "python",
    "code": "import requests\n\nurl = \"http://127.0.0.1:3000/health\"\nr = requests.get(url, timeout=3)\n\nassert r.status_code == 200\nassert \"version\" in r.json()\nprint(\"Condição do laboratório registrada\")\n",
    "codeNote": "Transforme a validação em teste reproduzível e restrito ao ambiente autorizado.",
    "labTitle": "PoC como teste de hipótese",
    "labMode": "PC",
    "labSteps": [
      "Escolha uma falha já conhecida do seu laboratório.",
      "Escreva a hipótese em uma linha.",
      "Defina qual resposta/estado provaria a condição sem causar dano.",
      "Automatize apenas essa verificação.",
      "Após correção, rode o mesmo teste como regressão."
    ],
    "expected": "A mesma evidência que comprova a falha deve depois comprovar a correção."
  },
  "70": {
    "why": "Active Directory organiza identidades, computadores, grupos e políticas em um domínio. Antes de segurança ofensiva ou defensiva, é essencial entender objetos e relações de confiança.",
    "flow": [
      "Domínio define limite administrativo",
      "Domain Controllers mantêm diretório e autenticação",
      "Usuários/computadores são objetos",
      "Grupos agregam permissões",
      "GPO aplica configurações em escopo"
    ],
    "codeTitle": "Consultar domínio em laboratório",
    "language": "powershell",
    "code": "Import-Module ActiveDirectory\nGet-ADDomain\nGet-ADForest\nGet-ADDomainController -Filter *\n",
    "codeNote": "Comandos de leitura ajudam a montar o mapa lógico do laboratório AD.",
    "labTitle": "Desenhar o diretório",
    "labMode": "PC",
    "labSteps": [
      "Use um domínio de laboratório autorizado.",
      "Consulte domínio, floresta e DCs.",
      "Liste algumas OUs e grupos.",
      "Desenhe Domain → OU → usuários/computadores.",
      "Marque onde políticas e permissões são herdadas."
    ],
    "expected": "Você deve conseguir explicar onde um usuário, grupo, computador e GPO existem no modelo."
  },
  "71": {
    "why": "LDAP consulta o diretório; Kerberos autentica principalmente com tickets; NTLM é um protocolo legado ainda encontrado em ambientes Windows. Saber qual protocolo aparece em cada fluxo ajuda detecção e hardening.",
    "flow": [
      "Aplicação/usuário encontra serviço",
      "LDAP consulta objetos quando necessário",
      "Kerberos usa tickets para autenticação",
      "NTLM pode aparecer por compatibilidade/fallback",
      "Logs permitem distinguir os protocolos"
    ],
    "codeTitle": "Observação de tickets e diretório",
    "language": "powershell",
    "code": "klist\nGet-ADUser $env:USERNAME -Properties MemberOf |\n  Select-Object SamAccountName, MemberOf\n",
    "codeNote": "A coleta é somente leitura; compare tickets existentes com o contexto da sessão.",
    "labTitle": "Relacionar protocolo a evidência",
    "labMode": "PC",
    "labSteps": [
      "Em domínio de laboratório, execute klist após login.",
      "Identifique tickets presentes.",
      "Faça uma consulta LDAP/AD simples.",
      "Abra logs de autenticação e procure eventos do período.",
      "Classifique o que corresponde a diretório e o que corresponde a autenticação."
    ],
    "expected": "Você deve evitar tratar LDAP, Kerberos e NTLM como sinônimos."
  },
  "72": {
    "why": "Enumeração AD defensiva inventaria objetos e relações que realmente existem. O risco não está em listar objetos no seu laboratório, mas em não perceber permissões e grupos que ampliam acesso.",
    "flow": [
      "Listar usuários/computadores",
      "Mapear grupos e memberships",
      "Revisar OUs e delegações",
      "Identificar serviços/contas especiais",
      "Comparar com baseline autorizado"
    ],
    "codeTitle": "Inventário AD read-only",
    "language": "powershell",
    "code": "Get-ADUser -Filter * -Properties Enabled |\n  Select-Object SamAccountName, Enabled\n\nGet-ADGroup -Filter * |\n  Select-Object Name, GroupScope\n\nGet-ADComputer -Filter * |\n  Select-Object Name, Enabled\n",
    "codeNote": "Em ambientes grandes, filtre e exporte resultados para análise; não use enumeração sem autorização.",
    "labTitle": "Baseline do domínio",
    "labMode": "PC",
    "labSteps": [
      "Liste usuários, grupos e computadores em domínio de laboratório.",
      "Exporte para CSV.",
      "Marque contas desabilitadas e grupos privilegiados.",
      "Compare memberships com uma lista esperada.",
      "Crie um pequeno relatório de desvios."
    ],
    "expected": "O inventário deve permitir responder quem existe, onde está e a quais grupos pertence."
  },
  "73": {
    "why": "Misconfigurations em AD surgem de delegações, ACLs, contas, protocolos e políticas inconsistentes. A revisão defensiva precisa transformar permissões complexas em relações compreensíveis.",
    "flow": [
      "Selecionar objeto crítico",
      "Ler proprietário e ACL",
      "Identificar principal com direito sensível",
      "Confirmar se a delegação é necessária",
      "Remover excesso e registrar mudança"
    ],
    "codeTitle": "Ler ACL de objeto do diretório",
    "language": "powershell",
    "code": "$dn = (Get-ADGroup \"Domain Admins\").DistinguishedName\n$path = \"AD:\\\" + $dn\n(Get-Acl $path).Access |\n  Select-Object IdentityReference, ActiveDirectoryRights, AccessControlType\n",
    "codeNote": "O objetivo é auditoria de delegações. Não modifique ACLs sem plano de mudança e backup.",
    "labTitle": "Revisar uma delegação",
    "labMode": "PC",
    "labSteps": [
      "Escolha uma OU/grupo de laboratório.",
      "Leia a ACL.",
      "Identifique entradas explícitas e herdadas.",
      "Explique quais direitos são realmente necessários.",
      "Documente uma correção antes de aplicá-la."
    ],
    "expected": "Você deve conseguir apontar qual identidade possui qual direito sobre qual objeto."
  },
  "74": {
    "why": "Privilege escalation em AD costuma depender de relações de permissão, membership ou delegação. A abordagem segura é detectar caminhos de privilégio excessivo e eliminá-los.",
    "flow": [
      "Mapear grupos privilegiados",
      "Revisar quem pode alterar membership/ACL",
      "Investigar delegações indiretas",
      "Priorizar caminhos com alto impacto",
      "Remover ou restringir permissões excessivas"
    ],
    "codeTitle": "Auditar membership privilegiado",
    "language": "powershell",
    "code": "Get-ADGroupMember \"Domain Admins\" -Recursive |\n  Select-Object Name, SamAccountName, ObjectClass\n\nGet-ADGroupMember \"Administrators\" -Recursive |\n  Select-Object Name, SamAccountName, ObjectClass\n",
    "codeNote": "Use a saída como baseline e revise alterações inesperadas.",
    "labTitle": "Detecção de caminho de privilégio",
    "labMode": "PC",
    "labSteps": [
      "Em laboratório, registre membros de grupos privilegiados.",
      "Escolha uma conta de teste com delegação controlada.",
      "Mapeie apenas as permissões que ela possui, sem explorar.",
      "Decida se a delegação pode alcançar um objeto crítico.",
      "Corrija o excesso e repita o inventário."
    ],
    "expected": "O resultado é um caminho de risco removido ou justificado, não uma sessão privilegiada obtida."
  },
  "75": {
    "why": "Lateral movement descreve o uso de uma identidade ou relação de confiança para acessar outro host. Na sua trilha, o foco deve ser evidência: autenticação remota, processos e conexões entre hosts do laboratório.",
    "flow": [
      "Identidade autentica em outro host",
      "Host de destino registra logon",
      "Serviço/protocolo remoto deixa telemetria",
      "Processos podem surgir no destino",
      "Correlação entre origem, usuário e destino revela movimento"
    ],
    "codeTitle": "Procurar logons remotos no laboratório",
    "language": "powershell",
    "code": "Get-WinEvent -FilterHashtable @{\n  LogName='Security'\n  Id=4624\n  StartTime=(Get-Date).AddHours(-1)\n} | Select-Object -First 20 TimeCreated, Id, Message\n",
    "codeNote": "Correlacione tipo de logon, conta e host de origem com atividades autorizadas.",
    "labTitle": "Simular acesso administrativo legítimo",
    "labMode": "PC",
    "labSteps": [
      "Use duas VMs próprias no mesmo laboratório.",
      "Faça um acesso remoto administrativo legítimo previamente planejado.",
      "Colete eventos no host de destino.",
      "Identifique horário, usuário e origem.",
      "Transforme essa atividade em um padrão de detecção."
    ],
    "expected": "Você deve reconhecer a telemetria de movimento sem depender de técnicas furtivas."
  },
  "76": {
    "why": "GPO centraliza configurações e pode afetar muitos objetos de uma vez. Permissões de edição, escopo e herança precisam ser tratados como superfícies críticas.",
    "flow": [
      "GPO contém configurações",
      "Link define onde ela se aplica",
      "Security filtering/WMI refinam escopo",
      "Permissões definem quem pode editar",
      "Clientes aplicam política e geram evidências"
    ],
    "codeTitle": "Inventário de GPO e permissões",
    "language": "powershell",
    "code": "Import-Module GroupPolicy\nGet-GPO -All | Select-Object DisplayName, Id\n\nGet-GPPermission -Name \"Default Domain Policy\" -All |\n  Select-Object Trustee, Permission\n",
    "codeNote": "Não edite políticas de produção durante estudo; use cópia/lab.",
    "labTitle": "Mapa de política",
    "labMode": "PC",
    "labSteps": [
      "Liste GPOs no domínio de laboratório.",
      "Escolha uma política de teste.",
      "Registre links, escopo e permissões de edição.",
      "Execute gpresult em um cliente de teste.",
      "Compare configuração esperada com aplicada."
    ],
    "expected": "Você deve saber quem pode alterar a política e quais máquinas/usuários ela afeta."
  },
  "77": {
    "why": "AD hardening é redução sistemática de superfície: privilégios, protocolos legados, contas, delegações, GPOs, senhas e monitoramento. Mudanças precisam ser graduais e testadas.",
    "flow": [
      "Criar baseline",
      "Priorizar controles de alto impacto",
      "Aplicar em grupo piloto",
      "Observar compatibilidade e logs",
      "Expandir e revalidar"
    ],
    "codeTitle": "Checklist simples de contas privilegiadas",
    "language": "powershell",
    "code": "Get-ADUser -Filter * -Properties PasswordNeverExpires, Enabled |\n  Where-Object { $_.Enabled -eq $true } |\n  Select-Object SamAccountName, PasswordNeverExpires\n",
    "codeNote": "O comando não decide a política por você; ele evidencia contas que exigem revisão.",
    "labTitle": "Plano de hardening de 5 itens",
    "labMode": "Celular + PC",
    "labSteps": [
      "Escolha cinco controles: contas admin, NTLM, GPO, senhas e logging.",
      "Para cada um, escreva estado atual e estado desejado.",
      "Defina como testar impacto.",
      "Aplique somente em ambiente piloto/lab.",
      "Registre evidência de sucesso e rollback."
    ],
    "expected": "Hardening vira um processo verificável, não uma lista de toggles aplicados às cegas."
  },
  "78": {
    "why": "Detection in AD depende de identidade e contexto. Eventos isolados dizem pouco; sequências de autenticação, alterações de grupo e tickets podem revelar atividade anômala.",
    "flow": [
      "Coletar eventos de DCs e endpoints",
      "Normalizar usuário/host/tempo",
      "Criar baseline",
      "Correlacionar alterações sensíveis",
      "Investigar desvios com contexto"
    ],
    "codeTitle": "Eventos úteis para triagem",
    "language": "powershell",
    "code": "$ids = 4624, 4672, 4728, 4732, 4768, 4769\nGet-WinEvent -FilterHashtable @{\n  LogName='Security'\n  Id=$ids\n  StartTime=(Get-Date).AddHours(-4)\n} | Select-Object TimeCreated, Id, MachineName\n",
    "codeNote": "IDs são pontos de partida; a interpretação depende de tipo de logon, conta e ambiente.",
    "labTitle": "Linha do tempo de identidade",
    "labMode": "PC",
    "labSteps": [
      "Faça um login e uma alteração de grupo autorizada em laboratório.",
      "Colete eventos do período.",
      "Ordene por horário.",
      "Associe usuário, host e ação.",
      "Escreva uma regra simples de alerta para alteração privilegiada fora do horário previsto."
    ],
    "expected": "Você deve transformar eventos dispersos em uma narrativa de identidade."
  },
  "79": {
    "why": "Logs são a memória operacional do sistema. O primeiro passo de Blue Team é saber quais fontes existem, qual relógio usam, por quanto tempo ficam disponíveis e quais campos permitem correlação.",
    "flow": [
      "Aplicação/sistema gera evento",
      "Agente ou serviço coleta",
      "Timestamp e campos são normalizados",
      "Eventos vão para retenção/SIEM",
      "Analista consulta e correlaciona"
    ],
    "codeTitle": "Leitura básica em Linux e Windows",
    "language": "text",
    "code": "Linux:\njournalctl --since \"1 hour ago\" --no-pager\n\nWindows PowerShell:\nGet-WinEvent -FilterHashtable @{\n  LogName='System'\n  StartTime=(Get-Date).AddHours(-1)\n} | Select-Object -First 30\n",
    "codeNote": "Antes de procurar ataques, confirme que a fonte registra corretamente atividades normais.",
    "labTitle": "Criar uma linha do tempo simples",
    "labMode": "PC",
    "labSteps": [
      "Gere três eventos benignos conhecidos no seu host.",
      "Colete logs correspondentes.",
      "Normalize horários.",
      "Monte tabela: hora, fonte, host, evento.",
      "Explique o que faltaria para correlacionar com outro sistema."
    ],
    "expected": "Você deve localizar um evento conhecido sem depender de 'caçar no escuro'."
  },
  "80": {
    "why": "Sysmon amplia a telemetria do Windows com eventos como criação de processo, conexões e alterações. Configuração boa equilibra visibilidade e volume.",
    "flow": [
      "Sysmon observa atividade",
      "Config define include/exclude",
      "Eventos vão ao log operacional",
      "Coletor encaminha ao SIEM",
      "Analista correlaciona processo, hash, parent e rede"
    ],
    "codeTitle": "Trecho de configuração para Process Create",
    "language": "xml",
    "code": "<Sysmon schemaversion=\"4.90\">\n  <EventFiltering>\n    <ProcessCreate onmatch=\"include\">\n      <Image condition=\"end with\">\\powershell.exe</Image>\n    </ProcessCreate>\n  </EventFiltering>\n</Sysmon>",
    "codeNote": "Em laboratório, comece pequeno e meça volume antes de ampliar regras.",
    "labTitle": "Observar árvore de processo",
    "labMode": "PC",
    "labSteps": [
      "Instale Sysmon apenas em VM própria.",
      "Ative uma configuração mínima.",
      "Abra PowerShell e execute um comando benigno.",
      "Localize Event ID 1 no log Sysmon.",
      "Identifique Image, ParentImage, CommandLine e hashes."
    ],
    "expected": "Você deve conseguir reconstruir quem iniciou qual processo."
  },
  "81": {
    "why": "Wireshark mostra pacotes; seu valor está em filtros e interpretação por camada. Uma captura boa começa com uma pergunta específica.",
    "flow": [
      "Interface captura frames",
      "Protocolos são decodificados",
      "Display filter reduz o conjunto",
      "Fluxos são seguidos",
      "Achado é relacionado ao processo/aplicação"
    ],
    "codeTitle": "Display filters úteis em laboratório",
    "language": "text",
    "code": "dns\nhttp\ntls\ntcp.stream eq 0\nip.addr == 127.0.0.1\nhttp.request.method == \"GET\"\n",
    "codeNote": "Display filters não alteram a captura; apenas controlam o que você visualiza.",
    "labTitle": "Capturar uma requisição local",
    "labMode": "PC",
    "labSteps": [
      "Inicie uma captura na interface correta.",
      "Acesse um serviço HTTP local de teste.",
      "Pare a captura rapidamente.",
      "Filtre por http ou pela porta do serviço.",
      "Siga o stream e compare com o log da aplicação."
    ],
    "expected": "Você deve relacionar um request visto na rede com uma ação conhecida do laboratório."
  },
  "82": {
    "why": "Suricata inspeciona tráfego e pode funcionar como IDS/IPS. Regras precisam de contexto, baixa taxa de falso positivo e uma estratégia clara de atualização.",
    "flow": [
      "Pacote/fluxo entra no sensor",
      "Decoder identifica protocolo",
      "Regras avaliam campos",
      "Alerta é registrado",
      "SIEM/analista correlaciona com outros sinais"
    ],
    "codeTitle": "Regra de laboratório para GET",
    "language": "text",
    "code": "alert http any any -> any any (\n  msg:\"LAB HTTP GET observado\";\n  flow:to_server,established;\n  http.method;\n  content:\"GET\";\n  sid:1000001;\n  rev:1;\n)\n",
    "codeNote": "SID local alto e mensagem LAB deixam claro que a regra é educacional.",
    "labTitle": "Gerar alerta benigno",
    "labMode": "PC",
    "labSteps": [
      "Use rede/VM própria.",
      "Carregue a regra de laboratório.",
      "Faça uma requisição GET a serviço local.",
      "Abra eve.json/fast.log.",
      "Confirme campos de origem, destino, assinatura e timestamp."
    ],
    "expected": "Você deve entender da regra ao evento registrado, sem bloquear tráfego real."
  },
  "83": {
    "why": "SIEM centraliza eventos para busca, correlação e alertas. A qualidade depende mais de fontes e normalização que de dashboards bonitos.",
    "flow": [
      "Fontes enviam eventos",
      "Pipeline normaliza campos",
      "Índice armazena com retenção",
      "Consulta correlaciona sinais",
      "Alerta gera investigação/caso"
    ],
    "codeTitle": "Consulta conceitual de falhas de login",
    "language": "kql",
    "code": "SecurityEvent\n| where EventID == 4625\n| summarize Failures=count() by Account, Computer, bin(TimeGenerated, 5m)\n| where Failures >= 5\n",
    "codeNote": "Ajuste campos/limites ao SIEM real e ao baseline; cinco falhas não significam ataque automaticamente.",
    "labTitle": "Do evento ao alerta",
    "labMode": "PC",
    "labSteps": [
      "Importe um pequeno conjunto de logs de laboratório.",
      "Normalize usuário, host e timestamp.",
      "Crie uma consulta de falhas de login.",
      "Observe atividade normal e ajuste limiar.",
      "Adicione contexto para reduzir falso positivo."
    ],
    "expected": "A regra deve explicar por que um conjunto de eventos é mais relevante que um evento isolado."
  },
  "84": {
    "why": "MITRE ATT&CK é uma linguagem para descrever comportamentos adversários. Ela ajuda a mapear cobertura de detecção, não a medir segurança por quantidade de técnicas marcadas.",
    "flow": [
      "Observação descreve comportamento",
      "Analista identifica tática",
      "Mapeia técnica/subtécnica",
      "Relaciona fonte de dados/detecção",
      "Identifica lacuna e prioriza melhoria"
    ],
    "codeTitle": "Registro de mapeamento",
    "language": "json",
    "code": "{\n  \"observation\": \"Office iniciou PowerShell\",\n  \"tactic\": \"Execution\",\n  \"technique\": \"Command and Scripting Interpreter\",\n  \"data_source\": \"Process Creation\",\n  \"coverage\": \"detected\"\n}",
    "codeNote": "Mapeie comportamento observado; não force uma técnica só para preencher matriz.",
    "labTitle": "Mapear três eventos benignos",
    "labMode": "Celular",
    "labSteps": [
      "Pegue três cenários do módulo de Blue Team.",
      "Para cada um, descreva o comportamento em uma frase.",
      "Busque a tática/técnica correspondente no ATT&CK.",
      "Anote a fonte de dados necessária.",
      "Classifique sua cobertura como inexistente, parcial ou boa."
    ],
    "expected": "Você deve usar ATT&CK para discutir cobertura de telemetria e detecção."
  },
  "85": {
    "why": "IOC é um artefato observável; IOA aponta uma ação; TTP descreve padrão de comportamento. Misturar os três leva a detecções frágeis.",
    "flow": [
      "Sensor observa artefato/ação",
      "Analista classifica IOC ou IOA",
      "Conjunto de ações forma padrão/TTP",
      "Detecção usa combinação de sinais",
      "Contexto decide severidade"
    ],
    "codeTitle": "Modelo de indicadores",
    "language": "json",
    "code": "{\n  \"ioc\": [\"hash:abc...\", \"domain:example.test\"],\n  \"ioa\": [\"office->powershell\"],\n  \"ttp\": [\"script interpreter used after document open\"]\n}",
    "codeNote": "Hashes mudam facilmente; relações de processo costumam sobreviver mais a pequenas mudanças.",
    "labTitle": "Classificar sinais",
    "labMode": "Celular",
    "labSteps": [
      "Pegue dez sinais fictícios.",
      "Separe em IOC, IOA ou descrição de TTP.",
      "Escolha dois IOCs e diga como poderiam ficar obsoletos.",
      "Escolha um IOA e diga qual telemetria o detecta.",
      "Monte uma detecção combinando pelo menos dois tipos."
    ],
    "expected": "Você deve justificar por que comportamento geralmente é mais resiliente que um único hash."
  },
  "86": {
    "why": "Sigma descreve padrões de eventos de forma portável. Uma regra boa define logsource, seleção, condição e contexto suficiente para ser convertida a um backend.",
    "flow": [
      "Definir hipótese",
      "Escolher logsource",
      "Selecionar campos/valores",
      "Escrever condition",
      "Testar em eventos positivos e negativos"
    ],
    "codeTitle": "Sigma: Office iniciando PowerShell",
    "language": "yaml",
    "code": "title: LAB Office spawning PowerShell\nstatus: experimental\nlogsource:\n  category: process_creation\n  product: windows\ndetection:\n  selection:\n    ParentImage|endswith: '\\WINWORD.EXE'\n    Image|endswith: '\\powershell.exe'\n  condition: selection\nlevel: medium\n",
    "codeNote": "Uma relação pai-filho é contexto; ainda precisa de tuning para ambiente real.",
    "labTitle": "Teste positivo e negativo",
    "labMode": "PC",
    "labSteps": [
      "Crie dois eventos JSON fictícios de process creation.",
      "Um deve satisfazer a regra e outro não.",
      "Valide com ferramenta Sigma ou revisão manual.",
      "Adicione um campo que reduza ruído.",
      "Documente falso positivo esperado."
    ],
    "expected": "A regra deve ser testável e ter uma hipótese explícita."
  },
  "87": {
    "why": "YARA identifica arquivos/memória por características. Regras defensivas robustas combinam strings e condições, evitando depender de uma única palavra genérica.",
    "flow": [
      "Selecionar amostras benignas/maliciosas do laboratório",
      "Extrair características estáveis",
      "Escrever strings/condição",
      "Testar contra conjunto positivo e negativo",
      "Ajustar para reduzir falsos positivos"
    ],
    "codeTitle": "YARA para marcador de laboratório",
    "language": "yara",
    "code": "rule LAB_Training_Marker {\n  meta:\n    purpose = \"educational\"\n  strings:\n    $marker = \"CYBER_STUDY_LAB_SAMPLE\"\n  condition:\n    $marker\n}\n",
    "codeNote": "A regra só detecta um arquivo de teste criado por você; é segura para aprender sintaxe.",
    "labTitle": "Criar amostra benigna",
    "labMode": "PC",
    "labSteps": [
      "Crie um TXT contendo CYBER_STUDY_LAB_SAMPLE.",
      "Salve a regra YARA acima.",
      "Execute YARA contra a pasta do laboratório.",
      "Confirme match apenas no arquivo marcado.",
      "Remova o marcador e teste novamente."
    ],
    "expected": "Você deve entender rule, strings e condition sem precisar de malware real."
  },
  "88": {
    "why": "Threat hunting parte de uma hipótese e busca proativamente evidências. Não é navegar aleatoriamente em logs até algo parecer estranho.",
    "flow": [
      "Hipótese específica",
      "Fontes de dados necessárias",
      "Consulta inicial ampla",
      "Pivot por entidade/tempo",
      "Conclusão documentada ou nova hipótese"
    ],
    "codeTitle": "Hipótese: parent-child incomum",
    "language": "kql",
    "code": "DeviceProcessEvents\n| where InitiatingProcessFileName =~ \"winword.exe\"\n| where FileName in~ (\"powershell.exe\", \"cmd.exe\")\n| project Timestamp, DeviceName, AccountName,\n          InitiatingProcessFileName, FileName, ProcessCommandLine\n",
    "codeNote": "A consulta só produz candidatos; investigação decide se a atividade é legítima.",
    "labTitle": "Hunt com dataset pequeno",
    "labMode": "PC",
    "labSteps": [
      "Use eventos de laboratório ou amostra pública segura.",
      "Escreva a hipótese em uma frase.",
      "Defina dois campos de pivot: host e usuário.",
      "Execute consulta e reduza resultados.",
      "Registre conclusão mesmo se não encontrar ameaça."
    ],
    "expected": "Um hunt termina com evidência e aprendizado, não necessariamente com um incidente."
  },
  "89": {
    "why": "Incident Response organiza decisões sob pressão. Preparação, contenção e recuperação precisam preservar evidência e continuidade do negócio.",
    "flow": [
      "Preparação",
      "Identificação",
      "Contenção",
      "Erradicação",
      "Recuperação",
      "Lições aprendidas"
    ],
    "codeTitle": "Estrutura mínima de timeline",
    "language": "json",
    "code": "[\n  {\"time\":\"10:02\",\"source\":\"EDR\",\"event\":\"alert created\"},\n  {\"time\":\"10:05\",\"source\":\"analyst\",\"event\":\"host isolated\"},\n  {\"time\":\"10:22\",\"source\":\"IT\",\"event\":\"credential reset\"}\n]\n",
    "codeNote": "Separar fato, fonte e horário reduz confusão durante o incidente.",
    "labTitle": "Tabletop de incidente",
    "labMode": "Celular",
    "labSteps": [
      "Use um cenário fictício de ransomware sem executar malware.",
      "Defina quem decide isolamento, comunicação e restauração.",
      "Monte timeline de seis eventos.",
      "Liste evidências que precisam ser preservadas.",
      "Finalize com três ações de melhoria."
    ],
    "expected": "Você deve conseguir explicar a ordem das decisões e quem é responsável por cada uma."
  },
  "90": {
    "why": "DFIR combina resposta a incidente com preservação e análise forense. Integridade da evidência, timeline e cadeia de custódia importam tanto quanto a ferramenta.",
    "flow": [
      "Preservar estado/evidência",
      "Calcular hash e registrar origem",
      "Coletar artefatos",
      "Construir timeline",
      "Analisar e documentar conclusões"
    ],
    "codeTitle": "Hash de evidência de laboratório",
    "language": "sh",
    "code": "sha256sum evidence.bin > evidence.sha256\nstat evidence.bin\ncp --preserve=all evidence.bin evidence-copy.bin\nsha256sum evidence-copy.bin\n",
    "codeNote": "Trabalhe com cópias de laboratório; hashes ajudam a comprovar integridade.",
    "labTitle": "Mini cadeia de custódia",
    "labMode": "PC",
    "labSteps": [
      "Crie um arquivo fictício de evidência.",
      "Registre origem, horário e responsável.",
      "Calcule SHA-256.",
      "Faça uma cópia de trabalho e confirme hash.",
      "Anote cada ação em um log simples."
    ],
    "expected": "Você deve demonstrar que a cópia analisada é idêntica à evidência coletada."
  },
  "91": {
    "why": "Antivírus moderno é uma pipeline: reputação, assinatura, heurística, comportamento e resposta. Nenhum motor isolado cobre todos os casos.",
    "flow": [
      "Arquivo/processo é observado",
      "Reputação/hash oferecem contexto",
      "Assinaturas procuram padrões conhecidos",
      "Heurística avalia características",
      "Comportamento adiciona sinais em execução",
      "Política decide bloquear, permitir ou investigar"
    ],
    "codeTitle": "Pipeline conceitual de decisão",
    "language": "python",
    "code": "def classify(sample):\n    if sample.reputation == \"known_bad\":\n        return \"block\"\n    if sample.signature_match:\n        return \"block\"\n    if sample.heuristic_score >= 80:\n        return \"analyze\"\n    return \"allow_with_telemetry\"\n",
    "codeNote": "Na prática, motores combinam muitos sinais e políticas do fornecedor.",
    "labTitle": "Classificar amostras fictícias",
    "labMode": "Celular",
    "labSteps": [
      "Crie cinco amostras fictícias com hash, reputação e score.",
      "Passe mentalmente pela pipeline.",
      "Explique por que um arquivo desconhecido não é automaticamente malicioso.",
      "Defina quando mandar para sandbox.",
      "Compare block vs analyze."
    ],
    "expected": "Você deve enxergar AV como composição de camadas."
  },
  "92": {
    "why": "Assinaturas e hashes são muito precisos para objetos conhecidos, mas frágeis diante de mudanças pequenas. Reputação adiciona contexto de prevalência e histórico.",
    "flow": [
      "Calcular hash",
      "Consultar base/reputação",
      "Comparar assinatura",
      "Combinar prevalência e origem",
      "Decidir com outros sinais quando desconhecido"
    ],
    "codeTitle": "Calcular SHA-256 local",
    "language": "python",
    "code": "from hashlib import sha256\nfrom pathlib import Path\n\ndata = Path(\"sample.txt\").read_bytes()\nprint(sha256(data).hexdigest())\n",
    "codeNote": "Hash identifica conteúdo exato; alterar um byte produz outro identificador.",
    "labTitle": "Ver sensibilidade do hash",
    "labMode": "PC",
    "labSteps": [
      "Crie sample.txt.",
      "Calcule SHA-256.",
      "Altere uma única letra.",
      "Calcule novamente.",
      "Explique por que assinatura comportamental pode complementar hash."
    ],
    "expected": "Você deve saber quando um IOC por hash é forte e quando é insuficiente."
  },
  "93": {
    "why": "Heurística pontua características associadas a risco sem exigir correspondência exata. O desafio é escolher sinais discriminativos e calibrar o limiar.",
    "flow": [
      "Extrair features",
      "Atribuir pesos",
      "Somar score",
      "Comparar com limiar",
      "Revisar FP/FN e recalibrar"
    ],
    "codeTitle": "Score heurístico didático",
    "language": "python",
    "code": "def heuristic(features):\n    score = 0\n    score += 40 if features[\"unsigned\"] else 0\n    score += 30 if features[\"writes_run_key\"] else 0\n    score += 20 if features[\"rare_parent\"] else 0\n    return min(score, 100)\n",
    "codeNote": "É um modelo didático; sinais reais precisam de dados, contexto e validação.",
    "labTitle": "Calibrar um limiar",
    "labMode": "Celular",
    "labSteps": [
      "Crie dez casos fictícios benignos/maliciosos.",
      "Atribua features e calcule score.",
      "Teste limiar 50, 70 e 90.",
      "Conte falsos positivos e falsos negativos.",
      "Escolha limiar e justifique."
    ],
    "expected": "Você deve perceber que aumentar sensibilidade costuma aumentar ruído."
  },
  "94": {
    "why": "Análise comportamental observa sequências de ações, como parent-child, persistência, rede e acesso a arquivos. Ela é mais resiliente que uma assinatura isolada, mas exige contexto.",
    "flow": [
      "Processo inicia",
      "Telemetria registra ações",
      "Eventos são encadeados por entidade/tempo",
      "Modelo/regra avalia comportamento",
      "Resposta depende de confiança e impacto"
    ],
    "codeTitle": "Correlação simples de comportamento",
    "language": "python",
    "code": "events = [\n  {\"type\":\"process\",\"image\":\"powershell.exe\"},\n  {\"type\":\"registry\",\"key\":\"Run\"},\n  {\"type\":\"network\",\"dst\":\"example.test\"}\n]\n\nsignals = {e[\"type\"] for e in events}\nsuspicious = {\"process\",\"registry\",\"network\"} <= signals\nprint(suspicious)\n",
    "codeNote": "A sequência e o contexto importam mais do que qualquer evento isolado.",
    "labTitle": "Montar uma sequência de eventos",
    "labMode": "Celular",
    "labSteps": [
      "Use um cenário fictício de cinco eventos.",
      "Separe eventos normais e potencialmente relevantes.",
      "Agrupe por processo e janela de tempo.",
      "Crie uma regra que exija dois ou três sinais.",
      "Explique falso positivo possível."
    ],
    "expected": "Você deve pensar em comportamento como história, não como lista de IOCs."
  },
  "95": {
    "why": "Sandboxing executa conteúdo em ambiente isolado para observar comportamento. Resultado útil exige baseline, instrumentação e consciência de que uma amostra pode se comportar diferente fora do ambiente.",
    "flow": [
      "Amostra entra em ambiente isolado",
      "Snapshot/baseline é registrado",
      "Execução gera processos, arquivos, registro e rede",
      "Telemetria é coletada",
      "Ambiente é descartado/restaurado"
    ],
    "codeTitle": "Checklist de política de sandbox",
    "language": "json",
    "code": "{\n  \"network\": \"simulated\",\n  \"snapshot\": true,\n  \"time_limit_sec\": 120,\n  \"collect\": [\"process\", \"file\", \"registry\", \"network\"],\n  \"restore_after_run\": true\n}",
    "codeNote": "Para estudo, use amostras benignas ou simuladores; não execute malware real no dispositivo principal.",
    "labTitle": "Sandbox com programa benigno",
    "labMode": "PC",
    "labSteps": [
      "Use uma VM descartável.",
      "Tire snapshot.",
      "Execute um script benigno que cria arquivo e faz request a serviço local.",
      "Observe processos/arquivos/rede.",
      "Restaure snapshot."
    ],
    "expected": "Você deve relacionar cada ação conhecida à telemetria capturada."
  },
  "96": {
    "why": "Exploit protection adiciona mitigadores que dificultam transformar bugs em execução de código. ASLR, DEP/NX e controles de fluxo reduzem confiabilidade de exploração.",
    "flow": [
      "Aplicação carrega com mitigadores",
      "Memória recebe permissões/relocalização",
      "Tentativa de comportamento inválido é bloqueada",
      "Evento/crash pode ser registrado",
      "Equipe corrige a vulnerabilidade de origem"
    ],
    "codeTitle": "Consultar mitigadores no Windows",
    "language": "powershell",
    "code": "Get-ProcessMitigation -System\nGet-ProcessMitigation -Name notepad.exe\n",
    "codeNote": "Mitigação não substitui patch; ela reduz exploração enquanto a causa raiz ainda existe.",
    "labTitle": "Inventário de mitigadores",
    "labMode": "PC",
    "labSteps": [
      "Use Windows de laboratório.",
      "Consulte mitigadores do sistema.",
      "Compare dois executáveis benignos.",
      "Pesquise o significado de DEP, ASLR e CFG.",
      "Registre quais controles são prevenção vs evidência."
    ],
    "expected": "Você deve explicar a função de um mitigador sem tratá-lo como correção do bug."
  },
  "97": {
    "why": "EDR coleta telemetria de endpoint e aplica detecção/resposta. O diferencial é contexto contínuo: processo, usuário, arquivo, rede e árvore de execução.",
    "flow": [
      "Sensor coleta evento",
      "Backend enriquece entidade",
      "Regra/modelo gera alerta",
      "Analista consulta contexto",
      "Resposta pode isolar host/processo conforme política"
    ],
    "codeTitle": "Evento de processo simplificado",
    "language": "json",
    "code": "{\n  \"host\": \"LAB-01\",\n  \"user\": \"victor\",\n  \"process\": \"powershell.exe\",\n  \"pid\": 4321,\n  \"parent\": \"winword.exe\",\n  \"sha256\": \"abc...\",\n  \"network_connections\": 1\n}",
    "codeNote": "Um alerta EDR útil preserva relação entre entidades, não apenas o nome do processo.",
    "labTitle": "Definir telemetria mínima",
    "labMode": "Celular",
    "labSteps": [
      "Escolha um cenário de processo suspeito fictício.",
      "Liste campos necessários para investigar.",
      "Separe telemetria de prevenção e de contexto.",
      "Desenhe o process tree.",
      "Defina uma ação de resposta proporcional."
    ],
    "expected": "Você deve saber quais campos pedir ao EDR antes de decidir."
  },
  "98": {
    "why": "Process trees revelam causalidade operacional: qual processo iniciou qual filho. Relações incomuns são excelentes pivôs de investigação.",
    "flow": [
      "Evento fornece PID e ParentPID",
      "Eventos são agrupados por host/boot",
      "Árvore liga parent a child",
      "Analista identifica relações raras",
      "Contexto decide legitimidade"
    ],
    "codeTitle": "Construir árvore a partir de eventos",
    "language": "python",
    "code": "events = [\n  {\"pid\":1, \"ppid\":0, \"name\":\"init\"},\n  {\"pid\":10, \"ppid\":1, \"name\":\"app\"},\n  {\"pid\":11, \"ppid\":10, \"name\":\"worker\"}\n]\n\nchildren = {}\nfor e in events:\n    children.setdefault(e[\"ppid\"], []).append(e)\n\nprint(children[10])\n",
    "codeNote": "Em telemetria real, PID pode ser reutilizado; inclua timestamp/host/boot ID.",
    "labTitle": "Desenhar duas árvores",
    "labMode": "Celular",
    "labSteps": [
      "Monte uma árvore normal de navegador → renderer.",
      "Monte uma árvore anômala fictícia de Office → script interpreter.",
      "Compare parent, child e linha de comando.",
      "Liste outros campos necessários.",
      "Explique qual árvore investigaria primeiro."
    ],
    "expected": "Você deve usar relação pai-filho como contexto, não como veredito."
  },
  "99": {
    "why": "Falso positivo é alerta benigno; falso negativo é ameaça não detectada. Detection engineering é sempre uma troca entre cobertura, precisão, custo e tempo de resposta.",
    "flow": [
      "Regra classifica eventos",
      "Resultados são comparados com verdade conhecida",
      "TP/FP/TN/FN formam matriz",
      "Métricas orientam tuning",
      "Mudanças são retestadas"
    ],
    "codeTitle": "Métricas de uma matriz de confusão",
    "language": "python",
    "code": "tp, fp, fn = 80, 20, 10\n\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\n\nprint(f\"precision={precision:.2f}\")\nprint(f\"recall={recall:.2f}\")\n",
    "codeNote": "Alta precisão e alta cobertura são desejáveis, mas o custo do erro varia por caso de uso.",
    "labTitle": "Tuning com 100 eventos fictícios",
    "labMode": "Celular",
    "labSteps": [
      "Defina TP, FP, TN e FN para uma regra fictícia.",
      "Calcule precision e recall.",
      "Aumente o limiar e estime como as métricas mudam.",
      "Decida qual erro é mais caro nesse cenário.",
      "Registre uma proposta de tuning."
    ],
    "expected": "Você deve justificar tuning com métricas e impacto operacional."
  },
  "100": {
    "why": "Detection engineering transforma hipóteses de ameaça em regras testáveis, monitoradas e versionadas. O ciclo inclui dado, lógica, teste, implantação e feedback.",
    "flow": [
      "Hipótese e comportamento",
      "Fonte de dados e campos",
      "Regra/detecção",
      "Testes positivos e negativos",
      "Deploy controlado",
      "Métricas, tuning e versionamento"
    ],
    "codeTitle": "Regra + casos de teste",
    "language": "yaml",
    "code": "title: LAB Suspicious Office Child\nlogsource:\n  category: process_creation\n  product: windows\ndetection:\n  parent:\n    ParentImage|endswith: '\\WINWORD.EXE'\n  child:\n    Image|endswith:\n      - '\\powershell.exe'\n      - '\\cmd.exe'\n  condition: parent and child\nlevel: medium\n",
    "codeNote": "Uma detecção só está pronta quando possui dados necessários, testes, owner e estratégia de tuning.",
    "labTitle": "Projeto final de detecção",
    "labMode": "PC",
    "labSteps": [
      "Escolha uma hipótese das aulas 79–99.",
      "Defina fonte de dados e campos mínimos.",
      "Escreva uma regra Sigma ou consulta equivalente.",
      "Crie pelo menos um evento positivo e dois negativos.",
      "Documente falso positivo, severidade, owner e passo de investigação.",
      "Versione a regra junto com os testes."
    ],
    "expected": "Você termina a aula com uma detecção reproduzível e explicável, não apenas uma consulta solta."
  }
};
