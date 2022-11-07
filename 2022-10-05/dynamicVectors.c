#include <stdio.h>
#include <stdlib.h>

int main() {
    int *Vec, VecSize, tmp;
    
    printf("Wprowadź rozmiar wektora: ");
    scanf("%d", &VecSize);
    Vec=malloc(VecSize*sizeof(*Vec));   // przydzielenie pamięci potrzebnej dla tablicy o danym rozmiarze

    printf("Podaj dane po spacji lub enterze:\n");
    for(int i = 0; i < VecSize; i++) {
        scanf("%d", &tmp);
        Vec[i] = tmp;
    }

    printf("Twoje dane:\n");
    for(int i = 0; i < VecSize; i++) {
        printf("Vec[%d]\t= %d\n", i, Vec[i]);
    }

    return 0;
}
