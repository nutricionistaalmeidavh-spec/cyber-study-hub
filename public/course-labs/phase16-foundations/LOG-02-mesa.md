# Caderno de trabalho LOG-02

Um formulário recebe o texto "007". O atendente quer somar uma unidade ao número informado, preservando também o código original. Preveja valor e tipo após cada atribuição; não confunda a grafia exibida com a quantidade.

| Etapa | código: texto | quantidade: inteiro | cópia: inteiro |
|---|---|---|---|
| código ← "007" | "007" | não definido | não definido |
| quantidade ← inteiro(código) | "007" | 7 | não definido |
| cópia ← quantidade | "007" | 7 | 7 |
| quantidade ← quantidade + 1 | "007" | 8 | 7 |
| código ← código + "1" | "0071" | 8 | 7 |

código ← "007"
quantidade ← inteiro(código) // conversão decimal explícita
cópia ← quantidade
quantidade ← quantidade + 1 // soma numérica
código ← código + "1"      // concatenação de textos

Parcial: substitua o texto inicial por "010" e complete quantidade final e código final. Independente: simule "dez" e marque a primeira etapa que não pode continuar. Autoexplicação: por que imprimir 7 e imprimir "7" pode parecer igual, mas somar 1 é uma operação diferente?

## Solução para conferir depois

Com "010", quantidade final é 11, cópia é 10 e código final é "0101". Com "dez", a conversão decimal falha; quantidade e cópia não recebem valor. Checkpoint: não invente zero como resultado da conversão inválida. O texto pode ser um identificador; se zeros iniciais importam, mantenha-o como texto.