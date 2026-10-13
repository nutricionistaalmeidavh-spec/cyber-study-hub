#include <stddef.h>
#include <stdio.h>
#include <string.h>
/* Testar contratos primeiro permite estudar variantes sem executar UB. */
static int name_v1(size_t n, size_t cap) { return n <= cap; } /* falta NUL */
static int alias_v1(size_t n, size_t cap) { return !(n > cap); } /* mesma causa */
static int bytes_ok(size_t n, size_t cap) { return n <= cap; } /* sem terminador */
static int name_v2(size_t n, size_t cap) { return cap && n < cap; }
int main(void) {
    char dst[8];
    memset(dst, 0, sizeof dst);
    printf("n=8 cap=8 name_v1=%d alias_v1=%d bytes_ok=%d name_v2=%d\n",
           name_v1(8, sizeof dst), alias_v1(8, sizeof dst),
           bytes_ok(8, sizeof dst), name_v2(8, sizeof dst));
    for (size_t n = 0; n <= 9; ++n) {
        if (name_v2(n, sizeof dst)) { memcpy(dst, "12345678", n); dst[n] = 0; }
    }
    return name_v2(8, 8) || !name_v2(7, 8) || name_v2(0, 0);
}
