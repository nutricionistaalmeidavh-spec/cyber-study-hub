/* Exemplo próprio para compilar e explorar no Ghidra. Sem dependências externas. */
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <limits.h>
static int parse(const char *s,int *value){
 char *end=NULL;errno=0;long v=strtol(s,&end,10);
 if(errno||end==s||*end!='\0'||v<0||v>10)return 0;
 *value=(int)v;return 1;
}
int main(int argc,char **argv){
 int severity,impact,blocked;
 if(argc!=4||!parse(argv[1],&severity)||!parse(argv[2],&impact)){
  fputs("Uso: ./sample SEVERITY(0..10) IMPACT(0..10) BLOCKED(0|1)\n",stderr);return 2;
 }
 if(argv[3][0]=='0'&&argv[3][1]=='\0')blocked=0;
 else if(argv[3][0]=='1'&&argv[3][1]=='\0')blocked=1;
 else {fputs("invalid blocked\n",stderr);return 2;}
 int score=severity*2+impact+(blocked?5:0);
 const char *priority=score>=22?"critical":score>=14?"high":"normal";
 printf("score=%d priority=%s\n",score,priority);
 return 0;
}
