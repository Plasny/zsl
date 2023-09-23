import java.util.ArrayList;
import java.util.Scanner;

public class PascalsTriangle {
    public static void main(String[] args) {
        System.out.print("Enter number of rows: ");

        Scanner sc = new Scanner(System.in);
        int rows = Integer.parseInt(sc.nextLine());
        sc.close();

        ArrayList<ArrayList<Integer>> arrs = new ArrayList<ArrayList<Integer>>(7);

        for (int i = 1; i <= rows; i++) {
            ArrayList<Integer> arr = new ArrayList<Integer>(i);

            arr.add(0, 1);

            for (int j = 1; j < i - 1; j++) {
                arr.add(j, arrs.get(i - 2).get(j - 1) + arrs.get(i - 2).get(j));
            }

            if (i != 1)
                arr.add(i - 1, 1);

            arrs.add(i - 1, arr);
        }

        for (int i = 0; i < arrs.size(); i++) {
            int size = arrs.get(i).size();
            int space = (rows - size) / 2;

            if (rows % 2 != 0 && i % 2 != 0)
                System.out.print("   ");
            if (rows % 2 == 0 && i % 2 == 0)
                System.out.print("   ");

            for (int j = 0; j < space; j++)
                System.out.print("      ");
            for (int j = 0; j < size; j++) {
                int num = arrs.get(i).get(j);

                if (num >= 100)
                    System.out.printf("%d   ", num);
                else if (num >= 10)
                    System.out.printf("%d    ", num);
                else
                    System.out.printf("%d     ", num);
            }

            System.out.print('\n');
        }
    }
}
