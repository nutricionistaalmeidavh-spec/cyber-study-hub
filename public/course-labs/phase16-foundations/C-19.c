#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(int argc, char **argv) {
    if (argc != 2) { fputs("use: asan | ubsan | corrigido\n",stderr); return 2; }
    if (strcmp(argv[1],"asan") == 0) {
        int *p = malloc(2 * sizeof *p);
        if (!p) return 1;
        volatile int indice = 2; /* índices válidos são 0 e 1 */
        p[indice] = 9;          /* erro intencional: heap-buffer-overflow */
        free(p);
    } else if (strcmp(argv[1],"ubsan") == 0) {
        volatile int maximo = INT_MAX;
        printf("%d\n", maximo + 1); /* overflow signed: comportamento indefinido */
    } else if (strcmp(argv[1],"corrigido") == 0) {
        int valores[2] = {0,9};
        int maximo = INT_MAX;
        if (maximo == INT_MAX) puts("incremento recusado: limite de int");
        printf("ultimo=%d\n",valores[1]);
    } else { return 2; }
    return 0;
}
