# Laboratório 02 — Pesquisa, pautas e roteiros

**Objetivo:** Criar pesquisa fundamentada, estrutura narrativa e roteiros reutilizáveis sem depender de APIs pagas.

**Percurso obrigatório:** R$ 0; conteúdo original, computador local e ferramentas gratuitas. Nenhum serviço externo pago é requisito.

## Antes de executar

Crie canal/pautas.csv e canal/roteiro-001.md. Um exemplo de cabeçalho CSV: id,status,titulo,fonte,licenca. Não inclua dados pessoais nem chaves.

## Procedimento

1. Escreva gratuitamente cinco pautas com pergunta, público e ao menos uma fonte por pauta.
2. Crie um CSV com id, status, titulo, fonte e licenca para rastrear o trabalho.
3. Produza um roteiro original de 90 segundos com abertura, evidências e desfecho.
4. Faça revisão manual de cada afirmação e salve uma versão final assinada editorialmente.

## Evidências e aceite

- [ ] Cinco pautas únicas com estados explícitos
- [ ] Fontes podem ser abertas e conferidas
- [ ] Roteiro possui estrutura e duração plausíveis
- [ ] A versão revisada fica preservada
- [ ] Etapa completa sem API ou pagamento

## Ferramentas para conhecer

- **Python** — núcleo gratuito/local. Scripts e CSV locais. https://www.python.org/
- **SQLite** — núcleo gratuito/local. Banco editorial local. https://www.sqlite.org/
- **Ollama** — opcional, validar custos/licença/hardware. Assistente local sujeito ao hardware. https://ollama.com/
- **ChatGPT** — opcional, validar custos/licença/hardware. Assistente de navegador, limites variáveis. https://chatgpt.com/

## Transferência

Um assistente gerou um número preciso, mas a fonte está indisponível. Qual estado da pauta e como o roteiro deve tratar o dado?

## Política de publicação

Não publique automaticamente. Confira fatos, consentimento, direitos de mídia, licenças comerciais, eventuais exigências de identificação de IA e aprovação editorial humana. Se usar ferramentas externas, não envie segredos nem dados de terceiros.



## Laboratório executável, versão gratuita e reproduzível

**Pré-requisito:** Node.js 20+ instalado gratuitamente no computador. Abra o terminal na pasta raiz do repositório `cyber-study-hub`. **A mídia e os dados são demonstrativos; não publique o resultado sem revisão.**

Execute:

```bash
node public/course-labs/channel-dark/engine.mjs --module 2 --out ./meu-canal
```

**Saída esperada:** `02-roteiros/pautas.csv + 02-roteiros/roteiro.md` dentro de `meu-canal/`. A mensagem no terminal indica onde os arquivos foram criados.

**Critério verificável:** Uma pauta sem revisão permanece a_verificar e não recebe selo de fonte confirmada.

**Interpretação:** A primeira pauta tem documento RFC como fonte a verificar; uma segunda pauta demonstrativa também precisa receber uma fonte pertinente antes de ser considerada pesquisada.

**Teste independente dos exemplos e dos casos negativos:**

```bash
npm run test:channel-dark
```

## Diagnóstico e recuperação

- Fonte 'verificada' sem aprovação humana
- Deixe a_verificar até consultar a fonte original e registrar o revisor
- Atualize a pergunta sem perder id e histórico

## Evidência a anexar ao registro da aula

Anote a entrada, o comando executado, o arquivo encontrado, a diferença entre previsão e resultado, a revisão humana pendente e como corrigiria o caso negativo. O teste automatizado demonstra apenas comportamento do kit; não comprova qualidade da narração, direitos comerciais, veracidade das fontes nem aceitação do público.
