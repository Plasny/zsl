public class Run {
    public static void main(String[] args) {
        MyPoint p1 = new MyPoint(4, 0);
        MyPoint p2 = new MyPoint(4, 0);

        System.out.println(p1.toString());
        System.out.println(p1.distanceFrom());
        System.out.println(p1.distanceFrom(1, 1));
        System.out.println(p1.distanceFrom(p2));

        System.out.println(p2.toString());
        System.out.println(p2.distanceFrom(2, 3));
    }
}

public class MyPoint {
    private int x;
    private int y;

    public MyPoint() {
        this.x = 0; 
        this.y = 0;
    }

    public MyPoint(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public int[] getPoint() {
        return new int[]{x, y};
    }

    public double distanceFrom() {
        return Math.sqrt(Math.pow((0 - x), 2) + Math.pow((0 - y), 2));
    }

    public double distanceFrom(int x, int y) {
        return Math.sqrt(Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2));
    }

    public double distanceFrom(MyPoint p) {
        return Math.sqrt(Math.pow((this.x - p.getX()), 2) + Math.pow((this.y - p.getY()), 2));
    }

    public String toString() {
        return "MyPoint{x=" + x + ", y=" + y + "}";
    }
}
