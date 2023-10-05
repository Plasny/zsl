import java.util.Set;
import java.util.HashSet;
import java.lang.Math;

public class runRobot {
    public static void main(String[] args) {
        Robot robot = new Robot();

        System.out.println(robot.getName());

        for (int i = 0; i < 1000; i++) {
            robot.reset();
            System.out.println(robot.getName());
        }
    }
}

public class Robot {
    private String name;
    private Set<String> usedNames;

    public Robot() {
        this.usedNames = new HashSet<String>();
        this.name = this.generateName();
    }

    private String generateName() {
        String name = "";

        while (true) {
            name = String.format("%c%c-%03d",
                    (char) (Math.random() * 26 + 65),
                    (char) (Math.random() * 26 + 65),
                    (int) (Math.random() * 1000));

            if (!this.usedNames.contains(name))
                return name;
        }
    }

    public void reset() {
        this.usedNames.add(this.name);
        this.name = this.generateName();
    }

    public String getName() {
        return this.name;
    }
}
