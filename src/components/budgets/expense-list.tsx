
"use client";

import type { Expense } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ListCollapse } from "lucide-react";

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  // Filter out expenses without a date and sort them, most recent first
  const sortedExpenses = expenses
    .filter(expense => expense.date)
    .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <ListCollapse className="h-6 w-6 text-primary"/>
            <CardTitle>Expense History</CardTitle>
        </div>
        <CardDescription>
          A list of all transactions for this budget.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedExpenses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell className="text-right font-mono text-destructive">-${expense.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {expense.date ? format(expense.date.toDate(), "MMM d, yyyy") : "Processing..."}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>No expenses logged for this budget yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
