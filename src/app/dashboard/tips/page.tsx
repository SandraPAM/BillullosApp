import { AiTips } from "@/components/dashboard/ai-tips";
import { Bot } from "lucide-react";

export default function AiTipsPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary"/>
            <h1 className="text-3xl font-headline font-bold">AI Budgeting Tips</h1>
        </div>
        <p className="text-muted-foreground">Your personal AI finance advisor. Generate tips based on your spending and saving habits.</p>
      </div>
      <AiTips />
    </div>
  );
}
