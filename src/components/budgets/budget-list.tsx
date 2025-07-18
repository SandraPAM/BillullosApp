
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { onBudgetsUpdate } from "@/lib/firebase/firestore";
import type { Budget } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { cn } from "@/lib/utils";

const mockBudgets = [
    { id: 'mock-1', name: 'Monthly Groceries', amount: 500, spentAmount: 350.75, deadline: new Date('2024-07-31') },
    { id: 'mock-2', name: 'Utilities', amount: 150, spentAmount: 125.50, deadline: new Date('2024-07-25') },
    { id: 'mock-3', name: 'Transportation', amount: 200, spentAmount: 210.00, deadline: new Date('2024-07-31') },
    { id: 'mock-4', name: 'Entertainment', amount: 100, spentAmount: 45.00, deadline: new Date('2024-07-31') },
];

const BudgetCard = ({ budget, isMock = false }: { budget: any, isMock?: boolean }) => {
    const progress = Math.min((budget.spentAmount / budget.amount) * 100, 100);
    const remaining = budget.amount - budget.spentAmount;

    // Firestore timestamp needs to be converted to Date
    const deadlineDate = budget.deadline?.toDate ? budget.deadline.toDate() : budget.deadline;

    return (
        <Card className={cn(isMock && "pointer-events-none opacity-70")}>
            <CardHeader>
                <CardTitle className="font-headline">{budget.name}</CardTitle>
                <CardDescription>
                    Deadline: {deadlineDate.toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Progress value={progress} aria-label={`${progress.toFixed(0)}% of budget spent`} />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Spent: ${budget.spentAmount.toFixed(2)}</span>
                        <span>Budget: ${budget.amount.toFixed(2)}</span>
                    </div>
                </div>
                <div className={`text-sm font-medium ${remaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {remaining >= 0 
                        ? `$${remaining.toFixed(2)} remaining` 
                        : `$${Math.abs(remaining).toFixed(2)} over budget`}
                </div>
            </CardContent>
            <CardFooter>
                 <Button asChild variant="outline" className="w-full" disabled={isMock}>
                    <Link href={`/dashboard/budgets/${budget.id}`}>Manage Budget</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};


export function BudgetList() {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const unsubscribe = onBudgetsUpdate(user.uid, (updatedBudgets) => {
                setBudgets(updatedBudgets);
                setLoading(false);
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                            <Skeleton className="h-4 w-1/3" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }
    
    const hasRealBudgets = budgets.length > 0;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
            ))}
            {/* If there are real budgets, we add a separator. If not, the heading is enough. */}
            {hasRealBudgets && (
                <div className="lg:col-span-3 md:col-span-2">
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Mock Examples
                            </span>
                        </div>
                    </div>
                </div>
            )}
             {mockBudgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} isMock={true} />
            ))}
        </div>
    );
}

