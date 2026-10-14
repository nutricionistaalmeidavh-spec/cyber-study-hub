#include <stdio.h>
#include <stdlib.h>
int main(void){char*p=malloc(8);if(!p)return 2;p[0]='A';p[1]='\0';int ok=p[0]=='A';free(p);p=NULL;if(!ok)return 3;puts("vida_ok");return 0;}
