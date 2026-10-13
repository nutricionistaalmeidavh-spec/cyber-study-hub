#include <stdio.h>
#include <string.h>
int main(void) {
    char buffer[1024]; /* garante objeto stack observável */
    FILE *f = fopen("/proc/self/maps", "r");
    if (!f) return 66;
    while (fgets(buffer, sizeof buffer, f)) {
        if (strstr(buffer, "/maps-") || strstr(buffer, "[stack]")) fputs(buffer, stdout);
    }
    return fclose(f) ? 74 : 0;
}
