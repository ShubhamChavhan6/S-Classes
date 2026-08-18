// src/data/javaQuizBank.js

export const JAVA_QUIZ_QUESTIONS = [
  {
    id: 'jq-1',
    category: 'String Memory & Immutability',
    question: 'What is the exact output of the following Java program?',
    code: `public class Main {
    public static void main(String[] args) {
        String s1 = "Java";
        String s2 = "Java";
        String s3 = new String("Java");

        System.out.print((s1 == s2) + " ");
        System.out.print((s1 == s3) + " ");
        System.out.print(s1.equals(s3));
    }
}`,
    options: [
      'true false true',
      'true true true',
      'false false true',
      'true false false'
    ],
    correctIndex: 0,
    explanation: '`s1 == s2` is true because both point to the same literal in the String Constant Pool. `s1 == s3` is false because `new String()` creates a new object in Heap memory. `s1.equals(s3)` is true because it compares character content.',
    conceptTag: 'String Pool & Heap'
  },

  {
    id: 'jq-2',
    category: 'OOP & Method Overriding',
    question: 'What will be printed when executing this Java inheritance code?',
    code: `class Parent {
    void show() { System.out.print("Parent "); }
}
class Child extends Parent {
    @Override
    void show() { System.out.print("Child "); }
}
public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        p.show();
    }
}`,
    options: [
      'Child ',
      'Parent ',
      'Parent Child ',
      'Compilation Error'
    ],
    correctIndex: 0,
    explanation: 'In Java, method resolution for overridden instance methods occurs at runtime based on the actual object instantiated (`Child`), which is known as Dynamic Method Dispatch / Runtime Polymorphism.',
    conceptTag: 'Dynamic Method Dispatch'
  },

  {
    id: 'jq-3',
    category: 'Exception Handling',
    question: 'What will be the output of this try-catch-finally block?',
    code: `public class Main {
    public static int test() {
        try {
            return 10;
        } finally {
            return 20;
        }
    }
    public static void main(String[] args) {
        System.out.println(test());
    }
}`,
    options: [
      '20',
      '10',
      '30',
      'Compilation Error: unreachable return'
    ],
    correctIndex: 0,
    explanation: 'The `finally` block ALWAYS executes before a method returns. If the `finally` block contains a return statement, it overrides any return statement from the `try` block.',
    conceptTag: 'JVM Control Flow'
  },

  {
    id: 'jq-4',
    category: 'Integer Caching in JVM',
    question: 'What does this Integer comparison output in Java?',
    code: `public class Main {
    public static void main(String[] args) {
        Integer a = 100;
        Integer b = 100;
        Integer c = 200;
        Integer d = 200;

        System.out.println((a == b) + " " + (c == d));
    }
}`,
    options: [
      'true false',
      'true true',
      'false false',
      'false true'
    ],
    correctIndex: 0,
    explanation: 'Java caches Integer objects between -128 and 127 via IntegerCache. Thus `a == b` compares the same cached instance (true), while `c` and `d` (200) are separately allocated on Heap (false).',
    conceptTag: 'Integer Cache'
  },

  {
    id: 'jq-5',
    category: 'Static Initialization Order',
    question: 'What is the exact execution sequence of this class?',
    code: `public class Main {
    static {
        System.out.print("A ");
    }
    {
        System.out.print("B ");
    }
    public Main() {
        System.out.print("C ");
    }
    public static void main(String[] args) {
        System.out.print("D ");
        new Main();
    }
}`,
    options: [
      'A D B C ',
      'D A B C ',
      'A B C D ',
      'B C A D '
    ],
    correctIndex: 0,
    explanation: '1) Static blocks execute when the class is loaded by JVM ClassLoader ("A "). 2) `main` method starts ("D "). 3) Instance initializer block runs on object creation ("B "). 4) Constructor executes ("C ").',
    conceptTag: 'ClassLoader Order'
  }
];
