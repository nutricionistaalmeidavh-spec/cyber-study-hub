# Meu Gestor — projeto-base do laboratório 01

Este arquivo HTML é um **protótipo executável e didático**, não é o sistema comercial final e não utiliza dados reais.

## Como usar (sem instalar nada)

1. Abra [starter.html](./starter.html) em um navegador de computador ou celular.
2. Observe os cartões e três ordens de serviço. Clique em **Avançar estado** em uma ordem pendente e confirme a mudança.
3. Para editar, salve uma cópia do `starter.html` no computador, abra-a no VSCodium ou editor de texto e substitua **somente** um nome de serviço fictício no array `orders`.
4. Salve e abra novamente o HTML. O novo texto deve aparecer; as contagens não mudam porque houve somente alteração visual.
5. Explique por que a ordem concluída não tem botão ativo.

> **Atenção:** o HTML usa dados mantidos na memória. Ao recarregar, os estados voltam ao valor inicial. Persistência em SQLite é assunto do módulo 6.

## Como usar IA sem API nem pagamento

Cole o prompt presente no módulo 1 em **ChatGPT** ou **Claude**, pelo site de sua escolha. A disponibilidade gratuita e os limites de uso podem variar por serviço. Você também pode concluir este exercício sem assistente externo, lendo o código e seguindo o roteiro acima. Nunca compartilhe segredos ou dados pessoais reais.

### IA local (opcional)

Se seu equipamento comportar o modelo desejado, pode usar Ollama e um modelo aberto compatível para explicar o HTML. IA local **não é pré-requisito** e o curso não deve supor um modelo capaz de editar dezenas de arquivos autonomamente.

## Critérios de aceite do laboratório

- Descrever público, problema e até três funcionalidades para o Meu Gestor.
- Explicar a regra `pendente → em andamento → concluído`.
- Validar que concluir uma ordem atualiza o contador apenas uma vez.
- Registrar um cenário inválido, como tentar avançar uma ordem já concluída.
- Alterar um texto fictício no código e verificar o resultado no navegador.
- Entregar o documento de escopo e uma explicação das decisões; não envie prints ou dados reais de terceiros.

## Continuidade

O módulo 3 introduzirá a estrutura React + TypeScript + Vite. Este arquivo é o **primeiro artefato**, intencionalmente sem instalação nem dependências para reduzir a dificuldade inicial.
