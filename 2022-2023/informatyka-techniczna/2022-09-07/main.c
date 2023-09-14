#include <stdio.h>

int main()
{
    /// Zmienne
    int vec1[] = {11, 21, 3, 0, 12, 102, 322, -2, -30};
    int vec1_size = sizeof(vec1)/sizeof(int);
    int max, min, sum;
    
    // Min, max, sum using for loop
    max = min = sum = vec1[0];
    for( int i = 1; i < vec1_size; i++) {
        if (max < vec1[i]) {
            max = vec1[i];
        } else if (min > vec1[i]) {
            min = vec1[i];
        }
        
        sum += vec1[i];
    }
    
    printf("FOR LOOP: \n- maksimum: %d \n- minimum: %d \n- suma: %d \n", max, min, sum);
    
    // Min, max, sum using while loop
    max = min = sum = vec1[0];
    int i = 1;
    while( i < vec1_size) {
        if (max < vec1[i]) {
            max = vec1[i];
        } else if (min > vec1[i]) {
            min = vec1[i];
        }
        
        sum += vec1[i];
        i++;
    }
    
    printf("WHILE LOOP: \n- maksimum: %d \n- minimum: %d \n- suma: %d \n", max, min, sum);

    return 0;
}
