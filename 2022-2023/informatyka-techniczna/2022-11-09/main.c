#include <stdio.h>
#define S 3

struct Family
{
    char city[10];
};

typedef struct
{
    int age;
    char name[10];
    char surname[20];
    struct Family family;
} Person;

int main(void)
{
    Person p[S];

    // p[0].age = 18;
    // sprintf(p[0].name, "Paweł");
    // sprintf(p[0].surname, "Pasternak");
    // sprintf(p[0].family.city, "Kraków");

    // printf("- %s %s:\
    //     \n  - lat: %d\
    //     \n  - miasto rodzinne: %s\n",
    //     p[0].name, p[0].surname, p[0].age, p[0].family.city);

    printf("Podaj kolejno imie, nazwisko, wiek i miasto rodzinne:\n");
    for (int i = 0; i < S; i++)
    {
        scanf("%s %s %d %s", p[i].name, p[i].surname, &p[i].age, p[i].family.city);
    }

    printf("");
    for (int i = 0; i < S; i++)
    {
        printf("- %s %s:\
\n  - lat: %d\
\n  - miasto rodzinne: %s\n",
            p[i].name, p[i].surname, p[i].age, p[i].family.city);
    }

    return 0;
}
