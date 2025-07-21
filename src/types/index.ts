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
  id:string;
  budgetId: string;
  description: string;
  amount: number;
  date: Timestamp; // Changed to Timestamp
  userId: string;
  receiptUrl?: string;
  storagePath?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Timestamp; // Changed to Timestamp
  userId: string;
  createdAt?: Timestamp; // serverTimestamp
}

export interface SavingsRecord {
  id: string;
  goalId: string;
  description: string;
  amount: number;
  date: Timestamp; // Changed to Timestamp
  screenshotUrl?: string;
  storagePath?: string;
  userId: string;
}
