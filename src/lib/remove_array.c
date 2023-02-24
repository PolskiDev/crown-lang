#include <stdio.h>
#include <stdlib.h>

int main() {
    int a[] = { 0, 2, 4, 6, 8, 10, 12 };
    
    int a_size = sizeof(a)/sizeof(a[0]);
    int pos = a_size; // Determine position here
    if(pos < 0 || pos > a_size) {
        printf("Invalid position! Please enter position between 1 to %d", a_size);
    } else {
        /* Copy next element value to current element */
        for(int i=pos-1; i<a_size-1; i++) {
            a[i] = a[i + 1];
        }

        /* Decrement array size by 1 */
        a_size = a_size-1;
    }
    return 0;
}