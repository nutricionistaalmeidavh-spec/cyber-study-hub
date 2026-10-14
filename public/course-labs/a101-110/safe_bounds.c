#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
int main(int argc,char**argv){
  if(argc!=2)return 2;
  char *end=NULL;errno=0;
  unsigned long n=strtoul(argv[1],&end,10);
  if(errno||end==argv[1]||!end||*end!='\0'||n>16ul){puts("rejeitado:limite");return 1;}
  char data[17]={0};for(unsigned long i=0;i<n;i++)data[i]='a';
  if(n>0 && data[0]!='a')return 3;
printf("aceito:%lu\n",n);return 0;
}
