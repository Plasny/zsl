#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#define MAX 2000

char str[MAX];

int check(int num)
{
    if (num == 1)
        return 1;
    else if (num % 2 == 0)
        return check(num / 2);
    else if (num % 5 == 0)
        return check(num / 5);
    else
        return 0;
}

void removeTrailing0(char *str)
{
    int len = strlen(str);
    for (int i = len - 1; i >= 0; i--)
    {
        // printf("%d - %c\n",i,str[i]);
        // if (str[i] != '0' && str[i] != '\0'){
        if (str[i] != '0')
        {
            str[i + 1] = '\0';
            return;
        }
    }
}

int okresCheck(int start, int len)
{
    for (int i = start; i < MAX - len; i++)
    {
        // printf("--> %c : %c\n", str[i], str[i+len]);
        if (str[i] != str[i + len])
            return 0;
    }

    return 1;
}

char *okres()
{
    // i = długość fragmentu przed okresem
    for (int i = 0; i < MAX / 2; i++)
    {
        // j = długość okresu
        for (int j = i; j < MAX / 2 - i; j++)
        {
            // printf("początek okresu [i]: %d, długość okresu [j]: %d\n", i, j - i + 1);

            if (okresCheck(i, j - i + 1))
            {
                char *rozw;
                rozw = malloc((j + 3) * sizeof(char));

                for (int l = 0; l < i; l++)
                    rozw[l] = str[l];

                rozw[i] = '(';

                for (int l = i; l <= j; l++)
                    rozw[l + 1] = str[l];

                rozw[j + 2] = ')';

                return rozw;
            }
        }
    }
}

int main()
{
    int L, M;
    int intOut;

    if (scanf("%d %d", &L, &M))
    {
        intOut = L / M;

        if (L % M == 0)
            printf("%d\n", intOut);
        else if (check(M))
        {
            char out[14];

            sprintf(out, "%6.6f", (double)L / M);
            removeTrailing0(out);
            printf("%s\n", out);
        }
        else
        {
            int rest = L % M;
            for (int i = 0; i < MAX; i++)
            {
                char buf[2];
                sprintf(buf, "%hhi", 10 * rest / M);
                str[i] = buf[0];

                rest = 10 * rest % M;
            }

            printf("%d.%s\n", intOut, okres());
        }

        return 0;
    }

    return 1;
}
