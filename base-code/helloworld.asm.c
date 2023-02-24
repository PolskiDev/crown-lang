#include <stdio.h>

int main() {
   char nome[] = "Hello world";
   int a[] = { 0,5,10,25,20 };
   int a_size = sizeof(a)/sizeof(a[0]);

   for (int i=0;i<5;i++) {
      printf("My message is: %s\n", nome); 
   }

   for(int loop = 0; loop < a_size; loop++) {
      printf("%d ", a[loop]); 
   }
      
    
   return 0;
}