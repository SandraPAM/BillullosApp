
"use client";

import type { Budget } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { differenceInDays, format } from "date-fns";

export function BudgetDetailCard({ budget }: { budget: Budget }) {
    const progress = Math.min((budget.spentAmount / budget.amount) * 100, 100);
    const remainingAmount = budget.amount - budget.spentAmount;
    
    // Convert Firestore Timestamp to JS Date
    const deadlineDate = budget.deadline.toDate();
    const daysRemaining = differenceInDays(deadlineDate, new Date());

    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget Details</CardTitle>
                <CardDescription>
                    Deadline: {format(deadlineDate, "PPP")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Spent</span>
                        <span>${budget.spentAmount.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="font-medium">Remaining</span>
                        <span className={remainingAmount < 0 ? 'text-destructive' : 'text-primary'}>${remainingAmount.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="font-medium">Total Budget</span>
                        <span>${budget.amount.toFixed(2)}</span>
                    </div>
                </div>
                <div>
                    <Progress value={progress} aria-label={`${progress.toFixed(0)}% of budget spent`} />
                    <p className="text-center text-sm text-muted-foreground mt-2">{progress.toFixed(1)}% used</p>
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
