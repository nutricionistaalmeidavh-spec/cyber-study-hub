/* Exercício educacional: imprime SOMENTE ponteiros deste próprio processo. */
#include <stdio.h>
#include <stdlib.h>
int main(void) {
    int local = 7;
    void *heap = malloc(32);
    if (heap == NULL) { fputs("alloc failed\n", stderr); return 1; }
    /* Convertendo para void* para imprimir ponteiro de função: convenção do Linux x86-64 usado neste laboratório. */
    printf("main=%p stack=%p heap=%p\n", (void *)&main, (void *)&local, heap);
    free(heap);
    return 0;
}
