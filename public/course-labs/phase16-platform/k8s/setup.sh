#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
# Requer Docker, kind, kubectl e Helm instalados no computador de laboratório.
kind create cluster --name course-phase16 --config kind.yaml
test "$(kubectl config current-context)" = kind-course-phase16
helm repo add cilium https://helm.cilium.io/
helm repo update cilium
helm install cilium cilium/cilium --version 1.20.1 --namespace kube-system --set image.pullPolicy=IfNotPresent --set ipam.mode=kubernetes
kubectl -n kube-system rollout status daemonset/cilium --timeout=300s
kubectl wait --for=condition=Ready nodes --all --timeout=180s
kubectl version
# Construir imagem própria e carregá-la, sem push a registry.
docker build -t course-notes:phase16 .
kind load docker-image course-notes:phase16 --name course-phase16
