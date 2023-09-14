#include <stdio.h>

int main()
{
    FILE *fIn, *fOut;   // FILE - stuktura opisująca plik
    char ch;

    /// pobranie danych o pliku i zapisanie ich w zmiennej
    fIn = fopen("in.txt", "r");     // umożliwienie odczytu tego pliku
    // fOut = fopen("out.txt", "w");   // umożliwienie zapisu tego pliku
    fOut = fopen("out.txt", "a");   // umożliwienie nadpis tego pliku

    if (fIn > 0)
    {
        while (feof(fIn) == 0)
        {
            ch = getc(fIn); // wyciągnięcie 1 znaku z fIn
            putchar(ch);    // wypisanie tego znaku na ekranie
            putc(ch, fOut); // wpisanie znaku do nowego pliku
        }

        /// zamknięcie pliku
        fclose(fIn);
        fclose(fOut);
    }
    else
    {
        printf("Błąd otwarcia pliku\n");
    }

    return 0;
}
