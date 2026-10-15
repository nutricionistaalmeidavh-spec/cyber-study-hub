# Gabarito separado — AULA-217: Reteste e regressão

> Abra após escrever as respostas. Este gabarito descreve o modelo determinístico EscolaLab, não observação de aluno.

## Oráculo e análise

Imprime PASS após quatro assertivas. Falha em qualquer resultado deve bloquear a conclusão, não mudar o esperado.

**Causa / princípio:** Reteste reproduz a hipótese no mesmo alvo e entradas; regressão assegura que o caminho legítimo permaneceu intacto. Três identidades fictícias cobrem permitir, negar e inexistente, sem validar autenticação real.

**Contraprova:** Se a correção mudar o resultado da Alice para 403, marque regressão mesmo que Bob esteja negado; não aceite 'tudo bloqueado' como defesa.

## Perguntas resolvidas

1. **Qual diferença entre reteste e regressão?** Reteste confirma correção do achado; regressão verifica funções preservadas.

2. **Por que manter o mesmo objeto F001?** Para comparar o mesmo controle e reduzir variáveis intervenientes.

3. **Qual assert prova preservação legítima?** Alice no modo corrected permanece 200.

4. **Se Bob 403 e Alice 403, o relatório pode dizer corrigido?** Não. Houve regressão funcional e não se atingiu o contrato de aceite.

5. **Se o modo vulnerable deixar de reproduzir 200, o que registrar?** Diferença de versão/ambiente ou hipótese não reproduzida, exigindo análise.

6. **Qual limite deve acompanhar o PASS?** Somente uma função e fixture sintéticas, sem autenticação ou infraestrutura real.

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

**Fonte:** https://owasp.org/www-project-web-security-testing-guide/
