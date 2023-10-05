// redo with overriding class methods

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class runClocks {
    public static void main(String[] args) {
        Clock c1, c2;
        c1 = new Clock();
        c2 = new Clock();

        System.out.println("CLOCKS: ");
        System.out.println("c1: " + c1.toString());
        System.out.println("c2: " + c2.toString());

        System.out.println("\nEQUALITY CHECK: ");
        System.out.println("are clocks equal? " + c1.equals(c2));

        System.out.println("\nAdding time");
        c1.time = c1.time.plusMinutes(30);

        System.out.println("\nCLOCKS: ");
        System.out.println("c1: " + c1.toString());
        System.out.println("c2: " + c2.toString());

        System.out.println("\nEQUALITY CHECK: ");
        System.out.println("are clocks equal? " + c1.equals(c2));

        System.out.println("\nAdding time");
        c2.time = c2.time.plusMinutes(30);

        System.out.println("\nCLOCKS: ");
        System.out.println("c1: " + c1.toString());
        System.out.println("c2: " + c2.toString());

        System.out.println("\nEQUALITY CHECK: ");
        System.out.println("are clocks equal? " + c1.equals(c2));
    }
}

public class Clock {
    public LocalTime time;
    private DateTimeFormatter df;

    public Clock() {
        this.time = LocalTime.now();
        df = DateTimeFormatter.ofPattern("kk:mm");
    }

    public String toString() {
        return df.format(this.time);
    }

    public boolean equals(Clock c)  {
        return this.toString().equals(c.toString());
    }
}
