package com.sclasses.icse;

/**
 * Standard Solved Questions for ICSE & CBSE Board Class 10 & 12 Computer Applications:
 * 1. Pig Latin Word Transformation
 * 2. Armstrong Number & Special Number Verification
 * 3. 2D Matrix Spiral & Transpose Operations
 */
public class ICSEClass10SolvedPapers {

    // 1. Pig Latin Conversion (ICSE Board Classic)
    public static String toPigLatin(String word) {
        if (word == null || word.isEmpty()) return "";
        String upper = word.toUpperCase();
        int firstVowelIndex = -1;
        for (int i = 0; i < upper.length(); i++) {
            char ch = upper.charAt(i);
            if (ch == 'A' || ch == 'E' || ch == 'I' || ch == 'O' || ch == 'U') {
                firstVowelIndex = i;
                break;
            }
        }
        if (firstVowelIndex == -1) return upper + "AY";
        return upper.substring(firstVowelIndex) + upper.substring(0, firstVowelIndex) + "AY";
    }

    // 2. Armstrong Number Check (e.g. 153 = 1^3 + 5^3 + 3^3)
    public static boolean isArmstrong(int num) {
        int temp = num;
        int sum = 0;
        int digits = String.valueOf(num).length();
        while (temp > 0) {
            int rem = temp % 10;
            sum += (int) Math.pow(rem, digits);
            temp /= 10;
        }
        return sum == num;
    }

    // 3. Matrix Transpose
    public static int[][] transposeMatrix(int[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int[][] transposed = new int[cols][rows];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                transposed[j][i] = matrix[i][j];
            }
        }
        return transposed;
    }

    public static void runDemo() {
        System.out.println("--- 1. ICSE Pig Latin Transformation ---");
        String[] testWords = { "COMPUTER", "APPLE", "RHYTHM", "JAVA" };
        for (String w : testWords) {
            System.out.printf("  Original: %-10s -> Pig Latin: %s%n", w, toPigLatin(w));
        }

        System.out.println("\n--- 2. Armstrong Number Verification ---");
        int[] testNumbers = { 153, 370, 371, 407, 9474, 120 };
        for (int n : testNumbers) {
            System.out.printf("  Number: %-5d -> Is Armstrong? %b%n", n, isArmstrong(n));
        }

        System.out.println("\n--- 3. 2D Matrix Transpose ---");
        int[][] mat = { { 1, 2, 3 }, { 4, 5, 6 } };
        int[][] trans = transposeMatrix(mat);
        System.out.println("  Original (2x3):");
        for (int[] r : mat) System.out.println("    " + java.util.Arrays.toString(r));
        System.out.println("  Transposed (3x2):");
        for (int[] r : trans) System.out.println("    " + java.util.Arrays.toString(r));
    }
}
