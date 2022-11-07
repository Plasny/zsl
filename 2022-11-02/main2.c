#include <stdio.h>
#include <stdlib.h>

int liczZnak(char *str, int strLen, char c)
{
    int count = 0;
    for (int i = 0; i < strLen; i++)
        if (str[i] == c)
            count++;

    return count;
}

int main()
{
    int n;
    char c, *str;

    printf("Podaj długość ciągu: ");
    scanf("%d", &n);

    str = malloc(n * sizeof(char));
    printf("Podaj ciąg: ");
    scanf("%s", str);

    printf("Podaj szukany znak: ");
    scanf(" %c", &c);

    printf("Ilość wystąpień znaku '%c' to %d\n", c, liczZnak(str, n, c));

    return 0;
}
