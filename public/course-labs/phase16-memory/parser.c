/* CSH-MEM-01: código próprio; v1 tem dois erros intencionais, v2 usa -DFIXED. */
#include <stddef.h>
#include <stdint.h>
#include <string.h>
static volatile unsigned checksum;
unsigned coverage;
int parse_record(const uint8_t *data, size_t size) {
    coverage = 1u; /* bitmap didático de decisões; não é cobertura LLVM */
    if (size < 2) return -1;
    coverage |= 2u;
    size_t n = data[1];
    if (data[0] == 'N') {
        char name[8]; /* capacidade inclui o terminador NUL */
        coverage |= 4u;
#ifdef FIXED
        if (n >= sizeof name || n > size - 2) return -1;
#else
        if (n > sizeof name || n > size - 2) return -1; /* BUG: aceita n=8 */
#endif
        coverage |= 8u;
        memcpy(name, data + 2, n);
        name[n] = '\0'; /* primeiro acesso inválido quando n=8 */
        checksum = n ? (unsigned char)name[0] : 0;
        return (int)n;
    }
    if (data[0] == 'R') {
        coverage |= 16u;
#ifdef FIXED
        if (n >= size - 2) return -1;
#endif
        checksum = data[2 + n]; /* BUG v1: índice remoto ao tamanho real */
        coverage |= 32u;
        return (int)checksum;
    }
    return -1;
}
