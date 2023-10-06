import java.util.HashMap;
import java.util.Map;

public class ScrabbleScore {
    public static void main(String[] args) {
        System.out.println("SCRABBLE");
        System.out.printf("javascript: %d pkt\n", scoreWord("javascript"));
        System.out.printf("java: %d pkt\n", scoreWord("java"));
    }

    public static int score(char c) {
        int score = 0;

        Map<Character, Integer> m = new HashMap<Character, Integer>();
        m.put('A', 1);
        m.put('B', 3);
        m.put('C', 3);
        m.put('D', 2);
        m.put('E', 1);
        m.put('F', 4);
        m.put('G', 2);
        m.put('H', 4);
        m.put('I', 1);
        m.put('J', 8);
        m.put('K', 5);
        m.put('L', 1);
        m.put('M', 3);
        m.put('N', 1);
        m.put('O', 1);
        m.put('P', 3);
        m.put('Q', 10);
        m.put('R', 1);
        m.put('S', 1);
        m.put('T', 1);
        m.put('U', 1);
        m.put('V', 4);
        m.put('W', 4);
        m.put('X', 8);
        m.put('Y', 4);
        m.put('Z', 10);

        return m.get(c);
    }

    public static int scoreWord(String s) {
        s = s.toUpperCase();
        int score = 0;

        for (int i = 0; i < s.length(); i++) {
            score += score(s.charAt(i));
        }

        return score;
    }
}
