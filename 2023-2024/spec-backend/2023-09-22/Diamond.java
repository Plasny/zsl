import java.util.Scanner;

public class Diamond {
    public static void main(String[] args) {
        System.out.print("Enter character from A-Z: ");

        Scanner sc = new Scanner(System.in);
        char ch = sc.nextLine().toUpperCase().charAt(0);
        sc.close();

        int chPos = charPosition(ch) + 1;
        int size = chPos * 2 - 1;
        int middle = size / 2 + 1;

        for (int i = 0; i < chPos; i++) {
            printRow(i, size, middle);
        }
        for (int i = chPos - 2; i >= 0; i--) {
            printRow(i, size, middle);
        }
    }

    public static int charPosition(char ch) {
        int num = (int) ch - (int) 'A';
        return num;
    }

    public static void printRow(int charIdx, int width, int middle) {
        for (int i = 0; i < width; i++) {
            if (i == middle + charIdx - 1 || i == middle - charIdx - 1) {
                System.out.print((char) (charIdx + (int) 'A'));
            } else {
                System.out.print('·');
            }
        }

        System.out.print('\n');
    }
}
