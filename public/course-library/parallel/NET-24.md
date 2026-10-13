# NET-24 — HTTPS

**Trilha paralela:** Redes para Segurança  
**Posição:** 24/40  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** NET-23  
**Próxima recomendada:** NET-25  
**Ambiente:** localhost, VM e PCAPs de laboratório  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Acesse HTTPS em loopback com uma CA local explícita e prove duas rejeições diferentes: CA desconhecida e nome de servidor incorreto. O objetivo é observar autenticação do servidor e confidencialidade do HTTP no transporte.

## Mecanismo e exemplo resolvido

HTTPS encapsula mensagens HTTP em TLS. O cliente abre TCP, negocia TLS e valida a cadeia do certificado, a validade temporal e a identidade esperada. Neste lab a CA assina um certificado com SAN DNS:localhost. Conectar ao IP 127.0.0.1 não altera o nome verificado: server_hostname="localhost" declara a identidade esperada. A confiança é adicionada apenas ao contexto do cliente, não ao armazenamento global do sistema.

Caso aceito: CA local carregada + localhost no SAN → handshake → GET /segredo → HTTP 200. Caso CA desconhecida: a validação da cadeia falha antes do GET. Caso outro.local: a CA é confiável, mas a identidade não coincide; falha antes de enviar o HTTP. A resposta tem MARCADOR_TLS_16; os bytes encaminhados pelo proxy TLS não contêm esse texto.

```python
cliente = ssl.create_default_context(cafile="ca.pem")
# CA e hostname continuam sendo verificados; não use CERT_NONE.
with cliente.wrap_socket(socket_tcp, server_hostname="localhost") as tls:
    tls.sendall(b"GET /segredo HTTP/1.1\r\nHost: localhost\r\n\r\n")
```

## Laboratório reproduzível

Arquivos: [tls_local.py](/course-labs/phase16-foundations/tls_local.py). Baixe os arquivos para uma pasta própria e mantenha os nomes.

```sh
python3 --version
openssl version
python3 "tls_local.py"
```

## Prática e autoexplicação

Baixe tls_local.py; exige Python 3 com ssl e OpenSSL CLI. O programa cria CA/servidor temporários, executa clientes e encerra listeners. Parcial: identifique no resultados.json qual campo prova o status HTTP e qual prova a versão TLS. Independente: explique o resultado de confiar na CA e verificar outro.local. Autoexplicação: por que HTTPS não pode ser demonstrado com curl http://...?

## Solução comentada e checkpoints

Checkpoint: TLS12 e TLS13 têm HTTP=200 e versões TLSv1.2/TLSv1.3; CA-nao-confiavel e hostname-incorreto têm resultado rejeitado. A confiança na CA não corrige o nome errado. resultados-tls contém CA pública, registros e PCAPs reconstruídos; as chaves privadas temporárias da CA/servidor são removidas ao terminar.

## Robustez, reteste e diagnóstico

Não use -k ou desative check_hostname para “corrigir” o negativo. Se o certificado expirar, gere outro executando o lab; os certificados valem um dia. Se OpenSSL não existir, instale-o antes da prática. HTTPS protege o transporte entre os endpoints, não torna o JSON confiável nem substitui autorização. Reteste sucesso e as duas rejeições após mudar qualquer configuração TLS.

## Quiz

1. **CA confiável com hostname errado deve:**
   - A) ser aceito porque a assinatura vale
   - B) ser aceito se o IP é local
   - C) ser rejeitado

2. **Qual evidência demonstra HTTP dentro do TLS?**
   - A) 200 recebido pelo cliente TLS validado
   - B) handshake concluído, sem observar a resposta HTTP
   - C) certificado válido, sem enviar uma requisição

3. **Como confiar somente no lab?**
   - A) desativando toda verificação
   - B) carregando a CA no contexto específico
   - C) adicionando a CA didática ao repositório global do sistema

**Gabarito comentado:** 1: C — a identidade esperada também precisa coincidir. 2: A — o HTTP só foi enviado após handshake e validação. 3: B — a confiança fica limitada ao cliente criado.

## Flashcards

- **HTTPS** → HTTP transportado numa sessão TLS.
- **SAN** → Campo de identidades do certificado usado para verificar o nome.
- **CA local** → Âncora de confiança criada para este experimento, sem alterar o sistema.
