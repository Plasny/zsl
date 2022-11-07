#include <stdio.h>

int liczAwPliku()
{
    FILE *fIn;
    fIn = fopen("alfa.txt", "r");

    int count = 0;
    char c;

    while (feof(fIn) == 0)
    {
        c = getc(fIn);
        if (c == 'a' || c == 'A')
            count++;
    }

    return count;
}

int main()
{
    printf("liczba a w pliku: %d\n", liczAwPliku());

    return 0;
}
