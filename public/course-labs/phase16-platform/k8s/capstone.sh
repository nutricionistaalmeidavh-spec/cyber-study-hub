#!/usr/bin/env bash
# K8S-10: integração real; somente o cluster descartável criado por setup.sh.
set -euo pipefail
cd "$(dirname "$0")"
test "$(kubectl config current-context)" = kind-course-phase16
k(){ kubectl --context kind-course-phase16 -n course-platform "$@"; }
request(){ k exec -i client -- python - "$1" < check.py; }
# Convergência observada: nenhuma espera fixa é tratada como prova de reconciliação.
retry(){
  local attempt
  for attempt in $(seq 1 12); do
    if "$@"; then return 0; fi
    sleep 1
  done
  echo "FAIL: condição não convergiu: $*" >&2; return 1
}
ready_endpoints(){
  k get endpointslices -l kubernetes.io/service-name=notes -o json |
    python3 -c 'import json,sys; d=json.load(sys.stdin); n=sum(len(e["addresses"]) for s in d["items"] for e in s.get("endpoints",[]) if e.get("conditions",{}).get("ready") is True); print("ready endpoints",n); sys.exit(0 if n==int(sys.argv[1]) else 1)' "$1"
}
restore(){
  # Executado também após erro: restaura SOMENTE as duas mutações didáticas.
  local result=$?
  trap - EXIT
  k patch service notes --type merge -p '{"spec":{"selector":{"app":"notes"}}}' || result=1
  k label pod/client app=client --overwrite || result=1
  exit "$result"
}
kubectl --context kind-course-phase16 apply -f stack.yaml
k rollout status deployment/notes --timeout=120s
k wait --for=condition=Ready pod/client --timeout=120s
trap restore EXIT
kubectl --context kind-course-phase16 version
k get pods -o wide
retry ready_endpoints 2
retry request allow
request unauth
echo 'CHECKPOINT A: 2 backends, HTTP 200 com token e 401 sem token'

k patch service notes --type merge -p '{"spec":{"selector":{"app":"missing"}}}'
retry ready_endpoints 0
request deny-selector
k patch service notes --type merge -p '{"spec":{"selector":{"app":"notes"}}}'
retry ready_endpoints 2
retry request allow
echo 'CHECKPOINT B: selector incorreto removeu endpoints; restauração recuperou HTTP'

k label pod/client app=guest --overwrite
retry request deny-policy
ready_endpoints 2
k label pod/client app=client --overwrite
retry request allow
echo 'CHECKPOINT C: cliente guest bloqueado com endpoints prontos; client recuperado'

identity=system:serviceaccount:course-platform:notes
test "$(k auth can-i get pods/log --as="$identity")" = yes
# can-i responde no com exit 1; outros resultados não satisfazem o assert.
answer=$(k auth can-i get secrets --as="$identity" || true)
test "$answer" = no
echo 'CHECKPOINT D: ServiceAccount pode ler logs, não pode ler secrets pela API'
k exec -i deployment/notes -- python - < check_process.py
request allow
k get endpointslices -l kubernetes.io/service-name=notes -o yaml
k logs deployment/notes --all-pods=true --tail=10
echo 'PASS capstone: HTTP/rede/RBAC/processo e retestes; conservar saída e versões'
