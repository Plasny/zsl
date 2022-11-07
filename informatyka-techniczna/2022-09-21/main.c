#include <stdio.h>

void printArray(int array[], int size);

int main() {
    /*
    int A, B;
    int *pAB;

    A=10;
    B=20;

    pAB=&A;
    // *pAB=*pAB++; // nie zadziała
    *pAB=*pAB+1;

    pAB=&B;
    *pAB+=1;

    printf("%d\t%d\n",A,B);
    // */

    int A[10] = {1,2,3,4,5,6,7,8,9,10};
    int *pA, *p, i;

    pA = &A[0]; // ustawiamy wskaźnik na początku tablicy (takie samo jak pA=&A)

    for(int i = 0; i < 10; i++){
        p = pA + i;
        *p = 0;
    }

    printArray(A, 10);

}

void printArray(int array[], int size) {
    for(int i = 0; i < size; i++){
        printf("%d ", array[i]);
    }
    printf("\n");
}
