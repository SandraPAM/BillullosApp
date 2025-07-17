import { GoalList } from "@/components/goals/goal-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function SavingsGoalsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Savings Goals</h1>
          <p className="text-muted-foreground">Define your goals and watch your savings grow.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>
      <GoalList />
    </div>
  );
}
