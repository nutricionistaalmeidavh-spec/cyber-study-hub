# Gabarito separado — AULA-211: Reconhecimento e inventário autorizado

> Abra após escrever as respostas. Este gabarito descreve o modelo determinístico EscolaLab, não observação de aluno.

## Oráculo e análise

A fixture revela F001, owner alice e 15000 centavos; Alice recebe 200 e Bob recebe 403 no modo corrigido.

**Causa / princípio:** Inventário é uma descrição verificável do ativo e do seu dono; reconhecimento não implica explorar. A fronteira de confiança começa na afirmação fictícia de identidade via parâmetro ?as=. O servidor está preso a 127.0.0.1; isso NÃO o transforma em aplicação segura.

**Contraprova:** Não coloque endereço público ou IP de terceiros no CSV; um ativo fora de 127.0.0.1 ou fixture: é REJEITADO por escopo, mesmo que responda.

## Perguntas resolvidas

1. **Por que porta local não equivale a autorização de teste?** Escopo exige propriedade e autorização explícita, mesmo que o transporte esteja local.

2. **Qual é a diferença entre ativo, endpoint e identidade?** Ativo é recurso protegido; endpoint é interface; identidade é o sujeito da decisão.

3. **Como provar que F001 é fictício?** A fixture local fixa F001, Alice e 15000 centavos; não há base real no laboratório.

4. **Se uma rota pública responder, pode incluí-la no inventário?** Não. Uma resposta de rede não concede autorização nem integra o escopo.

5. **Por que registrar o modo corrigido ou vulnerável no baseline?** O modo altera o resultado esperado para Bob; sem baseline a conclusão é ambígua.

6. **Quais campos permitem que outra pessoa reproduza o inventário?** ID, endpoint, dono, identidade, tipo de dado, escopo, prova e versão.

## Transferência a F002/Carol

O cenário F002/Carol é hipótese no papel. A fixture atual só reconhece F001, Alice e Bob. Uma resposta correta prevê a necessidade de alterar o dataset e vincular autorização à propriedade da fatura antes de executar; NÃO alega que F002 foi ensaiada. O teste positivo deveria permitir Carol ver o próprio objeto; o negativo deve impedir outro ator. Registre escopo e condição de parada.

## Rubrica (100 pontos)

| Dimensão | Pontos | Evidência observável |
|---|---:|---|
| Mecanismo e conceitos | 30 | Explicação do fluxo e da fronteira de confiança |
| Causa/defesa | 20 | Controle no componente que decide o acesso |
| Contraprova segura | 20 | Entrada, esperado, observado e interpretação |
| Reteste positivo | 20 | Ação legítima continua válida |
| Escopo/limites | 10 | Dados sintéticos, autorização e conclusão proporcional |

**Meta 80/100. Erro eliminatório:** testar fora de escopo ou inventar evidência. A classificação editorial A não equivale a uma nota do aluno nem validação humana.

**Fonte:** https://csrc.nist.gov/pubs/sp/800/115/final
