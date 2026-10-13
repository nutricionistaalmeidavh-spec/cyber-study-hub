"""Executa a fonte de PY-01 com dois valores sem alterá-la no disco."""
from pathlib import Path
import subprocess
import sys

BASE = Path(__file__).resolve().parent
SOURCE = (BASE / 'PY-01.py').read_text(encoding='utf-8')
if 'quantidade = 3' not in SOURCE:
    raise SystemExit('Use a versão original de PY-01.py junto deste verificador.')

for amount, expected in [
    (3, 'Olá, Ana: 3 itens\nFim\n'),
    (0, 'Fim\n'),
]:
    adapted = SOURCE.replace('quantidade = 3', f'quantidade = {amount}', 1)
    result = subprocess.run([sys.executable, '-c', adapted], capture_output=True,
                            text=True, timeout=4, check=True)
    assert result.stdout == expected, f'quantidade={amount}: {result.stdout!r}'
    assert result.stderr == '', result.stderr
    print(f'PASS PY-01 quantidade={amount}: {result.stdout!r}')
