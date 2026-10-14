#include <stdio.h>
__attribute__((noinline)) const char * classify(int score) {return score>=8?"APROVADO":"REVER";}
int main(void) { printf("%s,%s\n",classify(7),classify(8));return 0; }
