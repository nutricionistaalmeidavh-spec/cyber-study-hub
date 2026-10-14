# Aulas 141–150 — auditoria A editorial

**14/10/2026.** Foram aprofundadas as dez aulas de análise defensiva com modelos Node.js offline, controle positivo/negativo, dez provas de seis questões (60 no total), dez gabaritos independentes e rubricas de correção.

**Limites:** a classificação é revisão editorial assistida por IA, sem teste com alunos e **sem revisor humano independente**. Não indica resultado de aprendizagem comprovado e os modelos não detectam malware real. O caminho obrigatório é R$ 0, open source e offline; ferramentas profissionais são opcionais.

O registro canônico `quality/registry.json` foi planejado para passar de 163 para **173 notas A** (170 aulas principais e três trilhas paralelas), preservando as classificações existentes e vinculando novos pareceres a SHA-256 dos arquivos Markdown.

## Escopo de alteração

Somente páginas 141–150, laboratórios sintéticos, gabaritos, scripts de teste, registro de qualidade e workflow. **Nenhuma mudança em autenticação, Worker, OAuth, API, segredos, base de usuários ou deploy.**

## Verificação

```sh
npm run test:a-141-150
npm run test:grade-a-141-150
npm run verify:quality
npm run build
```

Cada oficina exige previsão, execução controlada, falsos positivos, reteste de caso benigno e documentação do limite de inferência.
