
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
} from "@/components/ui/accordion";
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Expense, SavingsRecord } from '@/types';
import { format } from 'date-fns';


export function AiTips() {
  const [isLoading, setIsLoading] = useState(false);
  const [tips, setTips] = useState<BudgetingTipsOutput | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleGenerateTips = async () => {
    if (!user || !db) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to generate tips.",
      });
      return;
    }

    setIsLoading(true);
    setTips(null);
    try {
      // Fetch expenses and savings records from Firestore
      const expensesQuery = query(collection(db, "expenses"), where("userId", "==", user.uid));
      const savingsQuery = query(collection(db, "savingsRecords"), where("userId", "==", user.uid));

      const [expensesSnapshot, savingsSnapshot] = await Promise.all([
        getDocs(expensesQuery),
        getDocs(savingsQuery)
      ]);

      const expenseRecords = expensesSnapshot.docs.map(doc => {
        const data = doc.data() as Expense;
        return `${data.description}: $${data.amount.toFixed(2)} on ${format(data.date.toDate(), 'MMM d, yyyy')}`;
      });

      const savingRecords = savingsSnapshot.docs.map(doc => {
        const data = doc.data() as SavingsRecord;
        return `${data.description}: $${data.amount.toFixed(2)} saved on ${format(data.date.toDate(), 'MMM d, yyyy')}`;
      });

      if (expenseRecords.length === 0 && savingRecords.length === 0) {
        toast({
          title: "No Data Found",
          description: "We couldn't find any financial data to analyze. Please add some budgets or savings goals first.",
        });
        setIsLoading(false);
        return;
      }
      
      const result = await getBudgetingTips({
        expenseRecords,
        savingRecords
      });

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
