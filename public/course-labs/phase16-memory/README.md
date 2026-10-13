# Laboratório de memória — fase 16

Fontes próprias C11 e Python 3.11+. Execute em cópia local Linux x86-64 com GCC, binutils e runtime ASan/UBSan. Não exige privilégios, Windows, rede, alvos externos nem malware. Entradas têm no máximo 4096 bytes; processos de teste têm timeout de 20 segundos e core dumps desativados. A recursão deliberada usa limite de stack de 8 MiB.

Na raiz do pacote cumulativo:

```bash
cd public/course-labs/phase16-memory
python3 run.py build
python3 run.py all
```

O build gera executáveis em `build/`, fixtures e manifesto SHA-256 em `fixtures/`; não esconde falhas de compilação nem de geração. Comandos e saídas integrais ficam em `build/logs/`; expectativas e retornos em `build/results-*.json`. `run.py` retorna zero somente se cada expectativa for satisfeita. Um programa vulnerável termina com erro esperado; isso não equivale a erro esperado do runner.

- `lab.c`: conversões, cópia com capacidade explícita, UAF, recursão e canary.
- `parser.c` + `driver.c`: CSH-MEM-01 v1; `-DFIXED` ativa v2. Formato: tipo N/R, comprimento/índice de um byte, corpo. N produz nome de até 7 bytes; R lê byte por índice.
- `fuzz_harness.c`: ABI `LLVMFuzzerTestOneInput`; `fuzz_driver.c`: enumeração real com bitmap manual, não motor LLVM.
- `maps.c`: mapas Linux do próprio processo; `variants.c`: contratos aparentados.
- `make_fixtures.py`: entradas e telemetria sintética identificada.
- `analyze.py`: Shannon/janelas, correlação do caso 160 e interpretador de retornos simbólicos.

Com Clang/libFuzzer instalados, experimento opcional (não foi executado no ambiente de revisão):

```bash
mkdir -p build/corpus-fixed
cp fixtures/valid.bin build/corpus-fixed/seed
clang -g -O1 -DFIXED -fsanitize=fuzzer,address,undefined parser.c fuzz_harness.c -o build/fuzzer-fixed
./build/fuzzer-fixed -seed=16 -runs=1000 -max_len=64 -timeout=2 build/corpus-fixed
```

A campanha determinística executada é `python3 run.py fuzz`: 32 chamadas reais ao harness, resultado `retained=2 bitmap=0x3f`. Esse bitmap é de seis decisões instrumentadas à mão, não percentual de cobertura nem prova de ausência de bugs. O corpus libFuzzer altera-se durante a execução; use uma pasta nova para comparar campanhas.

`python3 run.py maps` observa a política ASLR sem alterá-la. `python3 run.py canary` separa ASan de stack protector; o binário sem proteção é inspecionado, não recebe escrita inválida. Logs de GCC sobre os erros intencionais devem permanecer visíveis.

Para limpar uma execução, remova apenas a pasta `build/` desta cópia. As fontes e fixtures continuam disponíveis. Para preservar uma evidência, copie os logs, a versão do compilador e o hash do input antes de reconstruir.

Correções de qualidade: `run.py types` inclui rejeição de INT_MAX+1 antes da soma e caso INT_MAX−1+1 aceito; `run.py stack` inclui profundidade32 aceita e100000 rejeitada. `run.py investigate` verifica baseline, DNS fora da janela em cópia temporária e reteste. `analyze.py investigate --events /caminho/events-late.jsonl` permite observar o resultado de uma cópia local sem impor o gabarito fixo. Python3.11+ é necessário para os timestamps ISO terminados em Z.
