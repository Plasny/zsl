import java.util.ArrayList;
import java.util.Scanner;

public class Run {
    public static void main(String[] args) {
        Coordinates c = new Coordinates(8, 1);

        System.out.println("Enter coordinates of corners of the triangle:");
        Triangle t = new Triangle(new Point(), new Point(), new Point());

        System.out.println("Enter coordinates of the point to check:");
        Point p = new Point();

        // c.addPoint(1, 1);
        // c.addPoint(0, 0);
        c.addPoint(p);

        // c.addLine(0, 1, 1, 4);

        c.addLines(t.getLines());
        //c.addLines(new Point[]{new Point(5, 7), new Point(2, 4), new Point(7, 3), new Point(2, 7)});

        c.draw();

        System.out.println("\nPoint is inside triangle? " + t.isInTriangle(p));
    }
}

public class Point {
    public double x;
    public double y;

    public Point() {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter x: ");
        this.x = Double.parseDouble(sc.nextLine());

        System.out.print("Enter y: ");
        this.y = Double.parseDouble(sc.nextLine());
    }

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}

public interface lines {
    public Point[] getLines();
}

public class Triangle implements lines {
    private Point p1, p2, p3;

    public Triangle(Point p1, Point p2, Point p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    public static double area(Triangle t) {
        return Math.abs((t.p1.x * (t.p2.y - t.p3.y) + t.p2.x * (t.p3.y - t.p1.y) + t.p3.x * (t.p1.y - t.p2.y)) / 2.0);
    }

    public static double area(Point p1, Point p2, Point p3) {
        return Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2.0);
    }

    public boolean isInTriangle(Point p) {
        double a = area(this);
        double a1 = area(p1, p2, p);
        double a2 = area(p1, p3, p);
        double a3 = area(p2, p3, p);

        return a == a1 + a2 + a3;
    }

    public Point[] getLines() {
        return new Point[] { p1, p2, p3 };
    }
}

public class Coordinates {
    private boolean[][] c;
    private int precision;

    public Coordinates() {
        this.precision = 0;
        int size = 20;
        int n = (int) Math.pow(10, precision);
        this.c = new boolean[size * n][size * n];
    }

    public Coordinates(int size, int precision) {
        this.precision = precision;
        int n = (int) Math.pow(10, precision);
        this.c = new boolean[size * n][size * n];
    }

    public void draw() {
        System.out.println("coordinates:");

        for (int i = c.length - 1; i >= 0; i--) {
            for (int j = 0; j < c[i].length; j++) {
                if (c[i][j]) {
                    System.out.print("*");
                } else {
                    System.out.print(" ");
                }
            }
            System.out.print("\n");
        }
    }

    public void addPoint(double x, double y) {
        int rx = (int) (x * Math.pow(10, precision));
        int ry = (int) (y * Math.pow(10, precision));
        c[ry][rx] = true;
    }

    public void addPoint(Point p) {
        int rx = (int) (p.x * Math.pow(10, precision));
        int ry = (int) (p.y * Math.pow(10, precision));
        c[ry][rx] = true;
    }

    public void addLine(double x1, double y1, double x2, double y2) {
        double n = Math.pow(10, precision);
        int rx1 = (int) (x1 * n);
        int rx2 = (int) (x2 * n);
        int ry1 = (int) (y1 * n);
        int ry2 = (int) (y2 * n);
        int start, end;

        if (rx1 < rx2) {
            start = rx1;
            end = rx2;
        } else if (rx1 > rx2) {
            start = rx2;
            end = rx1;
        } else {
            if (ry1 <= ry2) {
                for (int i = ry1; i <= ry2; i++) {
                    c[i][rx1] = true;
                }
            } else {
                for (int i = ry2; i <= ry1; i++) {
                    c[i][rx1] = true;
                }
            }

            return;
        }

        for (; start <= end; start++) {
            int y = (int) ((((y1 - y2) / (x1 - x2)) * (start / n) + y1 - x1 * ((y1 - y2) / (x1 - x2))) * n);
            c[y][start] = true;

            // System.out.println("x: " + start + " y: " + y);
        }
    }

    public void addLine(Point p1, Point p2) {
        double n = Math.pow(10, precision);
        int rx1 = (int) (p1.x * n);
        int rx2 = (int) (p2.x * n);
        int ry1 = (int) (p1.y * n);
        int ry2 = (int) (p2.y * n);
        int start, end;

        if (rx1 < rx2) {
            start = rx1;
            end = rx2;
        } else if (rx1 > rx2) {
            start = rx2;
            end = rx1;
        } else {
            if (ry1 <= ry2) {
                for (int i = ry1; i <= ry2; i++) {
                    c[i][rx1] = true;
                }
            } else {
                for (int i = ry2; i <= ry1; i++) {
                    c[i][rx1] = true;
                }
            }

            return;
        }

        for (; start <= end; start++) {
            int y = (int) ((((p1.y - p2.y) / (p1.x - p2.x)) * (start / n) + p1.y
                    - p1.x * ((p1.y - p2.y) / (p1.x - p2.x))) * n);
            c[y][start] = true;

            // System.out.println("x: " + start + " y: " + y);
        }
    }

    public void addLines(Point[] ps) {
        for (int i = 0; i < ps.length; i++) {
            for (int j = i + 1; j < ps.length; j++) {
                this.addLine(ps[i].x, ps[i].y, ps[j].x, ps[j].y);
            }
        }
    }
}
