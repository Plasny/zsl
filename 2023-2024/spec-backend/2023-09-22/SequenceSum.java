import java.util.ArrayList;
import java.util.Scanner;

public class SequenceSum {
    public static void main(String[] args) {
        int size, sum = 0;
        ArrayList<Integer> list;

        System.out.print("Enter size of array: ");

        Scanner sc = new Scanner(System.in);
        size = Integer.parseInt(sc.nextLine());
        sc.close();

        System.out.printf("ArrayList elements: [");

        list = new ArrayList<Integer>(size + 1);
        for (int i = 0; i < size; i++) {
            list.add(i, i);
            sum += i;

            System.out.printf("%d, ", i);
        }

        list.add(size, size);
        sum += size;
        System.out.printf("%d]\n", size);

        System.out.printf("Sum of all ArrayList elements: %d\n", sum);
    }
}
