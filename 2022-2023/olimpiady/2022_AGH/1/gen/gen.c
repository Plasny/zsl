#include <stdio.h>

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
    int count = 0;

    if (scanf("%d %d", &A, &B))
    {
        // printf("primary? %d\n", ifPrimary(6));
        // printf("\nlargestNum = %d\n",largestBinNum(A, B));
        // printf("smallestNum = %d\n",smallestBinNum(A, B));

        int smallestNum = smallestBinNum(A,B);
        int largestNum = largestBinNum(A,B);
        for(int i = smallestNum; i <= largestNum; i++)
        {
            if(count1(i) == B)
                if(ifPrimary(i) == 0)
                    count++;
        }

        printf("%d",count);

        return 0;
    }

    return 1;
}
