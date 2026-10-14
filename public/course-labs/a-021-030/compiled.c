#include <stdio.h>
__attribute__((noinline)) int twice(int x) { return x * 2; }
int main(void) { printf("%d,%d\n", twice(5), twice(-2)); return 0; }
