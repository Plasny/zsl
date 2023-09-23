import java.util.Scanner;

public class Snail {
    public static void main(String[] args) {
        int size;

        System.out.println("Podaj rozmiar spirali:");
        Scanner sc = new Scanner(System.in);
        try {
            size = Integer.parseInt(sc.nextLine());
            sc.close();
        } catch (Exception e) {
            System.out.println("Nie prawidłowy rozmiar!");
            return;
        }

        int[][] arr = new int[size][size];
        int ml = size - 1, l = ml, c = 0, i = 0, j = 0;

        // right -> 0
        // down -> 1
        // left -> 2
        // up -> 3
        byte direction = 0;
        
        while(c < size * size) {
            // System.out.printf("l=%d, i=%d, j=%d, c=%d\n", l, i, j, c);

            arr[i][j] = c++;
            l--;

            switch (direction) {
                case 0:
                    j++;
                    break;
                case 1:
                    i++;
                    break;
                case 2:
                    j--;
                    break;
                case 3:
                    i--;
                    break;
            }


            if (l == 0) {
                direction++;
                l = ml;

                if(direction == 2) {
                    ml--;
                }

                if(direction >= 4) {
                    direction = 0;
                    ml--;
                }
            }
        }

        System.out.printf("\nSpirala:\n");
        for(i = 0; i < size; i++) {
            for(j = 0; j < size; j++) {
                System.out.printf("%d\t", arr[i][j]);
            }
            System.out.printf("\n");
        }
        System.out.printf("\n");
    }
}
