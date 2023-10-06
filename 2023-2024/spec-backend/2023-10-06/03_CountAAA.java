public class CountAAA {
    public static void main(String[] args) {
        String[][] tablica7 = new String[][] {
                { "aaa", "bbb", "ccc" },
                { "ccc", "bbb", "aaa" },
                { "aaa", "bbb", "ccc" },
                { "ddd", "aaa", "aaa" },
                { "aaa", "bbb", "aaa" },
                { "ccc", "bbb", "eee" },
                { "eee", "bbb", "aaa" },
                { "ddd", "bbb", "fff" },
                { "vvv", "aaa", "fff" }
        };

        int count = 0;
        int idxsToCheck = 2;

        for (int i = 0; i < tablica7.length; i++) {
            for (int j = 0; j < idxsToCheck; j++) {
                if (tablica7[i][j] == "aaa") {
                    count++;
                    break;
                }
            }
        }

        System.out.println(count);
    }
}
