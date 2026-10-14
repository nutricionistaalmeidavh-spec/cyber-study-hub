# Gabarito independente — AULA-106: Windows API

> Corrija depois de responder. Os critérios são editoriais e não avaliação real de estudante.

## Referências de resposta

1. **GetLastError após chamada bem-sucedida demonstra quê?** Não deve ser interpretado como erro da operação anterior; leia após a falha da API documentada.
2. **Um HANDLE inválido é sempre NULL?** Não; algumas APIs usam INVALID_HANDLE_VALUE.
3. **Quando chamar CloseHandle?** Para handles apropriados e válidos, seguindo contrato da função de criação.
4. **Qual caso positivo?** Abrir e fechar o handle de objeto fictício autorizado.
5. **Qual caso negativo?** Negar abertura sem privilégios ou segunda liberação.
6. **Por que menos direitos importam?** Reduzem capacidades acessíveis pelo handle em caso de erro/abuso.

## Rubrica de correção

- **6 pontos:** um ponto por resposta específica correta (sem adivinhação pelo título).
- **2 pontos:** caso positivo e negativo com entrada, saída e razão, cada um vale um ponto.
- **1 ponto:** controle correto na causa, não apenas detecção.
- **1 ponto:** evidência reproduzível e limites declarados honestamente.
- **Aprovação sugerida:** ao menos 8/10 e nenhum erro eliminatório.

**Erro eliminatório:** confundir evidência de modelo com execução em Windows/terceiros, omitir caso negativo ou autorizar operação fora do contrato.

**Feedback de recuperação:** refaça o cenário anotando pré-condição, operação, privilégio, efeito permitido e caso legítimo; só então reveja o gabarito.
