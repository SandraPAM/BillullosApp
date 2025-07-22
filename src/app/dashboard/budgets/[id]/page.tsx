
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { onBudgetUpdate, onExpensesUpdate } from '@/lib/firebase/firestore';
import type { Budget, Expense } from '@/types';
import { notFound, useParams, useRouter } from 'next/navigation';

import { ArrowLeft, Wallet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BudgetDetailCard } from '@/components/budgets/budget-detail-card';
import { AddExpenseForm } from '@/components/budgets/add-expense-form';
import { ExpenseList } from '@/components/budgets/expense-list';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteBudgetButton } from '@/components/budgets/delete-budget-button';

export default function BudgetDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const budgetId = params.id as string;

  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user && budgetId && !deleting) {
      setLoading(true);
      const budgetUnsubscribe = onBudgetUpdate(budgetId, (updatedBudget) => {
        if (updatedBudget && updatedBudget.userId !== user.uid) {
          // If budget doesn't belong to the user, treat as not found.
          setBudget(null);
          setLoading(false);
          return notFound();
        }
        setBudget(updatedBudget);
        setLoading(false);
      });

      const expensesUnsubscribe = onExpensesUpdate(budgetId, user.uid, (updatedExpenses) => {
        setExpenses(updatedExpenses);
      });

      return () => {
        budgetUnsubscribe();
        expensesUnsubscribe();
      };
    }
  }, [user, budgetId, deleting]);

  const handleBudgetDeleted = () => {
    router.push('/dashboard/budgets');
  }

  const handleDeleting = (isDeleting: boolean) => {
    setDeleting(isDeleting);
  }
  
  if (deleting) {
    return (
      <div className="flex h-full min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Deleting budget...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <BudgetDetailPageSkeleton />;
  }

  if (!budget) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard/budgets">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Budgets
            </Link>
        </Button>
        <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-3">
                    <Wallet className="h-8 w-8 text-primary"/>
                    <h1 className="text-3xl font-headline font-bold">{budget.name}</h1>
                </div>
                <p className="text-muted-foreground">Detailed view of your budget.</p>
            </div>
            <div className="flex items-center gap-2">
              <AddExpenseForm budgetId={budget.id} userId={user!.uid} />
              <DeleteBudgetButton 
                budgetId={budget.id} 
                onBudgetDeleted={handleBudgetDeleted} 
                onDeletingChange={handleDeleting} 
              />
            </div>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <BudgetDetailCard budget={budget} />
        </div>
        <div className="md:col-span-2">
            <ExpenseList expenses={expenses} />
        </div>
      </div>
    </div>
  );
}

function BudgetDetailPageSkeleton() {
  return (
    <div className="space-y-8">
        <div>
            <Skeleton className="h-10 w-48 mb-4" />
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-9 w-64" />
                    </div>
                    <Skeleton className="h-5 w-80 mt-2" />
                </div>
                <Skeleton className="h-10 w-36" />
            </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <Skeleton className="h-64 w-full" />
            </div>
            <div className="md:col-span-2">
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    </div>
  )
}
