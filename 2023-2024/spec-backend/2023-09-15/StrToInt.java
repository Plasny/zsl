public class StrToInt {
    public static void main(String[] args) {
        String[][] arrStr = new String[][] {
            { "100", "222" },
            { "3333", "44" },
            { "555", "6" },
            { "7", "888" }
        };

        int sum = 0;

        for (int i = 0; i < arrStr.length; i++) {
            for (int j = 0; j < arrStr[i].length; j++) {
                sum += Integer.parseInt(arrStr[i][j]);
            }
        }

        System.out.println("Suma: " + sum);
    }
}
