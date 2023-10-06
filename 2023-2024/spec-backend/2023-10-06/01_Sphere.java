import java.util.Scanner;

public class Sphere {
    public static void main(String[] args) {
        System.out.println("Podaj promień r.");

        Scanner sc = new Scanner(System.in);
        double r = Double.parseDouble(sc.nextLine());
        sc.close();

        double v = 4.0 / 3.0 * Math.PI * Math.pow(r, 3);
        System.out.printf("Objętość kuli o promieniu r = %.2f wynosi %.2f\n", r, v);
    }
}
