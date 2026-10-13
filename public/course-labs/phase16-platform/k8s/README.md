# Plataforma local — Services, securityContext e capstone

Pré-requisitos: Python 3.10+, Docker, kind, kubectl e Helm 3.13+. Use nó Kubernetes 1.34+ compatível com Cilium 1.20.1; o namespace fixa Pod Security restricted v1.34. Rede na primeira instalação.
Configuração Cilium baseada no guia oficial https://docs.cilium.io/en/stable/installation/kind/ consultado em 2026-09-02 (chart 1.20.1). A imagem do nó depende da versão de kind instalada; registre `kind version`, `kubectl version` e digests efetivos para repetir a plataforma exata. Não é lock completo de imagens.

1. Na raiz do projeto: `cd public/course-labs/phase16-platform/k8s`.
2. Teste HTTP local sem container: `python3 -m unittest -v test_server.py test_check.py` (6 testes).
3. Cluster isolado com CNI que aplica NetworkPolicy: `bash setup.sh`.
4. Integração de Deployment/Service/RBAC/NetworkPolicy/contexto/logs: `bash capstone.sh` (`run.sh` chama o mesmo roteiro).
5. Cleanup somente deste cluster: `kind delete cluster --name course-phase16`.

O script run recusa outro contexto. Ele demonstra conexão permitida, HTTP 401, selector quebrado/recuperado, label de cliente negada/recuperada, RBAC de logs versus secrets, UID/caps/seccomp, rootfs readonly e volume /tmp gravável. O roteiro tenta restaurar selector/label ao sair por erro. Se a restauração falhar, restaure `kubectl apply -f stack.yaml` e a label `kubectl -n course-platform label pod/client app=client --overwrite` antes de repetir.

`stack.yaml` contém todos os objetos; `server.py` é app próprio; `check.py` é o cliente HTTP real usado dentro do Pod. Segredo fictício é montado em runtime, nunca copiado à imagem. Sem NodePort, LoadBalancer ou portas do host.

CNI ausente/não aplicando policies: caso guest pode retornar 200 e DEVE falhar. Timeout isolado não prova política: correlacione EndpointSlice e repita allow após restauração. O roteiro aguarda contagem de endpoints e repete pedidos por prazo limitado; falha de convergência permanece erro. `deny-selector` aceita timeout/recusa, `deny-policy` exige timeout e ambos rejeitam HTTP e falha de DNS. `check_process.py` exige erro EROFS dentro do container; qualquer exit não zero não basta.

Execução de cluster não foi realizada na edição pois Docker/kubectl/kind/Helm estavam ausentes. Testes HTTP Python não validam Kubernetes, CNI, RBAC ou securityContext. Os resultados de runtime são esperados, não observados.

K8S-10: execute `set -o pipefail; bash capstone.sh 2>&1 | tee capstone-evidence.log` e conserve checkpoints, versões e retestes. Evidências esperadas não são evidências de execução. Sem cluster, a parte Kubernetes permanece pendente.
