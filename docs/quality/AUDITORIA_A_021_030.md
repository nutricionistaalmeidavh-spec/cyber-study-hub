# Auditoria editorial: aulas 021–030

**Natureza:** segunda revisão técnica/didática por IA. Sem testes observacionais com aprendizes ou certificação humana externa.

| Aula | Tema | Prática local | Nota |
|---|---|---|---|
| 021 | IP, portas, TCP e UDP | `network_lab.py`: sockets em loopback | A editorial IA |
| 022 | Linux para Segurança | `permissions_lab.py`: permissões em diretório temporário | A editorial IA |
| 023 | Nmap e sondagens | `scan_lab.py`: portas locais, Nmap opcional | A editorial IA |
| 024 | Wireshark e captura | `make_capture.py`: PCAP sintético, GUI opcional | A editorial IA |
| 025 | Compilação, CPU, registradores | `compiled.c`: binário próprio compilado com `cc` | A editorial IA |
| 026 | Stack, heap, buffer | `bounds.c`: limites de vetor; sem exploração | A editorial IA |
| 027 | Assembly e saltos | `flags.c`: cenários C e análise dos saltos | A editorial IA |
| 028 | Ghidra e engenharia reversa | `reverse.c`: binário próprio, GUI opcional | A editorial IA |
| 029 | Análise estática segura | `triage.py`: fixture benigno, sem executar malware | A editorial IA |
| 030 | Stuxnet e segurança OT | `ics_lab.py`: apenas telemetria sintética | A editorial IA |

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
node scripts/test-a-021-030.mjs
npm run verify:quality
npm run build
```
