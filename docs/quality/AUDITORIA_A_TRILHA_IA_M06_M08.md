# Auditoria editorial A — Desenvolvimento com IA, M06–M08

**Data:** 14/10/2026 · **Método:** revisão editorial por IA com segunda passagem crítica. **Não houve teste com estudantes reais, auditoria humana externa nem avaliação assistiva.**

## Resultado curricular

| Módulo | Conteúdo técnico | Didática | Prática | Defesa | Avaliação | Especificidade | Status |
|---|---:|---:|---:|---:|---:|---:|---|
| 06 — Backend e SQLite | 92 | 90 | 91 | 91 | 90 | 94 | A editorial IA |
| 07 — Qualidade e testes | 92 | 90 | 93 | 92 | 91 | 94 | A editorial IA |
| 08 — Entrega local | 90 | 91 | 90 | 92 | 90 | 93 | A editorial IA |

As seis evidências por módulo, metodologia, hashes SHA-256 dos conteúdos, laboratório, prova e gabarito, gates e limites estão em `quality/trails/ai-dev/reviews.json`. As cinco avaliações anteriores permanecem preservadas e são verificadas contra seus hashes.

## Laboratórios reais

- **M06:** `checkpoints/v0.4` — React+TS, API Node HTTP, SQLite com FK e CHECK, bind loopback, operações CRUD; testes reais de HTTP 201/400/404/409/422 e persistência após reabrir arquivo.
- **M07:** `checkpoints/v0.5` — checkpoint incremental, regressões de estados, IDs estáveis, exclusão e constraints SQL; exige relatório de falha antes/depois.
- **M08:** `checkpoints/v1.0` — servidor estático + API local, build, teste, backup SQLite via API nativa e restauração em arquivo novo, com validação de integridade e relações.

Cada módulo possui 4 etapas, duas microaulas novas com contraexemplos, uma aula canônica sem duplicação (WEB-26, ENG-16, ENG-21) e um laboratório. Seis questões de transferência independentes por módulo, 18 novas no total, com gabaritos separados e erro eliminatório.

## Restrições pedagógicas e técnicas

O núcleo exige **R$ 0** e funciona com ferramentas open source/self-hosted e Node 24+ sem API paga. ChatGPT/Claude no navegador são assistentes **opcionais** sujeitos a limites gratuitos; Ollama é facultativo segundo hardware; o laboratório pode ser realizado sem IA.

O app é apenas um **protótipo didático local**; a API só escuta 127.0.0.1 e não tem autenticação multiusuário, autorização, TLS ou auditoria. **Nunca colocar na internet nem usar dados reais de clientes ou pacientes.** Scripts de backup não sobrescrevem arquivos.

## QA e interpretação

A validação exige as 32 etapas, 8 pareceres A, 8 referências canônicas, 48 questões, integridade de hashes, testes dos laboratórios e build de todos os checkpoints. CI também confirma build e autenticação do HubEstudos.

A nota A é **editorial por IA**, não comprova aprendizagem individual nem prontidão para venda. Registro de conclusão continua autodeclarado e local. Estudos com iniciantes e testes de acessibilidade assistiva permanecem pendentes.
