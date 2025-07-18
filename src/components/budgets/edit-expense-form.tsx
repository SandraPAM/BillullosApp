
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { updateExpense } from "@/lib/firebase/firestore";
import { uploadReceipt, deleteFileFromStorage } from "@/lib/firebase/storage";
import type { Expense } from "@/types";
import Image from "next/image";


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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
import { Label } from "@/components/ui/label";
import { Loader2, Pencil } from "lucide-react";

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

interface EditExpenseFormProps {
    expense: Expense;
}

export function EditExpenseForm({ expense }: EditExpenseFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: expense.description,
      amount: expense.amount,
    },
  });

  const fileRef = form.register("receipt");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const receiptFile = values.receipt?.[0];
      const updatedData: Partial<Expense> = {
        description: values.description,
        amount: values.amount,
      };

      if (receiptFile) {
        // Delete the old receipt if it exists
        if (expense.storagePath) {
          await deleteFileFromStorage(expense.storagePath);
        }
        // Upload the new one
        const { downloadURL, storagePath } = await uploadReceipt(receiptFile, expense.userId, expense.id);
        updatedData.receiptUrl = downloadURL;
        updatedData.storagePath = storagePath;
      }
      
      await updateExpense(expense.id, expense.budgetId, expense.amount, updatedData);
      
      toast({
        title: "Expense Updated",
        description: "Your expense has been successfully updated.",
      });
      form.reset({
        description: values.description,
        amount: values.amount,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error updating expense: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update the expense. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>
            Make changes to your expense here. Click save when you're done.
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
            {expense.receiptUrl && (
                <div className="space-y-2">
                    <Label>Current Receipt</Label>
                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                        <Image src={expense.receiptUrl} alt="Receipt" layout="fill" objectFit="cover" />
                    </div>
                </div>
            )}
            <FormField
              control={form.control}
              name="receipt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{expense.receiptUrl ? 'Upload New Receipt' : 'Receipt (Optional)'}</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/png, image/jpeg" {...fileRef} disabled={isLoading} />
                  </FormControl>
                   <FormDescription>
                    {expense.receiptUrl ? 'Uploading a new file will replace the current one.' : 'Attach an image of your receipt (.png, .jpg, max 2MB).'}
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
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
