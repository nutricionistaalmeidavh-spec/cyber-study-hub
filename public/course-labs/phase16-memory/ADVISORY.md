# CSH-MEM-01 — advisory educacional local

Identificador interno; NÃO é CVE atribuído. Produto próprio: parser CSH Record, versão v1 (`parser.c` sem FIXED). Versão corrigida: v2, mesmo arquivo com `-DFIXED`. Data: 2026-09-02. Plataforma ensaiada: Linux x86-64/GCC; ver `build/environment.json`.

## Contrato e causas

`N | n | corpo` copia n bytes para `char name[8]` e escreve terminador. v1 aceita n=8 por validar `n > 8`. A escrita do terminador em índice 8 viola o objeto: CWE-193/off-by-one com escrita fora dos limites. `R | índice | corpo` em v1 não valida índice contra o corpo; `R 08 58` tenta ler além do arquivo de três bytes: CWE-125. Essas são duas causas e dois patches, não duas assinaturas do mesmo bug.

## Exposição e impacto demonstrados

Entrada local precisa ser entregue ao executável de laboratório; o driver não abre rede nem carrega bibliotecas fornecidas pelo usuário. ASan demonstra stack-buffer-overflow na escrita e heap-buffer-overflow na leitura. Não foi demonstrada execução arbitrária, extração de segredo real, persistência ou impacto remoto. Não é atribuído CVSS sem uma implantação e modelo de exposição; registrar métricas inventadas prejudicaria a conclusão.

## Reprodução e reteste

Executar `python3 run.py build` e `python3 run.py parser`. Os hashes estão em `fixtures/manifest.json`. `overflow8.bin` e `overflow8b.bin` pertencem à mesma causa; `read-oob.bin` pertence à segunda. Logs completos e códigos de saída são preservados pelo runner. A versão v2 deve retornar 2 para os três e continuar aceitando `valid.bin`, `zero.bin`, `boundary7.bin` e `read-ok.bin`.

## Correção semântica

No ramo N, `n >= sizeof name` rejeita a falta de espaço para o NUL. No ramo R, `n >= size - 2` rejeita índice inexistente. O guarda `size < 2` vem antes da subtração e impede underflow de size_t. O patch não é apenas habilitar NX, ASLR ou um sanitizer.

## Critério de fechamento

Reprodução v1 + regressão v2 + caso válido + variante com mesma causa + hashes e ambiente. Fontes, driver e fixture constituem o pacote reproduzível; nenhuma afirmação desta ficha depende de vulnerabilidade de terceiros. A ausência de alerta após patch é limitada aos inputs e configurações executados.
