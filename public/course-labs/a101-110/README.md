# Laboratórios A 101–110 — somente ambiente local e conteúdo benigno

Executar na raiz do repositório:

```sh
python3 -m unittest discover -s public/course-labs/a101-110 -p test_models.py -v
cc -std=c11 -Wall -Wextra -Werror -o /tmp/csh-a101 public/course-labs/a101-110/safe_bounds.c
/tmp/csh-a101 4
! /tmp/csh-a101 260
cc -std=c11 -Wall -Wextra -Werror -o /tmp/csh-a103 public/course-labs/a101-110/safe_lifetime.c
/tmp/csh-a103
```

Aulas 101 e 103 têm programas C próprios. As outras oito aulas exercitam modelos puros e testes negativos de limites, memória, concorrência, handles, resolução confiável de DLL, parser básico de PE **não executável** e solicitações de privilégios. Não instalar driver, carregar DLL alheia ou executar binários suspeitos. **Nenhuma API Windows real ou interface de depurador foi exercitada neste CI Linux.** Tarefas Windows reais são opcionais, separadas e precisam de ambiente próprio.
