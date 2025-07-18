
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { addExpense, updateExpense } from "@/lib/firebase/firestore";
import { uploadReceipt } from "@/lib/firebase/storage";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle } from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  description: z.string().min(2, { message: "Description must be at least 2 characters." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  receipt: z
    .custom<FileList>()
    .refine((files) => files === undefined || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`)
    .refine(
      (files) => files === undefined || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, and .png formats are supported."
    ).optional(),
});

interface AddExpenseFormProps {
    budgetId: string;
    userId: string;
}

export function AddExpenseForm({ budgetId, userId }: AddExpenseFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
    },
  });

  const fileRef = form.register("receipt");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const receiptFile = values.receipt?.[0];
      
      // Step 1: Create a basic expense document to get an ID
      const expenseData = {
        description: values.description,
        amount: values.amount,
        userId: userId,
        receiptUrl: '',
        storagePath: '',
      };
      
      const expenseId = await addExpense(budgetId, expenseData);
      
      let uploadData: { receiptUrl?: string; storagePath?: string } = {};

      // Step 2: If there's a file, upload it and get the URL
      if (receiptFile) {
        const { downloadURL, storagePath } = await uploadReceipt(receiptFile, userId, expenseId);
        uploadData.receiptUrl = downloadURL;
        uploadData.storagePath = storagePath;
      }
      
      // Step 3: Update the expense with image URL (if any) and increment budget
      // We pass 0 as oldAmount because we haven't incremented the budget yet.
      await updateExpense(expenseId, budgetId, 0, {
        amount: values.amount,
        ...uploadData,
      });

      toast({
        title: "Expense Added",
        description: `Your expense "${values.description}" has been logged.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding expense: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add the expense. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Log Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a New Expense</DialogTitle>
          <DialogDescription>
            Add a new transaction to this budget. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weekly groceries" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 75.50" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receipt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receipt (Optional)</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/png, image/jpeg" {...fileRef} disabled={isLoading} />
                  </FormControl>
                   <FormDescription>
                    Attach an image of your receipt (.png, .jpg, max 2MB).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Expense"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
