"use client"

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
import { Wallet } from "lucide-react";

const chartData = [
  { month: "January", spent: 1860, budget: 2500 },
  { month: "February", spent: 2005, budget: 2500 },
  { month: "March", spent: 1900, budget: 2500 },
  { month: "April", spent: 2280, budget: 2500 },
  { month: "May", spent: 1890, budget: 2500 },
  { month: "June", spent: 2390, budget: 2500 },
]

const chartConfig = {
  budget: {
    label: "Budget",
    color: "hsl(var(--secondary))",
  },
  spent: {
    label: "Spent",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function BudgetSummary() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Budget Overview</CardTitle>
        </div>
        <CardDescription>Your spending vs. your budget for the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
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
            <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
            <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
