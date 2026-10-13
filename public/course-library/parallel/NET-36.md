# NET-36 — TLS no PCAP

**Trilha paralela:** Redes para Segurança  
**Posição:** 36/40  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** NET-35  
**Próxima recomendada:** NET-37  
**Ambiente:** localhost, VM e PCAPs de laboratório  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Inspecione duas conversas TLS reais, uma 1.2 e outra 1.3, e explique por que um certificado pode aparecer em uma e estar cifrado na outra. Use a mesma requisição para comparar o que é visível sem e com segredos de sessão.

## Mecanismo e exemplo resolvido

O gerador executa TLS real em sockets locais e registra os bytes por direção num proxy. Os PCAPs fornecidos são RECONSTRUÇÕES: Ethernet/IP/TCP, ACKs e timestamps são sintéticos; os payloads TLS vêm das sessões reais. Eles servem para estudar registros/handshake e descriptografia, nunca para medir RTT, perda ou retransmissão. A captura de interface não foi executada: o contêiner não permite socket raw e não tem tcpdump/tshark.

Em TLS1.2 deste lab, ClientHello, ServerHello e Certificate são visíveis antes da cifra. Em TLS1.3, após ServerHello as mensagens de handshake seguintes, inclusive Certificate, ficam cifradas. O campo record version legado pode mostrar 0x0303 até em TLS1.3: procure supported_versions. SNI localhost está no ClientHello deste fixture sem ECH. Não conclua que todo tráfego moderno expõe o nome: ECH pode ocultar o ClientHello interno quando implantado.

```text
Sem .keys: filtro tls.handshake.type == 1 → ClientHello
Sem .keys: filtro tls.handshake.type == 11 → Certificate visível no TLS12 do lab
TLS13 sem .keys: Certificate não deve ser legível
Com .keys: filtro http.request.uri == "/segredo" → GET recuperado
Com .keys: Follow TLS Stream → corpo com MARCADOR_TLS_16
```

## Laboratório reproduzível

Arquivos: [tls_local.py](/course-labs/phase16-foundations/tls_local.py), [resultados-tls/TLS12-reconstruido.pcap](/course-labs/phase16-foundations/resultados-tls/TLS12-reconstruido.pcap), [resultados-tls/TLS13-reconstruido.pcap](/course-labs/phase16-foundations/resultados-tls/TLS13-reconstruido.pcap), [resultados-tls/TLS12.keys](/course-labs/phase16-foundations/resultados-tls/TLS12.keys), [resultados-tls/TLS13.keys](/course-labs/phase16-foundations/resultados-tls/TLS13.keys), [resultados-tls/LEIA-ME.txt](/course-labs/phase16-foundations/resultados-tls/LEIA-ME.txt). Baixe os arquivos para uma pasta própria e mantenha os nomes.

```sh
python3 "tls_local.py"
```

## Prática e autoexplicação

Execute o gerador e abra TLS12-reconstruido.pcap e TLS13-reconstruido.pcap no Wireshark. Primeiro deixe (Pre)-Master-Secret log filename vazio; depois indique o .keys da mesma sessão em Preferences → Protocols → TLS e recarregue. Parcial: registre frame do ClientHello e do ServerHello. Independente: explique por que trocar TLS13.keys pelo de outra execução impede a descriptografia. Autoexplicação: ausência de Certificate legível prova ausência de certificado?

## Solução comentada e checkpoints

Checkpoint sem keys: ClientHello/ServerHello legíveis; HTTP e MARCADOR_TLS_16 ausentes como texto nos bytes do transporte; certificado de TLS1.3 cifrado. Com keys corretas, o objetivo manual é ler GET /segredo e HTTP 200. A verificação automática executada confirma sessões reais, status e ausência dos marcadores nos payloads cifrados; descriptografia no Wireshark não foi executada neste ambiente. Registre seus números de frames, pois o agrupamento de segmentos pode variar.

## Robustez, reteste e diagnóstico

Para captura real em VM Linux própria: inicie `sudo tcpdump -i lo -s 0 -w "tls-real.pcap" "tcp and host 127.0.0.1"`, execute tls_local.py em outro terminal e pare tcpdump com Ctrl+C. Feche outros serviços locais para reduzir coleta; selecione um fluxo com TLS no Wireshark (o proxy cria dois trechos). Essa etapa requer permissão de captura e permanece manual. Não atribua anomalias de TCP aos PCAPs reconstruídos. Reteste com keys removidas/adicionadas e compare versão 1.2/1.3.

## Quiz

1. **Certificate ausente em claro no TLS1.3 significa:**
   - A) servidor sem certificado
   - B) handshake falhou
   - C) mensagem pode estar cifrada

2. **O PCAP reconstruído permite medir RTT real?**
   - A) não
   - B) sim pelos timestamps
   - C) sim pelos ACKs

3. **Qual segredo possibilita ler estas sessões efêmeras?**
   - A) certificado público da CA
   - B) key log da sessão correspondente
   - C) só a chave privada RSA do certificado, mesmo com troca efêmera

**Gabarito comentado:** 1: C — o certificado vem após ServerHello protegido. 2: A — headers e tempos são didáticos. 3: B — o key log fornece os segredos usados naquela sessão.

## Flashcards

- **TLS1.3 no PCAP** → Handshake após ServerHello é cifrado.
- **SNI/ECH** → SNI é visível neste lab sem ECH; ECH pode proteger o ClientHello interno.
- **Key log** → Segredos de sessões específicos, distintos da chave privada do certificado.
