# LAB-22 — Procmon

**Trilha paralela:** Laboratório e Ferramentas  
**Posição:** 22/30  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** LAB-21  
**Próxima recomendada:** LAB-23  
**Ambiente:** VM/localhost/escopo autorizado  
**Profundidade v2:** normal — 25–40 min + prática

---

## 1. Problema concreto

Procmon registra operações de filesystem, Registry, processo/thread.

Nesta trilha, o objetivo é entender o que a ferramenta observa e quais conclusões não prova sozinha. O tema **Procmon** precisa virar um modelo que permita prever comportamento antes de abrir uma ferramenta.

Imagine que você recebe somente uma captura, um erro ou uma saída relacionada a **Procmon**. Se não souber quais objetos e estados deveriam existir, qualquer conclusão vira chute.

**Pergunta de abertura:** qual estado existe antes de Procmon e qual evidência mudaria depois?

## 2. Objetivos

Ao terminar, você deve conseguir:

1. explicar Procmon sem definição circular;
2. reconhecer os elementos operation; path; result; process;
3. narrar o mecanismo passo a passo;
4. executar/simular um exemplo mínimo em ambiente próprio;
5. prever o resultado antes de executar;
6. produzir um caso positivo e um negativo;
7. registrar evidência suficiente para reteste;
8. relacionar o tema a uma decisão de segurança ou operação.

## 3. Fundamentos

### Definição operacional

Procmon registra operações de filesystem, Registry, processo/thread.

### Elementos

- **operation** — localize este elemento no mecanismo e no experimento, não apenas na definição.
- **path** — localize este elemento no mecanismo e no experimento, não apenas na definição.
- **result** — localize este elemento no mecanismo e no experimento, não apenas na definição.
- **process** — localize este elemento no mecanismo e no experimento, não apenas na definição.


### O que não confundir

- o nome do conceito não é o mesmo que uma ferramenta;
- uma saída isolada não explica causa;
- “funcionou” não significa “entendi”;
- comportamento normal precisa de baseline para que desvio tenha significado.

## 4. Mecanismo interno

Filtros por processo/tempo deixam a timeline compreensível.

Use este fluxo mental:

```text
estado inicial
   ↓
entrada/operação de Procmon
   ↓
regra/componente que interpreta
   ↓
novo estado
   ↓
evidência observável
```

**Checkpoint 1:** descreva cada caixa do fluxo usando substantivos concretos desta aula. Se você escrever apenas “sistema”, “coisa” ou “processo” sem especificar, refine.

## 5. Exemplo técnico

```text
1. Defina escopo
2. Gere um evento benigno conhecido
3. Observe com Procmon
4. Salve a menor evidência
5. Repita com caso negativo
```

**Resultado esperado:** evidência reproduzível do evento de laboratório.

Antes de executar, escreva uma previsão. Depois compare a saída real. A diferença entre previsão e observação é material de estudo, não algo a esconder.

## 6. Prática guiada

### Passo 1 — baseline

Registre ambiente, versão, identidade e estado inicial.

```text
data/hora:
ambiente:
versão:
estado inicial:
resultado esperado:
```

### Passo 2 — caso positivo

Execute o exemplo mínimo ou equivalente local. Salve somente a saída relevante.

**Esperado:** evidência reproduzível do evento de laboratório.

### Passo 3 — variação controlada

Mude **uma** variável relacionada a operation ou path. Antes de executar, complete:

> “Espero que ______ porque ______.”

### Passo 4 — caso negativo

Crie um cenário semelhante que não deveria produzir o mesmo sinal. Ele é essencial para descobrir se sua evidência realmente discrimina a condição estudada.

### Checkpoint 2

Qual única mudança explica a diferença entre caso positivo e negativo?

### Checkpoint 3

Se a saída divergiu do previsto, classifique primeiro: conceito, estado anterior, permissão, versão, sintaxe ou ambiente. Não altere cinco coisas de uma vez.

## 7. Conexão com segurança

Em segurança, **Procmon** é útil quando você precisa separar comportamento normal de desvio. Pergunte:

1. qual é a fronteira de confiança?
2. quem pode alterar o estado?
3. qual entrada é controlável?
4. qual evidência existe perto do mecanismo?
5. qual controle atua na causa?

Nunca use ausência de log como prova automática de ausência de atividade.

## 8. Observabilidade / detecção

Procure evidência compatível com o mecanismo: estado, erro/status/exit code, arquivo/processo/pacote/objeto alterado, identidade efetiva e sequência temporal.

Uma hipótese boa também prevê o que aconteceria **se estivesse errada**. Se todos os resultados confirmam sua hipótese por definição, o teste é fraco.

## 9. Correção / hardening

Quando Procmon participa de um problema, siga esta ordem:

1. defina o comportamento esperado;
2. reduza ambiguidade e privilégio;
3. valide entrada/estado relevante;
4. torne falhas observáveis;
5. aplique o controle;
6. repita o mesmo caso positivo;
7. repita o caso negativo e um fluxo legítimo.

O reteste precisa usar o mesmo critério que demonstrou o problema.

## 10. Troubleshooting

Se o laboratório não produzir o esperado:

- confirme runtime/ferramenta;
- confirme ambiente próprio/local;
- leia o erro completo;
- verifique permissão, path, porta e versão;
- restaure baseline;
- reduza para o menor caso reproduzível.

## 11. Erros comuns

- decorar operation sem relacioná-lo ao estado real;
- copiar comando sem prever saída;
- trocar ferramenta antes de entender a camada;
- não criar caso negativo;
- confundir correlação temporal com causalidade;
- corrigir e testar um caso diferente do reproducer original.

## 12. Desafio

Explique **Procmon** usando exatamente:

```text
objeto → estado → operação → regra → evidência → controle
```

Depois crie um exemplo válido, um caso limite e um falso positivo plausível.

## 13. Quiz

1. **Qual definição descreve melhor Procmon?**
   - A) Procmon registra operações de filesystem, Registry, processo/thread. ✅
   - B) É apenas o nome de uma ferramenta.
   - C) É qualquer evento raro observado no ambiente.
   - D) É um controle que elimina a necessidade de entender o mecanismo.

2. **Qual conjunto pertence diretamente ao mecanismo desta aula?**
   - A) operation; path; result; process. ✅
   - B) Apenas nome do arquivo e cor da interface.
   - C) Somente severidade sem evidência.
   - D) Nenhum estado observável.

3. **Qual é a melhor prática experimental?**
   - A) Prever resultado, executar caso mínimo, variar uma condição e criar caso negativo. ✅
   - B) Mudar várias variáveis até funcionar.
   - C) Copiar screenshot pronto.
   - D) Ignorar o baseline.

4. **Por que o caso negativo importa?**
   - A) Porque testa se o sinal realmente discrimina a condição. ✅
   - B) Porque substitui o caso positivo.
   - C) Porque todo caso negativo é incidente.
   - D) Porque elimina o reteste.

5. **Após uma correção, o que deve ser repetido?**
   - A) O mesmo reproducer, mais caso legítimo/negativo. ✅
   - B) Um teste diferente para facilitar.
   - C) Apenas a leitura do código.
   - D) Nada, se o commit foi aceito.

## 14. Flashcards

- **Procmon** → Procmon registra operações de filesystem, Registry, processo/thread.
- **operation** → elemento que precisa aparecer na explicação do mecanismo.
- **path** → elemento que deve ser ligado a estado/evidência.
- **Baseline** → estado conhecido antes da variação.
- **Caso positivo** → cenário que deve produzir a evidência prevista.
- **Caso negativo** → cenário semelhante que não deve produzir a mesma evidência.
- **Reteste** → repetição do mesmo critério após a correção.

## 15. Fechamento

Responda novamente à pergunta de abertura. Sua nova resposta precisa citar pelo menos um objeto, uma transição e uma evidência.

**Próxima recomendada:** LAB-23.
