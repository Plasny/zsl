#include <stdio.h>
#include <math.h>
#define _USE_MATH_DEFINES

void sinTo10Pi(char *filename)
{
    FILE *fptr;
    fptr = fopen(filename, "w");

    // fprintf(fptr, "x   \tf(x)\n");
    for (float i = 0; i < M_PI * 10; i += 0.1)
    {
        fprintf(fptr, "%.2f\t%f\n", i, sin(i));
    }

    fclose(fptr);
}

void readFile(char *filename)
{
    FILE *fptr;
    fptr = fopen(filename, "r");
    float x, fx;

    if (fptr > 0)
    {
        while (feof(fptr) == 0)
        {
            fscanf(fptr, "%f %f", &x, &fx);
            if (fabs(fx) <= 0.05)
            {
                printf("%.2f\t%f\n", x, fx);
            }
        }

        fclose(fptr);
    }
    else
    {
        printf("Błąd otwarcia pliku\n");
    }
}

int main()
{
    char *filename = "out.txt";

    sinTo10Pi(filename);
    readFile(filename);

    return 0;
}
