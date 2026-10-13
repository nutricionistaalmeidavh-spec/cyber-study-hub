# NET-25 — TLS

**Trilha paralela:** Redes para Segurança  
**Posição:** 25/40  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** NET-24  
**Próxima recomendada:** NET-26  
**Ambiente:** localhost, VM e PCAPs de laboratório  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Compare uma sessão TLS 1.2 e uma TLS 1.3 usando a mesma CA e o mesmo servidor. Identifique versão negociada, cifra e o papel separado da autenticação e das chaves de sessão.

## Mecanismo e exemplo resolvido

O ClientHello oferece versões e parâmetros; o ServerHello escolhe os compatíveis. A autenticação com certificado permite ao cliente verificar a identidade do servidor. Neste experimento, ECDHE em TLS 1.2 e a troca efêmera de TLS 1.3 derivam segredos de sessão; a chave privada RSA do certificado autentica o servidor e não equivale à chave simétrica usada para cada registro. Finished verifica a integridade do transcript do handshake. O servidor pode suportar ambas as versões, mas cada conexão negocia uma só.

O cliente define minimum_version=maximum_version para controlar a comparação. TLS12 deve informar TLSv1.2, com uma suíte ECDHE-RSA disponível no OpenSSL; TLS13 informa TLSv1.3, com suíte como TLS_AES_256_GCM_SHA384. A cifra exata pode variar por build. Em TLS 1.3 o nome da suíte descreve cifra AEAD/hash, sem embutir o método de autenticação como em nomes de TLS 1.2.

```python
cliente.minimum_version = ssl.TLSVersion.TLSv1_3
cliente.maximum_version = ssl.TLSVersion.TLSv1_3
# Consulte antes de fechar/consumir o encerramento da sessão.
print(tls.version(), tls.cipher())
```

## Laboratório reproduzível

Arquivos: [tls_local.py](/course-labs/phase16-foundations/tls_local.py). Baixe os arquivos para uma pasta própria e mantenha os nomes.

```sh
python3 "tls_local.py"
```

## Prática e autoexplicação

Parcial: compare os campos versao e cifra dos dois registros sem deduzir a versão só pelo nome da cifra. Independente: limite um cliente a TLS1.3 e um servidor a TLS1.2 em cópia do lab; preveja ausência de versão comum. Autoexplicação: por que possuir o certificado público não permite descriptografar o HTTP capturado?

## Solução comentada e checkpoints

Checkpoint: versões diferem, mas ambos recebem o mesmo HTTP 200 validando localhost. Na variação incompatível, o handshake falha antes do HTTP; não é status HTTP 500. Certificado público identifica a chave pública; os segredos da sessão são derivados na negociação. O lab exporta segredos de sessão didáticos em .keys justamente para uma inspeção autorizada na próxima unidade.

## Robustez, reteste e diagnóstico

Não reutilize as chaves temporárias como infraestrutura. Os arquivos .keys permitem descriptografar estas sessões e devem ser tratados como sensíveis fora de um fixture público. Se TLS1.3 não estiver disponível, registre a versão da biblioteca ssl/OpenSSL e não reduza silenciosamente o objetivo a TLS1.2. Reteste as versões e os negativos de cadeia/nome: negociar cifra não substitui autenticação.

## Quiz

1. **Um erro de versão incompatível ocorre:**
   - A) após HTTP 500
   - B) antes do HTTP
   - C) depois de o servidor receber GET e escolher a cifra

2. **A chave privada do certificado é sempre a chave de tráfego?**
   - A) sim
   - B) sim em TLS1.3
   - C) não

3. **Qual campo é evidência direta da versão?**
   - A) tls.version() durante a sessão
   - B) o campo legado record version isoladamente
   - C) a versão máxima permitida no contexto, sem ler a negociada

**Gabarito comentado:** 1: B — não se estabelece a sessão TLS. 2: C — autenticação e segredos de sessão têm papéis diferentes. 3: A — o runtime informa a versão negociada.

## Flashcards

- **Handshake** → Negociação autenticada de parâmetros e segredos de sessão.
- **Finished** → Mensagem que verifica integridade do transcript e posse de segredos.
- **Forward secrecy** → Troca efêmera reduz o efeito de comprometimento futuro da chave de autenticação sobre sessões passadas.
