import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const mockGoals = [
    { id: '1', name: 'Vacation to Hawaii', targetAmount: 3000, currentAmount: 1250.50, deadline: '2024-12-31' },
    { id: '2', name: 'New Laptop', targetAmount: 1500, currentAmount: 1500, deadline: '2024-08-31' },
    { id: '3', name: 'Emergency Fund', targetAmount: 5000, currentAmount: 4500, deadline: '2025-06-30' },
    { id: '4', name: 'Down Payment', targetAmount: 20000, currentAmount: 2500, deadline: '2026-12-31' },
];

export function GoalList() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockGoals.map((goal) => {
                const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                const remaining = goal.targetAmount - goal.currentAmount;

                return (
                    <Card key={goal.id}>
                        <CardHeader>
                            <CardTitle className="font-headline">{goal.name}</CardTitle>
                            <CardDescription>
                                Deadline: {new Date(goal.deadline).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Progress value={progress} className="[&>div]:bg-primary" aria-label={`${progress.toFixed(0)}% of goal saved`} />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Saved: ${goal.currentAmount.toFixed(2)}</span>
                                    <span>Goal: ${goal.targetAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="text-sm font-medium text-primary">
                                {remaining > 0 
                                    ? `$${remaining.toFixed(2)} to go` 
                                    : `Goal reached!`}
                            </div>
                        </CardContent>
                        <CardFooter>
                             <Button asChild variant="outline" className="w-full">
                                <Link href={`/dashboard/savings-goals/${goal.id}`}>Manage Goal</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
