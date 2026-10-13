#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
# Sem porta publicada e sem volume persistente. Senha fictícia só no container descartável.
name="course-rls-${$}"
cleanup(){ docker rm -f "$name" >/dev/null 2>&1 || true; }
trap cleanup EXIT
docker run -d --name "$name" -e POSTGRES_PASSWORD=fixture-only postgres:17 >/dev/null
ready=0
for i in $(seq 1 30); do
 if docker exec "$name" pg_isready -U postgres >/dev/null 2>&1; then ready=1; break; fi
 sleep 1
done
test "$ready" = 1
docker exec "$name" psql -U postgres -c 'SELECT version();'
docker exec -i "$name" psql -U postgres -v ON_ERROR_STOP=1 < lab.sql
