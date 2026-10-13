#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
/* O chamador recebe ownership do bloco; precisa free uma vez. */
static int *criar(size_t n, int simular_falha) {
    if (n == 0 || n > SIZE_MAX / sizeof(int)) return NULL;
    /* injeção controlada testa o caminho de falha sem esgotar memória */
    int *p = simular_falha ? NULL : malloc(n * sizeof *p);
    if (p == NULL) return NULL;
    for (size_t i = 0; i < n; ++i) p[i] = (int)i;
    return p; /* o bloco vive além da chamada; o nome local p não */
}
int main(void) {
    int *dados = criar(3, 0);
    if (dados == NULL) { fputs("alocação falhou\n", stderr); return 1; }
    assert(dados[0] == 0 && dados[2] == 2);
    printf("heap: %d %d %d\n",dados[0],dados[1],dados[2]);
    free(dados);
    dados = NULL;
    assert(criar(3,1) == NULL && criar(0,0) == NULL);
    puts("falha simulada e tamanho zero tratados");
    return 0;
}
