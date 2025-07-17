"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { getBudgetingTips, type BudgetingTipsOutput } from '@/ai/flows/budgeting-tips';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AiTips() {
  const [isLoading, setIsLoading] = useState(false);
  const [tips, setTips] = useState<BudgetingTipsOutput | null>(null);
  const { toast } = useToast();

  const handleGenerateTips = async () => {
    setIsLoading(true);
    setTips(null);
    try {
      // In a real app, you would fetch real user data from Firestore.
      const mockInput = {
        expenseRecords: [
          "Groceries: $350/month",
          "Dining out: $250/month",
          "Gas: $150/month",
          "Subscription service: $45/month",
        ],
        savingRecords: [
          "Emergency fund: saved $100 last month",
          "Vacation fund: saved $200 last month",
        ],
      };
      const result = await getBudgetingTips(mockInput);
      setTips(result);
    } catch (error) {
      console.error("Failed to generate tips:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate budgeting tips. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <p className="max-w-prose text-muted-foreground">
              Click the button below to analyze your recent financial activities. Our AI will provide personalized recommendations to help you optimize your budget and boost your savings.
            </p>
            <Button onClick={handleGenerateTips} disabled={isLoading} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate My Tips
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {tips && tips.tips.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-headline font-bold mb-4">Your Personalized Tips</h2>
            <Accordion type="single" collapsible className="w-full">
              {tips.tips.map((tip, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="font-semibold text-left">{`Tip #${index + 1}`}</AccordionTrigger>
                  <AccordionContent>
                    {tip}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
