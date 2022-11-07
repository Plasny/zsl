#include <stdio.h>

// podaj min, max, sum pod przekątną tablicy
int main() {
    int const size = 4;
    int min, max, sum;
    int arr2d[4][4] = {
        {0, 12, 22, 3},
        {11, 2, 41, 5},
        {12, 54, 1, 5},
        {-1, 4, 11, 4}
    };

    /* Wypisanie całej tablicy
    printf("Wypisanie całej tablicy:\n");
    for (int i = 0; i < size; i++){
        for (int j = 0; j < size; j++)
            printf("%d ", arr2d[i][j]);
        printf("\n");
    }
    //*/

    /* Wypisanie tablicy pod przekątną
    printf("\nWypisanie wartości z pod przekątnej tablicy:\n");
    for (int i = 0; i < size; i++){
        for (int j = 0; j < i; j++)
            printf("%d ", arr2d[i][j]);
        printf("\n");
    }
    //*/

    //* Obliczenie min, max, sum pod przekątną tablicy
    min = max = sum = arr2d[0][0];
    for (int i = 0; i < size; i++)
        for (int j = 0; j < i; j++) {
            if (max < arr2d[i][j]) {
                max = arr2d[i][j];
            } else if (min > arr2d[i][j]) {
                min = arr2d[i][j];
            }
        
            sum += arr2d[i][j];
        }

    printf("\nTABLICA 2D - GŁÓWNA PRZEKĄTNA:\n - maksimum: %d \n - minimum: %d \n - suma: %d \n", max, min, sum);
    //*/
    
    //* Obliczenie min, max, sum pod drugą przekątną tablicy
    min = max = sum = arr2d[0][4];
    for (int i = 0; i < size; i++) 
        for (int j = size-1; j > i; j--) {
            if (max < arr2d[i][j]) {
                max = arr2d[i][j];
            } else if (min > arr2d[i][j]) {
                min = arr2d[i][j];
            }
        
            sum += arr2d[i][j];
        }
    
    printf("\nTABLICA 2D - DRUGA PRZEKĄTNA:\n - maksimum: %d \n - minimum: %d \n - suma: %d \n", max, min, sum);
    //*/

    return 0;
}