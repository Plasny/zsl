import java.util.Scanner;

public class Reverse {
    public static void main(String[] args) {
        System.out.println("ODWRACANIE");
        System.out.println("Podaj dowolny ciąg znaków");

        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine();
        sc.close();

        System.out.println("odwrócone:");
        str = reverse(str);
        System.out.println(str);

        System.out.println("znów odwrócone:");
        str = reverse(str);
        System.out.println(str);
    }

    public static String reverse(String s) {
        char[] arr1 = s.toCharArray();
        char[] arr2 = new char[arr1.length];

        for (int i = 0; i < arr1.length; i++) {
            arr2[arr1.length - i - 1] = arr1[i];
        }

        return String.valueOf(arr2);
    }
}
