#include <stdint.h>
#include <stdio.h>
int LLVMFuzzerTestOneInput(const uint8_t *, size_t);
extern unsigned coverage;
int main(void) {
    unsigned seen = 0, kept = 0;
    /* Enumeração determinística: 2 tipos x 16 comprimentos declarados. */
    for (unsigned i = 0; i < 32; ++i) {
        uint8_t input[18] = {0};
        input[0] = i < 16 ? 'N' : 'R';
        input[1] = (uint8_t)(i % 16);
        LLVMFuzzerTestOneInput(input, sizeof input);
        if (coverage & ~seen) {
            seen |= coverage; ++kept;
            printf("run=%u retained=%u decisions=0x%x\n", i + 1, kept, seen);
        }
    }
    printf("runs=32 retained=%u bitmap=0x%x\n", kept, seen);
    return 0;
}
