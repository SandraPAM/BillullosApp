
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { onGoalsUpdate } from "@/lib/firebase/firestore";
import type { SavingsGoal } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const mockGoals = [
    { id: '1', name: 'Vacation to Hawaii', targetAmount: 3000, currentAmount: 1250.50, deadline: new Date('2024-12-31') },
    { id: '2', name: 'New Laptop', targetAmount: 1500, currentAmount: 1500, deadline: new Date('2024-08-31') },
    { id: '3', name: 'Emergency Fund', targetAmount: 5000, currentAmount: 4500, deadline: new Date('2025-06-30') },
];

const GoalCard = ({ goal, isMock = false }: { goal: any, isMock?: boolean }) => {
    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const remaining = goal.targetAmount - goal.currentAmount;
    const deadlineDate = goal.deadline?.toDate ? goal.deadline.toDate() : goal.deadline;

    const cardContent = (
        <>
            <CardHeader>
                <CardTitle className="font-headline">{goal.name}</CardTitle>
                <CardDescription>
                    Deadline: {deadlineDate.toLocaleDateString()}
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
                {isMock ? (
                    <Button variant="outline" className="w-full" disabled>Manage Goal</Button>
                ) : (
                    <Button asChild variant="outline" className="w-full">
                        <Link href={`/dashboard/savings-goals/${goal.id}`}>Manage Goal</Link>
                    </Button>
                )}
            </CardFooter>
        </>
    );

    if (isMock) {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Card className="opacity-70 cursor-pointer hover:border-primary/50 transition-colors">
                        {cardContent}
                    </Card>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>This is a Demo Goal</AlertDialogTitle>
                        <AlertDialogDescription>
                            Demo goals are for demonstration purposes only. Please create a new goal to start tracking your savings.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>Got it!</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return <Card>{cardContent}</Card>;
};


export function GoalList() {
    const { user } = useAuth();
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const unsubscribe = onGoalsUpdate(user.uid, (updatedGoals) => {
                setGoals(updatedGoals);
                setLoading(false);
            });

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

    const hasRealGoals = goals.length > 0;

    if (!hasRealGoals) {
       return (
            <div>
                 <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                           Demo Goals
                        </span>
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {mockGoals.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} isMock={true} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
            ))}
        </div>
    );
}
