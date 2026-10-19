#!/bin/sh
set -eu
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  printf 'Node.js 22+ não encontrado. Instale em https://nodejs.org/en/download
'
  exit 1
fi
printf '
EscolaLab - ArtiSys Academy
Abra http://127.0.0.1:4191 no navegador.
Ctrl+C encerra.

'
exec node server.mjs
