#include <stdio.h>
#include <stdlib.h>

// ciąg geometryczny: a_n = a_k * q^(n-k)
int getStringLength(int *s, int s_len, int index)
{
    double tmp;
    int len = 2;

    tmp = (double)s[index + 1] / s[index];
    // printf("\ns --> %d/%d = %f\n", s[index + 1], s[index], tmp);
    for (int i = index + 1; i < s_len - 1; i++)
    {
        // printf("%d --> %d/%d = %f\n", i, s[i + 1], s[i], (double)s[i + 1] / s[i]);
        if ((double)s[i + 1] / s[i] != tmp)
            break;

        len++;
    }

    return len;
}

int main()
{
    int N, high = 0;
    int *L, *M, *Ll, *Ml;

    if (scanf("%d", &N))
    {
        L = malloc(N * sizeof(int));
        Ll = malloc((N - 3) * sizeof(int));
        M = malloc(N * sizeof(int));
        Ml = malloc((N - 3) * sizeof(int));

        for (int i = 0; i < N; i++)
            scanf("%d %d", &L[i], &M[i]);

        for (int i = 0; i < N - 2; i++)
        {
            Ll[i] = getStringLength(L, N, i);
            Ml[i] = getStringLength(M, N, i);
            // printf("%d --> L length: %d, M length: %d\n", i, Ll[i], Ml[i]);

            int low;
            if (Ll[i] >= Ml[i])
                low = Ml[i];
            else
                low = Ll[i];

            if (high < low)
                high = low;
        }

        if (high < 3)
            printf("BRAK");
        else
            printf("%d", high);

        return 0;
    }

    return 1;
}
