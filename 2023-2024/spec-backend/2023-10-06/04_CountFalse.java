public class CountFalse {
    public static void main(String[] args) {
        int count = 0;
        boolean[][] tablica8 = new boolean[][] {
                { true, true, true, false, true, true, true, false },
                { true, true, true, true, true, true, true, true },
                { true, false, false, false, true, true, true, true },
                { false, false, true, true, false, true, false, true }
        };

        for (int i = 2; i < tablica8.length; i++) {
            for (int j = 0; j < tablica8[i].length; j++) {
                if (!tablica8[i][j])
                    count++;
            }
        }

        System.out.println(count);
    }
}
