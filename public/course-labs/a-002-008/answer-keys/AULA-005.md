# AULA-005 — gabarito comentado / uso após a tentativa

Este gabarito pertence à **prova de transferência** da aula 005 e não comprova sozinho domínio do estudante. Compare seu raciocínio com cada critério e registre por que divergiu. O caso usa dados sintéticos em ambiente local.

## Questão 1

**Situação:** Um JWT tem header e payload decodificáveis. Já é confiável?

**Resposta fundamentada:** Não. Verificar assinatura, algoritmo, expiração, issuer/audience e regras do contexto.

**Erro eliminatório:** Confundir Base64URL com validação criptográfica.

## Questão 2

**Situação:** Uma sessão expira às 3000ms e consulta ocorre exatamente em 3000. Aceita?

**Resposta fundamentada:** Não no contrato `now < exp`; comparar limite explicitamente.

**Erro eliminatório:** Aceitar com `<=` por acidente.

## Questão 3

**Situação:** O cookie contém `HttpOnly`. Isso bloqueia CSRF?

**Resposta fundamentada:** Não; o browser ainda envia o cookie conforme regras.

**Erro eliminatório:** Confundir acesso de script à string com envio do cookie.

## Questão 4

**Situação:** O usuário clica sair. Sessão no servidor ainda é aceita?

**Resposta fundamentada:** Não após revogação server-side.

**Erro eliminatório:** Só apagar estado visual do cliente.

## Questão 5

**Situação:** Token JWT curto expirará em dez minutos: ele pode ser invalidado imediatamente sem estado?

**Resposta fundamentada:** Não geralmente; exige revogação, rotação/versão, chave ou outra estratégia, conforme desenho.

**Erro eliminatório:** Afirmar revogação instantânea automática de JWT assinado.

## Questão 6

**Situação:** Por que colocar `Secure` e `SameSite=None` juntos?

**Resposta fundamentada:** None permite cross-site e exige Secure nos browsers modernos.

**Erro eliminatório:** Tratar None como configuração mais restrita que Strict.

## Rubrica de correção

- **1 ponto por questão:** resposta correta, justificativa causal e referência à decisão/controle. **0,5** quando falta justificativa; **0** quando consequência ou controle estão errados.
- **A da atividade (não equivale a nota editorial da aula):** pelo menos 5/6 pontos, nenhuma resposta com erro eliminatório e capacidade de reproduzir um caso positivo e um negativo com evidência observável.
- **B da atividade:** 4–4,5 pontos sem erro eliminatório; revise as lacunas e tente novamente com novo cenário.
- **Repetição/revisão:** se houver erro eliminatório ou menos de 4 pontos, volte ao mecanismo, corrija o caso e faça uma nova tentativa sem copiar o gabarito.
- O professor deve verificar a plausibilidade da justificação; o arquivo não é um avaliador automático da aprendizagem.
