import { BudgetList } from "@/components/budgets/budget-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function BudgetsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Budgets</h1>
          <p className="text-muted-foreground">Manage your spending and stay on track.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>
      <BudgetList />
    </div>
  );
}
