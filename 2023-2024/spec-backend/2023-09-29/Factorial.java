import java.math.BigInteger;
import java.util.Scanner;

public class runFactorial {
    public static void main(String[] args) {
        Factorial f = new Factorial();
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter number: ");
        int num = Integer.parseInt(sc.nextLine());
        sc.close();

        f.count(num);
    }
}

public class Factorial {
    private BigInteger n = BigInteger.valueOf(1);

    public BigInteger count(int num) {
        for (int i = 1; i <= num; i++) {
            this.n = this.n.multiply(BigInteger.valueOf(i));
            System.out.printf("%d! = %s\n", i, this.n.toString());
        }

        return this.n;
    }
}
