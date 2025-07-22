
"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { onGoalsUpdate } from "@/lib/firebase/firestore";
import type { SavingsGoal } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  goal: {
    label: "Goal",
    color: "hsl(var(--accent))",
  },
  saved: {
    label: "Saved",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const mockChartData = [
  { name: 'Vacation', goal: 3000, saved: 1200 },
  { name: 'New Laptop', goal: 1500, saved: 800 },
  { name: 'Emergency', goal: 5000, saved: 4500 },
  { name: 'Car Fund', goal: 10000, saved: 2500 },
];

export function SavingsSummary() {
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

  const hasRealGoals = goals.length > 0;

  const chartData = hasRealGoals
    ? goals.map(goal => ({
        name: goal.name.slice(0, 10) + (goal.name.length > 10 ? '...' : ''), // Truncate name for chart
        goal: goal.targetAmount,
        saved: goal.currentAmount,
      })).slice(0, 6)
    : mockChartData;

  if (loading) {
    return (
       <Card>
        <CardHeader>
           <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-full max-w-sm" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Savings Goals Progress</CardTitle>
        </div>
        <CardDescription>
          {hasRealGoals 
            ? "Your progress towards your savings goals."
            : "No savings goals found. Here's a demo of what it looks like."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="goal" fill="var(--color-goal)" radius={4} />
                <Bar dataKey="saved" fill="var(--color-saved)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-center text-muted-foreground">
            <p>Your savings progress will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
