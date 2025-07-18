import type { User as FirebaseUser } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export interface User extends FirebaseUser {
  // Add any custom user properties here
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spentAmount: number;
  deadline: Timestamp; // serverTimestamp
  userId: string;
  createdAt?: Timestamp; // serverTimestamp
}

export interface Expense {
  id: string;
  budgetId: string;
  description: string;
  amount: number;
  date: Timestamp; // Changed to Timestamp
  userId: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO string
  userId: string;
}

export interface SavingsRecord {
  id: string;
  goalId: string;
  amount: number;
  date: string; // ISO string
  screenshotUrl?: string;
  userId: string;
}
