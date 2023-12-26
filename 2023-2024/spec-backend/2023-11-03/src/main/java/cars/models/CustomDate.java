package cars.models;

import java.util.Date;
import java.util.Calendar;
import java.util.Random;

public class CustomDate {
    int year;
    int month;
    int day;

    public CustomDate(int year, int month, int day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    public static CustomDate afterYear(int afterYear) {
        Random rnd = new Random();
        Calendar cal = Calendar.getInstance();
        Date ds = new Date(rnd.nextLong(0, (new Date()).getTime()));
        int currentYear = cal.get(Calendar.YEAR);

        cal.setTime(ds);
        cal.set(Calendar.YEAR, rnd.nextInt(afterYear, currentYear + 1));

        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        int day = cal.get(Calendar.DAY_OF_MONTH);

        return new CustomDate(year, month, day);
    }

    public String toString() {
        return this.year + "-" + this.withLeadingZero(this.month) + "-" + this.withLeadingZero(this.day);
    }

    private String withLeadingZero(int n) {
        if (n < 10) {
            return "0" + n;
        } else {
            return "" + n;
        }
    }
}
