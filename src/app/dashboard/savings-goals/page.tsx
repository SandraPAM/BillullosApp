import { GoalList } from "@/components/goals/goal-list";
import { AddGoalForm } from "@/components/goals/add-goal-form";

export default function SavingsGoalsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Savings Goals</h1>
          <p className="text-muted-foreground">Define your goals and watch your savings grow.</p>
        </div>
        <AddGoalForm />
      </div>
      <GoalList />
    </div>
  );
}
