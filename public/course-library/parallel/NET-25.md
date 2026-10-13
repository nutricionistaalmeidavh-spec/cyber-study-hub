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

---

## Oficina de diagnóstico TLS — negociação, identidade e provas

**Você não precisa decorar cifras para começar.** TLS é o protocolo que negocia proteção para dados entre aplicações. Primeiro o cliente e servidor combinam versão e parâmetros; depois estabelecem chaves e verificam as mensagens relevantes do handshake. O certificado informa uma chave pública e uma identidade; **a presença de um certificado não significa que o nome foi verificado ou que a CA é confiável**.

### Os quatro resultados que você deve distinguir

1. **TLS 1.2 com cliente que exige 1.2 e servidor que suporta 1.2:** espera-se negociação 1.2; a cifra efetiva é registrada pela sessão e pode variar por ambiente.
2. **TLS 1.3 com cliente e servidor compatíveis:** espera-se 1.3; o formato da suíte TLS 1.3 difere do formato de uma suíte ECDHE-RSA de TLS 1.2.
3. **Cliente só 1.3, servidor só 1.2:** handshake falha **antes** da aplicação HTTP; não é status 500.
4. **Versão compatível, mas CA não confiável ou hostname incorreto:** handshake pode chegar à verificação do certificado, mas o cliente **deve rejeitar** a conexão. Negociar cifra não garante identidade.

### Prática guiada: leia os resultados do laboratório

Na pasta do programa `tls_local.py`, execute `python3 tls_local.py`. Ele cria material criptográfico de laboratório, testa conexões locais e produz o resultado estruturado. **Não reutilize** essa CA, as chaves ou as sessões geradas como infraestrutura real.

Os resultados que foram observados no ambiente de referência da Fase 16 para as conexões positivas são `TLSv1.2` e `TLSv1.3`, com HTTP 200 em ambas. Os casos de CA não confiável e hostname incorreto são rejeitados. A suíte exata depende da versão da biblioteca; o requisito é registrar `tls.version()` **na conexão negociada** e a cifra escolhida, não apenas a configuração máxima disponível.

### Exercício parcialmente resolvido

Complete: o ClientHello oferece `______`; o ServerHello escolhe `______`; a verificação do certificado verifica `______`; Finished contribui para verificar `______`. Resposta orientadora: versões/parâmetros; os compatíveis; identidade do servidor/cadeia de confiança/nome; integridade do transcript e posse de segredos do handshake.

**Uma distinção essencial:** as reconstruções `.pcap` do material são artefatos educacionais com *payload TLS real e cabeçalhos TCP sintéticos*. Isso serve a exercícios delimitados; não descreva a reconstrução como uma captura de rede original. Os arquivos `.keys` podem permitir desencriptar **aquelas sessões** no laboratório; não são prova de que a chave privada do certificado RSA por si só descriptografa um handshake com troca efêmera.

### Prática independente: revisão de um relatório incorreto

Um relatório afirma: “TLS 1.3 foi negociado porque o servidor suporta 1.3; a chave privada RSA do certificado serve para ler as sessões capturadas; a CA não confiável é irrelevante porque houve HTTP 200.” Reescreva cada uma das três frases:

- Evidência da **versão realmente negociada**: retorno do método de sessão `version()` enquanto ativa.
- **Separação de chaves**: material de assinatura/autenticação não é o mesmo que segredos de tráfego derivados; com troca efêmera, possuir a chave privada de longo prazo não basta para decriptar sessões passadas.
- **Autenticação do servidor**: CA confiável e hostname compatível são condições fundamentais de validação do cliente; o teste negativo deve ser rejeitado antes de confiar em HTTP.

### Checklist de execução e recuperação

- Registre `python3 --version`, a versão do OpenSSL acessível pelo módulo `ssl`, e os resultados de TLS1.2/TLS1.3.
- Se TLS1.2 não estiver disponível em seu ambiente, registre a limitação e não reporte execução bem-sucedida da comparação.
- Se o handshake falhar em ambos, confira a CA de laboratório, o hostname e o relógio do sistema antes de reduzir a política de verificação.
- Se um teste negativo aceitar a conexão, **reprove a configuração** e descubra qual verificação foi relaxada. Não “conserte” desativando `check_hostname` ou `CERT_REQUIRED`.
- Repita os casos positivos depois de corrigir o laboratório: uma configuração que rejeita todo o tráfego não demonstra TLS bem implementado.

### Avaliação de transferência

1. Um TLSv1.3 foi configurado como máximo; o handshake registrou TLSv1.2. Qual valor descreve a sessão? **TLSv1.2**, se o resultado veio do socket efetivamente negociado.
2. Uma conexão falha por CA não confiável. Por que não é HTTP 403? **Porque a aplicação HTTP não chegou a operar em uma sessão TLS confiável.**
3. TLS 1.2 usa ECDHE com autenticação RSA. Que papel tem o par RSA? **Autenticar/assinar**, não substituir automaticamente os segredos de tráfego.
4. Por que o `.keys` gerado deve ser protegido fora da fixture pública? **Pode conter segredos de sessão capazes de revelar conteúdo daquela captura.**
5. Qual observação demonstra falha de negociação por falta de versão comum? **Erro no handshake, sem resposta HTTP e com conjuntos de versões incompatíveis documentados.**

**Rubrica:** o estudante precisa diferenciar versão permitida da negociada, autenticação da troca de chaves, falha TLS de status HTTP, e evidência original de fixture sintetizada. Não avance se concluiu segurança apenas porque viu “cadeado”, “TLS” ou “HTTP 200”.

**Referências:** [RFC 8446 — TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446), [Python `ssl`](https://docs.python.org/3/library/ssl.html). O resultado do laboratório é uma observação local, não uma promessa universal de cifras.
