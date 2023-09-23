import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class OtherChars {
    public static void main(String[] args) {
        Set<Character> usedChars = new HashSet<Character>();
        char[] alphabet = "abcdefghijklmnopqrstuvwxyz".toCharArray();

        System.out.print("Enter a sentence: ");

        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine().toLowerCase();
        sc.close();

        for(char ch : str.toCharArray()) {
            usedChars.add(ch);
        }

        for(char ch : alphabet) {
            if(!usedChars.contains(ch)) {
                System.out.print(ch);
            }
        }

        System.out.print('\n');
    }
}
