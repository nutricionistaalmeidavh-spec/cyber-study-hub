# Laboratórios Phase 16 — plataforma

Estes projetos didáticos são independentes do aplicativo Study Hub. Execute a partir das pastas indicadas; todos os dados/segredos são fixtures sintéticas. Não há deploy, push ou contas cloud necessárias.

| Aula | Pasta | Comando principal | Camada exercitada |
|---|---|---|---|
| 193 IAM | iam | `python3 -m unittest -v test_iam.py` | Emulação limitada explícita de policy de identidade AWS |
| 195 CI/CD | ci | `node pipeline.cjs` e `node verify.cjs` | Gate e artefato reais locais; workflow opcional separado |
| 198 RLS | rls | `bash run.sh` | PostgreSQL real descartável; identidade auth.uid é dublê |
| 198 Firebase | firebase | `npm ci` e `npm test` | Firestore Emulator local; project demo- fixo |
| 200 Electron | electron | `npm test` | Handler real; GUI Electron exige instalação separada |
| K8S-04/09/10 | k8s | `python3 -m unittest -v test_server.py test_check.py`, `bash setup.sh`, `bash capstone.sh` | HTTP local e roteiro de cluster/CNI reais |

Ambientes pesados não disponíveis na edição permanecem pendentes em docs/phase16/platform-status.json. Não confunda revisão sintática com execução de runtime. Ver aulas para mecanismos, exemplos, matriz de teste, reteste e troubleshooting. Cada roteiro inclui limpeza de seus próprios recursos.

Verificação integrada local: `python3 public/course-labs/phase16-platform/verify.py` na raiz do projeto. Inclui mutação de autorização Electron em cópia temporária, CI segura/insegura/adulteração e testes HTTP/TCP. Não instala dependências nem cria cluster. Para incluir Firestore já instalado, acrescente `--firebase-jar /caminho/cloud-firestore-emulator-v1.19.8.jar`. A saída JSON registra cada comando, código de saída e resultado; [validation-evidence.json](validation-evidence.json) guarda a execução desta edição. Os cenários negativos deliberados têm exit 1 esperado e são diferenciados de falhas do verificador.
