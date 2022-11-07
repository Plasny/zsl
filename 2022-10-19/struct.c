#include <stdio.h>
#include <stdint.h>

struct myStructure {
    uint8_t a;
    uint8_t b;
    uint8_t c;
};

int main () {
    struct myStructure s;

    s.a = 1;
    s.b = 0;
    s.c = 255;

    printf("%d %d %d\n", s.a, s.b, s.c);
    
    return 0;
}
