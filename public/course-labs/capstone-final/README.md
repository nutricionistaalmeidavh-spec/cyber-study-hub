# Projeto Final Integrado (Aulas 209–218) — cenário único, local e reproduzível

**Cenário:** a EscolaLab possui uma única fatura fictícia `F001` da usuária **Alice**. A variante intencionalmente incorreta permite Bob ler a fatura; a versão corrigida retorna 403 a Bob, preservando acesso 200 da Alice. A cadeia de evidências liga **escopo → hipótese → teste → log → detecção → correção → reteste → decisão**.

## Rodar sem conta, Docker ou assinatura (Node 22+)

Da raiz do repositório:

```sh
node --test public/course-labs/capstone-final/lab.test.mjs
node public/course-labs/capstone-final/server.mjs
# em outro terminal:
curl 'http://127.0.0.1:4191/health'
curl -i 'http://127.0.0.1:4191/invoices/F001?as=alice' # 200
curl -i 'http://127.0.0.1:4191/invoices/F001?as=bob'   # 403
```

**Variante vulnerável controlada** (somente laboratório localhost): pare o servidor e execute `LAB_MODE=vulnerable node public/course-labs/capstone-final/server.mjs` em Linux/macOS; no PowerShell use `$env:LAB_MODE='vulnerable'; node public/course-labs/capstone-final/server.mjs`. Teste Bob com 200 e encerre; depois remova a variável (`Remove-Item Env:LAB_MODE` no PowerShell) e volte à variante corrigida. **Não exponha a porta externamente** e não ligue esse código a um projeto real. `?as=alice` é identidade inteiramente fictícia; nunca usá-la como autenticação verdadeira.

| Aula | Artefato gerado pelo aluno | Verificação |
| --- | --- | --- |
| 209 | SCOPE.md e LAB_ARCHITECTURE.md | host 127.0.0.1, portas, fluxo e condição de parada |
| 210 | THREAT_MODEL.md | ativo F001, usuários e fronteira entre identidade e ACL |
| 211 | ASSET_INVENTORY.csv | rotas /health e /invoices/F001 dentro do escopo |
| 212 | HYPOTHESES.md | hipótese Bob200 vs Bob403 e critério de prova |
| 213 | EVIDENCE_LOG.md | comparação com timestamp, HTTP, origem e versão |
| 214 | TIMELINE.csv | sequência de eventos JSON, preservando ordem temporal |
| 215 | detections/ e TEST_CASES.md | alerta no cenário vulnerável, ausência após correção |
| 216 | REMEDIATION_PLAN.md | vincular acesso à propriedade e teste positivo |
| 217 | RETEST_REPORT.md | Alice 200, Bob 403, outro usuário 404 |
| 218 | FINAL_REPORT.md e apresentação executiva | evidências, causa, limite e decisão para não técnicos |

## Templates e qualidade A

Use `templates/` para iniciar a **mesma** investigação em todas as etapas. Eles são formulários de estudo, não gabaritos. Critérios: autorização definida, prova causal, evidência rastreável, explicação de falso positivo/negativo, preservação do caso legítimo e limite do experimento. Execute uma alteração por vez. Salve dados fictícios, jamais dados pessoais ou credenciais.

**Extensões opcionais:** `utilidades/artisys-reporting` para consolidar evidências, `artisys-pdf` para formatar o relatório, `artisys-qa` / `artisysScan` para CI e registros; referências `frontEnds` apenas com acesso privado, sem cópia para o Hub público. Nenhum desses kits é necessário para concluir.

**O que o lab não prova:** proteção de sessão real, isolamento de tenants, segurança de rede, detecção em SIEM real ou conformidade de produção. É um toy app didático deliberadamente inseguro no modo opcional `vulnerable`.
