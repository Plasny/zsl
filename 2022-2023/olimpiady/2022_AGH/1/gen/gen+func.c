#include <stdio.h>
#define BUF_SIZE 33

// src: https://stackoverflow.com/a/1024414
char *int2bin(int a, char *buf, int buf_size)
{
    buf += (buf_size - 1);

    for (int i = 31; i >= 0; i--)
    {
        *buf-- = (a & 1) + '0';

        // printf("--> %d, %d\n", a, (a & 1));
        a >>= 1;
    }

    return buf;
}

int largestBinNum(int nuOf0, int nuOf1)
{
    int num = 1;
    for(int i = 1; i < nuOf1; i++)
        num = num * 2 + 1;

    num <<= nuOf0;

    return num;
}

int smallestBinNum(int nuOf0, int nuOf1)
{
    int num = 1;
    num <<= nuOf0;

    for(int i = 1; i < nuOf1; i++)
        num = num * 2 + 1;

    return num;

}

int count1(int num)
{
    int count = 1;

    for(int i = 31; i >= 0; i--)
    {
        if(num == 1)
            return count;
        if(num&1 == 1)
            count++;

        // printf("--> num: %d - count: %d\n", num,count);
        num >>= 1;
    }

    return -1;
}

// src: https://stackoverflow.com/a/2343180
int bin2int(char *buf, int buf_size)
{
    int total = 0;

    while (*buf)
    {
        total *= 2;
        if (*buf == '1')
            total += 1;

        *buf++;
    }

    return total;
}

/* 0 jeśli złożona*/
int ifPrimary(int num)
{
    if (num == 1)
        return 0;

    for (int i = 2; i < num - 1; i++)
    {
        if (num % i == 0)
            return 0;
    }

    return 1;
}

int main()
{
    int A, B;

    if (scanf("%d %d", &A, &B))
    {
        int length = A + B;
        printf("długość liczby: %d\n", length);


        char buffer[BUF_SIZE];
        buffer[BUF_SIZE - 1] = '\0';
        int2bin(length, buffer, BUF_SIZE - 1);
        printf("bin => %s\n", buffer);
        printf("dec => %d\n", bin2int(buffer, BUF_SIZE - 1));

        // printf("primary? %d\n", ifPrimary(6));
        // printf("\nlargestNum = %d\n",largestBinNum(A, B));
        // printf("smallestNum = %d\n",smallestBinNum(A, B));

        int smallestNum = smallestBinNum(A,B);
        int largestNum = largestBinNum(A,B);
        for(int i = smallestNum; i <= largestNum; i++)
        {
            if(count1(i) == B)
                if(ifPrimary(i) == 0)
                    printf("%d\n", i);
        }

        return 0;
    }

    return 1;
}
