public class Loops {
    public static void main(String[] args) {
        int max = 100;
        int tmp, i;

        System.out.printf("Program sumuje liczby całkowite od 1 do 100.\n");

        tmp = 0;
        for (i = 1; i <= max; i++) {
            tmp += i;
        }
        System.out.printf("Suma ciągu od 0 do %d jest równa %d (for)\n", max, tmp);

        tmp = 0;
        i = 1;
        while (i <= max) {
            tmp += i;
            i++;
        }
        System.out.printf("Suma ciągu od 0 do %d jest równa %d (while)\n", max, tmp);

        tmp = 0;
        i = 1;
        do {
            tmp += i;
            i++;
        } while (i <= max);
        System.out.printf("Suma ciągu od 0 do %d jest równa %d (do while)\n", max, tmp);
    }
}
