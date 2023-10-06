import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Zegar z = new Zegar(10, 10);
        int n;

        System.out.printf("jest godzina: %s\n", z.toString());

        System.out.println("podaj liczbę minut do dodania: ");
        n = Integer.parseInt(sc.nextLine());
        z.addMinutes(n);
        System.out.printf("po dodaniu %d minut jest godzina %s\n", n, z.toString());

        System.out.println("podaj liczbę minut do odjęcia: ");
        n = Integer.parseInt(sc.nextLine());
        z.minusMinutes(n);
        System.out.printf("po odjęciu %d minut jest godzina %s\n", n, z.toString());

        sc.close();
    }
}

public class Zegar {
    LocalTime t;
    DateTimeFormatter format;

    public Zegar() {
        t = LocalTime.now();
        format = DateTimeFormatter.ofPattern("hh:mm");
    }

    public Zegar(int h, int m) {
        t = LocalTime.of(h, m);
        format = DateTimeFormatter.ofPattern("hh:mm");
    }

    public void addMinutes(int n) {
        t = t.plusMinutes(n);
    }

    public void minusMinutes(int n) {
        t = t.minusMinutes(n);
    }

    public String toString() {
        return t.format(format);
    }
}
