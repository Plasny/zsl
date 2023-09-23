import java.util.Scanner;

public class Rectangle {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("Podaj długości boków prostkąta");

        double a = Double.parseDouble(sc.nextLine());
        double b = Double.parseDouble(sc.nextLine());
        double pole = a * b;

        sc.close();

        System.out.println("Pole prostokąta jest równe " + pole);
    }
}

