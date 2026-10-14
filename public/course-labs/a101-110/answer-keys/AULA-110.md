# Gabarito independente — AULA-110: Windows Internals

> Corrija depois de responder. Os critérios são editoriais e não avaliação real de estudante.

## Referências de resposta

1. **Por que PID isolado é insuficiente?** PID pode ser reutilizado; correlacione horário de criação e identidade de processo.
2. **Token equivale a handle?** Não; token caracteriza identidade/privilégios e handle representa referência com direitos sobre objeto.
3. **Como avaliar DLL carregada?** Confrontar caminho/dependências com inventário confiável e telemetria do próprio host.
4. **Que operação legítima preservar?** READ autorizado de report.txt.
5. **Que negativa reprovar?** WRITE sem ACL ou módulo em pasta não confiável.
6. **Como concluir sem exagerar evidência?** Reportar só os eventos do modelo, não inferir malware ou falha kernel.

## Rubrica de correção

- **6 pontos:** um ponto por resposta específica correta (sem adivinhação pelo título).
- **2 pontos:** caso positivo e negativo com entrada, saída e razão, cada um vale um ponto.
- **1 ponto:** controle correto na causa, não apenas detecção.
- **1 ponto:** evidência reproduzível e limites declarados honestamente.
- **Aprovação sugerida:** ao menos 8/10 e nenhum erro eliminatório.

**Erro eliminatório:** confundir evidência de modelo com execução em Windows/terceiros, omitir caso negativo ou autorizar operação fora do contrato.

**Feedback de recuperação:** refaça o cenário anotando pré-condição, operação, privilégio, efeito permitido e caso legítimo; só então reveja o gabarito.
