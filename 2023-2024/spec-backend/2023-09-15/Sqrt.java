import java.util.Scanner;

public class Sqrt {
    public static void main(String[] args) {
        System.out.println("Podaj liczbe");

        Scanner sc = new Scanner(System.in);
        double a = Double.parseDouble(sc.nextLine());
        sc.close();

        System.out.printf("Pierwiastek z %.2f jest równy %.2f\n", a, Math.sqrt(a));
    }
}
