#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void alloc_buffer(char* buffer, char text[]) {
    long    numbytes;
    
    /* grab sufficient memory for the 
    buffer to hold the text */
    buffer = (char*)calloc(numbytes, sizeof(char));	
    
    /* memory error */
    if(buffer == NULL) {
        printf("\nERROR: Buffer memory error!\n");
    }

    strcpy(buffer, text);
    printf("\n%s\n\n", buffer);
}

int main(){
    char    *buffer2;
    alloc_buffer(buffer2, "Hello world");
}