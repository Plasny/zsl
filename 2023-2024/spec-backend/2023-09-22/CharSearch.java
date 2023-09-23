import java.util.ArrayList;
import java.util.Scanner;

public class CharSearch {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<String> strs = new ArrayList<String>();
        ArrayList<Integer> scores = new ArrayList<Integer>();
        char searched;

        System.out.print("Enter character: ");
        searched = sc.nextLine().toLowerCase().charAt(0);

        System.out.println("Enter words or '#end' to end input: ");
        while (true) {
            String word = sc.nextLine().toLowerCase();
            int score = 0;

            if (word.equals("#end"))
                break;

            for (char ch : word.toCharArray()) {
                if (ch == searched)
                    score++;
            }

            strs.add(word);
            scores.add(score);
        }

        sc.close();

        // sets of arrays would be better probably
        // but i wanted to code merge sort in java
        customMergeSort(strs, scores, 0, scores.size() - 1);

        int currentScore = -1;
        for (int i = 0; i < strs.size(); i++) {
            if(currentScore != scores.get(i)) {
                currentScore = scores.get(i);
                System.out.printf("== Score: %d ==\n", currentScore);
            }

            System.out.printf("- %s\n", strs.get(i));
        }
    }

    public static void customMergeSort(ArrayList<String> strs, ArrayList<Integer> ints, int start, int end) {
        if (end == start)
            return;

        int middle = (end + start) / 2;

        customMergeSort(strs, ints, start, middle);
        customMergeSort(strs, ints, middle + 1, end);

        customMerge(strs, ints, start, middle, end);
    }

    public static void customMerge(ArrayList<String> strs, ArrayList<Integer> ints, int start, int middle, int end) {
        int sizeL = middle - start + 1, sizeR = end - middle;
        int iL = 0, iR = 0, i;
        ArrayList<Integer> intsL = new ArrayList<Integer>(sizeL), intsR = new ArrayList<Integer>(sizeR);
        ArrayList<String> strsL = new ArrayList<String>(sizeL), strsR = new ArrayList<String>(sizeR);

        for (i = 0; i < sizeL; i++) {
            intsL.add(ints.get(i + start));
            strsL.add(strs.get(i + start));
        }

        for (i = 0; i < sizeR; i++) {
            intsR.add(ints.get(i + middle + 1));
            strsR.add(strs.get(i + middle + 1));
        }

        i = start;
        while (iR < sizeR && iL < sizeL) {
            if (intsL.get(iL) >= intsR.get(iR)) {
                ints.set(i, intsL.get(iL));
                strs.set(i, strsL.get(iL));
                iL++;

            } else {
                ints.set(i, intsR.get(iR));
                strs.set(i, strsR.get(iR));
                iR++;
            }
            i++;
        }

        while (iR < sizeR) {
            ints.set(i, intsR.get(iR));
            strs.set(i++, strsR.get(iR++));
        }

        while (iL < sizeL) {
            ints.set(i, intsL.get(iL));
            strs.set(i++, strsL.get(iL++));
        }
    }
}
