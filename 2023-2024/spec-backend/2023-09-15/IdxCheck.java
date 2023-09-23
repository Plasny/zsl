public class IdxCheck {
    public static void main(String[] args) {
        int[][] arr = new int[][] {
            { 0, 1, 0, 1 },
            { 0, 1, 0, 2 },
            { 0, 2, 0, 2 },
            { 0, 1, 0, 2 },
            { 0, 1, 0, 1 },
            { 0, 1, 0, 2 },
            { 0, 2, 0, 2 },
            { 0, 1, 0, 2 }
        };
        
        int idxsWithTwo = 0;

        for(int i = 0; i < arr.length; i++) {
            for(int j = 0; j < arr[i].length; j++) {
                if(arr[i][j] == 2) {
                    idxsWithTwo++;
                    break;
                }
            }
        }

        System.out.println(idxsWithTwo);
    }
}
