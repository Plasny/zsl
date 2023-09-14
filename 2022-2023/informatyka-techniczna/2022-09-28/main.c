#define N 10
#include <stdio.h>

int sumaTabeli(int *arr) {
    int S=0;

    for(int i = 0; i < N; i++)
        S=S+*(arr+i);  // A + 0 --> A[1],A[2],...,A[i]

    return S;
}

void getMinMax(int *arr, int *min, int *max) {
    *max = *min = arr[0];
    for( int i = 1; i < N; i++) {
        if (*max < arr[i]) {
            *max = arr[i];
        } else if (*min > arr[i]) {
            *min = arr[i];
        }
    }
}

int main() {
    int B[N] = {1,2,3,4,5,6,7,8,9,0};
    int min, max;

    int suma = sumaTabeli(B);
    getMinMax(B, &min, &max);   // w taki sposób można ustawić wiele wartości naraz !

    printf("suma: %d\n", suma);
    printf("min: %d, max: %d\n", min, max);
    return 0;
}
