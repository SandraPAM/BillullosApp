
"use client";

import type { SavingsGoal } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { differenceInDays, format } from "date-fns";

export function GoalDetailCard({ goal }: { goal: SavingsGoal }) {
    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    
    const deadlineDate = goal.deadline.toDate();
    const daysRemaining = differenceInDays(deadlineDate, new Date());

    return (
        <Card>
            <CardHeader>
                <CardTitle>Goal Details</CardTitle>
                <CardDescription>
                    Deadline: {format(deadlineDate, "PPP")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Saved</span>
                        <span>${goal.currentAmount.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="font-medium">Remaining</span>
                        <span className={remainingAmount > 0 ? 'text-primary' : 'text-muted-foreground'}>
                            {remainingAmount > 0 ? `$${remainingAmount.toFixed(2)}` : 'Goal Reached!'}
                        </span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="font-medium">Total Goal</span>
                        <span>${goal.targetAmount.toFixed(2)}</span>
                    </div>
                </div>
                <div>
                    <Progress value={progress} className="[&>div]:bg-primary" aria-label={`${progress.toFixed(0)}% of goal saved`} />
                    <p className="text-center text-sm text-muted-foreground mt-2">{progress.toFixed(1)}% saved</p>
                </div>
            </CardContent>
            <CardFooter>
                <div className={`text-sm w-full text-center font-medium ${daysRemaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {daysRemaining < 0
                        ? `Ended ${Math.abs(daysRemaining)} days ago`
                        : `${daysRemaining} days remaining`}
                </div>
            </CardFooter>
        </Card>
    );
}
