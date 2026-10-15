# AULA-211 — Reconhecimento e inventário autorizado: etapa executável do projeto EscolaLab

**ID canônico:** AULA-211. **Tipo:** projeto incremental. Este laboratório mantém o mesmo aplicativo fictício **EscolaLab F001** em todas as 10 aulas finais; não reinicie em outro cenário. **Software:** Node 22+ sem conta, Docker, assinatura ou serviço externo.

## Entrega a construir

**ASSET_INVENTORY.csv** — liste somente /health e /invoices/F001 com restrição de escopo. Use os templates correspondentes existentes na pasta `templates/`, preencha-os com a investigação da aula e salve cópia no seu próprio diretório de entregas (não sobrescrever templates do Hub).

**Arquivos fornecidos:** `../server.mjs` (aplicação local), `../model.mjs` (decisão e telemetria), `../stage-runner.mjs` (evidência da etapa) e `../stage.test.mjs` (regressão).

## Execute e capture a evidência

Da raiz do repositório:

```sh
node public/course-labs/capstone-final/stage-runner.mjs 211
node --test public/course-labs/capstone-final/stage.test.mjs public/course-labs/capstone-final/lab.test.mjs
```

Para observar HTTP de verdade, execute somente no seu computador:
```sh
node public/course-labs/capstone-final/server.mjs
# outro terminal: apenas http://127.0.0.1:4191
curl -i 'http://127.0.0.1:4191/invoices/F001?as=alice'
curl -i 'http://127.0.0.1:4191/invoices/F001?as=bob'
```

O modo corrigido deve produzir **Alice 200, Bob 403, identidade desconhecida 404**. O runner documenta também o comportamento errado **Bob 200** da variante `vulnerable` sintética. A variável de modo vulnerável é exclusiva de localhost e não demonstra autenticação real.

## Produza a entrega independente

1. Antes da execução, defina qual dado provaria ou refutaria a hipótese de reconhecimento e inventário autorizado.
2. Leia `exercise` e `evidence` no JSON; registre o resultado com ambiente, identidade, rota, retorno e limite.
3. Preencha `ASSET_INVENTORY.csv` no diretório próprio de entregas usando fatos deste **mesmo** laboratório.
4. Compare os estados antes/depois, explique causa, controle e resultado negativo. Não confunda status HTTP com prova de segurança completa.
5. Faça reteste; se falhar, anote falha e correção em vez de marcar automaticamente como aprovado.
6. Verifique se sua entrega é compreensível a um colega que não executou o laboratório.

## Rubrica A (0, 1 ou 2 por critério)

Escopo/autorização, execução rastreável, prova/contraprova, proteção da situação legítima e relatório comunicável. Meta 8/10, sem omitir falha crítica. Progresso marcado na interface não comprova a execução e o gabarito permanece separado.

**Limite:** aplicação deliberadamente simplificada sem autenticação, dados reais, TLS ou autorização de produção. Os sinais Sigma/YARA/EDR reais precisam de infraestrutura e telemetria adicionais; não afirmamos que foram instalados.
