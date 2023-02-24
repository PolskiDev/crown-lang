#include <stdio.h>
#include <stdlib.h>

// retorna um int, argumento é de tipo int
int fat(int n) {
    int i, fat ;
    if (n <= 1) { // por definição
        return (1) ;
    } 
    fat = 1 ;
    for (i=2; i <= n; i++) {
        fat *= i ;
    }
    return (fat) ;
}
int main() {
    printf("O fatorial eh: %i\n\n", fat(15));
    return 0;
}