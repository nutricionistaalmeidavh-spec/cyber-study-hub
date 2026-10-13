"""Inspeciona 5 novas execuções de binários próprios sem alterar o ASLR do host."""
import re
import subprocess
import sys
from pathlib import Path

PATTERN = re.compile(r"^main=(0x[0-9a-fA-F]+) stack=(0x[0-9a-fA-F]+) heap=(0x[0-9a-fA-F]+)$")


def inspect(binary, samples=5):
    values = {name: set() for name in ("main", "stack", "heap")}
    for _ in range(samples):
        proc = subprocess.run([str(binary)], capture_output=True, text=True, timeout=5, check=True)
        m = PATTERN.fullmatch(proc.stdout.strip())
        if not m:
            raise ValueError(f"Saída inesperada de {binary}: {proc.stdout!r}")
        for name, value in zip(values, m.groups()):
            values[name].add(value)
    return {name: len(seen) for name, seen in values.items()}


def main(argv):
    if len(argv) != 3:
        print("Uso: python3 check_aslr.py ./aslr-pie ./aslr-no-pie", file=sys.stderr)
        return 2
    for label, arg in zip(("PIE", "NO-PIE"), argv[1:]):
        binary = Path(arg).resolve()
        if not binary.is_file():
            print(f"Binário ausente: {binary}", file=sys.stderr)
            return 2
        try:
            counts = inspect(binary)
        except (ValueError, subprocess.CalledProcessError, subprocess.TimeoutExpired) as err:
            print(f"Falha de execução: {err}", file=sys.stderr)
            return 1
        print(f"{label:6} " + "; ".join(f"{k}: {v}/5 endereços únicos" for k, v in counts.items()))
    print("Observação apenas: a diversidade amostral não mede entropia nem prova exploração/correção.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
