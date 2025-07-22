
"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { onBudgetsUpdate } from "@/lib/firebase/firestore";
import type { Budget } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  budget: {
    label: "Budget",
    color: "hsl(var(--secondary))",
  },
  spent: {
    label: "Spent",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const mockChartData = [
  { name: 'Groceries', budget: 400, spent: 250 },
  { name: 'Transport', budget: 150, spent: 175 },
  { name: 'Eating Out', budget: 200, spent: 150 },
  { name: 'Shopping', budget: 300, spent: 100 },
];


export function BudgetSummary() {
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
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  const hasRealBudgets = budgets.length > 0;
  
  const chartData = hasRealBudgets 
    ? budgets.map(budget => ({
        name: budget.name.slice(0, 10) + (budget.name.length > 10 ? '...' : ''), // Truncate name for chart
        budget: budget.amount,
        spent: budget.spentAmount,
      })).slice(0, 6) // Display up to 6 budgets
    : mockChartData;

  if (loading) {
    return (
      <Card>
        <CardHeader>
           <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
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
          <Wallet className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Budget Overview</CardTitle>
        </div>
        <CardDescription>
          {hasRealBudgets
            ? "A summary of your current budgets."
            : "No budgets found. Here's a demo of what it looks like."
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
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
              <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-center text-muted-foreground">
            <p>Your budget summary will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
