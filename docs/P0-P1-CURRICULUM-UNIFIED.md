# P0 / P1 — contrato de prática e conteúdo canônico no HubEstudos

## Fonte autoritativa
As aulas 043–100 têm duas superfícies de aprendizado: a experiência interativa (componentes legados ou V2) e o documento extenso `public/course-library/main/NNN.md`. O documento integral **sempre aparece** no caminho `#lesson/NNN` pelo componente `CanonicalLessonContent` renderizado com o mesmo `MarkdownDocument` usado pelo leitor `#course/main/NNN`. Se houver conflito de redação, **o Markdown é o documento pedagógico canônico**; a experiência interativa complementa, mas não substitui essa fonte. As duas superfícies continuam usando o ID AULA-NNN e preservam seus fluxos de progresso e avaliação.

## Contrato P0
- `PracticeOrientation` recebe o catálogo canônico e usa `practiceFor` para ensinar intenção, preparo, entrega, validação, limite e arquivos de verdade nas 543 unidades principais/paralelas.
- `GuidedPracticeOrientation` utiliza ID canônico DEV-IA-NNN ou CANAL-IA-NNN e a própria etapa nos 64 passos das trilhas guiadas. Uma microaula não é falsamente chamada de laboratório; um laboratório incremental explicita entrega e execução.
- O `PracticeKind` distingue **experimento**, **kit funcional**, **projeto incremental** e **estudo aplicado**. Os kits educacionais e privados não são automaticamente declarados downloads públicos; há links somente quando existentes.
- Pacotes e runners de segurança frequentemente cobrem uma FAIXA de aulas, e não uma implementação exclusiva da unidade. O componente deixa isso claro.
- A leitura, o quiz, o checklist e a execução efetiva do código permanecem conceitos separados.

## Contrato P1
- 58 documentos Markdown são buscados na própria experiência interativa; não são copiados e não geram divergência de conteúdo entre dois arquivos.
- As 14 aulas V2 preservam recursos explícitos e, quando faltam, resolvem apenas pacotes existentes e testados de `a41-50` e `a051-060`; nenhuma lista expõe `answer-keys`.
- O conteúdo do legado 043–046 e 061–100 é complementar; o documento completo é carregado ao lado, não substituído por versões resumidas.
- As demais 160 aulas principais e 325 unidades paralelas já consomem o documento Markdown do catálogo: continuam usando o mesmo leitor, acrescido do contrato prático.
- As 64 etapas guiadas continuam usando `modules.json` e seus manifests, ligados aos IDs do catálogo; seus arquivos de kit permanecem nos caminhos já aprovados.

## Segurança da migração
Nenhum ID, caminho de conteúdo canônico, nota/editorial, esquema D1, rota OAuth, login, chave de storage ou pontuação de quiz foi alterado. Testes devem confirmar IDs, recursos, visualizadores e estado antigo. A aprovação automatizada não é certificação pedagógica humana.
