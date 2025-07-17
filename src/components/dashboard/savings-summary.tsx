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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Target } from "lucide-react";

const chartData = [
  { month: "January", saved: 200, goal: 500 },
  { month: "February", saved: 450, goal: 500 },
  { month: "March", saved: 500, goal: 500 },
  { month: "April", saved: 800, goal: 1000 },
  { month: "May", saved: 950, goal: 1000 },
  { month: "June", saved: 1200, goal: 1000 },
]

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

export function SavingsSummary() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Savings Goals Progress</CardTitle>
        </div>
        <CardDescription>Your progress towards your savings goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
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
                <Area
                    dataKey="goal"
                    type="natural"
                    fill="var(--color-goal)"
                    fillOpacity={0.4}
                    stroke="var(--color-goal)"
                    stackId="a"
                />
                <Area
                    dataKey="saved"
                    type="natural"
                    fill="var(--color-saved)"
                    fillOpacity={0.4}
                    stroke="var(--color-saved)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
