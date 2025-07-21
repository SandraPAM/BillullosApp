
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { addSavingsRecord, updateSavingsRecord } from "@/lib/firebase/firestore";
import { uploadScreenshot } from "@/lib/firebase/storage";

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
  screenshot: z
    .custom<FileList>()
    .refine((files) => files === undefined || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`)
    .refine(
      (files) => files === undefined || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, and .png formats are supported."
    ).optional(),
});

interface AddIncomeFormProps {
    goalId: string;
    userId: string;
}

export function AddIncomeForm({ goalId, userId }: AddIncomeFormProps) {
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

  const fileRef = form.register("screenshot");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const screenshotFile = values.screenshot?.[0];
      
      const recordData = {
        description: values.description,
        amount: values.amount,
        userId: userId,
        screenshotUrl: '',
        storagePath: '',
      };
      
      const recordId = await addSavingsRecord(goalId, recordData);
      
      let uploadData: { screenshotUrl?: string; storagePath?: string } = {};

      if (screenshotFile) {
        const { downloadURL, storagePath } = await uploadScreenshot(screenshotFile, userId, recordId);
        uploadData.screenshotUrl = downloadURL;
        uploadData.storagePath = storagePath;
      }
      
      await updateSavingsRecord(recordId, goalId, 0, {
        amount: values.amount,
        ...uploadData,
      });

      toast({
        title: "Income Added",
        description: `Your contribution of $${values.amount} has been logged.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding income: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add the income. Please try again.",
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
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log New Income</DialogTitle>
          <DialogDescription>
            Add a new contribution to this savings goal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Paycheck" {...field} disabled={isLoading} />
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
                  <FormLabel>Amount Saved</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 250.00" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="screenshot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Screenshot (Optional)</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/png, image/jpeg" {...fileRef} disabled={isLoading} />
                  </FormControl>
                   <FormDescription>
                    Attach proof of transaction (.png, .jpg, max 2MB).
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
                  "Save Contribution"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
