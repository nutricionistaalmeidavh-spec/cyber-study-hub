#include <assert.h>
#include <stdio.h>
#include <string.h>
/* Contrato: src é string válida; dst tem cap bytes graváveis. */
static int copiar(char *dst, size_t cap, const char *src) {
    size_t n = strlen(src);
    if (n >= cap) return 0; /* reserva um byte para o terminador NUL */
    memcpy(dst, src, n + 1); /* inclui o terminador; objetos sem sobreposição */
    return 1;
}
int main(void) {
    char destino[5] = "";
    assert(copiar(destino,sizeof destino,"Ana"));
    printf("texto=%s comprimento=%zu capacidade=%zu\n",destino,strlen(destino),sizeof destino);
    assert(copiar(destino,sizeof destino,"ABCD"));
    assert(!copiar(destino,sizeof destino,"ABCDE"));
    assert(strcmp(destino,"ABCD") == 0); /* recusa preserva destino */
    puts("4 caracteres aceitos; 5 recusados; destino preservado");
    return 0;
}
