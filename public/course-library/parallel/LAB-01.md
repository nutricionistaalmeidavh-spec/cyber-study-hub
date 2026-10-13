# LAB-01 — Ética, autorização e escopo

**Trilha paralela:** Laboratório e Ferramentas  
**Posição:** 1/30  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** início da trilha  
**Próxima recomendada:** LAB-02  
**Ambiente:** VM/localhost/escopo autorizado  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Uma atividade aprovada permite consultar a saúde de uma aplicação; o aluno descobre `/admin` no mesmo endereço e presume que pode testá-lo. O erro ocorreu antes da ferramenta: o ativo permitido foi confundido com autorização para qualquer ação. Ao terminar, você deve transformar uma autorização delimitada em decisões verificáveis, reconhecer uma condição de parada e registrar o que foi executado.

## Autorização, ética e mecanismo

Autorização vem de quem controla legitimamente o ativo e a atividade. O documento identifica responsável, executores, alvos, operações, janela, limites de carga, dados permitidos, contatos e encerramento. Ser capaz de alcançar um host, possuir uma conta ou encontrar informação pública não amplia esse acordo. Em avaliação profissional, encaminhe dúvidas contratuais ao responsável; este exercício ensina controle operacional, sem determinar a validade jurídica de contratos.

Ética inclui minimizar coleta, evitar perturbação e comunicar desvios. Escopo é uma fronteira executável: antes de cada operação, confira identidade do alvo, método, caminho, horário e sinal de parada. Um redirecionamento muda o destino e exige nova decisão; um hostname resolvido para outro IP também pode mudar o ativo. O lab elimina DNS e redirecionamentos para que o aluno enxergue primeiro uma decisão inequívoca.

### Autorização preenchida para este experimento

| Campo | Valor do exercício |
|---|---|
| Responsável e executor | O aluno que inicia o processo local em seu computador |
| Identificador | LAB-01-local; registro didático, sem autoridade sobre terceiros |
| Ativo | Listener HTTP criado pelo próprio script em 127.0.0.1, porta efêmera impressa na saída |
| Operação | Uma requisição GET /health, sem query, credenciais ou corpo |
| Janela | Da inicialização até cinco minutos depois; fim exclusivo |
| Exclusões | Outros IPs/portas, POST, /admin, redirecionamentos, enumeração e dados pessoais |
| Volume | Uma requisição real; decisões negativas avaliadas antes de abrir conexão |
| Parada | Flag de interrupção, horário expirado, autorização ausente ou saída inesperada |
| Evidência e retenção | JSON de decisões e contador; guardar apenas no relatório do exercício |
| Encerramento | Fechar listener e confirmar que a thread terminou |

Os campos de autorização no código são fixtures preenchidas pelo autor. A função não autentica uma assinatura nem sabe quem é dono de um alvo; ela demonstra a tradução de um acordo já obtido para um gate. Em um processo real, a origem e a versão do acordo precisam ser verificadas fora dessa função.

## Laboratório local real

Baixe [LAB-01-scope.py](/course-labs/phase16-foundations/LAB-01-scope.py). Requer Python 3, sem dependências, sem privilégios administrativos. O programa cria somente um servidor loopback e encerra-o ao final.

```sh
python3 LAB-01-scope.py
```

Antes de rodar, decida: `GET /health` deve alcançar o servidor? E `POST /health`? O IP documental `192.0.2.10` aparece apenas como entrada negativa e nunca recebe conexão. O HTTP permitido é real; as outras sete operações são bloqueadas na decisão.

| Variação | Decisão esperada | Efeito no servidor |
|---|---|---|
| GET /health, no horário | permitido | HTTP 200, corpo `{"status":"lab-ok"}` |
| POST ou /admin | acao-fora-do-escopo | Nenhuma requisição |
| Outro IP ou query de exportação | ativo-fora-do-escopo | Nenhuma requisição |
| Exatamente no fim da janela | fora-da-janela | Nenhuma requisição |
| Flag de parada ativa | parada | Nenhuma requisição |
| approval_id vazio | sem-autorizacao | Nenhuma requisição |

O resultado final deve conter `requests_recebidas: 1` e o processo deve sair com status 0. A assertiva no servidor testa o efeito real; apenas imprimir “bloqueado” não provaria ausência de envio.

## Exercício parcial e desafio independente

Parcial: explique por que a janela usa `start <= now < end`, e preencha a decisão em `now == end`. Depois adicione ao vetor de testes uma URL com porta diferente, mantendo o IP. Preveja decisão e contador final antes de executar. Independente: escreva um aditivo de escopo para **duas** consultas de saúde, incluindo quem aprova, novo limite e forma de comprovar o consumo. Não envie a segunda requisição até implementar o contador e seu teste de limite.

Gabarito parcial: no instante final, a atividade está fora da janela. Outra porta identifica outro listener e deve ser recusada. O contador continua 1. O aditivo precisa mudar volume autorizado e mecanismo; alterar apenas uma frase do relatório não altera o programa.

## Detecção, correção e reteste

Uma decisão ausente, um contador maior que 1 ou uma requisição registrada após parada são falhas do gate. Reproduza com a mesma entrada; verifique se a validação ocorre **antes** de `HTTPConnection.request`. Corrija a ordem ou o critério, repita o caso negativo e confirme que o GET legítimo ainda produz 200. Não “corrija” retirando a assertiva do contador.

Se houver dado de terceiro inesperado, interrompa a coleta e informe ao contato definido; não expanda o teste para investigar por conta própria. Se a execução local falhar por porta/socket indisponível, guarde o erro e marque o experimento não executado. A autoautorização didática não justifica contornar políticas de um ambiente gerenciado.

## Quiz

1. **Mesmo IP, nova porta: a autorização de /health continua suficiente?** A) Sim, a autorização de um IP cobre todas as suas portas. B) Sim, se o caminho /health continuar igual. C) Não, a identificação do ativo inclui o listener.
2. **A flag de parada foi ativada após uma resposta 200. O que fazer na próxima operação?** A) Bloquear antes de conectar. B) Fazer mais uma consulta. C) Apenas reduzir velocidade.
3. **O JSON diz “negado”, mas o contador do servidor subiu. O controle funcionou?** A) Sim, o status negado é evidência suficiente. B) Não: houve efeito apesar da decisão. C) Sim, desde que a resposta não tenha sido armazenada.

**Gabarito:** 1 C — endereço alcançável não define todas as operações permitidas; 2 A — autorização é reavaliada; 3 B — a evidência do efeito contradiz a intenção.

## Flashcards

- **Escopo operacional** → Ativo + ação + janela + limites + responsável + parada verificáveis.
- **Fim exclusivo da janela** → No instante `end`, a operação já deve ser recusada.
- **Negativo sem envio** → Entrada recusada antes da conexão, comprovada também no receptor.
- **Aditivo de escopo** → Nova autorização registrada antes de ampliar operações ou volume.
