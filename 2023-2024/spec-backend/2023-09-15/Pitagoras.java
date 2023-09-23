import java.util.Arrays;
import java.util.Scanner;

public class Pitagoras {
    public static void main(String[] args) {
        System.out.println("Podaj długości boków trójkąta: ");

        double[] sides = new double[3];

        Scanner sc = new Scanner(System.in);
        for (int i = 0; i < 3; i++) {
            sides[i] = Double.parseDouble(sc.nextLine());
        }
        sc.close();

        Arrays.sort(sides);

        if (Math.pow(sides[0], 2) + Math.pow(sides[1], 2) == Math.pow(sides[2], 2)) {
            System.out.println("Jest to trójkąt prostokątny.");
        } else {
            System.out.println("Nie jest to trójkąt prostokątny.");
        }
    }
}
