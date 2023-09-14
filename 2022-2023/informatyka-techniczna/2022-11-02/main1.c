#include <stdio.h>
#define N 5

int main()
{
    int tab[N][N] = {
        {1, 1, 1, 1, 1},
        {2, 1, 1, 1, 1},
        {-1, 3, 1, 1, 1},
        {1, 1, 2, 1, 1},
        {5, 1, 1, 2, 1}},
        min, max, sum = 0;

        min = max = tab[0][1];

    for (int i = 0; i < N; i++)
    {
        for (int j = 0; j < i; j++)
        {
            sum += tab[i][j];

            if(min > tab[i][j])
                min = tab[i][j];
            else if (max < tab[i][j])
                max = tab[i][j];
        }
    }

    printf("suma: %d\nminimum: %d\nmaximum: %d\n", sum, min, max);

    return 0;
}
