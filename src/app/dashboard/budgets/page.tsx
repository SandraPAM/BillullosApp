import { BudgetList } from "@/components/budgets/budget-list";
import { AddBudgetForm } from "@/components/budgets/add-budget-form";

export default function BudgetsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Budgets</h1>
          <p className="text-muted-foreground">Manage your spending and stay on track.</p>
        </div>
        <AddBudgetForm />
      </div>
      <BudgetList />
    </div>
  );
}
