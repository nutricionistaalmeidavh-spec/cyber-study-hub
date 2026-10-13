#include <stddef.h>
#include <stdint.h>
int parse_record(const uint8_t *, size_t);
int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    /* Sem estado persistente por input, I/O ou criação de processos. */
    if (size <= 4096) (void)parse_record(data, size);
    return 0;
}
