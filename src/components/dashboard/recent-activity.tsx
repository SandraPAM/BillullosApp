"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/config";
import type { Expense, SavingsRecord } from "@/types";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";

type ActivityItem = (Expense & { type: 'expense' }) | (SavingsRecord & { type: 'saving' });

export function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const expensesQuery = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid),
      orderBy("date", "desc"),
      limit(5)
    );

    const savingsQuery = query(
      collection(db, "savingsRecords"),
      where("userId", "==", user.uid),
      orderBy("date", "desc"),
      limit(5)
    );

    const expensesUnsubscribe = onSnapshot(expensesQuery, (snapshot) => {
      const expenses = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'expense' } as ActivityItem));
      setActivities(prev => {
        const otherActivities = prev.filter(act => act.type !== 'expense');
        const combined = [...expenses, ...otherActivities].sort((a, b) => b.date.toMillis() - a.date.toMillis()).slice(0, 5);
        return combined;
      });
      setLoading(false);
    });

    const savingsUnsubscribe = onSnapshot(savingsQuery, (snapshot) => {
      const savings = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'saving' } as ActivityItem));
       setActivities(prev => {
        const otherActivities = prev.filter(act => act.type !== 'saving');
        const combined = [...savings, ...otherActivities].sort((a, b) => b.date.toMillis() - a.date.toMillis()).slice(0, 5);
        return combined;
      });
      setLoading(false);
    });

    return () => {
      expensesUnsubscribe();
      savingsUnsubscribe();
    }

  }, [user]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Recent Activity</CardTitle>
        </div>
        <CardDescription>Your latest transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${activity.type === 'expense' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                      {activity.type === 'expense' ? 
                          <ArrowDownLeft className="h-4 w-4 text-destructive" /> : 
                          <ArrowUpRight className="h-4 w-4 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.date ? formatDistanceToNow(activity.date.toDate(), { addSuffix: true }) : 'just now'}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold ${activity.type === 'expense' ? 'text-destructive' : 'text-primary'}`}>
                  {activity.type === 'expense' ? '-' : '+'}${activity.amount.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>Your recent transactions will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
