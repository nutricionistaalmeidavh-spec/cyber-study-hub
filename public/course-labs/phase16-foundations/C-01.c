#include <stdio.h>  /* declara printf; não executa uma impressão */
int main(void) {    /* ponto de entrada, sem argumentos usados */
    int caixas = 3;
    int itens = caixas * 4; /* expressão avaliada e armazenada */
    printf("itens=%d\n", itens); /* %d corresponde a int */
    return 0;      /* status de sucesso para o processo chamador */
}
