import { BudgetSummary } from "@/components/dashboard/budget-summary";
import { SavingsSummary } from "@/components/dashboard/savings-summary";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Bot } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Here&apos;s a summary of your financial activity.</p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <BudgetSummary />
          <SavingsSummary />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-headline font-semibold mb-4 flex items-center">
              <Bot className="mr-2 h-6 w-6 text-primary" />
              AI Budgeting Tips
            </h2>
            <p className="text-muted-foreground mb-4">
              Get personalized tips to improve your budgeting and reach your goals faster.
            </p>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/dashboard/tips">Generate My Tips</Link>
            </Button>
          </div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
