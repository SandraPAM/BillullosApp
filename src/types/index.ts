import type { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {
  // Add any custom user properties here
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spentAmount: number;
  deadline: string; // ISO string
  userId: string;
}

export interface Expense {
  id: string;
  budgetId: string;
  description: string;
  amount: number;
  date: string; // ISO string
  receiptUrl?: string;
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
