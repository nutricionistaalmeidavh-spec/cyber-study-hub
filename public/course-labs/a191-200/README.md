# Laboratórios A — aulas 191 a 200

## Núcleo obrigatório: R$ 0, Node.js 22+, sem pacotes npm

Na raiz do repositório:

```bash
node --test public/course-labs/a191-200/lab.test.mjs
```

O runner contém dez contratos com cenário legítimo, violação e reteste; não precisa de conta AWS, Cloudflare, Docker, cluster, Supabase, Firebase, Windows nem licença comercial. Não cria recursos, não abre portas, não usa credenciais e não consulta a Internet.

**Limite de interpretação:** `models.mjs` implementa modelos deliberadamente pequenos. Aprovação da fixture **não** comprova segurança de Docker, política de cluster, regra IAM, assinatura ou proveniência, credenciais reais, banco PostgreSQL, Firebase ou IPC Electron. Os laboratórios nativos anteriores das aulas 193 (Python), 195 (Node), 198 (Postgres/Firestore Emulator) e 200 (Electron) permanecem nos caminhos originais, independentes deste pacote. Docker/cluster e ferramentas especializadas são extensões opcionais — sempre com ambiente próprio ou autorizado.

**Procedimento de estudo:** 1) prever saída antes da execução; 2) executar teste local; 3) explicar causa da recusa; 4) propor correção primária; 5) verificar preservação do caso permitido; 6) responder a avaliação de transferência antes de abrir o gabarito.

Gabaritos estão em `answer-keys/AULA-191.md` até `AULA-200.md`, fora das páginas das aulas. Os tests são verificações programáticas dos modelos, e não ensaios com alunos humanos.