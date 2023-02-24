#include <stdio.h>
#include <stdlib.h>
#include <regex.h>
#include <string.h>
#include <locale.h>

regex_t strmatch(const char *string, const char *pattern) {
    regex_t re;
    if (regcomp(&re, pattern, REG_EXTENDED|REG_NOSUB) != 0) {}
    int status = regexec(&re, string, 0, NULL, 0);
    regfree(&re);
    if (status != 0) {};
    return re; 
}
const char* match(regex_t *pexp, char *sz) {
    regmatch_t matches[1];
    if (regexec(pexp, sz, 1, matches, 0) == 0) {
        //printf("\"%s\" matches characters %d - %d\n", sz, matches[0].rm_so, matches[0].rm_eo);
        return sz;
    } else {
        //printf("\"%s\" does not match\n", sz);
        return "ERROR";
    }
}

int main () {
   char str[80] = "This is - \"www.tutorialspoint.com\" - website";
   const char s[360] = "[A-Za-z0-9_$++::.,@*#><>=<=>===:=\\[\\]]+|\"[^\"]+\"|\"[^\"]+\"|\\([^)]*\\)|\\[[^\\]]*\\]|(:)|(=)";
   char *token;
   
   /* get the first token */
   token = strtok(str, s);
   
   /* walk through other tokens */
   while( token != NULL ) {
      printf( " %s\n", token );
    
      token = strtok(NULL, s);
   }
   
   return(0);
}