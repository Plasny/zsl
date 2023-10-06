public class MultiplicationTable {
    public static void main(String[] args) {
        System.out.println("Program rysuje tabliczkę mnożenia");

        for (int i = 1; i <= 10; i++) {
            for (int j = 1; j <= 10; j++) {
                System.out.printf("%d\t", i * j);
            }
            System.out.print("\n");
        }
    }
}
