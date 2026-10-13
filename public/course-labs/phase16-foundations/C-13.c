#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv) {
    (void)argv;
    int *p = malloc(sizeof *p);
    if (p == NULL) return 1;
    *p = 42;
    if (argc > 1) {
        int *alias = p;
        free(p);
        p = NULL; /* NÃO invalida o outro nome alias */
        printf("%d\n", *alias); /* fixture intencional: ASan deve apontar UAF */
        return 0;
    }
    printf("antes de free=%d\n", *p);
    free(p);     /* libera exatamente uma vez, depois do último uso */
    p = NULL;
    puts("ownership encerrado; nenhum acesso depois de free");
    return 0;
}
