// not correct

#include <stdio.h>
#include <stdlib.h>

int N;
char *maze;

void printMaze(char *maze, int size, int x, int y)
{
    printf("MAZE:\n");
    for (int i = 0; i < size; i++)
    {
        for (int j = 0; j < size; j++)
        {
            if (j == x && i == y)
                printf("O ");
            else
                printf("%c ", maze[i * size + j]);
        }
        printf("\n");
    }
}

int pathFind(int x, int y, int move)
{
    printf("\nx: %d, y: %d, move: %d\n", x, y, move);
    printMaze(maze, N, x, y);

    if (x == N - 1 && y == N - 1)
    {
        printf("%d", move);
        exit(0);
    }

    maze[y * N + x] = 'X';

    if (y + 1 < N && maze[(y + 1) * N + x] == '.' && y - 1 >= 0 && maze[(y - 1) * N + x] == '.')
    {
        printf("rozdroże\n");
        pathFind(x, y - 1, move + 1);
        printf("to lecimy w dół\n");
    }

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
