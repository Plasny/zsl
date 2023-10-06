import java.util.Scanner;

public class Zadanie07 {
    public static void main(String[] args) {
        Osoba o = new Osoba();
        o.init();

        System.out.println("=======================");
        o.display();
    }
}

public class Osoba {
    private String surname;
    private String city;
    private String postCode;

    public void init() {
        Scanner sc = new Scanner(System.in);

        System.out.println("Wprowadzanie danych");

        System.out.println("Podaj nazwisko:");
        this.surname = sc.nextLine();

        System.out.println("Podaj miasto:");
        this.city = sc.nextLine();

        System.out.println("Podaj kod pocztowy:");
        String tmp = sc.nextLine();
        if (check(tmp)) {
            this.postCode = tmp;
        } else {
            while (true) {
                System.out.println("podaj dokładnie pięć cyfr kodu i kreskę na trzecim miejscu");
                tmp = sc.nextLine();

                if (check(tmp)) {
                    this.postCode = tmp;
                    break;
                }
            }
        }

        sc.close();
    }

    public void display() {
        System.out.println("Wyświetlenie danych");
        System.out.printf("Nazwisko: %s\n", this.surname);
        System.out.printf("Miasto: %s\n", this.city);
        System.out.printf("Kod: %s\n", this.postCode);
    }

    public boolean check(String s) {
        int PostCodeLength = 6;
        int DashCharIdx = 2;

        if (s.length() != PostCodeLength)
            return false;

        for (int i = 0; i < PostCodeLength; i++) {
            if (i == DashCharIdx) {
                if (s.charAt(i) != '-')
                    return false;

            } else {
                try {
                    int n = Integer.parseInt(s.substring(i, i+1));
                    if (n < 0 && n >= 10)
                        return false;
                } catch (Exception e) {
                    // System.out.println("err");
                    return false;
                }
            }
        }

        return true;
    }
}
