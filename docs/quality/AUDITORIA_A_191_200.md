# Auditoria A editorial — aulas 191–200 (15/10/2026)

## Escopo
Dez aulas principais, Cloud/DevSecOps/App Security. Os materiais 193 (IAM/Python), 195 (CI/Node), 198 (PostgreSQL RLS/Firestore Emulator) e 200 (Electron IPC) já tinham laboratórios específicos e foram **preservados integralmente**, recebendo transferência de competência e gabaritos externos. As seis aulas 191, 192, 194, 196, 197 e 199 tiveram scaffolding genérico substituído por situações concretas, mecanismos diferenciados, modelos de decisão e correção causal.

## Contrato de qualidade
- Aula com problema preciso, mecanismo, positivo/negativo, interpretação e controle causal.
- 10 testes Node 22 com casos legítimos, recusas e regressão do contrato local.
- 10 provas de transferência independentes e rubricas de 100 pontos, com gabarito em outro arquivo.
- 10 hashes SHA-256 vinculados ao conteúdo exato, seis dimensões de parecer e evidência individual.
- Material obrigatório gratuito, local e open source, sem Cloud/IA paga; ferramentas externas são opcionais.
- Formas de acesso às outras aulas e trilhas não são bloqueadas por pré-requisitos.
- Não foram modificados frontend, APIs, autenticação, Worker, Cloudflare, segredos nem DB de produção.

## Verificação automatizada
```bash
npm ci --no-audit --no-fund
npm run test:a-191-200
npm run test:grade-a-191-200
npm run verify:quality
npm run build
```
Workflows no PR verificam execução. Para os labs nativos mantidos, os ambientes são opcionais e separados: banco PostgreSQL em contêiner, Firebase Emulator local, Electron, CLI Python IAM/Node CI.

## Limites honestos
A nota A é **editorial assistida por IA**. Os modelos de decisão testados são in-memory, não comprovam enforcement Docker/Kubernetes/AWS/Supabase/Firebase/Serverless/Electron. Nenhum aluno humano foi observado; não se afirma eficácia comprovada de ensino nem auditoria de sistemas reais. A revisão editorial e os testes sintéticos não substituem ensaio humano, validação operacional e revisão de versões de documentação. O total esperado neste checkpoint é 183 A, preservando as 173 anteriores.
