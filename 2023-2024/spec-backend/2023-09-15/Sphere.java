import java.util.Scanner;

public class Sphere {
    public static void main(String[] args) {
        System.out.println("Podaj promień kuli");

        Scanner sc = new Scanner(System.in);
        double r = Double.parseDouble(sc.nextLine());
        sc.close();

        double v = (4 * Math.PI * Math.pow(r, 3)) / 3;

        System.out.printf("Objętość kuli o takim promieniu jest równa: %.2f.\n", v);
    }
}

