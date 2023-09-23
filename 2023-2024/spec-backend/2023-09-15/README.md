# Introduction to Java

Java is an object-oriented programming language, created in 1995 by Sun Microsystems. It was designed as an alternative to the extremely difficult C ++ distinguished by the absence of both systematicity and logical restrictions in software development. The new approach also had to solve other urgent issues, like security, cross-platform, versatility, etc.

## Primitvew data types in Java 

Data Type | Size      | Description
--------- | --------- | ------------
byte      | 1 byte    | Stores whole numbers from -128 to 127
short     | 2 bytes   | Stores whole numbers from -32,768 to 32,767
int       | 4 bytes   | Stores whole numbers from -2,147,483,648 to 2,147,483,647
long      | 8 bytes   | Stores whole numbers from -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
float     | 4 bytes   | Stores fractional numbers. Sufficient for storing 6 to 7 decimal digits
double    | 8 bytes   | Stores fractional numbers. Sufficient for storing 15 decimal digits
boolean   | 1 bit     | Stores true or false values
char      | 2 bytes   | Stores a single character/letter or ASCII values

## Input from console

```java
import java.util.Scanner;

public class InputTest {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine();
        sc.close();

        System.out.println("String that was prived: " + str);
    }
}
```

## Exercises

- Diagonal.java
- HashSet.java
- IdxCheck.java
- KChar.java
- Loops.java
- Pitagoras.jav
- Random.java
- Rectangle.jav
- Snail.java
- Sphere.java
- Sqrt.java
- StrToInt.java

