#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
: "${PIPER_MODEL:?Defina PIPER_MODEL para um arquivo .onnx de voz pt_BR com licença conferida}"
PIPER_BIN="${PIPER_BIN:-piper}"
command -v "$PIPER_BIN" >/dev/null 2>&1 || { echo 'Instale Piper TTS e confira o PATH'; exit 2; }
test -f "$PIPER_MODEL" || { echo 'Modelo ONNX não encontrado'; exit 2; }
test -f narracao.txt || { echo 'Coloque texto autoral em narracao.txt'; exit 2; }
"$PIPER_BIN" --model "$PIPER_MODEL" --output_file narracao.wav < narracao.txt
echo 'WAV criado. Escute o áudio, confira português/consentimento e normalize com normalizar-audio.sh.'
