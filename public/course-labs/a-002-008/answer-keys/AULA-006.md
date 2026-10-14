# AULA-006 — gabarito comentado / uso após a tentativa

Este gabarito pertence à **prova de transferência** da aula 006 e não comprova sozinho domínio do estudante. Compare seu raciocínio com cada critério e registre por que divergiu. O caso usa dados sintéticos em ambiente local.

## Questão 1

**Situação:** Um UUID aleatório impede IDOR de maneira suficiente?

**Resposta fundamentada:** Não; imprevisibilidade não substitui verificar permissão sobre objeto.

**Erro eliminatório:** Afirmar que ID difícil de adivinhar dispensa autorização.

## Questão 2

**Situação:** Bia edita R10 de Ana usando sessão válida. Resultado correto?

**Resposta fundamentada:** Negar antes de alterar dados; 403 ou 404 conforme contrato, sem vazar o pedido.

**Erro eliminatório:** Aceitar por estar autenticada.

## Questão 3

**Situação:** Consulta escopada `id=R10 AND owner=bia` retorna zero. Que conclusão é segura?

**Resposta fundamentada:** Bia não tem aquele pedido sob regra de ownership; verificar política de outros papéis se houver.

**Erro eliminatório:** Dizer que o recurso não existe globalmente.

## Questão 4

**Situação:** Leitura bloqueada, mas exportação CSV sem filtro. Está resolvido?

**Resposta fundamentada:** Não; mesmo objeto exige autorização em todas as rotas.

**Erro eliminatório:** Testar apenas GET de detalhes.

## Questão 5

**Situação:** Admin pode ler todos os objetos neste lab. O que ainda deve ser testado?

**Resposta fundamentada:** Papel admin autenticado na origem confiável, ação permitida, auditoria e restrições de tenant se políticas exigirem.

**Erro eliminatório:** Aceitar string admin enviada via query.

## Questão 6

**Situação:** Que evidência demonstra ausência de corrupção no caso negativo?

**Resposta fundamentada:** Status de negação E estado do objeto antes/depois inalterado; positivo legítimo ainda altera quando autorizado.

**Erro eliminatório:** Olhar somente a cor do botão ou o status.

## Rubrica de correção

- **1 ponto por questão:** resposta correta, justificativa causal e referência à decisão/controle. **0,5** quando falta justificativa; **0** quando consequência ou controle estão errados.
- **A da atividade (não equivale a nota editorial da aula):** pelo menos 5/6 pontos, nenhuma resposta com erro eliminatório e capacidade de reproduzir um caso positivo e um negativo com evidência observável.
- **B da atividade:** 4–4,5 pontos sem erro eliminatório; revise as lacunas e tente novamente com novo cenário.
- **Repetição/revisão:** se houver erro eliminatório ou menos de 4 pontos, volte ao mecanismo, corrija o caso e faça uma nova tentativa sem copiar o gabarito.
- O professor deve verificar a plausibilidade da justificação; o arquivo não é um avaliador automático da aprendizagem.
