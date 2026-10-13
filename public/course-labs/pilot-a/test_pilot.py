"""Checks independentes do conteúdo: comportamento, negativos e diferenças de contexto."""
import importlib.util
import subprocess
import sys
from pathlib import Path

BASE = Path(__file__).parent

def load(name):
    spec = importlib.util.spec_from_file_location(name, BASE / f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

stock = load('stock_rules')
for inp, out in [((0, 0), ('invalido', 0)), ((0, 1), ('recusar', 0)),
                 ((3, 3), ('aceitar', 0)), ((3, 4), ('recusar', 3)),
                 ((3, -1), ('invalido', 3)), ((3, 1.5), ('invalido', 3))]:
    assert stock.reserve(*inp) == out, (inp, out)
assert stock.reserve(4, True) == ('invalido', 4), 'bool não deve passar como inteiro de pedido'
print('PASS regra estoque: limites, domínio e sem mutação')

res = subprocess.run([sys.executable, str(BASE / 'test_py_intro.py')],capture_output=True,text=True,timeout=7)
assert res.returncode == 0, (res.stderr,res.stdout)
print('PASS Python: 2 execuções reais com saída correta')

aslr = load('check_aslr')
assert aslr.PATTERN.fullmatch('main=0x401000 stack=0x7fff1000 heap=0x700000')
assert not aslr.PATTERN.fullmatch('main=qualquer stack=0x1 heap=0x2')
assert aslr.main(['check_aslr.py']) == 2
print('PASS ASLR: parser rejeita dados inválidos e CLI incompleta')
