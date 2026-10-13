# LAB-03 — Virtualização

**Trilha paralela:** Laboratório e Ferramentas  
**Posição:** 3/30  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** LAB-02  
**Próxima recomendada:** LAB-04  
**Ambiente:** VM/localhost/escopo autorizado  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Uma VM “de laboratório” foi criada com adaptador em bridge e pasta pessoal compartilhada. O disco do convidado é separado, mas o serviço que você iniciou pode estar visível na LAN e o convidado consegue alterar arquivos do host. A aula constrói uma VM com fronteiras explícitas e comprova uma conexão entre dois convidados, sua interrupção e o restabelecimento.

## Hipervisor e fronteiras

O host fornece CPU, memória, armazenamento e dispositivos virtuais; o guest executa seu próprio kernel. Uma vCPU é agendada sobre CPUs do host. RAM e discos virtuais têm limites, e um disco dinamicamente alocado ainda pode consumir o espaço livre do host. Um snapshot registra estado da VM; não substitui cópia independente. Drivers, integrações, área de transferência, USB e pastas compartilhadas abrem caminhos adicionais entre host e guest.

O modo de rede decide que participantes estão ligados ao adaptador, não o que o firewall do guest permite. Um serviço precisa de processo, listener em endereço correto, rota e regra permissiva para funcionar. O simples fato de existir uma VM não decide nenhuma dessas quatro condições.

| Modo VirtualBox | Relação típica | Decisão para este lab |
|---|---|---|
| NAT | Guest inicia acesso usando tradução do host; regras podem publicar portas | Usar apenas na preparação de atualizações; desligar antes do teste |
| Bridge | Guest participa da rede física escolhida | Não usar no cenário isolado |
| Host-only | Rede virtual inclui host e convidados conectados | Adequado quando acesso do host é desejado, mas não o exclui |
| Internal Network | Convidados com mesmo nome de rede se comunicam sem interface normal do host nessa rede | Usar `csh-lab03` em ambos |
| Cabo desconectado | Placa virtual existe, mas seu link está inativo | Caso negativo controlado |

Essas são propriedades dos modos, não garantia contra toda configuração adicional: um segundo adaptador NAT ou uma VM roteadora pode criar saída. Confira **todos** os adaptadores e dispositivos. Referência: [rede virtual do VirtualBox](https://www.virtualbox.org/manual/ch06.html).

## Preparação concreta

Em host próprio com VirtualBox instalado, prepare duas VMs Linux, `csh-servidor` e `csh-cliente`, com Python 3 e curl instalados durante a preparação. Use imagens obtidas do fornecedor, registre versão do hipervisor/guest, hashes e recursos. Como ponto de partida para Linux leve, reserve 2 vCPUs e 2 GiB por guest somente se o host tiver folga; ajuste aos requisitos da distribuição e monitore memória/disco.

Desligue os convidados. Em Settings → Network, configure o adaptador 1 de ambos como Internal Network, nome `csh-lab03`, cabo conectado. Desative os demais adaptadores. Desative pastas compartilhadas, clipboard bidirecional, drag-and-drop e passagem USB. Tire um snapshot desligado `lab03-base` para o exercício, depois ligue as VMs.

No terminal de cada guest, descubra o nome real da interface com `ip -br link` e use-o no lugar de `enp0s3` abaixo. Os comandos adicionam endereços apenas à placa interna identificada. Se ela já tiver configuração de outra atividade, use uma VM nova em vez de apagar suas rotas.

```sh
# csh-servidor
sudo ip link set enp0s3 up
sudo ip addr add 192.168.77.10/24 dev enp0s3
ip -br addr
ip route
# csh-cliente: executar nesta OUTRA VM
sudo ip link set enp0s3 up
sudo ip addr add 192.168.77.11/24 dev enp0s3
ip -br addr
ip route
```

Não adicione gateway nem DNS para esta troca numérica interna. Confira a rota conectada `192.168.77.0/24` e ausência de default route. Isso complementa a inspeção do hipervisor; sozinho não prova ausência de acesso por dispositivos compartilhados.

## Laboratório e resultados

Baixe [LAB-03-canary.py](/course-labs/phase16-foundations/LAB-03-canary.py) na VM servidor, durante a preparação. O programa não serve arquivos do diretório.

```sh
# Servidor, terminal 1
python3 LAB-03-canary.py --bind 192.168.77.10
# Servidor, terminal 2
ss -ltn 'sport = :8080'
# Cliente
curl --noproxy '*' --connect-timeout 2 --max-time 3 -i http://192.168.77.10:8080/canary
curl --noproxy '*' --connect-timeout 2 --max-time 3 -i http://192.168.77.10:8080/ausente
```

Espere listener em `192.168.77.10:8080`, HTTP 200 e `CSH-LAB03` para `/canary`, HTTP 404 para `/ausente`. O 404 confirma que houve rede e resposta da aplicação; não é bloqueio da rede. O log do servidor deve registrar ambas as URLs. Curl sem `--fail` pode sair 0 mesmo com HTTP 404: registre status HTTP além do exit code.

Caso negativo de **rede**: no hipervisor, desmarque “Cable connected” apenas no adaptador do cliente. Repita o GET /canary. Espere falha de transporte antes do limite total, sem novo GET registrado no servidor. O código exato pode variar entre timeout e indisponibilidade de rota. Reconecte o cabo e repita: o mesmo GET deve voltar a 200. No host, examine as configurações de adaptadores para verificar que não há interface host-only nessa rede; não use falha de ping isolada como prova de isolamento.

## Detecção, correção e reteste

Se /canary nunca funcionou, o negativo não discrimina a desconexão. Primeiro confirme IPs sem duplicação, nome idêntico da Internal Network e listener específico. Se aparecer `127.0.0.1:8080`, o servidor está acessível só no guest local; reinicie com o bind documentado. Se aparecer timeout com o link ativo, consulte firewall do guest e libere somente TCP/8080 entre `.11` e `.10` na interface interna, conforme a ferramenta da distribuição. Não desative todo o firewall.

Se o cliente responder mesmo após desligar o cabo correto, procure segundo adaptador, proxy de ambiente ou teste executado no guest errado. O comando usa `--noproxy '*'` para reduzir essa ambiguidade. Corrija a topologia e refaça a sequência 200 → transporte falha → 200 com horários e logs do receptor.

## Prática, evidência e limites

Parcial: preencha uma tabela com VM, MAC, interface, IP, modo e papel. Explique qual linha teria de mudar para incluir o host. Independente: mantenha a topologia e mude apenas o caminho para `/ausente`; demonstre que HTTP404 e timeout pertencem a camadas diferentes.

Registre configuração dos adaptadores, `ip route`, `ss`, três resultados do teste do cabo e logs. Ao terminar, pare o servidor com Ctrl+C e restaure `lab03-base` se quiser desfazer os IPs temporários; eles também não são configuração persistente de rede. Snapshot não remove arquivos compartilhados do host. O script HTTP pode ser verificado em loopback; isso **não** comprova o isolamento das VMs. A validação do hipervisor exige os dois convidados reais.

## Quiz

1. **Qual configuração inclui explicitamente o host na rede virtual?** A) Internal. B) Host-only. C) NAT sem encaminhamento de portas, como uma rede compartilhada com o host.
2. **GET /ausente retorna HTTP404. Qual conclusão é válida?** A) Não houve conexão. B) A VM está isolada da LAN. C) A aplicação respondeu e recusou o caminho.
3. **Por que olhar adaptadores 2, 3 e 4?** A) Outro adaptador pode fornecer rota fora da rede interna. B) Só para conferir IPs: Internal no adaptador1 isola automaticamente os demais. C) Só para somar portas: o modo do adaptador1 vale para toda a VM.

**Gabarito:** 1 B; 2 C; 3 A. Cada conclusão se refere à camada realmente observada.

## Flashcards

- **Internal Network** → Rede entre convidados com mesmo nome, sem interface normal do host nessa rede.
- **Bind do listener** → Define endereços locais em que o processo aceita conexões.
- **HTTP404 versus timeout** → Resposta da aplicação versus ausência de resposta dentro do prazo.
- **Teste de isolamento** → Inspeção da topologia mais positivo, negativo controlado e reteste.
