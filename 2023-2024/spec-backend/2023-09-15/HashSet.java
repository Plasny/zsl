import java.util.HashSet;

public class checkingOutHashSet {
    public static void main(String[] args) {
        int[] arr = new int[] {0, 2, 4, 2, 6, 7, 4, 3, 12, 6};
        HashSet<Integer> hs = new HashSet<>();

        for(int i = 0; i < arr.length; i++) {
            hs.add(arr[i]);
        }

        System.out.printf(hs.toString());
        
    }
}
