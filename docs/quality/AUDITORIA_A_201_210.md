# Auditoria A técnico-editorial — aulas 201–210 (15/10/2026)

## Delimitação
201–208: segurança de aplicações de IA/LLM, prompt injection, dados sensíveis, RAG, abuso de ferramentas, supply chain, taxonomias OWASP GenAI 2026 e miniagente. 209–210: projeto final **geral** do curso, com SCOPE.md, LAB_ARCHITECTURE.md e THREAT_MODEL.md. Não são pré-requisitos obrigatórios.

## Mudanças verificáveis
- Dez aulas com causa técnica, fronteira de confiança, laboratório reprodutível e duas classes de decisão (permitida/negada).
- Dez gabaritos fora das aulas, avaliação de transferência com rubrica de 100 pontos.
- Node 22+ offline, sem dependência npm adicional; sem APIs de LLM, credenciais, cloud, licenças ou GPU.
- Dez testes de contratos de decisão com cenários seguros e negativos. São mocks in-memory, não validação real de segurança de LLM, auth, banco, vector DB, assinatura ou autorização humana.
- A 207 referencia explicitamente versão OWASP GenAI LLM Top 10 2026, publicada em agosto de 2026, sem confundi-la com ranking 2025.
- Auditoria editorial IA com SHA-256 das páginas, dimensões de evidência e limitações explícitas; não houve observação com alunos.
- Nenhuma alteração prevista em frontend, rotas/API, OAuth, DB, Worker, Cloudflare, secrets ou configuração de deploy.

## QA reproduzível
```bash
npm ci --no-audit --no-fund
npm run test:a-201-210
npm run test:grade-a-201-210
npm run verify:quality
npm run build
```

### Fonte primária
- https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/
- https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence

**Nota:** Grade A indica avaliação técnico-editorial assistida por IA e suite automatizada. Não equivale a validação humana nem certifica ambientes reais.
