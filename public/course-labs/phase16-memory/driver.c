#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
int parse_record(const uint8_t *, size_t);
extern unsigned coverage;
int main(int argc, char **argv) {
    if (argc != 2) return 64;
    FILE *f = fopen(argv[1], "rb");
    if (!f) return 66;
    if (fseek(f, 0, SEEK_END)) return 74;
    long length = ftell(f);
    if (length < 0 || length > 4096 || fseek(f, 0, SEEK_SET)) return 65;
    size_t n = (size_t)length;
    /* Alocação exata faz o ASan reconhecer o limite real do arquivo. */
    uint8_t *p = malloc(n ? n : 1);
    if (!p || fread(p, 1, n, f) != n) return 74;
    fclose(f);
    int result = parse_record(p, n);
    printf("result=%d coverage=%u bytes=%zu\n", result, coverage, n);
    free(p);
    return result < 0 ? 2 : 0; /* rejeição esperada é distinta de crash */
}
