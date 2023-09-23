public class Diagonal {
    public static void main(String[] args) {
        int[][] arr = new int[10][10];
        int k = 0;

        for(int i = 0; i < arr.length; i++) {
            for(int j = 0; j < arr.length; j++) {
                if(i + j == arr.length - 1) {
                    System.out.printf("%d ", k);
                    k++;
                } else {
                    System.out.printf("0 ");
                }
            }
            System.out.printf("\n");
        }
    }
}
