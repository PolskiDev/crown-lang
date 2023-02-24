#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

char* toLower(char* s) {
  for(char *p=s; *p; p++) *p=tolower(*p);
  return s;
}
char* toUpper(char* s) {
  for(char *p=s; *p; p++) *p=toupper(*p);
  return s;
}

int main() {
    char msg[] = "HELLO WORLD";
    printf("%s", toLower(msg));

    return 0;
}