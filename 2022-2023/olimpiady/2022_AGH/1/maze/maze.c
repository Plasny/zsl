#include <stdio.h>
#include <stdlib.h>

int N;
char *maze;

int pathFind(int x, int y, int move)
{
    if (x == N - 1 && y == N - 1)
    {
        printf("%d", move);
        exit(0);
    }

    maze[y * N + x] = 'X';

    if (y + 1 < N && maze[(y + 1) * N + x] == '.' && y - 1 >= 0 && maze[(y - 1) * N + x] == '.')
        pathFind(x, y - 1, move + 1);

    if (y + 1 < N && maze[(y + 1) * N + x] == '.')
        pathFind(x, y + 1, move + 1);

    if (y - 1 >= 0 && maze[(y - 1) * N + x] == '.')
        pathFind(x, y - 1, move + 1);

    if (x + 1 < N && maze[y * N + x + 1] == '.')
        pathFind(x + 1, y, move + 1);

    return -1;
}

int main()
{
    if (scanf("%d", &N))
    {
        maze = malloc(N * N * sizeof(char));

        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++)
                scanf(" %c", &maze[i * N + j]);

        int moves = pathFind(0, 0, 0);
        if (moves == -1)
            printf("BRAK");

        return 0;
    }

    return 1;
}
