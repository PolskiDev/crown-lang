#include <stdio.h>
#include <stdlib.h>

int main() {
    int a[] = { 0, 2, 4, 6, 8, 10, 12 };
    int a_size = sizeof(a)/sizeof(a[0]);

    int pos = a_size+1;
    int add_value = 145;
    for(int i=a_size-1;i>=pos-1;i--) {
        a[i+1]=a[i];
        a[pos-1]= add_value;   
    }
   
    return 0;
}