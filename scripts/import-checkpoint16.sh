#!/usr/bin/env bash
# Integração assistida de CyberStudyHub_Fase_16_CHECKPOINT_02.zip.
# Nunca realiza commit, push, merge ou deploy.
set -Eeuo pipefail
fail() { printf 'ERRO: %s\n' "$*" >&2; exit 1; }
for cmd in git python3 node npm; do command -v "$cmd" >/dev/null || fail "$cmd indisponível"; done
[[ $# == 1 ]] || fail 'Uso: bash scripts/import-checkpoint16.sh /caminho/CyberStudyHub_Fase_16_CHECKPOINT_02.zip'
[[ -f "$1" ]] || fail 'Arquivo ZIP não encontrado'
archive="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
repo="$(git rev-parse --show-toplevel 2>/dev/null)" || fail 'Execute dentro de um checkout Git do Hub'
cd "$repo"
[[ -f src/App.tsx && -f src/components/Lessons.tsx && -f src/data/lessons.ts ]] || fail 'Projeto-base não encontrado'
[[ -z "$(git status --porcelain)" ]] || fail 'Checkout com alterações. Salve-as antes de integrar.'
branch="$(git branch --show-current)"
[[ -n "$branch" && "$branch" != main && "$branch" != master ]] || fail 'Crie e selecione uma branch de integração antes de executar.'
workdir="$(mktemp -d)"
trap 'rm -rf -- "$workdir"' EXIT
python3 - "$archive" "$workdir" <<'PY'
from pathlib import Path
from zipfile import ZipFile
import sys, stat
zip_path, dest = sys.argv[1:]
with ZipFile(zip_path) as z:
    for entry in z.infolist():
        target = Path(entry.filename)
        if target.is_absolute() or '..' in target.parts or '\\' in entry.filename:
            raise SystemExit(f'ZIP contém caminho inseguro: {entry.filename}')
        if stat.S_ISLNK(entry.external_attr >> 16):
            raise SystemExit(f'ZIP contém symlink: {entry.filename}')
    z.extractall(dest)
PY
package="$workdir/CyberStudyHub_Fase_16_CHECKPOINT_02"
[[ -f "$package/FASE_16_CHECKPOINT.md" && -f "$package/cumulativo/apply.sh" && -f "$package/apply-content-phase16.mjs" ]] || fail 'Checkpoint 02 incompleto.'
printf '\n[1/5] Conferindo integridade do manifesto SHA-256...\n'
python3 - "$package" <<'PY'
import hashlib,json,pathlib,sys
root=pathlib.Path(sys.argv[1])
data=json.loads((root/'CONTENT_MANIFEST.json').read_text())
assert data, 'Manifesto vazio'
for entry in data:
    p=root/'cumulativo'/entry['path']
    assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==entry['sha256'],entry['path']
print(f'{len(data)} entradas verificadas')
PY
printf '\n[2/5] Aplicando Fases 00–14 na branch %s...\n' "$branch"
sh "$package/cumulativo/apply.sh"
printf '\n[3/5] Validando a Fase 16...\n'
node "$package/apply-content-phase16.mjs" "$repo" --check
printf '\n[4/5] Aplicando a Fase 16...\n'
node "$package/apply-content-phase16.mjs" "$repo"
printf '\n[5/5] Instalando e verificando...\n'
npm install
npm run verify:curriculum
npm run verify:learning
npm run verify:catalog
npm run build
git diff --check
printf '\nVALIDADO. Nenhum commit, push, merge ou deploy foi realizado.\n'
printf 'Revise o resultado com: git diff --stat && git status --short\n'