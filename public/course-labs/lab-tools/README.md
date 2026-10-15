# LAB-01–30 — oficinas de ferramentas (material complementar)

Cada unidade inclui um **roteiro próprio, dados sintéticos, um avaliador executável, casos positivo e negativo e um teste de regressão**. O aluno pratica a interpretação de evidências antes de usar ferramentas reais. **Este runner não roda Kali, Docker, Nmap, ZAP, Sysmon, Ghidra etc.** Para prática real, siga as recomendações da aula somente em localhost/VM autorizada, e registre versões e permissões.

Pré-requisito: Node.js 22+. Na raiz do HubEstudos:

```bash
node public/course-labs/lab-tools/run.mjs LAB-01
node --test public/course-labs/lab-tools/lab.test.mjs
```

| Unidade | Foco | Roteiro |
|---|---|---|
| LAB-01 | Ética, autorização e escopo | [Abrir](./workshops/LAB-01.md) |
| LAB-02 | Como documentar um laboratório | [Abrir](./workshops/LAB-02.md) |
| LAB-03 | Virtualização | [Abrir](./workshops/LAB-03.md) |
| LAB-04 | WSL | [Abrir](./workshops/LAB-04.md) |
| LAB-05 | Docker | [Abrir](./workshops/LAB-05.md) |
| LAB-06 | Redes Docker | [Abrir](./workshops/LAB-06.md) |
| LAB-07 | Kali | [Abrir](./workshops/LAB-07.md) |
| LAB-08 | Ubuntu | [Abrir](./workshops/LAB-08.md) |
| LAB-09 | Windows VM | [Abrir](./workshops/LAB-09.md) |
| LAB-10 | Snapshots | [Abrir](./workshops/LAB-10.md) |
| LAB-11 | Burp Suite | [Abrir](./workshops/LAB-11.md) |
| LAB-12 | OWASP ZAP | [Abrir](./workshops/LAB-12.md) |
| LAB-13 | DevTools | [Abrir](./workshops/LAB-13.md) |
| LAB-14 | curl | [Abrir](./workshops/LAB-14.md) |
| LAB-15 | Postman e Bruno | [Abrir](./workshops/LAB-15.md) |
| LAB-16 | Nmap | [Abrir](./workshops/LAB-16.md) |
| LAB-17 | Wireshark | [Abrir](./workshops/LAB-17.md) |
| LAB-18 | Nuclei | [Abrir](./workshops/LAB-18.md) |
| LAB-19 | Ghidra | [Abrir](./workshops/LAB-19.md) |
| LAB-20 | x64dbg | [Abrir](./workshops/LAB-20.md) |
| LAB-21 | Sysmon | [Abrir](./workshops/LAB-21.md) |
| LAB-22 | Procmon | [Abrir](./workshops/LAB-22.md) |
| LAB-23 | Process Explorer | [Abrir](./workshops/LAB-23.md) |
| LAB-24 | Autoruns | [Abrir](./workshops/LAB-24.md) |
| LAB-25 | REMnux | [Abrir](./workshops/LAB-25.md) |
| LAB-26 | Volatility | [Abrir](./workshops/LAB-26.md) |
| LAB-27 | Suricata | [Abrir](./workshops/LAB-27.md) |
| LAB-28 | SIEM | [Abrir](./workshops/LAB-28.md) |
| LAB-29 | YARA e Sigma | [Abrir](./workshops/LAB-29.md) |
| LAB-30 | Laboratório integrado | [Abrir](./workshops/LAB-30.md) |

LAB-01, LAB-03, LAB-09 e LAB-10 conservam seus scripts práticos anteriores da pasta `phase16-foundations`. Os demais **ainda requerem execução nativa separada** para demonstração de proficiência na ferramenta real; os fixtures por si sós não provam isso.

Nunca use credenciais reais, hosts de terceiros ou captura de tráfego não autorizado. Os arquivos deste pacote não fazem I/O de rede, não executam processos e não alteram o sistema.
