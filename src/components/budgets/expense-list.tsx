
"use client";

import type { Expense } from "@/types";
import Image from "next/image";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ListCollapse, MoreVertical, Paperclip } from "lucide-react";
import { EditExpenseForm } from "./edit-expense-form";
import { DeleteExpenseButton } from "./delete-expense-button";


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
                <TableHead className="w-[50px] text-center">Receipt</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell className="text-center">
                    {expense.receiptUrl ? (
                       <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Paperclip className="h-4 w-4" />
                              <span className="sr-only">View Receipt</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Receipt for {expense.description}</DialogTitle>
                          </DialogHeader>
                          <div className="relative mt-4 h-96 w-full">
                            <Image src={expense.receiptUrl} alt={`Receipt for ${expense.description}`} layout="fill" objectFit="contain" />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-destructive">-${expense.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {expense.date ? format(expense.date.toDate(), "MMM d, yyyy") : "Processing..."}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <EditExpenseForm expense={expense} />
                            <DeleteExpenseButton expense={expense} />
                        </DropdownMenuContent>
                    </DropdownMenu>
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
