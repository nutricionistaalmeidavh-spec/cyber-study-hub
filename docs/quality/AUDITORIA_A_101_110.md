# Auditoria A editorial — aulas 101 a 110

**Data:** 13/10/2026. **Avaliação:** segunda passagem editorial IA. **Alunos reais:** não testados.

A classificação A diz respeito ao material e não constitui certificação, exploração de kernel nem validação de Win32 ou DLLs reais.

| Aula | Tema | Técnica | Didática | Prática | Defesa | Avaliação | Especificidade |
|---|---|---:|---:|---:|---:|---:|---:|
| AULA-101 | C aplicado à Segurança | 92 | 90 | 92 | 91 | 92 | 95 |
| AULA-102 | Ponteiros | 89 | 90 | 92 | 91 | 92 | 95 |
| AULA-103 | Stack e Heap | 89 | 90 | 92 | 91 | 92 | 95 |
| AULA-104 | Memória Virtual | 89 | 90 | 92 | 91 | 92 | 95 |
| AULA-105 | Processes e Threads | 89 | 90 | 92 | 91 | 92 | 95 |
| AULA-106 | Windows API | 89 | 90 | 88 | 91 | 92 | 95 |
| AULA-107 | DLLs | 89 | 90 | 88 | 91 | 92 | 95 |
| AULA-108 | Formato PE | 89 | 90 | 88 | 91 | 92 | 95 |
| AULA-109 | User Mode vs Kernel Mode | 89 | 90 | 88 | 91 | 92 | 95 |
| AULA-110 | Windows Internals | 89 | 90 | 88 | 91 | 92 | 95 |

## Critérios de validação e limites

- **Fontes:** documentação primária Microsoft Learn para API Win32, DLL, PE, memória e privilégios; C/SEI CERT e Python para modelos, listadas por unidade no JSON.
- **Entregas:** 10 oficinas específicas, 60 questões de transferência, gabaritos separados, rubricas e erros eliminatórios.
- **Prática reproduzível:** `python3 -m unittest discover -s public/course-labs/a101-110 -p test_models.py -v`, C compilado com GCC estrito; em Linux não se prova Win32, proteção de kernel, carregamento de DLL nem validação de um PE real.
- **SHA-256:** os dez pareceres são associados ao conteúdo exato de cada arquivo Markdown; qualquer mudança futura invalida a evidência até nova revisão.
- **Independência:** distinção entre autoria de conteúdo e segunda passagem editorial IA; isto não equivale a avaliação humana externa.
- **Preservação:** os 125 pareceres prévios permanecem íntegros; a branch consolida 135 notas A no total.

## Verificação

```sh
python3 -m unittest discover -s public/course-labs/a101-110 -p test_models.py -v
npm run test:grade-a-101-110
npm run verify:quality
npm run build
```
