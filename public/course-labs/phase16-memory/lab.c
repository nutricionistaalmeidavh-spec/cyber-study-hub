/* Exemplos próprios; não executa entrada como código, não abre rede. */
#include <limits.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
static volatile unsigned observed;
static unsigned descend(unsigned n) {
    volatile unsigned char frame[4096];
    frame[0] = (unsigned char)n;
    if (!n) return frame[0];
    return descend(n - 1) + frame[0]; /* acesso posterior impede tail call */
}
static int copy_name(char *dst, size_t cap, const char *src, size_t len) {
    /* sizeof(dst) seria tamanho do ponteiro, não capacidade do chamador. */
    if (!dst || !src || cap == 0 || len >= cap) return -1;
    memcpy(dst, src, len);
    dst[len] = '\0';
    return 0;
}
static void smash(size_t n) {
    volatile unsigned char name[8];
    /* O limite defeituoso é exclusivamente para observar o canary local. */
    for (size_t i = 0; i < n; ++i) name[i] = 'A';
    observed = name[0];
}
int main(int argc, char **argv) {
    if (argc != 2) return 64;
    if (!strcmp(argv[1], "types")) {
        uint8_t a = 250, b = 10;
        unsigned wide = (unsigned)a + b;
        printf("wide=%u narrowed=%u\n", wide, (unsigned)(uint8_t)wide);
    } else if (!strcmp(argv[1], "signed")) {
        volatile int a = INT_MAX;
        printf("%d\n", a + 1); /* UB: UBSan encerra, não especifica wrap */
    } else if (!strcmp(argv[1], "signed-fixed") || !strcmp(argv[1], "signed-valid")) {
        int a = !strcmp(argv[1], "signed-fixed") ? INT_MAX : INT_MAX - 1;
        /* A decisão ocorre ANTES da operação; nunca calculamos INT_MAX+1. */
        if (a > INT_MAX - 1) { puts("rejected INT_MAX+1 before addition"); return 2; }
        int sum = a + 1;
        printf("accepted at_limit=%d result=%d\n", sum == INT_MAX, sum);
    } else if (!strcmp(argv[1], "copy")) {
        char tiny[4];
        int valid = copy_name(tiny, sizeof tiny, "abc", 3);
        int rejected = copy_name(tiny, sizeof tiny, "abcd", 4);
        printf("valid=%d rejected=%d name=%s cap=%zu\n", valid, rejected, tiny, sizeof tiny);
        return valid != 0 || rejected != -1;
    } else if (!strcmp(argv[1], "uaf")) {
        unsigned char *p = malloc(4);
        if (!p) return 70;
        p[0] = 42;
        unsigned char *alias = p;
        free(p); /* lifetime termina; alias continua numericamente igual */
        observed = alias[0]; /* uso inválido deliberado */
    } else if (!strcmp(argv[1], "heap-fixed")) {
        unsigned char *p = malloc(4);
        if (!p) return 70;
        p[0] = 42;
        unsigned value = p[0]; /* extrair valor antes de encerrar lifetime */
        free(p);
        p = NULL;
        printf("saved=%u owner_null=%d\n", value, p == NULL);
    } else if (!strcmp(argv[1], "recurse")) {
        observed = descend(100000); /* runner limita stack/tempo */
    } else if (!strcmp(argv[1], "depth-fixed") || !strcmp(argv[1], "depth-valid")) {
        unsigned requested = !strcmp(argv[1], "depth-fixed") ? 100000 : 32;
        if (requested > 32) { puts("rejected depth=100000 limit=32"); return 2; }
        observed = descend(requested);
        printf("accepted depth=%u result=%u\n", requested, observed);
    } else if (!strcmp(argv[1], "smash")) {
        smash(24); /* somente crash, nunca payload/endereço de retorno */
    } else return 64;
    return 0;
}
