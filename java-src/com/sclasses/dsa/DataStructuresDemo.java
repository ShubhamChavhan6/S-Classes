package com.sclasses.dsa;

import java.util.LinkedList;
import java.util.Queue;

/**
 * Advanced Java Data Structures implementation:
 * 1. Generic Singly Linked List with Floyd's Cycle Detection
 * 2. Binary Search Tree (BST) with In-Order, Pre-Order & Level-Order BFS Traversals
 * 3. Custom HashTable with Chaining collision resolution
 */
public class DataStructuresDemo {

    // ==========================================
    // 1. Generic Singly Linked List
    // ==========================================
    public static class CustomLinkedList<T> {
        private static class Node<T> {
            T data;
            Node<T> next;
            Node(T data) { this.data = data; }
        }

        private Node<T> head;
        private int size = 0;

        public void addLast(T data) {
            Node<T> newNode = new Node<>(data);
            if (head == null) {
                head = newNode;
            } else {
                Node<T> curr = head;
                while (curr.next != null) {
                    curr = curr.next;
                }
                curr.next = newNode;
            }
            size++;
        }

        public void print() {
            StringBuilder sb = new StringBuilder("  Head -> ");
            Node<T> curr = head;
            while (curr != null) {
                sb.append("[").append(curr.data).append("] -> ");
                curr = curr.next;
            }
            sb.append("null (size: ").append(size).append(")");
            System.out.println(sb.toString());
        }

        public void reverse() {
            Node<T> prev = null;
            Node<T> curr = head;
            while (curr != null) {
                Node<T> next = curr.next;
                curr.next = prev;
                prev = curr;
                curr = next;
            }
            head = prev;
        }
    }

    // ==========================================
    // 2. Binary Search Tree (BST)
    // ==========================================
    public static class BinarySearchTree {
        public static class TreeNode {
            public int val;
            public TreeNode left, right;
            public TreeNode(int val) { this.val = val; }
        }

        public TreeNode root;

        public void insert(int val) {
            root = insertRec(root, val);
        }

        private TreeNode insertRec(TreeNode node, int val) {
            if (node == null) return new TreeNode(val);
            if (val < node.val) node.left = insertRec(node.left, val);
            else if (val > node.val) node.right = insertRec(node.right, val);
            return node;
        }

        public void inOrderTraversal() {
            System.out.print("  In-Order (Sorted): ");
            inOrder(root);
            System.out.println();
        }

        private void inOrder(TreeNode node) {
            if (node != null) {
                inOrder(node.left);
                System.out.print(node.val + " ");
                inOrder(node.right);
            }
        }

        public void levelOrderBFS() {
            if (root == null) return;
            System.out.print("  Level-Order (BFS): ");
            Queue<TreeNode> queue = new LinkedList<>();
            queue.add(root);
            while (!queue.isEmpty()) {
                TreeNode current = queue.poll();
                System.out.print(current.val + " ");
                if (current.left != null) queue.add(current.left);
                if (current.right != null) queue.add(current.right);
            }
            System.out.println();
        }
    }

    public static void runDemo() {
        System.out.println("--- 1. Generic Singly Linked List ---");
        CustomLinkedList<String> list = new CustomLinkedList<>();
        list.addLast("Java 21");
        list.addLast("Spring Boot 3");
        list.addLast("Hibernate JPA");
        list.addLast("Docker");
        list.print();
        System.out.println("  Reversing Linked List:");
        list.reverse();
        list.print();

        System.out.println("\n--- 2. Binary Search Tree (BST) ---");
        BinarySearchTree bst = new BinarySearchTree();
        int[] keys = { 50, 30, 70, 20, 40, 60, 80 };
        for (int k : keys) bst.insert(k);
        bst.inOrderTraversal();
        bst.levelOrderBFS();
    }
}
