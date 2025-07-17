import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const mockBudgets = [
    { id: '1', name: 'Monthly Groceries', amount: 500, spentAmount: 350.75, deadline: '2024-07-31' },
    { id: '2', name: 'Utilities', amount: 150, spentAmount: 125.50, deadline: '2024-07-25' },
    { id: '3', name: 'Transportation', amount: 200, spentAmount: 210.00, deadline: '2024-07-31' },
    { id: '4', name: 'Entertainment', amount: 100, spentAmount: 45.00, deadline: '2024-07-31' },
];

export function BudgetList() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockBudgets.map((budget) => {
                const progress = Math.min((budget.spentAmount / budget.amount) * 100, 100);
                const remaining = budget.amount - budget.spentAmount;

                return (
                    <Card key={budget.id}>
                        <CardHeader>
                            <CardTitle className="font-headline">{budget.name}</CardTitle>
                            <CardDescription>
                                Deadline: {new Date(budget.deadline).toLocaleDateString()}
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
                             <Button asChild variant="outline" className="w-full">
                                <Link href={`/dashboard/budgets/${budget.id}`}>Manage Budget</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
