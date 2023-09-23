public class KChar {
    public static void main(String[] args) {
        String[] arr = {"koty","psy","owoce","grzyby","samochody","kanarki"};

        for(int i = 0; i < arr.length; i++) {
            if(arr[i].charAt(0) == 'k') {
                System.out.println("Długość słowa " + arr[i] + " (na \"k\") wynosi " + arr[i].length());
            } else {
                System.out.println("Długość słowa " + arr[i] + " wynosi " + arr[i].length());
            }
        }
    }
}
