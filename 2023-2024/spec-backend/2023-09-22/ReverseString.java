import java.util.ArrayList;
import java.util.Scanner;

public class ReverseString {
    public static void main(String[] args) {
        System.out.println("Enter a word to reverse it:");

        Scanner sc = new Scanner(System.in);
        String word = sc.nextLine();
        sc.close();
        
        System.out.println(reverse(word));
    }

    public static String reverse(String str) {
        int size = str.length();
        String newStr = "";

        for(int i = 0; i < size; i++) {
            newStr += str.charAt(size - i - 1);
        }

        return newStr;
    }
}
