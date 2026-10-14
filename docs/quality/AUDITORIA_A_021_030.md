# Auditoria editorial: aulas 021–030

**Natureza:** segunda revisão técnica/didática por IA. Sem testes observacionais com aprendizes ou certificação humana externa.

| Aula | Tema | Prática | Estado |
|---|---|---|---|
| 021 | Redes: IP, Portas, TCP e UDP | Execute `python3 public/course-labs/a-021-030/network_lab | A editorial IA |
| 022 | Linux para Segurança | Execute `python3 public/course-labs/a-021-030/permissions_lab | A editorial IA |
| 023 | Nmap — Mapeamento de Portas e Serviços | Execute `python3 public/course-labs/a-021-030/scan_lab | A editorial IA |
| 024 | Wireshark — Observando Pacotes | Execute `python3 public/course-labs/a-021-030/make_capture | A editorial IA |
| 025 | Programas Compilados, CPU e Registradores | No Linux: `cc -O0 -fno-inline -o /tmp/csh_compile public/cours | A editorial IA |
| 026 | Memória: Stack, Heap e Buffer Overflow | Compile `cc -std=c11 -Wall -Wextra -fsanitize=address,undefine | A editorial IA |
| 027 | Assembly — Comparações e Saltos | Use `cc -O0 -fno-inline -o /tmp/csh_flags public/course-labs/a | A editorial IA |
| 028 | Ghidra e Engenharia Reversa | Compile `cc -O0 -o /tmp/csh_reverse public/course-labs/a-021-0 | A editorial IA |
| 029 | Malware — Conceitos e Análise Segura | Execute `python3 public/course-labs/a-021-030/triage | A editorial IA |
| 030 | Stuxnet e Sistemas Industriais | Execute `python3 public/course-labs/a-021-030/ics_lab | A editorial IA |

## Escopo de validação

- Cada documento distingue conceito, mecanismo, exemplo trabalhado, contraexemplo, prática positiva/negativa, defesa/reteste e transferência.
- Seis perguntas por aula, com gabarito de arquivo separado e critérios eliminatórios.
- SHA-256 do conteúdo final em `quality/reviews/a-021-030-2026-10-13.json` e no registro canônico `quality/registry.json`.
- As fontes primárias são listadas por aula; variação de arquitetura/OS pode alterar os exemplos de saída.
- Nmap/Wireshark/Ghidra são opções adicionais: o CI não afirma haver executado suas interfaces.
- A classificação A editorial mede o material revisado, não o domínio de um aluno.

## Reprodutibilidade

```sh
python3 -m unittest discover -s public/course-labs/a-021-030 -p "test_*.py" -v
node scripts/verify-a-021-030.mjs
npm run verify:quality
npm run build
```
