#!/usr/bin/env bash
# Cyber Study Hub: checkpoint 02 importer. Never commits/pushes/merges/deploys.
set -Eeuo pipefail
fail() { echo "ERRO: $*" >&2; exit 1; }
[[ $# == 1 && -f "$1" ]] || fail "Uso: bash scripts/import-checkpoint16.sh /caminho/checkpoint-02.tar.xz|zip"
archive="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
for bin in python3 node npm git; do command -v "$bin" >/dev/null || fail "$bin indisponível"; done
repo="$(git rev-parse --show-toplevel)" || fail "Fora do checkout Git"
cd "$repo"
branch="$(git symbolic-ref --short HEAD)" || fail "Checkout em detached HEAD"
[[ "$branch" != main && "$branch" != master ]] || fail "Execute numa branch de integração, nunca na main"
[[ -z "$(git status --porcelain)" ]] || fail "Checkout tem alterações não commitadas"
[[ -f src/App.tsx && -f src/components/Lessons.tsx && -f src/data/lessons.ts ]] || fail "Faltam arquivos do app-base"
[[ "$(node -p "require('./package.json').name")" == "cyber-study-hub" ]] || fail "package.json não pertence ao Cyber Study Hub"
workdir="$(mktemp -d)"
trap 'rm -rf -- "$workdir"' EXIT
python3 - "$archive" "$workdir" <<'PY'
from pathlib import Path
from zipfile import ZipFile
import tarfile,sys
archive,dest=Path(sys.argv[1]),Path(sys.argv[2]);
# Files are copied individually; never follow symlinks, hardlinks or paths escaping dest.
def safe(name):
    path=Path(name)
    if path.is_absolute() or '\\' in name or '..' in path.parts: raise SystemExit(f'Unsafe archive path: {name}')
    return path
if archive.suffix=='.zip':
    with ZipFile(archive) as z:
        for item in z.infolist():
            if item.is_dir():continue
            rel=safe(item.filename); target=dest/rel;target.parent.mkdir(parents=True,exist_ok=True)
            with z.open(item) as r,target.open('wb') as w:
                import shutil;shutil.copyfileobj(r,w)
    src=dest/'CyberStudyHub_Fase_16_CHECKPOINT_02'
else:
    with tarfile.open(archive,mode='r:xz') as t:
        for item in t:
            if not item.isfile():raise SystemExit(f'Archive includes non-regular member: {item.name}')
            rel=safe(item.name);target=dest/rel;target.parent.mkdir(parents=True,exist_ok=True)
            with t.extractfile(item) as r,target.open('wb') as w:
                import shutil;shutil.copyfileobj(r,w)
    src=dest
if not (src/'CONTENT_MANIFEST.json').is_file() or not (src/'cumulativo/apply.sh').is_file():
    raise SystemExit('Checkpoint 02 missing required files')
(src/'_path.txt').write_text(str(src))
print(f'Checkpoint extracted to {src}')
PY
if [[ "$archive" == *.zip ]]; then package="$workdir/CyberStudyHub_Fase_16_CHECKPOINT_02"; else package="$workdir"; fi
python3 - "$package" <<'PY'
from pathlib import Path
import json,hashlib,sys
p=Path(sys.argv[1]);manifest=json.loads((p/'CONTENT_MANIFEST.json').read_text())
assert manifest and isinstance(manifest,list)
for item in manifest:
    file=p/'cumulativo'/item['path']
    if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest()!=item['sha256']:
        raise SystemExit(f"Invalid checkpoint hash: {item['path']}")
print(f'Validated {len(manifest)} manifest items')
PY
# Main currently holds v1.1 baseline. Existing upgraded checkouts need ONLY the checkpoint update.
if [[ -f src/content/registry.ts && -f scripts/verify-phase-12-14.mjs && -f src/curriculum/catalog.json ]]; then
  echo 'Fases 00–14 já presentes. Preservando interface existente.'
else
  echo 'Aplicando cumulativo Fases 00–14 ao app-base...'
  sh "$package/cumulativo/apply.sh"
fi
node "$package/apply-content-phase16.mjs" "$repo" --check
node "$package/apply-content-phase16.mjs" "$repo"
# ts-fsrs Grade excludes Rating.Manual; narrow this map to the four valid review grades.
node --input-type=module <<'JS'
import fs from 'node:fs';
const file = 'src/lib/reviewEngine.ts';
let code = fs.readFileSync(file, 'utf8');
const oldType = 'Record<ReviewRating, Rating>';
const validGrades = 'Record<ReviewRating, Rating.Again | Rating.Hard | Rating.Good | Rating.Easy>';
if (code.includes(oldType)) {
  code = code.replace(oldType, validGrades);
  fs.writeFileSync(file, code);
} else if (!code.includes(validGrades)) {
  throw new Error('Unexpected review engine rating map; manual compatibility review required');
}
JS
npm install --no-audit --no-fund
npm run build
git diff --check
printf '\nIntegração validada na branch %s. Sem commit/push/merge/deploy.\n' "$branch"