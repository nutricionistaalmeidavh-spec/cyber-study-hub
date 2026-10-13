#include <assert.h>
#include <stddef.h>
#include <stdio.h>
/* n é quantidade de elementos, não bytes; acesso só ocorre para i < n. */
static int soma(const int *valores, size_t n) {
    int total = 0;
    for (size_t i = 0; i < n; ++i) total += valores[i];
    return total;
}
int main(void) {
    int valores[] = {4, 7, 2};
    size_t n = sizeof valores / sizeof valores[0];
    assert(n == 3 && soma(valores, n) == 13);
    assert(soma(NULL, 0) == 0); /* corpo não acessa NULL */
    printf("n=%zu soma=%d vazio=%d\n", n, soma(valores,n), soma(NULL,0));
    return 0;
}
