#include <stdio.h>
#include <string.h>
#include <stdbool.h>
static bool store(char dest[8], size_t capacity, const char *src, size_t bytes) {
    if (bytes >= capacity) return false;
    memcpy(dest, src, bytes);
    dest[bytes] = '\0';
    return true;
}
int main(void) {
    char dest[8];
    printf("0:%s\n",store(dest,sizeof dest,"",0)?"OK":"REJECT");
    printf("7:%s\n",store(dest,sizeof dest,"abcdefg",7)?"OK":"REJECT");
    printf("8:%s\n",store(dest,sizeof dest,"abcdefgh",8)?"OK":"REJECT");
    return 0;
}
