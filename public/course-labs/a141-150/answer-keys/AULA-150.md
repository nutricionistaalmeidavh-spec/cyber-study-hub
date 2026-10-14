# Gabarito AULA-150: Extração de IOCs

Responda sem consultar esta referência. As saídas são exclusivamente sintéticas.

### Questão 1: Que campos mínimos dão contexto ao IOC?

**Resposta comentada:** Tipo, valor, fonte, confiança, expiração e justificativa.

### Questão 2: Por que domínios em caixa distinta são duplicados?

**Resposta comentada:** Normalização para minúsculas representa o mesmo indicador do tipo domain.

### Questão 3: Como lidar com um IOC vencido?

**Resposta comentada:** Separar como expirado e revalidar a fonte antes de reutilizar.

### Questão 4: IOC é confirmação de infecção?

**Resposta comentada:** Não; um indicador isolado é apenas evidência potencial.

### Questão 5: Que dano causa bloqueio automático sem contexto?

**Resposta comentada:** Falso positivo, indisponibilidade e bloqueio de serviço compartilhado.

### Questão 6: Qual validação precede publicação?

**Resposta comentada:** Verificar origem, permissão de compartilhamento, escopo e risco residual.

## Rubrica de correção

- 20 pontos — mecanismo e causa.
- 20 pontos — hipótese e resultado positivo.
- 20 pontos — contraprova e falso positivo.
- 20 pontos — defesa, continuidade legítima e reteste.
- 20 pontos — escopo seguro, evidência e limites.

**Erro eliminatório:** afirmar malware ou C2 real a partir de simulação, executar amostras desconhecidas, habilitar rede indevida ou omitir autorização.

**Nota:** sem teste com estudante ou revisor humano independente.
