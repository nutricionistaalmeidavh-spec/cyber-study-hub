#include <assert.h>
#include <stdio.h>
/* Ponteiro emprestado: chamador mantém o objeto vivo durante a chamada. */
static int incrementar(int *p) {
    if (p == NULL) return 0; /* NULL não aponta para um int válido */
    *p += 1;               /* grava no objeto apontado */
    return 1;
}
int main(void) {
    int x = 7;
    int *p = &x;           /* & obtém endereço; ainda não copia x */
    int *alias = p;        /* ambos designam o mesmo x */
    assert(incrementar(p));
    assert(x == 8 && *alias == 8);
    assert(!incrementar(NULL));
    printf("x=%d alias=%d null=recusado\n",x,*alias);
    return 0;             /* lifetime de x termina na saída de main */
}
