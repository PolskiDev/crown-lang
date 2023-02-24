// How to do lexical analysis in c?

#include <stdio.h>
#include <string.h>
 
int main(int argc, char** argv)
{
 
    //char* re = "[A-Za-z0-9_$++::.,@#><>=<=>===:=\\[\\]]+|\"[^\"]+\"|\"[^\"]+\"|\\([^)]*\\)|\\[[^\\]]*\\]|(:)|(=)";
    char* re = "(.*?)";
    char text[400] = "this is \"hello world\" forom hrello oelrd";
    char* token = strtok(text, re);
 
    while (token != NULL) {
        printf("(%s)", token);
        token = strtok(NULL, re);
    }
    return 0;
}