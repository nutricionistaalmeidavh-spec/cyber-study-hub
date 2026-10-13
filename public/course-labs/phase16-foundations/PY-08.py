import sys
import medidas_lab
from conversao import resumo
assert resumo(2048) == "2.0 KiB"
print(resumo(2048))
print("versão:", medidas_lab.__version__)
print("interpretador:", sys.executable)
print("dependência:", medidas_lab.__file__)
