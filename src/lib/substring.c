#include <stdio.h>
#include <stdlib.h>
#include <string.h>
/*int indexOf_old(char* string, char* character) {
    //char *string = "qwerty";
    char* e;
    int index;

    e = strchr(string, character);
    index = (int)(e - string);
    return index;
}*/

/*int indexOf(char string[], char c) {
    char *str = strtok(string, "");
    return strstr(str, c); 
}*/


/** MOST RECOMMENDED */
/*int beginsWith(char str1[], char str2[]) {
    for(int i=0; i<strlen(str2); i++) {
        if (str1[i] == str2[i]) {
            continue;
        } else {
            return 0;
        }
    }
    return 1;
}
int indexOf(char str[], char character[]) {
    for (int i=0;i<strlen(str);i++) {
        if(beginsWith(&str[i], character)) {
            return i;
        }
    }
    return -1;
}*/

int indexOf(char str[], char chr[]) {
    char* ptr = strchr(str, chr);
    //char s[4096];
    //strcpy(s, ptr);
    
    if (ptr != NULL) {
        int pos = ptr - str;
        return pos;
    }
}

void substr(char s[], char sub[], int p, int l) {
   int c = 0;
   
   while (c < l) {
      sub[c] = s[p+c-1];
      c++;
   }
   sub[c] = '\0';
}

int main() {
    char sub[1024];
    char s[] = "Hello world";
    int s_size = sizeof(s)/sizeof(s[0]);
    //substring(s,sub, 7,s_size);
    //substring(s,sub, indexOf(s," "), s_size);

    //printf("%s", sub);

    int ind = indexOf("Hello world", "w");
    printf("Found index: %i\n", ind);
    return 0;
}