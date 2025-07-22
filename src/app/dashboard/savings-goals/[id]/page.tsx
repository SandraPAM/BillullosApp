
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { onGoalUpdate, onSavingsRecordsUpdate } from '@/lib/firebase/firestore';
import type { SavingsGoal, SavingsRecord } from '@/types';
import { notFound, useParams, useRouter } from 'next/navigation';

import { ArrowLeft, Target, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GoalDetailCard } from '@/components/goals/goal-detail-card';
import { AddIncomeForm } from '@/components/goals/add-income-form';
import { IncomeList } from '@/components/goals/income-list';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteGoalButton } from '@/components/goals/delete-goal-button';

export default function GoalDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const goalId = params.id as string;

  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [records, setRecords] = useState<SavingsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user && goalId && !deleting) {
      setLoading(true);
      const goalUnsubscribe = onGoalUpdate(goalId, (updatedGoal) => {
        if (updatedGoal && updatedGoal.userId !== user.uid) {
          setGoal(null);
          setLoading(false);
          return notFound();
        }
        setGoal(updatedGoal);
        setLoading(false);
      });

      const recordsUnsubscribe = onSavingsRecordsUpdate(goalId, user.uid, (updatedRecords) => {
        setRecords(updatedRecords);
      });

      return () => {
        goalUnsubscribe();
        recordsUnsubscribe();
      };
    }
  }, [user, goalId, deleting]);

  const handleGoalDeleted = () => {
    router.push('/dashboard/savings-goals');
  }

  const handleDeleting = (isDeleting: boolean) => {
    setDeleting(isDeleting);
  }
  
  if (deleting) {
    return (
      <div className="flex h-full min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Deleting savings goal...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <GoalDetailPageSkeleton />;
  }

  if (!goal) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard/savings-goals">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Savings Goals
            </Link>
        </Button>
        <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-primary"/>
                    <h1 className="text-3xl font-headline font-bold">{goal.name}</h1>
                </div>
                <p className="text-muted-foreground">Detailed view of your savings goal.</p>
            </div>
            <div className="flex items-center gap-2">
              <AddIncomeForm goalId={goal.id} userId={user!.uid} />
              <DeleteGoalButton 
                goalId={goal.id} 
                userId={user!.uid} 
                onGoalDeleted={handleGoalDeleted} 
                onDeletingChange={handleDeleting} 
              />
            </div>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <GoalDetailCard goal={goal} />
        </div>
        <div className="md:col-span-2">
            <IncomeList records={records} />
        </div>
      </div>
    </div>
  );
}

function GoalDetailPageSkeleton() {
  return (
    <div className="space-y-8">
        <div>
            <Skeleton className="h-10 w-52 mb-4" />
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
