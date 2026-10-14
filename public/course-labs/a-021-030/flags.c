#include <stdio.h>
__attribute__((noinline)) const char * classify(int x) {
    if (x < 0) return "NEG";
    if (x == 0) return "ZERO";
    return "POS";
}
int main(void) { printf("%s,%s,%s\n",classify(-1),classify(0),classify(1));return 0; }
