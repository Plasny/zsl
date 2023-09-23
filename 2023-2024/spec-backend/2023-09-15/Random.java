import java.util.Random;

public class myRandom {
    public static void main(String[] args) {
        Random rnd = new Random();
        int[] arr = new int[5];

        System.out.printf("Wylosowane liczby: ");
        for(int i = 0; i < 5; i++) {
            arr[i] = rnd.nextInt(100);
            System.out.printf("%d ", arr[i]);
        }
        System.out.printf("\n");

        int min, max, avg;
        min = max = avg = arr[0];

        for(int i = 1; i < arr.length; i++) {
            avg += arr[i];

            if (arr[i] > max) {
                max = arr[i];
            } else if(arr[i] < min) {
                min = arr[i];
            }
        }

        avg /= 5;

        System.out.printf("Najmniejsza liczba: %d\nNajwiększa liczba: %d\nŚrednia: %d\n", min, max, avg);
    }
}

