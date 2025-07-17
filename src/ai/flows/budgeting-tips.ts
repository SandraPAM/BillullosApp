'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized budgeting tips based on user's financial data.
 *
 * The flow takes expense and saving records as input and uses a language model to generate tailored advice.
 * - getBudgetingTips - The function to retrieve budgeting tips.
 * - BudgetingTipsInput - The input type for the getBudgetingTips function.
 * - BudgetingTipsOutput - The output type for the getBudgetingTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetingTipsInputSchema = z.object({
  expenseRecords: z.array(z.string()).describe('List of expense records.'),
  savingRecords: z.array(z.string()).describe('List of saving records.'),
});
export type BudgetingTipsInput = z.infer<typeof BudgetingTipsInputSchema>;

const BudgetingTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('A list of personalized budgeting tips.'),
});
export type BudgetingTipsOutput = z.infer<typeof BudgetingTipsOutputSchema>;

export async function getBudgetingTips(input: BudgetingTipsInput): Promise<BudgetingTipsOutput> {
  return budgetingTipsFlow(input);
}

const budgetingTipsPrompt = ai.definePrompt({
  name: 'budgetingTipsPrompt',
  input: {schema: BudgetingTipsInputSchema},
  output: {schema: BudgetingTipsOutputSchema},
  prompt: `You are a personal finance advisor. Based on the user's expense and saving records, provide personalized budgeting tips.

Expense Records:
{{#each expenseRecords}}
- {{{this}}}
{{/each}}

Saving Records:
{{#each savingRecords}}
- {{{this}}}
{{/each}}

Provide specific and actionable advice to help the user save more money and achieve their financial goals faster.`, // Modified prompt to use Handlebars each helper
});

const budgetingTipsFlow = ai.defineFlow(
  {
    name: 'budgetingTipsFlow',
    inputSchema: BudgetingTipsInputSchema,
    outputSchema: BudgetingTipsOutputSchema,
  },
  async input => {
    const {output} = await budgetingTipsPrompt(input);
    return output!;
  }
);
