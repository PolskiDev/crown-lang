#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

size_t split_token(char *buffer, char *argv[], size_t argv_size)
{
    char *p, *start_of_word;
    int c;
    enum states { DULL, IN_WORD, IN_STRING } state = DULL;
    size_t argc = 0;

    for (p = buffer; argc < argv_size && *p != '\0'; p++) {
        c = (unsigned char) *p;
        switch (state) {
        case DULL:
            if (isspace(c)) {
                continue;
            }

            if (c == '"') {
                state = IN_STRING;
                start_of_word = p + 1; 
                continue;
            }

            /*if (c == '(') {
                state = IN_STRING;
                start_of_word = p + 1; 
                continue;
            }
            if (c == '[') {
                state = IN_STRING;
                start_of_word = p + 1; 
                continue;
            }*/
            state = IN_WORD;
            start_of_word = p;
            continue;

        case IN_STRING:
            if (c == '"') {
                *p = 0;
                argv[argc++] = start_of_word;
                state = DULL;
            }
            /*if (c == ')') {
                *p = 0;
                argv[argc++] = start_of_word;
                state = DULL;
            }
            if (c == ']') {
                *p = 0;
                argv[argc++] = start_of_word;
                state = DULL;
            }*/
            continue;

        case IN_WORD:
            if (isspace(c)) {
                *p = 0;
                argv[argc++] = start_of_word;
                state = DULL;
            }
            continue;
        }
    }

    if (state != DULL && argc < argv_size)
        argv[argc++] = start_of_word;

    return argc;
}
void c_tokenizer(char* buffer_tok, const char *s, char* arguments[])
{
    char buf[1024];
    size_t i, stackc;
    char *stack[20];

    FILE* outfile;
    outfile = fopen(arguments[1],"w");

    if(outfile == NULL) {
        printf("\nError PointerException!\n");   
        exit(1);             
    }

    strcpy(buf, s);
    stackc = split_token(buf, stack, 20);
    for (i = 0; i < stackc; i++) {
        if (strcmp(stack[i],"if")==0) {
            printf("Se %s\n", stack[i+1]);
            fprintf(outfile,"se (%s) entao\n", stack[i+1]);
        }
    }
    fclose(outfile);
        
}
int main(int argc, char *argv[])
{

    FILE* source;
    source
    char* buffer;
    c_tokenizer(
        buffer,
        "let a = \"Hello world\"\nif (a > 3) do\nlet b = [1, 2, 3]\n",
        argv
    );
    //printf("%s", buffer);
    
    return 0;
}